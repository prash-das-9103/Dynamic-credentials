/**
 * POST /api/jobs/freshness
 *
 * Checks content freshness and creates notifications for stale records.
 * Idempotent — uses dedupeKeys to avoid duplicate notifications.
 * Requires: CRON_SECRET header matching env var CRON_SECRET, or administrator session.
 *
 * Never deletes published records.
 * Only creates notifications — does not modify content directly.
 */

import { NextRequest, NextResponse } from "next/server";
import { runJob } from "@/lib/jobs/job-runner";
import { createNotification } from "@/lib/stores/notification-store";
import { listAllSavedSearches } from "@/lib/stores/saved-search-store";
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

  const result = await runJob("freshness-check", async () => {
    // Check subscribed saved searches for new matches
    // In production this would compare against the last-run snapshot.
    // Here we use a simple staleness window of 7 days.
    const searches = listAllSavedSearches();
    let notified = 0;

    for (const search of searches) {
      if (!search.subscriptionEnabled || search.archived) continue;

      const lastRun = search.lastRunAt ? new Date(search.lastRunAt) : null;
      const staleThresholdDays = search.subscriptionFrequency === "daily" ? 1 : 7;
      const stale =
        !lastRun ||
        Date.now() - lastRun.getTime() > staleThresholdDays * 86400 * 1000;

      if (!stale) continue;

      createNotification({
        userId: search.ownerUserId,
        type: "saved-search-alert",
        title: `Saved search ready: ${search.name}`,
        message: `Your saved search "${search.name}" is ready to run. New content may be available.`,
        link: `/saved-searches`,
        priority: "normal",
        deliveryChannels: ["in-app"],
        dedupeKey: `freshness:${search.id}:${new Date().toISOString().slice(0, 10)}`,
      });
      notified++;
    }

    return { processedCount: notified };
  });

  return NextResponse.json(result);
}
