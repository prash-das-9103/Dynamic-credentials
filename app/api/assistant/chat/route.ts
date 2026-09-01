/**
 * POST /api/assistant/chat
 *
 * Two-phase AI-assisted request architecture:
 *
 *   Phase 1 — Interpret:  generateText with output.object → InterpretedAssistantRequest
 *   Phase 2 — Execute:    deterministic tools (no AI) → grounded results
 *   Phase 3 — Explain:    streamText with ONLY the returned results → streaming response
 *
 * The AI NEVER calculates case counts.
 * The AI ONLY interprets, selects tools, and explains deterministic results.
 *
 * Uses the Vercel AI Gateway (no provider package required).
 * Model: configured via AI_MODEL env var; defaults to openai/gpt-4.1-mini.
 *
 * Error handling:
 *   Every failure path returns a structured AssistantError in the stream so the
 *   client can display a meaningful diagnostic rather than "An error occurred".
 *   Secrets are never exposed — only stage, code, and a safe message.
 */

import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  generateText,
  Output,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { runCaseAnalyticsTool } from "@/lib/ai-assistant/case-analytics-tool";
import { runContentSearchTool } from "@/lib/ai-assistant/content-search-tool";
import type {
  InterpretedAssistantRequest,
  CaseAnalyticsToolResult,
  ContentSearchResult,
} from "@/lib/ai-assistant/types";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// ─── Correlation ID ───────────────────────────────────────────────────────────

function makeRequestId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AST-${date}-${rand}`;
}

// ─── Safe header value ────────────────────────────────────────────────────────
// HTTP headers must contain only Latin-1 characters (codepoints ≤ 255).
// JSON serialised objects can contain multi-byte characters (e.g. em-dashes in
// methodology notes). Encode as base64 so the header is always byte-safe.

function toSafeHeader(value: string): string {
  return Buffer.from(value, "utf8").toString("base64");
}

// ─── Configuration validation ─────────────────────────────────────────────────

type ConfigResult =
  | { ok: true; model: string }
  | { ok: false; code: string; stage: string; message: string };

function validateConfig(): ConfigResult {
  // Explicit disable flag
  if (process.env.AI_ASSISTANT_ENABLED === "false") {
    return {
      ok: false,
      code: "AI_DISABLED",
      stage: "configuration",
      message:
        "The AI assistant is disabled for this deployment. You can still use guided search and analytics.",
    };
  }

  // The Vercel AI Gateway integration injects AI_GATEWAY_API_KEY at runtime.
  // In the v0 preview sandbox this variable is set but the token only works
  // in a real Vercel deployment context (OIDC-signed). Detect missing key early.
  const gatewayKey = process.env.AI_GATEWAY_API_KEY;
  const hasGateway = Boolean(gatewayKey && gatewayKey.length > 0);

  if (!hasGateway) {
    return {
      ok: false,
      code: "AI_NOT_CONFIGURED",
      stage: "configuration",
      message:
        "The AI provider is not configured for this deployment. " +
        "The Vercel AI Gateway API key is missing. " +
        "Deploy to Vercel to enable AI interpretation, or add AI_GATEWAY_API_KEY to your environment variables. " +
        "Analytical case counts and content search continue to work without AI.",
    };
  }

  const model = process.env.AI_MODEL ?? "openai/gpt-4.1-mini";
  return { ok: true, model };
}

// ─── Gateway auth error detection ────────────────────────────────────────────

function isGatewayAuthError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes("unauthenticated") ||
    msg.includes("gatewayauthentication") ||
    msg.includes("401") ||
    msg.includes("unauthorized") ||
    /api.?key/i.test(msg)
  );
}

// ─── Safe stream error response ───────────────────────────────────────────────
// Writes a v7 UI-message-stream–compatible response so DefaultChatTransport
// can parse it correctly.
//
// v7 UIMessageChunk types used:
//   text-start  { type, id }
//   text-delta  { type, id, delta }
//   text-end    { type, id }
//
// The x-vercel-ai-ui-message-stream: v1 header is required for DefaultChatTransport
// to recognise and parse the stream. Without it the transport falls back to its
// generic error handler and shows "An error occurred."

function makeErrorStreamResponse(opts: {
  requestId: string;
  stage: string;
  code: string;
  message: string;
  httpStatus?: number;
}): Response {
  const { requestId, stage, code, message, httpStatus = 200 } = opts;

  const errorPayload = JSON.stringify({ __assistantError: true, requestId, stage, code, message });
  const textId = `err-${requestId}`;
  const encoder = new TextEncoder();

  // Emit valid v7 UIMessageChunk SSE events
  function sse(chunk: Record<string, unknown>): Uint8Array {
    return encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`);
  }

  const stream = new ReadableStream({
    start(controller) {
      // text-start → text-delta (full payload as one delta) → text-end → DONE
      controller.enqueue(sse({ type: "text-start", id: textId }));
      controller.enqueue(sse({ type: "text-delta", id: textId, delta: errorPayload }));
      controller.enqueue(sse({ type: "text-end", id: textId }));
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    status: httpStatus,
    headers: {
      // These headers are required by DefaultChatTransport to recognise a v7 stream
      "content-type": "text/event-stream",
      "cache-control": "no-cache",
      "connection": "keep-alive",
      "x-vercel-ai-ui-message-stream": "v1",
      "x-accel-buffering": "no",
      // Diagnostic headers (safe — no secrets)
      "x-request-id": requestId,
      "x-assistant-error-stage": stage,
      "x-assistant-error-code": code,
    },
  });
}

// ─── Zod schema for the interpreted request ───────────────────────────────────

const InterpretedRequestSchema = z.object({
  status: z.enum(["ready", "needs-clarification", "unsupported"]),

  intents: z.array(
    z.enum([
      "case-count",
      "case-trend",
      "case-breakdown",
      "case-comparison",
      "credential-search",
      "expert-search",
      "partner-search",
      "publication-search",
      "pack-recommendation",
      "methodology-question",
      "clarification",
      "unsupported",
    ])
  ),

  analyticalRequest: z
    .object({
      scope: z
        .enum([
          "sustainability",
          "sustainability-value-creation",
          "resilience-adaptation",
          "transition-strategy",
          "circularity-value-creation",
        ])
        .optional(),
      isFoodSystemsTransformation: z.boolean(),
      solutionIntersection: z
        .enum([
          "sustainability-value-creation",
          "resilience-adaptation",
          "transition-strategy",
          "circularity-value-creation",
        ])
        .optional(),
      dateExpression: z.string().optional(),
      resolvedDateRange: z
        .object({
          startDate: z.string(),
          endDate: z.string(),
          label: z.string(),
          mode: z.enum([
            "single-year",
            "bounded-range",
            "onward",
            "rolling",
            "calendar-years",
            "all-available",
            "custom",
          ]),
        })
        .optional(),
      regionIds: z.array(z.string()),
      breakdown: z.enum(["end-year", "region", "solution", "none"]),
      metric: z.literal("unique-case-count"),
    })
    .optional(),

  contentRequest: z
    .object({
      query: z.string(),
      solutionIds: z.array(z.string()),
      industryIds: z.array(z.string()),
      regionIds: z.array(z.string()),
      clientNeedIds: z.array(z.string()),
      contentTypes: z.array(
        z.enum(["credential", "expert", "partner", "publication"])
      ),
    })
    .optional(),

  packRequest: z
    .object({
      requested: z.boolean(),
      clientContext: z.string().optional(),
      desiredSections: z.array(z.string()),
      maximumItems: z.number().optional(),
    })
    .optional(),

  clarification: z
    .object({
      missingFields: z.array(
        z.enum([
          "time-duration",
          "solution",
          "region",
          "content-type",
          "client-context",
        ])
      ),
      question: z.string(),
      options: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      ),
    })
    .optional(),

  confidence: z.number().min(0).max(1),
  interpretationNotes: z.array(z.string()),
});

// ─── Interpreter system prompt ────────────────────────────────────────────────

const INTERPRETER_SYSTEM = `You are an AI request interpreter for a Bain sustainability credentials platform.

Your ONLY job is to parse the user's message into a structured InterpretedAssistantRequest JSON object.
You do NOT answer questions, calculate counts, or provide analysis.

## Application context
- The app contains: a case registry (FY2021-2025, ~17,000 rows), credentials (case examples & proof-points), experts, ecosystem partners, and publications
- All case counts come from the workbook case registry using columns: A=region, D=end date, Q=solution, T=food systems flag
- Fiscal years: FY2021, FY2022, FY2023, FY2024, FY2025
- Solutions (scope values): sustainability (all), sustainability-value-creation, resilience-adaptation, transition-strategy, circularity-value-creation
- Regions: EMEA, Americas, APAC, Other Office Grouping

## Date resolution rules
- "last year" / "FY24" / "2024" → single-year mode, startDate="2024-01-01", endDate="2024-12-31"
- "this year" / "FY25" / "2025" → startDate="2025-01-01", endDate="2025-12-31"
- "FY22 to FY24" → bounded-range, startDate="2022-01-01", endDate="2024-12-31"
- "since FY22" → onward, startDate="2022-01-01", endDate="2025-12-31"
- "all time" / "full dataset" → all-available, startDate="2021-01-01", endDate="2025-12-31"
- Ambiguous time → leave resolvedDateRange undefined and set dateExpression to what the user said

## Clarification rules
- If time duration is missing and the question needs it → status="needs-clarification", ask for it
- If solution scope is ambiguous → status="needs-clarification", suggest options
- If the question is completely unrelated to sustainability credentials → status="unsupported"

## Important
- Set isFoodSystemsTransformation=false unless the user explicitly mentions food systems or FST
- regionIds uses exact values: "EMEA", "Americas", "APAC", "Other Office Grouping"
- solutionIds for contentRequest uses the same exact solution labels: "Sustainability Value Creation", "Circular Value Creation", "Resilience & Adaptation", "Transition Strategy"
- confidence is 0-1; use 0.9+ when the request is clear, 0.5-0.9 for partial clarity
- interpretationNotes should explain key interpretation decisions (e.g. how you resolved a date)`;

// ─── Explainer system prompt ──────────────────────────────────────────────────

function buildExplainerSystem(
  toolResults: Record<string, CaseAnalyticsToolResult | ContentSearchResult | string>
): string {
  return `You are an AI assistant helping users navigate a Bain sustainability credentials platform.

## Your role
You explain deterministic results that were already calculated by the application's tools.
You do NOT recalculate, estimate, or fabricate any numbers or records.
Every fact you state must come directly from the tool results provided below.

## Critical rules
1. NEVER state a case count unless it appears verbatim in the caseAnalytics.uniqueCaseCount field
2. NEVER recommend a credential, expert, partner, or publication not present in the contentSearch results
3. NEVER infer methodology — cite the methodologyNotes from the tool results
4. If data shows 0 results, say so clearly and suggest how to broaden the search
5. Keep responses concise and grounded — no filler phrases or invented context

## Tool results available to you
${JSON.stringify(toolResults, null, 2)}

## Response format
- Lead with the key number or finding
- If showing case counts: always state the exact period and scope
- If showing content: name items and their key attributes from the results
- End with 1-2 suggestions if useful (e.g. "To see EMEA breakdown, filter by region")
- Do not use markdown headers — use short paragraphs`;
}

// ─── Chat route ───────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const requestId = makeRequestId();

  // ─── Phase 0: Configuration check ─────────────────────────────────────────
  const config = validateConfig();
  if (!config.ok) {
    return makeErrorStreamResponse({
      requestId,
      stage: config.stage,
      code: config.code,
      message: config.message,
    });
  }

  const { model } = config;

  let body: { messages: UIMessage[] };
  try {
    body = (await req.json()) as { messages: UIMessage[] };
  } catch {
    return makeErrorStreamResponse({
      requestId,
      stage: "request-validation",
      code: "INVALID_REQUEST_BODY",
      message: "The request body could not be parsed.",
      httpStatus: 400,
    });
  }

  const { messages } = body;

  // Abort signal: honour both the client disconnect and a 60s hard timeout
  const requestSignal = req.signal;

  // Get the latest user message for interpretation (only the query, not full history)
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  const userQuery = lastUserMessage?.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join(" ")
    .trim() ?? "";

  if (!userQuery) {
    return makeErrorStreamResponse({
      requestId,
      stage: "request-validation",
      code: "EMPTY_MESSAGE",
      message: "No message text was provided.",
      httpStatus: 400,
    });
  }

  // ─── Phase 1: Interpret the request ───────────────────────────────────────
  // IMPORTANT: only the user's query is sent to the interpreter — never raw rows.
  let interpretedRequest: InterpretedAssistantRequest;
  try {
    const interpretSignal = AbortSignal.any([
      requestSignal,
      AbortSignal.timeout(30_000),
    ]);
    const interpretResult = await generateText({
      model,
      output: Output.object({ schema: InterpretedRequestSchema }),
      system: INTERPRETER_SYSTEM,
      prompt: userQuery,
      abortSignal: interpretSignal,
    });
    interpretedRequest = interpretResult.output as InterpretedAssistantRequest;
  } catch (err) {
    // Surface gateway auth failures as a controlled configuration error stream
    // rather than falling back silently to "unsupported".
    if (isGatewayAuthError(err)) {
      return makeErrorStreamResponse({
        requestId,
        stage: "model-call",
        code: "AI_NOT_CONFIGURED",
        message:
          "AI interpretation is temporarily unavailable — the AI Gateway authentication failed. " +
          "You can continue using guided search and analytics.",
      });
    }

    const errMsg = err instanceof Error ? err.message : String(err);
    const isModelErr = /model.*not.*found|invalid.*model|no.*such.*model/i.test(errMsg);

    // For other errors: fall back to unsupported so the explainer can still respond
    interpretedRequest = {
      status: "unsupported",
      intents: ["unsupported"],
      confidence: 0,
      interpretationNotes: [
        isModelErr
          ? `[${requestId}] Model not found: ${model}.`
          : `[${requestId}] Interpretation failed (model-call).`,
      ],
    };
  }

  // ─── Phase 2: Run deterministic tools ─────────────────────────────────────
  // Tools only run when the request is ready (not needs-clarification / unsupported).
  const toolResults: Record<string, CaseAnalyticsToolResult | ContentSearchResult | string> = {};

  if (
    interpretedRequest.status === "ready" &&
    interpretedRequest.analyticalRequest
  ) {
    try {
      toolResults.caseAnalytics = runCaseAnalyticsTool(interpretedRequest.analyticalRequest);
    } catch (err) {
      toolResults.caseAnalyticsError = `[${requestId}] tool-execution: analytics tool threw — ${
        err instanceof Error ? err.message : String(err)
      }`;
    }
  }

  if (
    interpretedRequest.status === "ready" &&
    interpretedRequest.contentRequest
  ) {
    try {
      toolResults.contentSearch = runContentSearchTool(interpretedRequest.contentRequest);
    } catch (err) {
      toolResults.contentSearchError = `[${requestId}] tool-execution: content search tool threw — ${
        err instanceof Error ? err.message : String(err)
      }`;
    }
  }

  // ─── Phase 3: Stream grounded explanation ─────────────────────────────────
  let systemPrompt: string;

  if (interpretedRequest.status === "needs-clarification" && interpretedRequest.clarification) {
    systemPrompt = `You are a helpful assistant. Your only task is to ask the clarification question provided below, and present the options clearly. Do not answer the question yourself. Do not provide any case counts or statistics.

Clarification question: ${interpretedRequest.clarification.question}
Options: ${interpretedRequest.clarification.options.map((o) => `"${o.label}"`).join(", ")}`;
  } else if (interpretedRequest.status === "unsupported") {
    systemPrompt = `You are a helpful assistant for a sustainability credentials platform. Politely explain that you can help with: case count queries, credential/expert/partner/publication searches, and methodology questions. Suggest rephrasing if the question might be related.`;
  } else {
    systemPrompt = buildExplainerSystem(toolResults);
  }

  const explainerSignal = AbortSignal.any([
    requestSignal,
    AbortSignal.timeout(45_000),
  ]);

  const explainerResult = streamText({
    model,
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    abortSignal: explainerSignal,
    onError: (event) => {
      // Log safely — never expose key/token. The error is converted to a
      // stream error event by the SDK automatically after this callback.
      const msg = event.error instanceof Error ? event.error.message : String(event.error);
      console.error(`[${requestId}] stream-processing error:`, msg.replace(/key[=:\s]+\S+/gi, "key=[REDACTED]"));
    },
  });

  // Convert text stream to UI message stream using standalone helper.
  // onError returns a user-safe string; the SDK emits this as a type:"error"
  // chunk which causes useChat to set its error state. Redact secrets.
  const uiStream = toUIMessageStream({
    stream: explainerResult.stream,
    onError: (err) => {
      const errMsg = err instanceof Error ? err.message : String(err);
      if (isGatewayAuthError(err)) {
        return `AI_NOT_CONFIGURED [${requestId}]: The AI Gateway authentication failed. You can continue using guided search and analytics.`;
      }
      return `[${requestId}] An unexpected error occurred. Please try again.`;
    },
  });

  // HTTP response headers must contain only Latin-1 bytes (codepoints ≤ 255).
  // JSON-serialised objects can include multi-byte characters (e.g. em-dashes).
  // Encode as base64 to guarantee byte-safety; client can decode with atob().
  return createUIMessageStreamResponse({
    stream: uiStream,
    headers: {
      "x-request-id": requestId,
      "x-interpreted-request": toSafeHeader(JSON.stringify(interpretedRequest)),
      "x-tool-results": toSafeHeader(JSON.stringify(toolResults)),
    },
  });
}
