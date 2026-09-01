/**
 * GET  /api/admin/users — list all users (requires users:manage)
 * POST /api/admin/users — create a user (requires users:manage)
 */

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/guard";
import { getAllUsers, createUser } from "@/lib/stores/user-store";
import { writeAuditEvent } from "@/lib/stores/audit-store";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { session, response } = await requirePermission(req, "users:manage");
  if (response) return response;

  const users = await getAllUsers();
  // Strip password hashes before returning
  const safe = users.map(({ passwordHash: _h, passwordSalt: _s, ...u }) => u);
  return NextResponse.json({ users: safe });
}

const CreateUserSchema = z.object({
  email: z.string().email().max(254),
  name: z.string().min(1).max(120),
  role: z.enum(["viewer", "contributor", "reviewer", "data-steward", "administrator"]),
  password: z.string().min(10).max(256),
});

export async function POST(req: NextRequest) {
  const { session, response } = await requirePermission(req, "users:manage");
  if (response) return response;

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = CreateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const { password, ...fields } = parsed.data;
    const user = await createUser({ ...fields, active: true, createdBy: session.userId }, password);
    const { passwordHash: _h, passwordSalt: _s, ...safe } = user;

    await writeAuditEvent({
      actorUserId: session.userId,
      actorEmail: session.email,
      actorRole: session.role,
      action: "users:create",
      entityType: "user",
      entityId: user.id,
      metadata: { email: user.email, role: user.role },
    });

    return NextResponse.json({ user: safe }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create user.";
    return NextResponse.json({ error: msg }, { status: 409 });
  }
}
