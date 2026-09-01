import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guard";
import { markAllRead } from "@/lib/stores/notification-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { session, response: authErr } = await requireSession(req);
  if (authErr) return authErr;

  const count = markAllRead(session.userId);
  return NextResponse.json({ markedRead: count });
}
