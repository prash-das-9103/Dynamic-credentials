/**
 * POST /api/v1/feedback — submit user feedback
 * GET  /api/v1/feedback — list feedback (administrator / data-steward only)
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guard";
import {
  createFeedback,
  listFeedback,
  type FeedbackStatus,
  type FeedbackType,
} from "@/lib/stores/feedback-store";
import { writeAuditEvent } from "@/lib/stores/audit-store";
import { recordUsageEvent } from "@/lib/stores/usage-store";
import { z } from "zod";

export const dynamic = "force-dynamic";

const FEEDBACK_TYPES = [
  "content-error",
  "data-quality",
  "missing-content",
  "confidentiality-concern",
  "search-quality",
  "recommendation-quality",
  "general",
] as const;

const CreateSchema = z.object({
  type: z.enum(FEEDBACK_TYPES),
  message: z.string().min(10).max(2000),
  entityType: z.string().max(50).optional(),
  entityId: z.string().max(100).optional(),
  route: z.string().max(200).default("/"),
  structuredContext: z
    .object({
      searchQuery: z.string().max(200).optional(),
      activeFilters: z.record(z.string(), z.array(z.string())).optional(),
      datasetVersion: z.string().max(50).optional(),
      applicationVersion: z.string().max(50).optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  const { session, response: authErr } = await requireSession(req);
  if (authErr) return authErr;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation error.", details: parsed.error.flatten() }, { status: 400 });
  }

  const item = createFeedback({
    type: parsed.data.type,
    message: parsed.data.message,
    entityType: parsed.data.entityType,
    entityId: parsed.data.entityId,
    route: parsed.data.route,
    structuredContext: parsed.data.structuredContext as {
      searchQuery?: string;
      activeFilters?: Record<string, string[]>;
      datasetVersion?: string;
      applicationVersion?: string;
    } | undefined,
    createdBy: session.userId,
    createdByEmail: session.email,
  });

  await writeAuditEvent({
    actorUserId: session.userId,
    actorEmail: session.email,
    actorRole: session.role,
    action: "feedback.submitted",
    entityType: "feedback",
    entityId: item.id,
    metadata: { type: item.type, route: item.route },
  });

  recordUsageEvent({
    userId: session.userId,
    sessionId: session.userId,
    eventType: "feedback_submitted",
    feature: item.type,
  });

  return NextResponse.json({ feedback: item }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { session, response: authErr } = await requireSession(req);
  if (authErr) return authErr;

  if (!["administrator", "data-steward"].includes(session.role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const sp = req.nextUrl.searchParams;
  const rawStatus = sp.get("status");
  const rawType = sp.get("type");

  const result = listFeedback({
    status: rawStatus ? (rawStatus as FeedbackStatus) : undefined,
    type: rawType ? (rawType as FeedbackType) : undefined,
    limit: parseInt(sp.get("limit") ?? "50", 10),
    offset: parseInt(sp.get("offset") ?? "0", 10),
  });

  return NextResponse.json(result);
}
