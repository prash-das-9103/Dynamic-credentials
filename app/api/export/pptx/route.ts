/**
 * app/api/export/pptx/route.ts
 *
 * POST /api/export/pptx
 *
 * Body: { packJson: string, analyticsJson?: string }
 *   packJson       — JSON.stringify(PackState)
 *   analyticsJson  — JSON.stringify(AnalyticsSnapshot) — required if pack contains chart items
 *
 * Returns the .pptx as an application/octet-stream binary response,
 * with Content-Disposition set to the generated filename.
 *
 * Never exposes internal data: no logging of packJson contents, no
 * Case Codes in response headers, no client names in errors.
 */

import { NextRequest, NextResponse } from "next/server";
import type { PackState } from "@/types/credentials";
import type { AnalyticsSnapshot } from "@/lib/export/types";
import { createPresentation } from "@/lib/export/pptx/create-presentation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // pptxgenjs requires Node.js runtime

// 30-second max for large packs
export const maxDuration = 30;

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Guard against aborted requests
  if (req.signal?.aborted) {
    return NextResponse.json({ error: "Request aborted." }, { status: 499 });
  }

  let packJson: string;
  let analyticsJson: string | undefined;

  try {
    const body = await req.json();
    if (typeof body.packJson !== "string") {
      return NextResponse.json({ error: "packJson is required." }, { status: 400 });
    }
    packJson = body.packJson;
    analyticsJson = typeof body.analyticsJson === "string" ? body.analyticsJson : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  let pack: PackState;
  let analyticsSnapshot: AnalyticsSnapshot | undefined;

  try {
    pack = JSON.parse(packJson) as PackState;
  } catch {
    return NextResponse.json({ error: "Could not parse pack data." }, { status: 400 });
  }

  if (analyticsJson) {
    try {
      analyticsSnapshot = JSON.parse(analyticsJson) as AnalyticsSnapshot;
    } catch {
      return NextResponse.json({ error: "Could not parse analytics data." }, { status: 400 });
    }
  }

  try {
    const result = await createPresentation({ pack, analyticsSnapshot });

    return new NextResponse(result.buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${result.filename}"`,
        "Content-Length": String(result.buffer.length),
        // Non-blocking warnings passed as a header (truncated if too many)
        "X-Export-Warnings": JSON.stringify(result.warnings.slice(0, 10)),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown export error";
    // Never surface internal stack traces or raw data
    return NextResponse.json(
      { error: message.startsWith("Export blocked:") ? message : "Export failed. Check confidentiality settings." },
      { status: 422 }
    );
  }
}
