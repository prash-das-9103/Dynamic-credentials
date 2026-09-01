"use client";

import { useState } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import {
  Bookmark,
  Bell,
  BellOff,
  Trash2,
  RefreshCw,
  ExternalLink,
  Search,
} from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";
import type { SavedSearch, SavedSearchType } from "@/lib/stores/saved-search-store";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FETCHER = (url: string) =>
  fetch(url, { credentials: "include" }).then((r) => r.json());

const TYPE_LABELS: Record<SavedSearchType, string> = {
  credentials: "Case Examples",
  experts: "Experts",
  partners: "Partners",
  publications: "Publications",
  "analytics-credentials": "Analytics — Case Examples",
  "analytics-cases": "Analytics — Cases",
  "cross-content": "Cross-content",
};

function typeHref(s: SavedSearch): string {
  const params = new URLSearchParams();
  Object.entries(s.queryParams).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      v.forEach((vi) => params.append(k, String(vi)));
    } else {
      params.set(k, String(v));
    }
  });
  const base =
    s.type === "credentials"
      ? "/credentials"
      : s.type === "experts"
      ? "/experts"
      : s.type === "partners"
      ? "/ecosystem"
      : s.type === "publications"
      ? "/publications"
      : "/analytics";
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function relativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function SavedSearchRow({ item }: { item: SavedSearch }) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState("");

  async function deleteSearch() {
    setDeleting(true);
    try {
      await fetch(`/api/v1/saved-searches/${item.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      globalMutate("/api/v1/saved-searches");
    } catch {
      setError("Could not delete.");
    } finally {
      setDeleting(false);
    }
  }

  async function toggleSubscription() {
    setToggling(true);
    try {
      await fetch(`/api/v1/saved-searches/${item.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionEnabled: !item.subscriptionEnabled,
        }),
      });
      globalMutate("/api/v1/saved-searches");
    } catch {
      setError("Could not update subscription.");
    } finally {
      setToggling(false);
    }
  }

  return (
    <div className="group flex items-start gap-4 rounded border border-border bg-background p-4 transition-colors hover:border-foreground/20">
      {/* Icon */}
      <span className="mt-0.5 rounded bg-secondary p-1.5 text-muted-foreground">
        <Bookmark size={14} aria-hidden />
      </span>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={typeHref(item)}
              className="text-[14px] font-semibold text-foreground hover:text-[#CC0000] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
            >
              {item.name}
            </Link>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {TYPE_LABELS[item.type] ?? item.type}
              </span>
              {item.subscriptionEnabled && (
                <span className="flex items-center gap-1 text-[10px] text-amber-500">
                  <Bell size={10} aria-hidden />
                  {item.subscriptionFrequency ?? "weekly"} digest
                </span>
              )}
              <span className="text-[11px] text-muted-foreground">
                Saved {relativeDate(item.createdAt)}
              </span>
              {item.lastRunAt && (
                <span className="text-[11px] text-muted-foreground">
                  · Last run {relativeDate(item.lastRunAt)}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1">
            <Link
              href={typeHref(item)}
              className="flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
              aria-label={`Run search — ${item.name}`}
            >
              <ExternalLink size={11} aria-hidden />
              Run
            </Link>

            <button
              onClick={toggleSubscription}
              disabled={toggling}
              aria-label={
                item.subscriptionEnabled ? "Disable alert" : "Enable alert"
              }
              className={cn(
                "flex items-center gap-1 rounded border px-2 py-1 text-[11px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground",
                item.subscriptionEnabled
                  ? "border-amber-500/40 text-amber-500 hover:bg-amber-500/10"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              )}
            >
              {toggling ? (
                <RefreshCw size={11} className="animate-spin" aria-hidden />
              ) : item.subscriptionEnabled ? (
                <BellOff size={11} aria-hidden />
              ) : (
                <Bell size={11} aria-hidden />
              )}
            </button>

            <button
              onClick={deleteSearch}
              disabled={deleting}
              aria-label={`Delete saved search — ${item.name}`}
              className="flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:border-red-500/40 hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
            >
              {deleting ? (
                <RefreshCw size={11} className="animate-spin" aria-hidden />
              ) : (
                <Trash2 size={11} aria-hidden />
              )}
            </button>
          </div>
        </div>

        {/* Filter summary */}
        {Object.keys(item.queryParams).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {Object.entries(item.queryParams)
              .filter(([, v]) =>
                Array.isArray(v) ? v.length > 0 : Boolean(v)
              )
              .slice(0, 6)
              .map(([k, v]) => {
                const display = Array.isArray(v) ? v.join(", ") : String(v);
                return (
                  <span
                    key={k}
                    className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground"
                    title={`${k}: ${display}`}
                  >
                    {k}: {display.length > 24 ? `${display.slice(0, 24)}…` : display}
                  </span>
                );
              })}
          </div>
        )}

        {error && (
          <p role="alert" className="mt-1 text-[11px] text-red-500">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface SavedSearchesResponse {
  savedSearches: SavedSearch[];
}

export default function SavedSearchesPage() {
  const { data, error, isLoading } = useSWR<SavedSearchesResponse>(
    "/api/v1/saved-searches",
    FETCHER
  );

  const [typeFilter, setTypeFilter] = useState<SavedSearchType | "all">("all");
  const [subscribeFilter, setSubscribeFilter] = useState<
    "all" | "subscribed" | "unsubscribed"
  >("all");

  const items = data?.savedSearches ?? [];
  const filtered = items
    .filter((s) => typeFilter === "all" || s.type === typeFilter)
    .filter((s) =>
      subscribeFilter === "all"
        ? true
        : subscribeFilter === "subscribed"
        ? s.subscriptionEnabled
        : !s.subscriptionEnabled
    );

  const subscribedCount = items.filter((s) => s.subscriptionEnabled).length;

  return (
    <AppShell title="Saved Searches">
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-6 py-8">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-[20px] font-semibold text-foreground">Saved Searches</h1>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {items.length} saved {items.length === 1 ? "search" : "searches"}
              {subscribedCount > 0 && ` · ${subscribedCount} with active alerts`}
            </p>
          </div>

          {/* Filters */}
          {items.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as SavedSearchType | "all")
                }
                className="h-8 rounded border border-border bg-background px-2.5 text-[12px] text-foreground outline-none focus:border-foreground"
                aria-label="Filter by content type"
              >
                <option value="all">All types</option>
                {Object.entries(TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>

              <select
                value={subscribeFilter}
                onChange={(e) =>
                  setSubscribeFilter(
                    e.target.value as "all" | "subscribed" | "unsubscribed"
                  )
                }
                className="h-8 rounded border border-border bg-background px-2.5 text-[12px] text-foreground outline-none focus:border-foreground"
                aria-label="Filter by alert subscription"
              >
                <option value="all">All alerts</option>
                <option value="subscribed">With alerts</option>
                <option value="unsubscribed">No alerts</option>
              </select>
            </div>
          )}

          {/* State: loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-16 text-[13px] text-muted-foreground">
              <RefreshCw size={14} className="mr-2 animate-spin" aria-hidden />
              Loading saved searches…
            </div>
          )}

          {/* State: error */}
          {error && (
            <div
              role="alert"
              className="rounded border border-red-500/20 bg-red-500/5 px-4 py-3 text-[13px] text-red-500"
            >
              Could not load saved searches. Please try again.
            </div>
          )}

          {/* State: empty */}
          {!isLoading && !error && items.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Search size={32} className="text-muted-foreground/30" aria-hidden />
              <p className="text-[14px] font-medium text-foreground">
                No saved searches yet
              </p>
              <p className="max-w-xs text-[13px] text-muted-foreground">
                Use the &quot;Save search&quot; button on Case Examples, Analytics, or
                other content pages to bookmark your current filters.
              </p>
              <Link
                href="/credentials"
                className="mt-2 rounded border border-border px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
              >
                Browse credentials
              </Link>
            </div>
          )}

          {/* State: filtered empty */}
          {!isLoading && !error && items.length > 0 && filtered.length === 0 && (
            <p className="py-8 text-center text-[13px] text-muted-foreground">
              No saved searches match the current filters.
            </p>
          )}

          {/* List */}
          {filtered.length > 0 && (
            <div className="space-y-2">
              {filtered.map((item) => (
                <SavedSearchRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>
    </AppShell>
  );
}
