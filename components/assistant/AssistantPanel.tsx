"use client";

/**
 * AssistantPanel — the main chat interface.
 *
 * Uses AI SDK v7 useChat with the DefaultChatTransport pattern.
 * Tool results are decoded from the x-tool-results and
 * x-interpreted-request response headers by the explainer route.
 *
 * Error handling:
 *   The route encodes errors as structured JSON text chunks in the stream
 *   (field __assistantError: true). This component detects those and renders
 *   a meaningful diagnostic panel rather than the SDK's generic "An error occurred."
 *
 * The panel supports:
 *   - Case count queries (with result cards)
 *   - Content search (credentials / experts / partners / publications)
 *   - Clarification flow (with quick-reply chips)
 *   - Grounding notice (AI explains results only, never invents counts)
 *   - AI_NOT_CONFIGURED fallback with links to analytics/search
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send, RotateCcw, Info, Loader2, AlertTriangle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { SUGGESTED_QUESTIONS } from "@/lib/ai-assistant/types";
import {
  CaseAnalyticsCard,
  ContentSearchCard,
} from "./AssistantResultCards";
import type {
  CaseAnalyticsToolResult,
  ContentSearchResult,
} from "@/lib/ai-assistant/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MessageToolData {
  caseAnalytics?: CaseAnalyticsToolResult;
  contentSearch?: ContentSearchResult;
}

interface AssistantError {
  requestId: string;
  stage: string;
  code: string;
  message: string;
}

// ─── Error parsing ────────────────────────────────────────────────────────────

function parseAssistantError(text: string): AssistantError | null {
  if (!text.includes("__assistantError")) return null;
  try {
    const parsed = JSON.parse(text) as { __assistantError?: boolean } & AssistantError;
    if (parsed.__assistantError) return parsed;
  } catch {
    // not a structured error
  }
  return null;
}

// ─── Error display ────────────────────────────────────────────────────────────

function ErrorPanel({ error }: { error: AssistantError }) {
  const isDev =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname.includes("vercel.app"));

  const isNotConfigured = error.code === "AI_NOT_CONFIGURED" || error.code === "AI_DISABLED";

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-3">
      <div className="flex items-start gap-2">
        <AlertTriangle size={13} className="mt-0.5 shrink-0 text-destructive" aria-hidden />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-destructive">
            {isNotConfigured ? "AI provider not configured" : "Assistant request failed"}
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground leading-relaxed">
            {isNotConfigured
              ? "AI interpretation requires the Vercel AI Gateway. Analytical case counts and content search work without it."
              : error.message}
          </p>
        </div>
      </div>

      {/* Development diagnostics — not shown in production */}
      {isDev && !isNotConfigured && (
        <div className="rounded border border-border bg-secondary/30 px-3 py-2 space-y-1 font-mono text-[11px]">
          <div className="flex gap-2">
            <span className="text-muted-foreground w-14 shrink-0">Stage</span>
            <span className="text-foreground">{error.stage}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted-foreground w-14 shrink-0">Code</span>
            <span className="text-foreground">{error.code}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted-foreground w-14 shrink-0">Ref</span>
            <span className="text-foreground">{error.requestId}</span>
          </div>
        </div>
      )}

      {/* Production reference ID */}
      {!isDev && !isNotConfigured && (
        <p className="text-[11px] text-muted-foreground font-mono">
          Reference: {error.requestId}
        </p>
      )}

      {/* Fallback actions when AI is not configured */}
      {isNotConfigured && (
        <div className="space-y-1.5 pt-1">
          <p className="text-[11px] font-medium text-muted-foreground">You can still:</p>
          <div className="flex flex-wrap gap-2">
            <a
              href="/analytics"
              className="flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1.5 text-[11px] text-foreground hover:bg-secondary/60 transition-colors"
            >
              <ExternalLink size={10} aria-hidden />
              Open Analytics
            </a>
            <a
              href="/credentials"
              className="flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1.5 text-[11px] text-foreground hover:bg-secondary/60 transition-colors"
            >
              <ExternalLink size={10} aria-hidden />
              Browse Credentials
            </a>
            <a
              href="/experts"
              className="flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1.5 text-[11px] text-foreground hover:bg-secondary/60 transition-colors"
            >
              <ExternalLink size={10} aria-hidden />
              Find Experts
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AssistantPanel() {
  const [input, setInput] = useState("");
  const [messageToolData, setMessageToolData] = useState<
    Record<string, MessageToolData>
  >({});
  // Parsed structured errors keyed by message id
  const [messageErrors, setMessageErrors] = useState<Record<string, AssistantError>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Use a ref to hold pending tool data so the fetch callback doesn't close over
  // stale state, preventing stale-response association bugs.
  const pendingToolDataRef = useRef<MessageToolData | null>(null);

  const { messages, sendMessage, status, error: sdkError, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/assistant/chat",
      // Intercept the response to extract tool results from response headers.
      fetch: async (url: RequestInfo | URL, init?: RequestInit) => {
        const response = await fetch(url, init);
        if (response.ok) {
          const toolResultsHeader = response.headers.get("x-tool-results");
          if (toolResultsHeader) {
            try {
              // Headers are base64-encoded by the route to ensure Latin-1 safety.
              const decoded = atob(toolResultsHeader);
              const toolData = JSON.parse(decoded) as Record<
                string,
                CaseAnalyticsToolResult | ContentSearchResult
              >;
              pendingToolDataRef.current = toolData as MessageToolData;
            } catch {
              // Ignore malformed header
            }
          }
        }
        return response;
      },
    }),
    onFinish: ({ message }) => {
      if (message.role !== "assistant") return;

      // Check if the message text is a structured error payload
      const textContent = message.parts
        .filter((p) => p.type === "text")
        .map((p) => p.text)
        .join("");
      const structuredError = parseAssistantError(textContent);

      if (structuredError) {
        setMessageErrors((prev) => ({ ...prev, [message.id]: structuredError }));
        // Don't attach tool data to error messages
        pendingToolDataRef.current = null;
      } else if (pendingToolDataRef.current) {
        const data = pendingToolDataRef.current;
        pendingToolDataRef.current = null;
        setMessageToolData((prev) => ({ ...prev, [message.id]: data }));
      }
    },
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || status !== "ready") return;
    sendMessage({ text: trimmed });
    setInput("");
  }, [input, status, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (e.keyCode === 229) return; // Safari IME
      handleSubmit();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setMessageToolData({});
    setMessageErrors({});
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSuggestion = (q: string) => {
    setInput(q);
    inputRef.current?.focus();
  };

  const isLoading = status === "submitted" || status === "streaming";
  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full flex-col">
      {/* ── Grounding notice ──────────────────────────────────────────────── */}
      <div className="flex shrink-0 items-start gap-2 border-b border-border bg-secondary/30 px-4 py-2.5">
        <Info size={12} className="mt-0.5 shrink-0 text-muted-foreground" aria-hidden />
        <p className="text-[11px] text-muted-foreground">
          The AI interprets requests and explains results. All case counts are
          calculated deterministically from the workbook registry — the AI never
          calculates or estimates numbers.
        </p>
      </div>

      {/* ── Messages ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
        {isEmpty ? (
          <EmptyState onSuggestionClick={handleSuggestion} />
        ) : (
          <div className="space-y-5">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                toolData={messageToolData[message.id]}
                structuredError={messageErrors[message.id]}
              />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 size={14} className="animate-spin" aria-hidden />
                <span className="text-[12px]">Thinking…</span>
              </div>
            )}
            {/* SDK-level error (network failure, stream error, aborted, etc.) */}
            {sdkError && !isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[90%] w-full">
                  {sdkError.message.startsWith("AI_NOT_CONFIGURED") ? (
                    <ErrorPanel
                      error={{
                        requestId: sdkError.message.match(/\[(AST-[^\]]+)\]/)?.[1] ?? "unknown",
                        stage: "model-call",
                        code: "AI_NOT_CONFIGURED",
                        message:
                          "AI interpretation requires the Vercel AI Gateway. Analytical case counts and content search work without it.",
                      }}
                    />
                  ) : (
                    <div className="flex items-start gap-2 rounded border border-destructive/30 bg-destructive/5 p-3">
                      <AlertTriangle size={13} className="mt-0.5 shrink-0 text-destructive" aria-hidden />
                      <p className="text-[12px] text-destructive">
                        Connection error. Please check your network and try again.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Input ─────────────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-border bg-background p-3">
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Ask about case counts, credentials, experts, partners…"
              rows={1}
              className={cn(
                "w-full resize-none rounded-lg border border-border bg-secondary/40 px-3 py-2.5 pr-10 text-[13px] leading-relaxed outline-none transition-colors",
                "placeholder:text-muted-foreground/60",
                "focus:border-foreground/50 focus:bg-background",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "max-h-32 overflow-y-auto"
              )}
              aria-label="Ask the AI assistant"
              style={{
                height: "auto",
                minHeight: "42px",
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              input.trim() && !isLoading
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            )}
          >
            <Send size={14} aria-hidden />
          </button>
        </div>

        {/* Reset button */}
        {!isEmpty && (
          <button
            onClick={handleReset}
            className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear conversation"
          >
            <RotateCcw size={10} aria-hidden />
            Clear conversation
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  message,
  toolData,
  structuredError,
}: {
  message: UIMessage;
  toolData?: MessageToolData;
  structuredError?: AssistantError;
}) {
  const isUser = message.role === "user";
  const textContent = message.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");

  // If this is a structured error message, render the error panel instead
  if (!isUser && structuredError) {
    return (
      <div className="flex justify-start">
        <div className="max-w-[90%] w-full">
          <ErrorPanel error={structuredError} />
        </div>
      </div>
    );
  }

  // Hide raw JSON error payloads that somehow weren't caught
  const isRawError = !isUser && textContent.includes('"__assistantError"');

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-xl px-3.5 py-2.5",
          isUser
            ? "bg-foreground text-background text-[13px]"
            : "bg-secondary/50 text-foreground text-[13px]"
        )}
      >
        {/* Text content — skip if it is a raw error payload */}
        {textContent && !isRawError && (
          <p className="whitespace-pre-wrap leading-relaxed">{textContent}</p>
        )}

        {/* Tool result cards — only shown on assistant messages */}
        {!isUser && toolData && (
          <>
            {toolData.caseAnalytics && (
              <CaseAnalyticsCard result={toolData.caseAnalytics} />
            )}
            {toolData.contentSearch && toolData.contentSearch.totalMatches > 0 && (
              <ContentSearchCard result={toolData.contentSearch} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onSuggestionClick }: { onSuggestionClick: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#CC0000]/10">
        <span
          className="text-[18px] font-bold text-[#CC0000]"
          aria-hidden
          style={{ fontFamily: "serif" }}
        >
          A
        </span>
      </div>
      <h3 className="mb-1 text-[14px] font-semibold text-foreground">
        AI-Assisted Search
      </h3>
      <p className="mb-5 max-w-xs text-[12px] text-muted-foreground leading-relaxed">
        Ask about case counts, find credentials, explore experts and partners, or search publications.
      </p>
      <div className="w-full max-w-sm space-y-2 text-left">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-2">
          Try asking
        </p>
        {SUGGESTED_QUESTIONS.slice(0, 4).map((q) => (
          <button
            key={q}
            onClick={() => onSuggestionClick(q)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-left text-[12px] text-foreground transition-colors hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
