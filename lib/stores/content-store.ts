/**
 * lib/stores/content-store.ts
 *
 * Content workflow state layer.
 * Tracks the publication status and version metadata for content items.
 * The canonical content data still lives in data/*.ts files;
 * this store overlays workflow state (status, reviewer, publish date).
 *
 * Workflow:
 *   draft → submitted → in-review → approved → published
 *                              ↓
 *                          rejected → draft
 *
 * Governance rules:
 *   - Drafts are invisible to normal viewers.
 *   - Only published records appear in normal searches.
 *   - A contributor cannot approve their own submission.
 *   - Source references are required before submission.
 *   - Time-sensitive claims require a reviewBy date.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "content-workflow.json");
const BACKUP = join(DATA_DIR, "content-workflow.backup.json");

export type ContentStatus =
  | "draft"
  | "submitted"
  | "in-review"
  | "approved"
  | "published"
  | "rejected"
  | "archived";

export interface ContentWorkflowRecord {
  id: string;
  entityType: "credential" | "expert" | "partner" | "publication" | "reference-slide";
  entityId: string;
  status: ContentStatus;
  version: number;

  /** The user who created or last submitted the record. */
  submittedBy?: string;
  submittedAt?: string;

  /** The reviewer who approved or rejected. */
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;

  publishedBy?: string;
  publishedAt?: string;

  timeSensitive: boolean;
  /** ISO date by which the record must be reviewed */
  reviewBy?: string;
  lastReviewedAt?: string;

  /** Source references required before submission */
  hasSourceReferences: boolean;

  updatedAt: string;
  createdAt: string;
}

interface ContentWorkflowStore {
  version: number;
  updatedAt: string;
  records: ContentWorkflowRecord[];
}

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readStore(): ContentWorkflowStore {
  try {
    if (!existsSync(FILE)) return emptyStore();
    return JSON.parse(readFileSync(FILE, "utf8")) as ContentWorkflowStore;
  } catch {
    try {
      if (existsSync(BACKUP))
        return JSON.parse(readFileSync(BACKUP, "utf8")) as ContentWorkflowStore;
    } catch {}
    return emptyStore();
  }
}

function emptyStore(): ContentWorkflowStore {
  return { version: 1, updatedAt: new Date().toISOString(), records: [] };
}

function writeStore(store: ContentWorkflowStore) {
  ensureDir();
  if (existsSync(FILE)) writeFileSync(BACKUP, readFileSync(FILE));
  writeFileSync(FILE, JSON.stringify(store, null, 2));
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getAllContentRecords(): ContentWorkflowRecord[] {
  return readStore().records;
}

export function getContentRecord(entityType: string, entityId: string): ContentWorkflowRecord | null {
  return (
    readStore().records.find((r) => r.entityType === entityType && r.entityId === entityId) ?? null
  );
}

/** Returns only published records — safe for viewer-facing queries. */
export function getPublishedIds(entityType: string): string[] {
  return readStore()
    .records.filter((r) => r.entityType === entityType && r.status === "published")
    .map((r) => r.entityId);
}

/** Returns records that need review (in-review status or past reviewBy date). */
export function getRecordsPendingReview(): ContentWorkflowRecord[] {
  const now = new Date().toISOString();
  return readStore().records.filter(
    (r) =>
      r.status === "in-review" ||
      r.status === "submitted" ||
      (r.timeSensitive && r.reviewBy && r.reviewBy < now)
  );
}

export function upsertContentRecord(
  record: Omit<ContentWorkflowRecord, "id" | "createdAt" | "updatedAt" | "version"> & {
    version?: number;
  }
): ContentWorkflowRecord {
  const store = readStore();
  const existing = store.records.findIndex(
    (r) => r.entityType === record.entityType && r.entityId === record.entityId
  );
  const now = new Date().toISOString();
  if (existing !== -1) {
    const prev = store.records[existing];
    const updated: ContentWorkflowRecord = {
      ...prev,
      ...record,
      version: (record.version ?? prev.version) + 1,
      updatedAt: now,
    };
    store.records[existing] = updated;
    store.version += 1;
    store.updatedAt = now;
    writeStore(store);
    return updated;
  }
  const created: ContentWorkflowRecord = {
    ...record,
    id: `cw-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    version: 1,
    createdAt: now,
    updatedAt: now,
  };
  store.records.push(created);
  store.version += 1;
  store.updatedAt = now;
  writeStore(store);
  return created;
}

/**
 * Transition a content record's status.
 * Self-approval is enforced here: pass submittedBy and actorId to check.
 */
export function transitionContentStatus(
  entityType: string,
  entityId: string,
  newStatus: ContentStatus,
  actorId: string,
  options?: { reviewNotes?: string; reviewBy?: string }
): ContentWorkflowRecord {
  const store = readStore();
  const idx = store.records.findIndex(
    (r) => r.entityType === entityType && r.entityId === entityId
  );
  if (idx === -1) throw new Error("Content record not found.");

  const record = store.records[idx];

  // Self-approval guard
  if (
    (newStatus === "approved" || newStatus === "published") &&
    record.submittedBy === actorId
  ) {
    throw new Error("Contributors cannot approve their own submissions.");
  }

  const now = new Date().toISOString();
  const updated: ContentWorkflowRecord = {
    ...record,
    status: newStatus,
    version: record.version + 1,
    updatedAt: now,
  };

  if (newStatus === "submitted") {
    updated.submittedBy = actorId;
    updated.submittedAt = now;
  }
  if (newStatus === "in-review" || newStatus === "approved" || newStatus === "rejected") {
    updated.reviewedBy = actorId;
    updated.reviewedAt = now;
    if (options?.reviewNotes) updated.reviewNotes = options.reviewNotes;
  }
  if (newStatus === "published") {
    updated.publishedBy = actorId;
    updated.publishedAt = now;
  }
  if (options?.reviewBy) updated.reviewBy = options.reviewBy;

  store.records[idx] = updated;
  store.version += 1;
  store.updatedAt = now;
  writeStore(store);
  return updated;
}
