import { NextRequest, NextResponse } from "next/server";
import { buildClearCookieHeader } from "@/lib/auth/session";
import { writeAuditEvent } from "@/lib/stores/audit-store";
import { getSession } from "@/lib/auth/guard";

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (session) {
    await writeAuditEvent({
      actorUserId: session.userId,
      actorEmail: session.email,
      actorRole: session.role,
      action: "auth:logout",
      entityType: "user",
      entityId: session.userId,
    });
  }
  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", buildClearCookieHeader());
  return response;
}
