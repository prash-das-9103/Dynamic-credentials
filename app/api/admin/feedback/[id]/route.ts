import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/guard";
import { updateFeedback } from "@/lib/stores/feedback-store";
import { writeAuditEvent } from "@/lib/stores/audit-store";
import { z } from "zod";

export const dynamic = "force-dynamic";

const PatchSchema = z.object({
  status: z.enum(["new", "triaged", "in-progress", "resolved", "closed", "duplicate"]),
  notes: z.string().max(2000).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await requirePermission(request, "content:review");
  if (result.response) return result.response;
  const { session } = result;

  const body = await request.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const updated = updateFeedback(id, {
    status: parsed.data.status,
    resolutionNotes: parsed.data.notes,
  });

  if (!updated)
    return NextResponse.json({ error: "Feedback item not found." }, { status: 404 });

  await writeAuditEvent({
    actorUserId: session.userId,
    actorEmail: session.email,
    actorRole: session.role,
    action: "feedback.status_updated",
    entityType: "feedback",
    entityId: id,
    metadata: { newStatus: parsed.data.status },
  });

  return NextResponse.json({ feedback: updated });
}
