/**
 * PATCH /api/v1/notifications/[id] — mark read or archive
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guard";
import { markRead, archiveNotification } from "@/lib/stores/notification-store";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, response: authErr } = await requireSession(req);
  if (authErr) return authErr;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const action = body.action as string;

  if (action === "read") {
    const ok = markRead(id, session.userId);
    return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (action === "archive") {
    const ok = archiveNotification(id, session.userId);
    return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ error: "Invalid action. Use 'read' or 'archive'." }, { status: 400 });
}
