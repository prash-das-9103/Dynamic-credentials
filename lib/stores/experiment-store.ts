/**
 * lib/stores/experiment-store.ts
 *
 * Controlled experimentation registry.
 * Administrators define experiments; feature flags gate new behaviour.
 * No experiment automatically alters published taxonomy or content.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "experiments.json");

// ─── Types ────────────────────────────────────────────────────────────────────

export type ExperimentStatus = "draft" | "active" | "paused" | "completed";

export interface Experiment {
  id: string;
  name: string;
  description?: string;
  status: ExperimentStatus;
  environment: string;
  variants: string[];
  /** 0–100: percentage of eligible users to include. */
  allocationPercentage: number;
  startDate?: string;
  endDate?: string;
  owner: string;
  successMetrics: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Disk I/O ─────────────────────────────────────────────────────────────────

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readAll(): Experiment[] {
  ensureDir();
  if (!existsSync(FILE)) return [];
  try {
    return JSON.parse(readFileSync(FILE, "utf8")) as Experiment[];
  } catch {
    return [];
  }
}

function writeAll(experiments: Experiment[]) {
  ensureDir();
  writeFileSync(FILE, JSON.stringify(experiments, null, 2), "utf8");
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function createExperiment(
  params: Omit<Experiment, "id" | "createdAt" | "updatedAt">
): Experiment {
  const all = readAll();
  const now = new Date().toISOString();
  const experiment: Experiment = {
    ...params,
    id: `exp-${Date.now()}-${randomUUID().slice(0, 8)}`,
    createdAt: now,
    updatedAt: now,
  };
  writeAll([...all, experiment]);
  return experiment;
}

export function listExperiments(status?: ExperimentStatus): Experiment[] {
  const all = readAll();
  return status ? all.filter((e) => e.status === status) : all;
}

export function getExperiment(id: string): Experiment | undefined {
  return readAll().find((e) => e.id === id);
}

export function updateExperiment(
  id: string,
  patch: Partial<Omit<Experiment, "id" | "createdAt">>
): Experiment | null {
  const all = readAll();
  const idx = all.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
  writeAll(all);
  return all[idx];
}
