import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/guard";
import { listFeedback } from "@/lib/stores/feedback-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { response: authErr } = await requirePermission(request, "content:review");
  if (authErr) return authErr;

  const { items, total } = listFeedback({ limit: 500 });
  return NextResponse.json({ feedback: items, total });
}
