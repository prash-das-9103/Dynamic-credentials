/**
 * GET /api/assistant/health
 *
 * Development and preview only — never exposes keys, tokens, or raw data.
 *
 * Reports whether each layer of the Assistant stack is ready:
 *   - AI configuration (gateway key present, model name set)
 *   - Case analytics data availability (cases.json loaded)
 *   - Content data availability (credentials, experts, etc.)
 *
 * Does NOT perform a live model call — use /api/assistant/test-connection for that.
 * Safe to call without authentication.
 */

import { NextResponse } from "next/server";
import { getAllCaseRows } from "@/lib/case-analytics";

export const dynamic = "force-dynamic";

export async function GET() {
  // Resolve configuration state — never return actual key values
  const gatewayKey = process.env.AI_GATEWAY_API_KEY;
  const assistantEnabled = process.env.AI_ASSISTANT_ENABLED !== "false";
  const model = process.env.AI_MODEL ?? "openai/gpt-4.1-mini";

  const providerConfigured = Boolean(gatewayKey && gatewayKey.length > 0);
  const modelConfigured = Boolean(model && model.length > 0);

  // Check analytics data availability
  let analyticsDataAvailable = false;
  let analyticsRowCount = 0;
  let analyticsError: string | null = null;
  try {
    const rows = getAllCaseRows();
    analyticsRowCount = rows.length;
    analyticsDataAvailable = rows.length > 0;
  } catch (err) {
    analyticsError = err instanceof Error ? err.message : "Unknown error loading case data";
  }

  // Check content data availability
  let credentialsAvailable = false;
  let expertsAvailable = false;
  let partnersAvailable = false;
  let publicationsAvailable = false;
  try {
    const { CREDENTIALS } = await import("@/data/credentials");
    credentialsAvailable = Array.isArray(CREDENTIALS) && CREDENTIALS.length > 0;
  } catch { /* not available */ }
  try {
    const { EXPERTS } = await import("@/data/experts");
    expertsAvailable = Array.isArray(EXPERTS) && EXPERTS.length > 0;
  } catch { /* not available */ }
  try {
    const { PARTNERS } = await import("@/data/partners");
    partnersAvailable = Array.isArray(PARTNERS) && PARTNERS.length > 0;
  } catch { /* not available */ }
  try {
    const { PUBLICATIONS } = await import("@/data/publications");
    publicationsAvailable = Array.isArray(PUBLICATIONS) && PUBLICATIONS.length > 0;
  } catch { /* not available */ }

  return NextResponse.json({
    // AI layer
    assistantEnabled,
    providerConfigured,
    modelConfigured,
    modelName: modelConfigured ? model : null,

    // Analytics layer
    analyticsDataAvailable,
    analyticsRowCount: analyticsDataAvailable ? analyticsRowCount : 0,
    analyticsError,

    // Content layer
    content: {
      credentialsAvailable,
      expertsAvailable,
      partnersAvailable,
      publicationsAvailable,
    },

    // Summary
    ready: assistantEnabled && providerConfigured && modelConfigured && analyticsDataAvailable,
    timestamp: new Date().toISOString(),
  });
}
