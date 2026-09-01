/**
 * PATCH  /api/v1/saved-searches/[id] — update name, subscription, archive
 * DELETE /api/v1/saved-searches/[id] — hard-delete (owner only)
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guard";
import {
  getSavedSearch,
  updateSavedSearch,
  deleteSavedSearch,
} from "@/lib/stores/saved-search-store";
import { writeAuditEvent } from "@/lib/stores/audit-store";
import { z } from "zod";

export const dynamic = "force-dynamic";

const PatchSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(500).optional(),
  subscriptionEnabled: z.boolean().optional(),
  subscriptionFrequency: z.enum(["daily", "weekly"]).optional(),
  archived: z.boolean().optional(),
  visibility: z.enum(["private", "shared-with-users"]).optional(),
  sharedUserIds: z.array(z.string()).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, response: authErr } = await requireSession(req);
  if (authErr) return authErr;

  const { id } = await params;
  const existing = getSavedSearch(id);
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  // Only the owner or an administrator can modify
  if (existing.ownerUserId !== session.userId && session.role !== "administrator") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation error.", details: parsed.error.flatten() }, { status: 400 });
  }

  const updated = updateSavedSearch(id, parsed.data);
  return NextResponse.json({ search: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, response: authErr } = await requireSession(req);
  if (authErr) return authErr;

  const { id } = await params;
  const existing = getSavedSearch(id);
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  if (existing.ownerUserId !== session.userId && session.role !== "administrator") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  deleteSavedSearch(id);

  await writeAuditEvent({
    actorUserId: session.userId,
    actorEmail: session.email,
    actorRole: session.role,
    action: "saved_search.deleted",
    entityType: "saved-search",
    entityId: id,
  });

  return NextResponse.json({ ok: true });
}
