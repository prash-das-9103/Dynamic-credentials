import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/guard";
import { updateExperiment } from "@/lib/stores/experiment-store";
import { writeAuditEvent } from "@/lib/stores/audit-store";
import { z } from "zod";

export const dynamic = "force-dynamic";

const PatchSchema = z.object({
  status: z.enum(["draft", "active", "paused", "completed"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await requirePermission(request, "system:manage");
  if (result.response) return result.response;
  const { session } = result;

  const body = await request.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const updated = updateExperiment(id, { status: parsed.data.status });
  if (!updated)
    return NextResponse.json({ error: "Experiment not found." }, { status: 404 });

  await writeAuditEvent({
    actorUserId: session.userId,
    actorEmail: session.email,
    actorRole: session.role,
    action: "experiment.status_updated",
    entityType: "experiment",
    entityId: id,
    metadata: { newStatus: parsed.data.status },
  });

  return NextResponse.json({ experiment: updated });
}
