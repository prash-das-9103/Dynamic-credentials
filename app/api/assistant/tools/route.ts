/**
 * POST /api/assistant/tools
 *
 * Deterministic tool executor. Receives a structured request from the AI
 * interpreter and runs the appropriate deterministic function(s).
 *
 * The AI never calculates counts. This route does.
 */

import { type NextRequest, NextResponse } from "next/server";
import { runCaseAnalyticsTool } from "@/lib/ai-assistant/case-analytics-tool";
import { runContentSearchTool } from "@/lib/ai-assistant/content-search-tool";
import type { InterpretedAssistantRequest } from "@/lib/ai-assistant/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { interpretedRequest: InterpretedAssistantRequest };
    const { interpretedRequest } = body;

    if (!interpretedRequest) {
      return NextResponse.json({ error: "Missing interpretedRequest" }, { status: 400 });
    }

    const results: Record<string, unknown> = {};

    // Run case analytics if an analytical request is present
    if (interpretedRequest.analyticalRequest) {
      try {
        const analyticsResult = runCaseAnalyticsTool(interpretedRequest.analyticalRequest);
        results.caseAnalytics = analyticsResult;
      } catch (err) {
        results.caseAnalyticsError = `Analytics tool error: ${err instanceof Error ? err.message : String(err)}`;
      }
    }

    // Run content search if a content request is present
    if (interpretedRequest.contentRequest) {
      try {
        const contentResult = runContentSearchTool(interpretedRequest.contentRequest);
        results.contentSearch = contentResult;
      } catch (err) {
        results.contentSearchError = `Content search error: ${err instanceof Error ? err.message : String(err)}`;
      }
    }

    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json(
      { error: `Tool execution failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}
