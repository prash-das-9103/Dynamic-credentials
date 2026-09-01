import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/guard";
import { listExperiments } from "@/lib/stores/experiment-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { response: authErr } = await requirePermission(request, "system:manage");
  if (authErr) return authErr;

  const experiments = listExperiments();
  return NextResponse.json({ experiments });
}
