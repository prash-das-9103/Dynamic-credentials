import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/guard";
import { getUsageSummary } from "@/lib/stores/usage-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { response: authErr } = await requirePermission(request, "system:manage");
  if (authErr) return authErr;

  const summary = getUsageSummary({ days: 30 });
  return NextResponse.json(summary);
}
