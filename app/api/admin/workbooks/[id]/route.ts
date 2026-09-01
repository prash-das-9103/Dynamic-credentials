/**
 * PATCH /api/admin/workbooks/[id] — transition status (approve/reject/publish/rollback)
 *
 * action=approve  — requires workbook:review
 * action=reject   — requires workbook:review
 * action=publish  — requires workbook:publish
 * action=rollback — requires workbook:rollback  (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/guard";
import {
  getWorkbookVersionById,
  updateWorkbookVersionStatus,
  publishWorkbookVersion,
  rollbackToWorkbookVersion,
} from "@/lib/stores/workbook-store";
import { writeAuditEvent } from "@/lib/stores/audit-store";
import { z } from "zod";

export const dynamic = "force-dynamic";

const ActionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("approve"), notes: z.string().max(2000).optional() }),
  z.object({ action: z.literal("reject"), notes: z.string().max(2000).optional() }),
  z.object({ action: z.literal("publish") }),
  z.object({ action: z.literal("rollback"), reason: z.string().max(2000).optional() }),
]);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const existing = getWorkbookVersionById(id);
  if (!existing) {
    return NextResponse.json({ error: "Workbook version not found." }, { status: 404 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = ActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.issues }, { status: 400 });
  }

  const { action } = parsed.data;
  const permissionMap = {
    approve: "workbook:review",
    reject: "workbook:review",
    publish: "workbook:publish",
    rollback: "workbook:rollback",
  } as const;

  const { session, response } = await requirePermission(req, permissionMap[action]);
  if (response) return response;

  try {
    let updated;
    if (action === "publish") {
      updated = publishWorkbookVersion(id, session.userId, session.email);
    } else if (action === "rollback") {
      updated = rollbackToWorkbookVersion(id, session.userId, session.email);
    } else {
      updated = updateWorkbookVersionStatus(
        id,
        action === "approve" ? "approved" : "rejected",
        session.userId,
        session.email,
        (parsed.data as { notes?: string }).notes
      );
    }

    await writeAuditEvent({
      actorUserId: session.userId,
      actorEmail: session.email,
      actorRole: session.role,
      action: `workbook:${action}`,
      entityType: "workbook-version",
      entityId: id,
      previousVersion: existing.versionNumber,
      newVersion: updated.versionNumber,
      reason: action === "rollback" ? (parsed.data as { reason: string }).reason : undefined,
      metadata: { fileName: existing.fileName },
    });

    return NextResponse.json({ version: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Action failed.";
    return NextResponse.json({ error: msg }, { status: 422 });
  }
}
