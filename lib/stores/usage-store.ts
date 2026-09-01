/**
 * lib/stores/usage-store.ts
 *
 * Privacy-safe usage event log for adoption analytics.
 *
 * NEVER logs:
 *   - Raw workbook rows
 *   - Full Pack content
 *   - Full assistant prompts
 *   - Personally identifiable information beyond a pseudonymised hash
 *
 * User IDs are hashed with a daily salt before storage so individual
 * activity cannot be reconstructed across days without the salt.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync } from "fs";
import { join } from "path";
import { randomUUID, createHash } from "crypto";

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "usage.ndjson");

// ─── Types ────────────────────────────────────────────────────────────────────

export type UsageEventType =
  | "page_view"
  | "search"
  | "filter_applied"
  | "credential_viewed"
  | "expert_viewed"
  | "pack_item_added"
  | "pack_exported"
  | "saved_search_created"
  | "saved_search_run"
  | "notification_read"
  | "feedback_submitted"
  | "recommendation_clicked"
  | "recommendation_dismissed";

export interface UsageEvent {
  id: string;
  timestamp: string;
  /** SHA-256 of userId + daily salt — pseudonymised. */
  userIdHash?: string;
  sessionId: string;
  eventType: UsageEventType;
  entityType?: string;
  entityId?: string;
  solutionId?: string;
  feature?: string;
  environment: string;
  /**
   * Safe metadata only.
   * No raw content, no passwords, no API keys, no full prompts.
   * String values are truncated to 200 chars.
   */
  metadata?: Record<string, string | number | boolean>;
}

// ─── Pseudonymisation ─────────────────────────────────────────────────────────

/**
 * Produce a daily pseudonym for a user ID.
 * The daily salt means the same user gets a different hash each day,
 * making cross-day tracking infeasible without the salt.
 */
function pseudonymise(userId: string): string {
  const dayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const salt = process.env.USAGE_PSEUDONYM_SALT ?? "default-dev-salt";
  return createHash("sha256")
    .update(`${dayKey}:${salt}:${userId}`)
    .digest("hex")
    .slice(0, 16);
}

function sanitiseMeta(
  raw?: Record<string, unknown>
): Record<string, string | number | boolean> | undefined {
  if (!raw) return undefined;
  const BLOCKED = /password|secret|token|key|auth|credential|prompt|content/i;
  return Object.fromEntries(
    Object.entries(raw)
      .filter(([k]) => !BLOCKED.test(k))
      .slice(0, 20) // cap number of keys
      .map(([k, v]) => {
        if (typeof v === "string") return [k, v.slice(0, 200)];
        if (typeof v === "number" || typeof v === "boolean") return [k, v];
        return [k, String(v).slice(0, 200)];
      })
  );
}

// ─── Disk I/O ─────────────────────────────────────────────────────────────────

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface RecordUsageParams {
  userId?: string;
  sessionId: string;
  eventType: UsageEventType;
  entityType?: string;
  entityId?: string;
  solutionId?: string;
  feature?: string;
  metadata?: Record<string, unknown>;
}

export function recordUsageEvent(params: RecordUsageParams): void {
  ensureDir();
  const event: UsageEvent = {
    id: `ue-${Date.now()}-${randomUUID().slice(0, 6)}`,
    timestamp: new Date().toISOString(),
    userIdHash: params.userId ? pseudonymise(params.userId) : undefined,
    sessionId: params.sessionId,
    eventType: params.eventType,
    entityType: params.entityType,
    entityId: params.entityId,
    solutionId: params.solutionId,
    feature: params.feature,
    environment: process.env.NODE_ENV ?? "development",
    metadata: sanitiseMeta(params.metadata),
  };
  try {
    appendFileSync(FILE, JSON.stringify(event) + "\n", "utf8");
  } catch {
    // Usage logging must never crash the application
  }
}

export interface UsageMetrics {
  totalEvents: number;
  pageViews: number;
  searches: number;
  credentialsViewed: number;
  packsExported: number;
  savedSearchesCreated: number;
  feedbackSubmitted: number;
  uniqueUserHashes: number;
}

export function computeUsageMetrics(sinceDays = 30): UsageMetrics {
  ensureDir();
  if (!existsSync(FILE)) {
    return {
      totalEvents: 0,
      pageViews: 0,
      searches: 0,
      credentialsViewed: 0,
      packsExported: 0,
      savedSearchesCreated: 0,
      feedbackSubmitted: 0,
      uniqueUserHashes: 0,
    };
  }

  const since = new Date();
  since.setDate(since.getDate() - sinceDays);
  const sinceStr = since.toISOString();

  const events = readFileSync(FILE, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => {
      try {
        return JSON.parse(l) as UsageEvent;
      } catch {
        return null;
      }
    })
    .filter((e): e is UsageEvent => e !== null && e.timestamp >= sinceStr);

  const userHashes = new Set(events.map((e) => e.userIdHash).filter(Boolean));

  return {
    totalEvents: events.length,
    pageViews: events.filter((e) => e.eventType === "page_view").length,
    searches: events.filter((e) => e.eventType === "search").length,
    credentialsViewed: events.filter((e) => e.eventType === "credential_viewed").length,
    packsExported: events.filter((e) => e.eventType === "pack_exported").length,
    savedSearchesCreated: events.filter((e) => e.eventType === "saved_search_created").length,
    feedbackSubmitted: events.filter((e) => e.eventType === "feedback_submitted").length,
    uniqueUserHashes: userHashes.size,
  };
}

/**
 * Retention cleanup: remove events older than retentionDays.
 */
export function applyUsageRetention(retentionDays = 365): number {
  ensureDir();
  if (!existsSync(FILE)) return 0;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - retentionDays);
  const cutoffStr = cutoff.toISOString();

  const lines = readFileSync(FILE, "utf8").split("\n").filter(Boolean);
  const kept = lines.filter((l) => {
    try {
      const e = JSON.parse(l) as UsageEvent;
      return e.timestamp >= cutoffStr;
    } catch {
      return false;
    }
  });

  const removed = lines.length - kept.length;
  if (removed > 0) {
    writeFileSync(FILE, kept.join("\n") + (kept.length ? "\n" : ""), "utf8");
  }
  return removed;
}

// ─── Rich summary for admin analytics dashboard ───────────────────────────────

export interface UsageSummary {
  totalEvents: number;
  uniqueSessions: number;
  topFeatures: { feature: string; count: number }[];
  topEntities: { entityType: string; entityId: string; count: number }[];
  dailyCounts: { date: string; count: number }[];
  eventTypeCounts: { eventType: string; count: number }[];
}

export function getUsageSummary(opts: { days?: number } = {}): UsageSummary {
  ensureDir();
  const days = opts.days ?? 30;
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString();

  const events: UsageEvent[] = existsSync(FILE)
    ? readFileSync(FILE, "utf8")
        .split("\n")
        .filter(Boolean)
        .map((l) => {
          try { return JSON.parse(l) as UsageEvent; } catch { return null; }
        })
        .filter((e): e is UsageEvent => e !== null && e.timestamp >= sinceStr)
    : [];

  const sessions = new Set(events.map((e) => e.sessionId));

  // eventType counts
  const etMap = new Map<string, number>();
  for (const e of events) etMap.set(e.eventType, (etMap.get(e.eventType) ?? 0) + 1);
  const eventTypeCounts = [...etMap.entries()]
    .map(([eventType, count]) => ({ eventType, count }))
    .sort((a, b) => b.count - a.count);

  // feature counts
  const featureMap = new Map<string, number>();
  for (const e of events) {
    if (e.feature) featureMap.set(e.feature, (featureMap.get(e.feature) ?? 0) + 1);
  }
  const topFeatures = [...featureMap.entries()]
    .map(([feature, count]) => ({ feature, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // entity counts
  const entityKey = (e: UsageEvent) => `${e.entityType ?? ""}::${e.entityId ?? ""}`;
  const entityMap = new Map<string, { entityType: string; entityId: string; count: number }>();
  for (const e of events) {
    if (e.entityType && e.entityId) {
      const k = entityKey(e);
      const existing = entityMap.get(k);
      if (existing) existing.count++;
      else entityMap.set(k, { entityType: e.entityType, entityId: e.entityId, count: 1 });
    }
  }
  const topEntities = [...entityMap.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // daily counts
  const dayMap = new Map<string, number>();
  for (const e of events) {
    const day = e.timestamp.slice(0, 10);
    dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
  }
  const dailyCounts = [...dayMap.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalEvents: events.length,
    uniqueSessions: sessions.size,
    topFeatures,
    topEntities,
    dailyCounts,
    eventTypeCounts,
  };
}
