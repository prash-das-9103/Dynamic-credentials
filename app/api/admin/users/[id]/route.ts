/**
 * PATCH /api/admin/users/[id] — update role/active (requires users:manage)
 * DELETE /api/admin/users/[id] — deactivate a user (requires users:manage)
 */

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/guard";
import { updateUser, getUserById } from "@/lib/stores/user-store";
import { writeAuditEvent } from "@/lib/stores/audit-store";
import { z } from "zod";

export const dynamic = "force-dynamic";

const PatchSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  role: z.enum(["viewer", "contributor", "reviewer", "data-steward", "administrator"]).optional(),
  active: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, response } = await requirePermission(req, "users:manage");
  if (response) return response;

  const { id } = await params;

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.issues }, { status: 400 });
  }

  // Prevent an administrator from demoting themselves
  if (id === session.userId && parsed.data.role && parsed.data.role !== session.role) {
    return NextResponse.json({ error: "You cannot change your own role." }, { status: 403 });
  }

  try {
    const updated = await updateUser(id, parsed.data);
    const { passwordHash: _h, passwordSalt: _s, ...safe } = updated;

    await writeAuditEvent({
      actorUserId: session.userId,
      actorEmail: session.email,
      actorRole: session.role,
      action: "users:update",
      entityType: "user",
      entityId: id,
      metadata: parsed.data as Record<string, string | boolean>,
    });

    return NextResponse.json({ user: safe });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update user.";
    return NextResponse.json({ error: msg }, { status: 404 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, response } = await requirePermission(req, "users:manage");
  if (response) return response;

  const { id } = await params;

  if (id === session.userId) {
    return NextResponse.json({ error: "You cannot deactivate your own account." }, { status: 403 });
  }

  try {
    await updateUser(id, { active: false });

    await writeAuditEvent({
      actorUserId: session.userId,
      actorEmail: session.email,
      actorRole: session.role,
      action: "users:deactivate",
      entityType: "user",
      entityId: id,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "User not found.";
    return NextResponse.json({ error: msg }, { status: 404 });
  }
}
