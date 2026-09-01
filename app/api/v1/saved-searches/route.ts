/**
 * GET  /api/v1/saved-searches — list saved searches for the current user
 * POST /api/v1/saved-searches — create a saved search
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guard";
import { createSavedSearch, listSavedSearches } from "@/lib/stores/saved-search-store";
import { writeAuditEvent } from "@/lib/stores/audit-store";
import { z } from "zod";

export const dynamic = "force-dynamic";

const SAVED_SEARCH_TYPES = [
  "credentials",
  "experts",
  "partners",
  "publications",
  "analytics-credentials",
  "analytics-cases",
  "cross-content",
] as const;

const CreateSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  type: z.enum(SAVED_SEARCH_TYPES),
  queryParams: z.record(z.string(), z.union([z.string(), z.array(z.string()), z.boolean(), z.number()])),
  analyticalContext: z
    .object({
      tab: z.enum(["credentials", "cases"] as const).optional(),
      mode: z.enum(["count", "pct"] as const).optional(),
      datasetVersion: z.string().optional(),
    })
    .optional(),
  visibility: z.enum(["private", "shared-with-users"]).default("private"),
  sharedUserIds: z.array(z.string()).default([]),
  subscriptionEnabled: z.boolean().default(false),
  subscriptionFrequency: z.enum(["daily", "weekly"]).optional(),
});

export async function GET(req: NextRequest) {
  const { session, response: authErr } = await requireSession(req);
  if (authErr) return authErr;

  const searches = listSavedSearches(session.userId);
  return NextResponse.json({ searches });
}

export async function POST(req: NextRequest) {
  const { session, response: authErr } = await requireSession(req);
  if (authErr) return authErr;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation error.", details: parsed.error.flatten() }, { status: 400 });
  }

  const search = createSavedSearch({
    ...parsed.data,
    queryParams: parsed.data.queryParams as Record<string, string | string[] | boolean | number>,
    ownerUserId: session.userId,
    ownerEmail: session.email,
    lastRunAt: new Date().toISOString(),
  });

  await writeAuditEvent({
    actorUserId: session.userId,
    actorEmail: session.email,
    actorRole: session.role,
    action: "saved_search.created",
    entityType: "saved-search",
    entityId: search.id,
    metadata: { name: search.name, type: search.type },
  });

  return NextResponse.json({ search }, { status: 201 });
}
