/**
 * PATCH /api/admin/content/[id] — transition a content workflow record
 *
 * Transitions: submit, approve, reject, publish, archive
 * Self-approval is blocked server-side in content-store.ts.
 */

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/guard";
import { transitionContentStatus, getAllContentRecords } from "@/lib/stores/content-store";
import { writeAuditEvent } from "@/lib/stores/audit-store";
import { z } from "zod";
import type { ContentStatus } from "@/lib/stores/content-store";
import type { Permission } from "@/lib/auth/types";

export const dynamic = "force-dynamic";

const TransitionSchema = z.object({
  action: z.enum(["submit", "approve", "reject", "publish", "archive"]),
  reviewNotes: z.string().max(2000).optional(),
  reviewBy: z.string().optional(),
});

const ACTION_TO_STATUS: Record<string, ContentStatus> = {
  submit: "submitted",
  approve: "approved",
  reject: "rejected",
  publish: "published",
  archive: "archived",
};

const ACTION_PERMISSION: Record<string, Permission> = {
  submit: "content:edit",
  approve: "content:review",
  reject: "content:review",
  publish: "content:publish",
  archive: "content:review",
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = TransitionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.issues }, { status: 400 });
  }

  const { action, reviewNotes, reviewBy } = parsed.data;
  const permission = ACTION_PERMISSION[action];

  const { session, response } = await requirePermission(req, permission);
  if (response) return response;

  // Find the record by its workflow ID
  const all = getAllContentRecords();
  const existing = all.find((r) => r.id === id);
  if (!existing) {
    return NextResponse.json({ error: "Content record not found." }, { status: 404 });
  }

  try {
    const updated = transitionContentStatus(
      existing.entityType,
      existing.entityId,
      ACTION_TO_STATUS[action],
      session.userId,
      { reviewNotes, reviewBy }
    );

    await writeAuditEvent({
      actorUserId: session.userId,
      actorEmail: session.email,
      actorRole: session.role,
      action: `content:${action}`,
      entityType: existing.entityType,
      entityId: existing.entityId,
      previousVersion: existing.version,
      newVersion: updated.version,
      metadata: reviewNotes ? { reviewNotes } : undefined,
    });

    return NextResponse.json({ record: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Transition failed.";
    return NextResponse.json({ error: msg }, { status: 422 });
  }
}
