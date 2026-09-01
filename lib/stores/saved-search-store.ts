/**
 * lib/stores/saved-search-store.ts
 *
 * File-backed store for saved searches and saved analytical views.
 * Swap seam: replace readFromDisk/writeToDisk with DB queries when available.
 *
 * NEVER stores raw workbook rows or full credential records —
 * only the filter parameters used to reproduce the query.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "saved-searches.json");

// ─── Types ────────────────────────────────────────────────────────────────────

export type SavedSearchType =
  | "credentials"
  | "experts"
  | "partners"
  | "publications"
  | "analytics-credentials"
  | "analytics-cases"
  | "cross-content";

export interface SavedSearch {
  id: string;
  ownerUserId: string;
  ownerEmail: string;

  name: string;
  description?: string;
  type: SavedSearchType;

  /** Serialised filter parameters — no raw content, only keys/values. */
  queryParams: Record<string, string | string[] | boolean | number>;

  /** For analytics saved views — snapshot of the methodology context. */
  analyticalContext?: {
    tab?: "credentials" | "cases";
    mode?: "count" | "pct";
    datasetVersion?: string;
  };

  visibility: "private" | "shared-with-users";
  sharedUserIds: string[];

  subscriptionEnabled: boolean;
  subscriptionFrequency?: "daily" | "weekly";

  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;

  /** Archived searches do not trigger alerts or appear in active lists. */
  archived: boolean;
}

// ─── Disk I/O ─────────────────────────────────────────────────────────────────

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readAll(): SavedSearch[] {
  ensureDir();
  if (!existsSync(FILE)) return [];
  try {
    return JSON.parse(readFileSync(FILE, "utf8")) as SavedSearch[];
  } catch {
    return [];
  }
}

function writeAll(searches: SavedSearch[]) {
  ensureDir();
  writeFileSync(FILE, JSON.stringify(searches, null, 2), "utf8");
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function createSavedSearch(
  params: Omit<SavedSearch, "id" | "createdAt" | "updatedAt" | "archived">
): SavedSearch {
  const all = readAll();
  const now = new Date().toISOString();
  const search: SavedSearch = {
    ...params,
    id: `ss-${Date.now()}-${randomUUID().slice(0, 8)}`,
    createdAt: now,
    updatedAt: now,
    archived: false,
  };
  writeAll([...all, search]);
  return search;
}

export function listSavedSearches(ownerUserId: string): SavedSearch[] {
  return readAll().filter(
    (s) =>
      !s.archived &&
      (s.ownerUserId === ownerUserId || s.sharedUserIds.includes(ownerUserId))
  );
}

export function listAllSavedSearches(): SavedSearch[] {
  return readAll();
}

export function getSavedSearch(id: string): SavedSearch | undefined {
  return readAll().find((s) => s.id === id);
}

export function updateSavedSearch(
  id: string,
  patch: Partial<Pick<SavedSearch, "name" | "description" | "subscriptionEnabled" | "subscriptionFrequency" | "visibility" | "sharedUserIds" | "lastRunAt" | "archived">>
): SavedSearch | null {
  const all = readAll();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
  all[idx] = updated;
  writeAll(all);
  return updated;
}

export function deleteSavedSearch(id: string): boolean {
  const all = readAll();
  const filtered = all.filter((s) => s.id !== id);
  if (filtered.length === all.length) return false;
  writeAll(filtered);
  return true;
}

/** Return non-archived searches with subscriptions enabled. */
export function listSubscribedSearches(): SavedSearch[] {
  return readAll().filter((s) => !s.archived && s.subscriptionEnabled);
}
