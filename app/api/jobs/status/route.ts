/**
 * GET /api/jobs/status
 * Returns recent job runs. Administrator only.
 * Failed jobs are visible to administrators for operational awareness.
 */

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/guard";
import { listJobRuns, listFailedJobs } from "@/lib/jobs/job-runner";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { session, response: authErr } = await requirePermission(req, "system:manage");
  if (authErr) return authErr;

  void session; // used for permission check only
  const recentRuns = listJobRuns({ limit: 50 });
  const failedJobs = listFailedJobs();

  return NextResponse.json({ recentRuns, failedJobs });
}
