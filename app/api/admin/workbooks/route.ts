/**
 * GET  /api/admin/workbooks  — list all versions (requires workbook:review)
 * POST /api/admin/workbooks  — register a new upload (requires workbook:upload)
 *
 * File upload handling: the client uploads the .xlsx file, parses it
 * client-side using the existing case-analytics workbook methodology,
 * and sends only the derived summary stats (no raw row data).
 *
 * Column governance is enforced by the client parser; this route stores
 * only the version metadata and validation summary.
 */

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/guard";
import { getAllWorkbookVersions, createWorkbookVersion } from "@/lib/stores/workbook-store";
import { writeAuditEvent } from "@/lib/stores/audit-store";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { response } = await requirePermission(req, "workbook:review");
  if (response) return response;

  const versions = getAllWorkbookVersions();
  return NextResponse.json({ versions });
}

const RegisterSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileChecksum: z.string().min(1).max(128),
  sourceSheet: z.string().min(1).max(255),
  headerRow: z.number().int().min(0),
  rawRowCount: z.number().int().min(0),
  uniqueCaseCount: z.number().int().min(0),
  invalidEndDateCount: z.number().int().min(0),
  minimumEndDate: z.string().optional(),
  maximumEndDate: z.string().optional(),
  validationSummary: z.object({
    errors: z.number().int().min(0),
    warnings: z.number().int().min(0),
    information: z.number().int().min(0),
  }),
  notes: z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  const { session, response } = await requirePermission(req, "workbook:upload");
  if (response) return response;

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.issues }, { status: 400 });
  }

  const version = createWorkbookVersion({
    ...parsed.data,
    uploadedBy: session.userId,
    uploadedByEmail: session.email,
    uploadedAt: new Date().toISOString(),
    status: "needs-review",
  });

  await writeAuditEvent({
    actorUserId: session.userId,
    actorEmail: session.email,
    actorRole: session.role,
    action: "workbook:upload",
    entityType: "workbook-version",
    entityId: version.id,
    newVersion: version.versionNumber,
    metadata: {
      fileName: version.fileName,
      uniqueCaseCount: version.uniqueCaseCount,
    },
  });

  return NextResponse.json({ version }, { status: 201 });
}
