/**
 * GET /api/v1/search
 *
 * Permission-aware search endpoint.
 * Requires authentication. Rate-limited server-side.
 *
 * Query params:
 *   q            — search query (required)
 *   product      — exact product ID filter
 *   industry     — exact industry ID filter
 *   region       — exact region ID filter
 *   clientNeed   — exact client need ID filter
 *   solution     — exact solution ID filter
 *   types        — comma-separated entity types (credential,expert,partner)
 *   limit        — max results (default 20, max 50)
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guard";
import { search } from "@/lib/search/search-engine";
import { recordUsageEvent } from "@/lib/stores/usage-store";
import { z } from "zod";

export const dynamic = "force-dynamic";

const QuerySchema = z.object({
  q: z.string().max(500).default(""),
  product: z.string().optional(),
  industry: z.string().optional(),
  region: z.string().optional(),
  clientNeed: z.string().optional(),
  solution: z.string().optional(),
  types: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export async function GET(req: NextRequest) {
  const { session, response: authErr } = await requireSession(req);
  if (authErr) return authErr;

  const sp = req.nextUrl.searchParams;
  const parsed = QuerySchema.safeParse({
    q: sp.get("q") ?? "",
    product: sp.get("product") ?? undefined,
    industry: sp.get("industry") ?? undefined,
    region: sp.get("region") ?? undefined,
    clientNeed: sp.get("clientNeed") ?? undefined,
    solution: sp.get("solution") ?? undefined,
    types: sp.get("types") ?? undefined,
    limit: sp.get("limit") ?? 20,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query parameters." }, { status: 400 });
  }

  const { q, product, industry, region, clientNeed, solution, types, limit } = parsed.data;
  const entityTypes = types
    ? (types.split(",").filter((t) => ["credential", "expert", "partner"].includes(t)) as ("credential" | "expert" | "partner")[])
    : undefined;

  const result = search(
    { q, product, industry, region, clientNeed, solution, entityTypes, limit },
    session.role
  );

  // Log safe usage event (no raw content, no full query for sensitive searches)
  recordUsageEvent({
    userId: session.userId,
    sessionId: req.headers.get("x-session-id") ?? session.userId,
    eventType: "search",
    feature: "v1-search",
    metadata: {
      resultCount: result.totalResults,
      routedToAnalytics: result.routeToAnalytics ?? false,
    },
  });

  return NextResponse.json(result);
}
