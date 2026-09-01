/**
 * GET  /api/admin/content          — list all workflow records (requires content:review)
 * POST /api/admin/content          — register a content item in the workflow (requires content:create)
 * PATCH /api/admin/content/[id]    — transition status (requires content:review or content:publish)
 */

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/guard";
import {
  getAllContentRecords,
  upsertContentRecord,
  getRecordsPendingReview,
} from "@/lib/stores/content-store";
import { writeAuditEvent } from "@/lib/stores/audit-store";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { response } = await requirePermission(req, "content:review");
  if (response) return response;

  const url = new URL(req.url);
  const pendingOnly = url.searchParams.get("pending") === "true";

  const records = pendingOnly ? getRecordsPendingReview() : getAllContentRecords();
  return NextResponse.json({ records, total: records.length });
}

const UpsertSchema = z.object({
  entityType: z.enum(["credential", "expert", "partner", "publication", "reference-slide"]),
  entityId: z.string().min(1).max(255),
  status: z.enum(["draft", "submitted", "in-review", "approved", "published", "rejected", "archived"]).default("draft"),
  timeSensitive: z.boolean().default(false),
  reviewBy: z.string().optional(),
  hasSourceReferences: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const { session, response } = await requirePermission(req, "content:create");
  if (response) return response;

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = UpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.issues }, { status: 400 });
  }

  const record = upsertContentRecord({
    ...parsed.data,
    submittedBy: session.userId,
    submittedAt: new Date().toISOString(),
  });

  await writeAuditEvent({
    actorUserId: session.userId,
    actorEmail: session.email,
    actorRole: session.role,
    action: "content:register",
    entityType: record.entityType,
    entityId: record.entityId,
    metadata: { status: record.status },
  });

  return NextResponse.json({ record }, { status: 201 });
}
