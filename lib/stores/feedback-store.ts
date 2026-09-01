/**
 * lib/stores/feedback-store.ts
 *
 * User feedback and correction requests.
 * Feedback never directly modifies published records.
 * Resolution must go through the governed content workflow.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "feedback.json");

// ─── Types ────────────────────────────────────────────────────────────────────

export type FeedbackType =
  | "content-error"
  | "data-quality"
  | "missing-content"
  | "confidentiality-concern"
  | "search-quality"
  | "recommendation-quality"
  | "general";

export type FeedbackStatus =
  | "new"
  | "triaged"
  | "in-progress"
  | "resolved"
  | "closed"
  | "duplicate";

export interface FeedbackItem {
  id: string;
  createdBy: string;
  createdByEmail: string;
  createdAt: string;
  updatedAt: string;

  type: FeedbackType;
  message: string;

  entityType?: string;
  entityId?: string;
  /** The route the user was on when they submitted feedback. */
  route: string;

  /**
   * Safe structured context — filter keys and entity IDs only.
   * Raw workbook rows, credential text, and prompts are NOT stored.
   */
  structuredContext?: {
    searchQuery?: string;
    activeFilters?: Record<string, string[]>;
    datasetVersion?: string;
    applicationVersion?: string;
  };

  status: FeedbackStatus;
  assignedTo?: string;
  resolutionNotes?: string;
  /** ID of a canonical item if this is a duplicate. */
  duplicateOf?: string;
}

// ─── Disk I/O ─────────────────────────────────────────────────────────────────

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readAll(): FeedbackItem[] {
  ensureDir();
  if (!existsSync(FILE)) return [];
  try {
    return JSON.parse(readFileSync(FILE, "utf8")) as FeedbackItem[];
  } catch {
    return [];
  }
}

function writeAll(items: FeedbackItem[]) {
  ensureDir();
  writeFileSync(FILE, JSON.stringify(items, null, 2), "utf8");
}

// ─── Public API ───────────────────────────────────────────────────────────────

export type CreateFeedbackParams = Omit<
  FeedbackItem,
  "id" | "createdAt" | "updatedAt" | "status"
>;

export function createFeedback(params: CreateFeedbackParams): FeedbackItem {
  const all = readAll();
  const now = new Date().toISOString();
  const item: FeedbackItem = {
    ...params,
    id: `fb-${Date.now()}-${randomUUID().slice(0, 8)}`,
    createdAt: now,
    updatedAt: now,
    status: "new",
  };
  writeAll([...all, item]);
  return item;
}

export function listFeedback(opts: {
  status?: FeedbackStatus;
  type?: FeedbackType;
  limit?: number;
  offset?: number;
} = {}): { items: FeedbackItem[]; total: number } {
  let all = readAll();
  if (opts.status) all = all.filter((f) => f.status === opts.status);
  if (opts.type) all = all.filter((f) => f.type === opts.type);
  // Newest first
  all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const total = all.length;
  const limit = opts.limit ?? 50;
  const offset = opts.offset ?? 0;
  return { items: all.slice(offset, offset + limit), total };
}

export function getFeedback(id: string): FeedbackItem | undefined {
  return readAll().find((f) => f.id === id);
}

export function updateFeedback(
  id: string,
  patch: Partial<Pick<FeedbackItem, "status" | "assignedTo" | "resolutionNotes" | "duplicateOf">>
): FeedbackItem | null {
  const all = readAll();
  const idx = all.findIndex((f) => f.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
  writeAll(all);
  return all[idx];
}
