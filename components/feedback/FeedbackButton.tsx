"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, RefreshCw, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FeedbackType } from "@/lib/stores/feedback-store";

const FEEDBACK_TYPES: { value: FeedbackType; label: string }[] = [
  { value: "content-error", label: "Content error" },
  { value: "data-quality", label: "Data quality" },
  { value: "missing-content", label: "Missing content" },
  { value: "confidentiality-concern", label: "Confidentiality concern" },
  { value: "search-quality", label: "Search quality" },
  { value: "recommendation-quality", label: "Recommendation" },
  { value: "general", label: "General" },
];

export function FeedbackButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("general");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Don't render on admin pages — admins have their own tooling
  if (pathname.startsWith("/admin")) return null;

  // Don't render on reference slide pages — each pixel-accurate slide
  // recreation is displayed as a full-bleed image/iframe, and the floating
  // button was overlapping the slide content on every one of them.
  if (pathname.startsWith("/reference-slides")) return null;

  async function submit() {
    if (!message.trim()) {
      setErrorMsg("Please describe the issue.");
      return;
    }
    setState("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/v1/feedback", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message: message.trim(), route: pathname }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error((json as { error?: string }).error ?? "Submission failed.");
      }
      setState("done");
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Submission failed.");
      setState("idle");
    }
  }

  function reset() {
    setOpen(false);
    setTimeout(() => {
      setState("idle");
      setMessage("");
      setType("general");
      setErrorMsg("");
    }, 300);
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Send feedback"
          className="w-72 overflow-hidden rounded border border-border bg-background shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
            <span className="text-[13px] font-semibold text-foreground">Send feedback</span>
            <button
              onClick={reset}
              className="rounded p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
              aria-label="Close feedback"
            >
              <X size={13} aria-hidden />
            </button>
          </div>

          {state === "done" ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <CheckCircle size={28} className="text-green-500" aria-hidden />
              <p className="text-[13px] font-medium text-foreground">
                Thank you for your feedback
              </p>
              <p className="text-[12px] text-muted-foreground">
                It will be reviewed by the content team.
              </p>
              <button
                onClick={reset}
                className="mt-2 rounded border border-border px-3 py-1 text-[12px] text-foreground hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="space-y-3 p-3">
              {/* Type */}
              <div>
                <label
                  htmlFor="fb-type"
                  className="mb-1 block text-[11px] font-medium text-foreground"
                >
                  Category
                </label>
                <select
                  id="fb-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as FeedbackType)}
                  className="h-8 w-full rounded border border-border bg-background px-2.5 text-[12px] text-foreground outline-none focus:border-foreground"
                >
                  {FEEDBACK_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="fb-message"
                  className="mb-1 block text-[11px] font-medium text-foreground"
                >
                  Description
                </label>
                <textarea
                  id="fb-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  maxLength={2000}
                  placeholder="Describe the issue or suggestion…"
                  className="w-full resize-none rounded border border-border bg-background px-2.5 py-2 text-[12px] text-foreground outline-none focus:border-foreground placeholder:text-muted-foreground"
                />
                <div className="mt-0.5 text-right text-[10px] text-muted-foreground">
                  {message.length}/2000
                </div>
              </div>

              {/* Route context */}
              <p className="text-[10px] text-muted-foreground">
                Page: <span className="font-mono">{pathname}</span>
              </p>

              {errorMsg && (
                <p role="alert" className="text-[11px] text-red-500">
                  {errorMsg}
                </p>
              )}

              <button
                onClick={submit}
                disabled={state === "submitting" || !message.trim()}
                className={cn(
                  "flex w-full items-center justify-center gap-1.5 rounded px-3 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground",
                  state === "submitting" || !message.trim()
                    ? "cursor-not-allowed bg-secondary text-muted-foreground"
                    : "bg-foreground text-background hover:opacity-90"
                )}
              >
                {state === "submitting" && (
                  <RefreshCw size={11} className="animate-spin" aria-hidden />
                )}
                {state === "submitting" ? "Sending…" : "Send feedback"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((p) => !p)}
        aria-label={open ? "Close feedback" : "Send feedback"}
        aria-expanded={open}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border border-border shadow-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground",
          open
            ? "bg-foreground text-background"
            : "bg-background text-muted-foreground hover:text-foreground"
        )}
      >
        {open ? (
          <X size={15} aria-hidden />
        ) : (
          <MessageSquare size={15} aria-hidden />
        )}
      </button>
    </div>
  );
}
