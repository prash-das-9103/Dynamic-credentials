/**
 * lib/stores/notification-store.ts
 *
 * File-backed in-app notification store.
 * Notifications are created server-side and read by the recipient.
 *
 * Idempotency: each notification carries a dedupeKey.
 * Attempting to create a notification with an existing dedupeKey for the same
 * userId is a no-op — returns the existing notification.
 *
 * Raw workbook content is NEVER stored in notification bodies.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "notifications.json");

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationPriority = "low" | "normal" | "high" | "urgent";
export type DeliveryChannel = "in-app" | "email" | "teams" | "slack";

export interface AppNotification {
  id: string;
  userId: string;

  type: string;
  title: string;
  /** Plain-text message — no raw workbook rows, no credentials content. */
  message: string;

  entityType?: string;
  entityId?: string;
  /** Internal link — must require authentication; shared links re-check permissions. */
  link?: string;

  priority: NotificationPriority;

  readAt?: string;
  archivedAt?: string;
  createdAt: string;
  /** ISO — notifications past this date are eligible for cleanup. */
  expiresAt?: string;

  deliveryChannels: DeliveryChannel[];
  /** Tracks which channels have already been delivered to prevent duplicates. */
  deliveredChannels: DeliveryChannel[];

  /**
   * Deduplication key — if a notification with this key already exists for this
   * userId and is not archived, a new one is NOT created.
   */
  dedupeKey?: string;
}

// ─── Disk I/O ─────────────────────────────────────────────────────────────────

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readAll(): AppNotification[] {
  ensureDir();
  if (!existsSync(FILE)) return [];
  try {
    return JSON.parse(readFileSync(FILE, "utf8")) as AppNotification[];
  } catch {
    return [];
  }
}

function writeAll(notifications: AppNotification[]) {
  ensureDir();
  writeFileSync(FILE, JSON.stringify(notifications, null, 2), "utf8");
}

// ─── Public API ───────────────────────────────────────────────────────────────

export type CreateNotificationParams = Omit<
  AppNotification,
  "id" | "createdAt" | "readAt" | "archivedAt" | "deliveredChannels"
>;

/**
 * Create a notification.
 * If a non-archived notification with the same dedupeKey already exists for
 * this userId, returns the existing one without creating a duplicate.
 */
export function createNotification(params: CreateNotificationParams): AppNotification {
  const all = readAll();

  if (params.dedupeKey) {
    const existing = all.find(
      (n) =>
        n.userId === params.userId &&
        n.dedupeKey === params.dedupeKey &&
        !n.archivedAt
    );
    if (existing) return existing;
  }

  const notification: AppNotification = {
    ...params,
    id: `notif-${Date.now()}-${randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
    deliveredChannels: [],
  };
  writeAll([...all, notification]);
  return notification;
}

export function listNotifications(
  userId: string,
  opts: { includeArchived?: boolean; limit?: number } = {}
): AppNotification[] {
  let all = readAll().filter((n) => n.userId === userId);
  if (!opts.includeArchived) all = all.filter((n) => !n.archivedAt);
  // Newest first
  all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return opts.limit ? all.slice(0, opts.limit) : all;
}

export function countUnread(userId: string): number {
  return readAll().filter(
    (n) => n.userId === userId && !n.readAt && !n.archivedAt
  ).length;
}

export function markRead(id: string, userId: string): boolean {
  const all = readAll();
  const idx = all.findIndex((n) => n.id === id && n.userId === userId);
  if (idx === -1) return false;
  if (all[idx].readAt) return true; // already read
  all[idx] = { ...all[idx], readAt: new Date().toISOString() };
  writeAll(all);
  return true;
}

export function markAllRead(userId: string): number {
  const all = readAll();
  const now = new Date().toISOString();
  let count = 0;
  const updated = all.map((n) => {
    if (n.userId === userId && !n.readAt && !n.archivedAt) {
      count++;
      return { ...n, readAt: now };
    }
    return n;
  });
  writeAll(updated);
  return count;
}

export function archiveNotification(id: string, userId: string): boolean {
  const all = readAll();
  const idx = all.findIndex((n) => n.id === id && n.userId === userId);
  if (idx === -1) return false;
  all[idx] = { ...all[idx], archivedAt: new Date().toISOString() };
  writeAll(all);
  return true;
}

/** Mark a channel as delivered to prevent duplicate sends. */
export function markChannelDelivered(id: string, channel: DeliveryChannel): boolean {
  const all = readAll();
  const idx = all.findIndex((n) => n.id === id);
  if (idx === -1) return false;
  if (all[idx].deliveredChannels.includes(channel)) return true;
  all[idx] = {
    ...all[idx],
    deliveredChannels: [...all[idx].deliveredChannels, channel],
  };
  writeAll(all);
  return true;
}

/**
 * Retention cleanup: remove archived notifications older than retentionDays.
 * NEVER removes non-archived or unread notifications.
 */
export function cleanupExpiredNotifications(retentionDays = 90): number {
  const all = readAll();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - retentionDays);
  const cutoffStr = cutoff.toISOString();
  const kept = all.filter((n) => {
    if (!n.archivedAt) return true; // never delete non-archived
    return n.archivedAt > cutoffStr;
  });
  const removed = all.length - kept.length;
  if (removed > 0) writeAll(kept);
  return removed;
}
