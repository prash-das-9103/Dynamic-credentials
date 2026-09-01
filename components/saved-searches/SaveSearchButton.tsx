"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck, X, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SavedSearchType } from "@/lib/stores/saved-search-store";

interface SaveSearchButtonProps {
  type: SavedSearchType;
  queryParams: Record<string, string | string[] | boolean | number>;
  analyticalContext?: {
    tab?: "credentials" | "cases";
    mode?: "count" | "pct";
    datasetVersion?: string;
  };
  defaultName?: string;
  /** Whether the current filters produce a non-empty result set. */
  hasResults?: boolean;
}

export function SaveSearchButton({
  type,
  queryParams,
  analyticalContext,
  defaultName = "",
  hasResults = true,
}: SaveSearchButtonProps) {
  const [state, setState] = useState<"idle" | "form" | "saving" | "saved" | "error">("idle");
  const [name, setName] = useState(defaultName);
  const [subscribeEnabled, setSubscribeEnabled] = useState(false);
  const [frequency, setFrequency] = useState<"daily" | "weekly">("weekly");
  const [errorMsg, setErrorMsg] = useState("");

  async function save() {
    if (!name.trim()) {
      setErrorMsg("A name is required.");
      return;
    }
    setState("saving");
    setErrorMsg("");
    try {
      const res = await fetch("/api/v1/saved-searches", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          type,
          queryParams,
          analyticalContext,
          visibility: "private",
          sharedUserIds: [],
          subscriptionEnabled: subscribeEnabled,
          subscriptionFrequency: subscribeEnabled ? frequency : undefined,
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setErrorMsg((json as { error?: string }).error ?? "Failed to save.");
        setState("form");
        return;
      }
      setState("saved");
      // Reset to idle after 3s
      setTimeout(() => {
        setState("idle");
        setName(defaultName);
        setSubscribeEnabled(false);
      }, 3000);
    } catch {
      setErrorMsg("An error occurred. Please try again.");
      setState("form");
    }
  }

  if (state === "saved") {
    return (
      <button
        disabled
        className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-[12px] text-muted-foreground"
        aria-label="Search saved"
      >
        <BookmarkCheck size={12} aria-hidden />
        Saved
      </button>
    );
  }

  if (state === "idle") {
    return (
      <button
        onClick={() => setState("form")}
        disabled={!hasResults}
        className={cn(
          "flex items-center gap-1.5 rounded border px-3 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground",
          hasResults
            ? "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            : "cursor-not-allowed border-border text-muted-foreground/40"
        )}
        aria-label="Save this search"
      >
        <Bookmark size={12} aria-hidden />
        Save search
      </button>
    );
  }

  // Form state
  return (
    <div className="relative">
      <div
        role="dialog"
        aria-label="Save search"
        className="absolute right-0 top-full z-50 mt-1 w-72 overflow-hidden rounded border border-border bg-background shadow-lg"
      >
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="text-[13px] font-semibold text-foreground">Save search</span>
          <button
            onClick={() => setState("idle")}
            className="rounded p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
            aria-label="Close"
          >
            <X size={13} aria-hidden />
          </button>
        </div>

        <div className="space-y-3 p-3">
          <div>
            <label htmlFor="ss-name" className="block text-[11px] font-medium text-foreground mb-1">
              Name
            </label>
            <input
              id="ss-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing) save();
              }}
              maxLength={120}
              placeholder="e.g. EMEA circular economy 2024"
              className="h-8 w-full rounded border border-border bg-background px-2.5 text-[12px] outline-none focus:border-foreground"
              autoFocus
            />
          </div>

          {/* Alert subscription */}
          <div className="flex items-center gap-2">
            <input
              id="ss-subscribe"
              type="checkbox"
              checked={subscribeEnabled}
              onChange={(e) => setSubscribeEnabled(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border accent-[#CC0000]"
            />
            <label htmlFor="ss-subscribe" className="text-[12px] text-foreground cursor-pointer">
              Alert me when new matches appear
            </label>
          </div>

          {subscribeEnabled && (
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-muted-foreground shrink-0">Frequency:</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as "daily" | "weekly")}
                className="h-7 rounded border border-border bg-background px-2 text-[11px] outline-none focus:border-foreground"
                aria-label="Alert frequency"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          )}

          {errorMsg && (
            <p role="alert" className="text-[11px] text-red-500">
              {errorMsg}
            </p>
          )}

          <button
            onClick={save}
            disabled={state === "saving" || !name.trim()}
            className={cn(
              "flex w-full items-center justify-center gap-1.5 rounded px-3 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground",
              state === "saving" || !name.trim()
                ? "cursor-not-allowed bg-secondary text-muted-foreground"
                : "bg-foreground text-background hover:opacity-90"
            )}
          >
            {state === "saving" && <RefreshCw size={11} className="animate-spin" aria-hidden />}
            {state === "saving" ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
