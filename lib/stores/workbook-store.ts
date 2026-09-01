/**
 * lib/stores/workbook-store.ts
 *
 * Versioned workbook registry.
 * Each uploaded workbook creates a new version.
 * Publishing a version updates the active analytical dataset.
 * Prior versions remain available for rollback.
 *
 * Column governance (enforced at parse time):
 *   A  = region
 *   D  = case end date  (time field — Col D ONLY)
 *   Q  = solution
 *   T  = Food Systems Transformation tag
 *
 * Raw workbook rows are NEVER written to this store or to logs.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "workbook-versions.json");
const BACKUP = join(DATA_DIR, "workbook-versions.backup.json");

export type WorkbookStatus =
  | "uploaded"
  | "validating"
  | "needs-review"
  | "approved"
  | "published"
  | "rejected"
  | "superseded";

export interface WorkbookVersion {
  id: string;
  versionNumber: number;
  fileName: string;
  /** SHA-256 hex digest of the raw file bytes */
  fileChecksum: string;
  /** Name of the authoritative sheet parsed */
  sourceSheet: string;
  /** 0-indexed row number of the header */
  headerRow: number;

  uploadedBy: string;
  uploadedByEmail: string;
  uploadedAt: string;

  reviewedBy?: string;
  reviewedAt?: string;

  publishedBy?: string;
  publishedAt?: string;

  status: WorkbookStatus;

  rawRowCount: number;
  uniqueCaseCount: number;
  invalidEndDateCount: number;

  minimumEndDate?: string;
  maximumEndDate?: string;

  validationSummary: {
    errors: number;
    warnings: number;
    information: number;
  };

  notes?: string;
}

interface WorkbookStore {
  version: number;
  updatedAt: string;
  activeVersionId: string | null;
  versions: WorkbookVersion[];
}

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readStore(): WorkbookStore {
  try {
    if (!existsSync(FILE)) return emptyStore();
    return JSON.parse(readFileSync(FILE, "utf8")) as WorkbookStore;
  } catch {
    try {
      if (existsSync(BACKUP))
        return JSON.parse(readFileSync(BACKUP, "utf8")) as WorkbookStore;
    } catch {}
    return emptyStore();
  }
}

function emptyStore(): WorkbookStore {
  return { version: 1, updatedAt: new Date().toISOString(), activeVersionId: null, versions: [] };
}

function writeStore(store: WorkbookStore) {
  ensureDir();
  if (existsSync(FILE)) writeFileSync(BACKUP, readFileSync(FILE));
  writeFileSync(FILE, JSON.stringify(store, null, 2));
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getAllWorkbookVersions(): WorkbookVersion[] {
  return readStore().versions.sort((a, b) => b.versionNumber - a.versionNumber);
}

export function getActiveWorkbookVersion(): WorkbookVersion | null {
  const store = readStore();
  if (!store.activeVersionId) return null;
  return store.versions.find((v) => v.id === store.activeVersionId) ?? null;
}

export function getWorkbookVersionById(id: string): WorkbookVersion | null {
  return readStore().versions.find((v) => v.id === id) ?? null;
}

export function createWorkbookVersion(
  fields: Omit<WorkbookVersion, "id" | "versionNumber">
): WorkbookVersion {
  const store = readStore();
  const maxVersion = store.versions.reduce((m, v) => Math.max(m, v.versionNumber), 0);
  const version: WorkbookVersion = {
    ...fields,
    id: `wb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    versionNumber: maxVersion + 1,
  };
  store.versions.push(version);
  store.version += 1;
  store.updatedAt = new Date().toISOString();
  writeStore(store);
  return version;
}

export function updateWorkbookVersionStatus(
  id: string,
  status: WorkbookStatus,
  actorId: string,
  actorEmail: string,
  notes?: string
): WorkbookVersion {
  const store = readStore();
  const idx = store.versions.findIndex((v) => v.id === id);
  if (idx === -1) throw new Error("Workbook version not found.");
  const now = new Date().toISOString();
  const updated = { ...store.versions[idx], status, notes: notes ?? store.versions[idx].notes };
  if (status === "approved") {
    updated.reviewedBy = actorId;
    updated.reviewedAt = now;
  }
  if (status === "published") {
    updated.publishedBy = actorId;
    updated.publishedAt = now;
  }
  store.versions[idx] = updated;
  store.version += 1;
  store.updatedAt = now;
  writeStore(store);
  return updated;
}

/**
 * Publish a workbook version.
 * Marks the previous active version as "superseded".
 * Publishing is the only event that switches the active analytical dataset.
 */
export function publishWorkbookVersion(
  id: string,
  actorId: string,
  actorEmail: string
): WorkbookVersion {
  const store = readStore();
  const idx = store.versions.findIndex((v) => v.id === id);
  if (idx === -1) throw new Error("Workbook version not found.");
  if (store.versions[idx].status !== "approved") {
    throw new Error("Only approved workbook versions can be published.");
  }

  const now = new Date().toISOString();

  // Supersede current active
  if (store.activeVersionId) {
    const prevIdx = store.versions.findIndex((v) => v.id === store.activeVersionId);
    if (prevIdx !== -1) {
      store.versions[prevIdx] = { ...store.versions[prevIdx], status: "superseded" };
    }
  }

  store.versions[idx] = {
    ...store.versions[idx],
    status: "published",
    publishedBy: actorId,
    publishedAt: now,
  };
  store.activeVersionId = id;
  store.version += 1;
  store.updatedAt = now;
  writeStore(store);
  return store.versions[idx];
}

/**
 * Rollback to a prior published or approved version.
 * Requires workbook:rollback permission (checked in the route handler).
 */
export function rollbackToWorkbookVersion(
  id: string,
  actorId: string,
  actorEmail: string
): WorkbookVersion {
  const store = readStore();
  const target = store.versions.find((v) => v.id === id);
  if (!target) throw new Error("Workbook version not found.");
  if (!["published", "approved", "superseded"].includes(target.status)) {
    throw new Error("Can only roll back to a previously published or approved version.");
  }

  const now = new Date().toISOString();
  if (store.activeVersionId) {
    const prevIdx = store.versions.findIndex((v) => v.id === store.activeVersionId);
    if (prevIdx !== -1) {
      store.versions[prevIdx] = { ...store.versions[prevIdx], status: "superseded" };
    }
  }

  const targetIdx = store.versions.findIndex((v) => v.id === id);
  store.versions[targetIdx] = {
    ...target,
    status: "published",
    publishedBy: actorId,
    publishedAt: now,
  };
  store.activeVersionId = id;
  store.version += 1;
  store.updatedAt = now;
  writeStore(store);
  return store.versions[targetIdx];
}
