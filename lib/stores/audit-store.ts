/**
 * lib/stores/audit-store.ts
 *
 * Append-only audit event log.
 * Audit events are immutable once written — no update or delete path.
 *
 * Each event includes a correlation ID.
 * Raw workbook content, credentials, API keys, and stack traces are NEVER logged.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

const DATA_DIR = join(process.cwd(), ".data");
/** One JSON object per line (newline-delimited JSON) for efficient appending. */
const FILE = join(DATA_DIR, "audit.ndjson");

export interface AuditEvent {
  id: string;
  correlationId: string;
  timestamp: string;
  actorUserId: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId?: string;
  environment: string;
  previousVersion?: number;
  newVersion?: number;
  reason?: string;
  /**
   * Sanitised metadata only — no raw content, passwords, or secrets.
   * String values are truncated to 500 chars.
   */
  metadata?: Record<string, string | number | boolean>;
}

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Sanitise metadata values to prevent sensitive data leaking into audit logs.
 * Truncates strings, removes any key containing "password", "secret", "token", "key".
 */
function sanitiseMetadata(
  raw?: Record<string, unknown>
): Record<string, string | number | boolean> | undefined {
  if (!raw) return undefined;
  const BLOCKED = /password|secret|token|key|auth|credential/i;
  return Object.fromEntries(
    Object.entries(raw)
      .filter(([k]) => !BLOCKED.test(k))
      .map(([k, v]) => {
        if (typeof v === "string") return [k, v.slice(0, 500)];
        if (typeof v === "number" || typeof v === "boolean") return [k, v];
        return [k, String(v).slice(0, 500)];
      })
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface WriteAuditParams {
  correlationId?: string;
  actorUserId: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId?: string;
  previousVersion?: number;
  newVersion?: number;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export async function writeAuditEvent(params: WriteAuditParams): Promise<AuditEvent> {
  ensureDir();
  const event: AuditEvent = {
    id: `audit-${Date.now()}-${randomUUID().slice(0, 8)}`,
    correlationId: params.correlationId ?? randomUUID(),
    timestamp: new Date().toISOString(),
    actorUserId: params.actorUserId,
    actorEmail: params.actorEmail,
    actorRole: params.actorRole,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    environment: process.env.NODE_ENV ?? "development",
    previousVersion: params.previousVersion,
    newVersion: params.newVersion,
    reason: params.reason,
    metadata: sanitiseMetadata(params.metadata),
  };
  // Append as newline-delimited JSON — immutable; never update existing lines
  appendFileSync(FILE, JSON.stringify(event) + "\n", "utf8");
  return event;
}

export interface AuditQuery {
  limit?: number;
  offset?: number;
  actorUserId?: string;
  entityType?: string;
  action?: string;
  since?: string;
}

export function readAuditEvents(query: AuditQuery = {}): {
  events: AuditEvent[];
  total: number;
} {
  ensureDir();
  if (!existsSync(FILE)) return { events: [], total: 0 };

  const lines = readFileSync(FILE, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => {
      try {
        return JSON.parse(l) as AuditEvent;
      } catch {
        return null;
      }
    })
    .filter((e): e is AuditEvent => e !== null);

  // Apply filters
  let filtered = lines;
  if (query.actorUserId)
    filtered = filtered.filter((e) => e.actorUserId === query.actorUserId);
  if (query.entityType)
    filtered = filtered.filter((e) => e.entityType === query.entityType);
  if (query.action)
    filtered = filtered.filter((e) => e.action === query.action);
  if (query.since)
    filtered = filtered.filter((e) => e.timestamp >= query.since!);

  // Return newest first
  filtered = filtered.reverse();

  const total = filtered.length;
  const limit = query.limit ?? 100;
  const offset = query.offset ?? 0;
  return { events: filtered.slice(offset, offset + limit), total };
}
