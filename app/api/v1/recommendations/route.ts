/**
 * GET /api/v1/recommendations
 *
 * Returns grounded recommendations for the current user.
 * Every result exists in the application data and has a visible reason.
 * Restricted records are never returned.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guard";
import { getRecommendations } from "@/lib/search/recommendations";
import { z } from "zod";

export const dynamic = "force-dynamic";

const QuerySchema = z.object({
  recentProducts: z.string().optional(),
  recentIndustries: z.string().optional(),
  dismissed: z.string().optional(),
  personalise: z.coerce.boolean().default(true),
  limit: z.coerce.number().int().min(1).max(12).default(6),
});

export async function GET(req: NextRequest) {
  const { session, response: authErr } = await requireSession(req);
  if (authErr) return authErr;

  const sp = req.nextUrl.searchParams;
  const parsed = QuerySchema.safeParse({
    recentProducts: sp.get("recentProducts") ?? undefined,
    recentIndustries: sp.get("recentIndustries") ?? undefined,
    dismissed: sp.get("dismissed") ?? undefined,
    personalise: sp.get("personalise") ?? true,
    limit: sp.get("limit") ?? 6,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid parameters." }, { status: 400 });
  }

  const { recentProducts, recentIndustries, dismissed, personalise, limit } = parsed.data;

  const recommendations = getRecommendations(
    {
      recentProductIds: recentProducts?.split(",").filter(Boolean),
      recentIndustryIds: recentIndustries?.split(",").filter(Boolean),
      dismissedIds: dismissed?.split(",").filter(Boolean),
      personalisationEnabled: personalise,
    },
    limit
  );

  return NextResponse.json({ recommendations, userId: session.userId });
}
