/**
 * POST /api/jobs/retention
 *
 * Applies retention policies to archived notifications and usage events.
 * NEVER removes published records, non-archived notifications, or unread notifications.
 * Requires CRON_SECRET header or administrator session.
 */

import { NextRequest, NextResponse } from "next/server";
import { runJob } from "@/lib/jobs/job-runner";
import { cleanupExpiredNotifications } from "@/lib/stores/notification-store";
import { applyUsageRetention } from "@/lib/stores/usage-store";
import { getSession } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

function isCronAuthorised(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("x-cron-secret") === secret;
}

async function isAdminSession(req: NextRequest): Promise<boolean> {
  const session = await getSession(req);
  return session?.role === "administrator";
}

export async function POST(req: NextRequest) {
  const cronOk = isCronAuthorised(req);
  const adminOk = !cronOk && (await isAdminSession(req));
  if (!cronOk && !adminOk) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const result = await runJob("retention-cleanup", async () => {
    const notifRemoved = cleanupExpiredNotifications(90);
    const usageRemoved = applyUsageRetention(365);
    return { processedCount: notifRemoved + usageRemoved };
  });

  return NextResponse.json(result);
}
