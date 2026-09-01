/**
 * GET  /api/v1/notifications — list notifications for the current user
 * POST /api/v1/notifications/read-all — mark all as read
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guard";
import {
  listNotifications,
  countUnread,
  markAllRead,
} from "@/lib/stores/notification-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { session, response: authErr } = await requireSession(req);
  if (authErr) return authErr;

  const sp = req.nextUrl.searchParams;
  const includeArchived = sp.get("archived") === "1";
  const limit = Math.min(parseInt(sp.get("limit") ?? "50", 10), 100);

  const notifications = listNotifications(session.userId, { includeArchived, limit });
  const unreadCount = countUnread(session.userId);

  return NextResponse.json({ notifications, unreadCount });
}
