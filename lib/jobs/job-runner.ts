/**
 * lib/jobs/job-runner.ts
 *
 * Idempotent scheduled job infrastructure.
 *
 * Each job:
 *   - Runs idempotently (safe to call multiple times)
 *   - Can retry on failure
 *   - Is visible to administrators on failure
 *   - Never creates duplicate notifications
 *   - Never deletes published records
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "job-runs.json");

// ─── Types ────────────────────────────────────────────────────────────────────

export type JobStatus = "running" | "success" | "failed" | "skipped";

export interface JobRun {
  id: string;
  jobName: string;
  startedAt: string;
  finishedAt?: string;
  status: JobStatus;
  /** Number of items processed (safe aggregate, no content). */
  processedCount?: number;
  errorMessage?: string;
  retryCount: number;
}

// ─── Disk I/O ─────────────────────────────────────────────────────────────────

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readAll(): JobRun[] {
  ensureDir();
  if (!existsSync(FILE)) return [];
  try {
    return JSON.parse(readFileSync(FILE, "utf8")) as JobRun[];
  } catch {
    return [];
  }
}

function writeAll(runs: JobRun[]) {
  ensureDir();
  writeFileSync(FILE, JSON.stringify(runs, null, 2), "utf8");
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns true if a job with the given name is currently running.
 * Used to prevent concurrent duplicate runs.
 */
export function isJobRunning(jobName: string): boolean {
  return readAll().some((r) => r.jobName === jobName && r.status === "running");
}

export function startJobRun(jobName: string): JobRun {
  const all = readAll();
  const run: JobRun = {
    id: `job-${Date.now()}-${randomUUID().slice(0, 8)}`,
    jobName,
    startedAt: new Date().toISOString(),
    status: "running",
    retryCount: 0,
  };
  writeAll([...all, run]);
  return run;
}

export function finishJobRun(
  id: string,
  status: Exclude<JobStatus, "running">,
  opts: { processedCount?: number; errorMessage?: string } = {}
): void {
  const all = readAll();
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return;
  all[idx] = {
    ...all[idx],
    finishedAt: new Date().toISOString(),
    status,
    ...opts,
  };
  writeAll(all);
}

export function listJobRuns(opts: { jobName?: string; limit?: number } = {}): JobRun[] {
  let all = readAll();
  if (opts.jobName) all = all.filter((r) => r.jobName === opts.jobName);
  all.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  return opts.limit ? all.slice(0, opts.limit) : all;
}

export function listFailedJobs(): JobRun[] {
  return readAll().filter((r) => r.status === "failed");
}

/**
 * Wrap a job function with tracking, error catching, and logging.
 * Returns { status, processedCount, errorMessage }.
 *
 * Skips if the same job is already running (idempotency guard).
 */
export async function runJob(
  jobName: string,
  fn: () => Promise<{ processedCount: number }>
): Promise<{ status: JobStatus; processedCount: number; errorMessage?: string }> {
  if (isJobRunning(jobName)) {
    return { status: "skipped", processedCount: 0, errorMessage: "Already running." };
  }
  const run = startJobRun(jobName);
  try {
    const result = await fn();
    finishJobRun(run.id, "success", { processedCount: result.processedCount });
    return { status: "success", processedCount: result.processedCount };
  } catch (err) {
    const errorMessage = (err as Error)?.message ?? String(err);
    finishJobRun(run.id, "failed", { errorMessage });
    console.error(`[job:${jobName}] failed:`, errorMessage);
    return { status: "failed", processedCount: 0, errorMessage };
  }
}
