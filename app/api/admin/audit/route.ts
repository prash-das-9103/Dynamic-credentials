/**
 * GET /api/admin/audit — paginated audit log (requires audit:view)
 */

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/guard";
import { readAuditEvents } from "@/lib/stores/audit-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { response } = await requirePermission(req, "audit:view");
  if (response) return response;

  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "50"), 200);
  const offset = Math.max(Number(url.searchParams.get("offset") ?? "0"), 0);
  const entityType = url.searchParams.get("entityType") ?? undefined;
  const action = url.searchParams.get("action") ?? undefined;
  const since = url.searchParams.get("since") ?? undefined;

  const { events, total } = readAuditEvents({ limit, offset, entityType, action, since });

  return NextResponse.json({ events, total, limit, offset });
}
