"use client";

import useSWR from "swr";
import { Clock, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentWorkflowRecord } from "@/lib/stores/content-store";

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then((r) => r.json());

function getAge(dateStr: string): { label: string; tone: "ok" | "warn" | "danger" } {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  if (days >= 365) return { label: `${Math.floor(days / 365)}y ago`, tone: "danger" };
  if (days >= 90) return { label: `${days}d ago`, tone: "warn" };
  return { label: days === 0 ? "Today" : `${days}d ago`, tone: "ok" };
}

export default function AdminFreshnessPage() {
  const { data, isLoading, mutate } = useSWR<{ records: ContentWorkflowRecord[] }>(
    "/api/admin/content",
    fetcher
  );

  const now = new Date().toISOString();
  const published = (data?.records ?? []).filter((r) => r.status === "published");
  const timeSensitive = published.filter(
    (r) => r.timeSensitive && r.reviewBy && r.reviewBy < now
  );
  const stale = published.filter((r) => {
    const lastReview = r.lastReviewedAt ?? r.publishedAt;
    if (!lastReview) return true;
    const days = Math.floor((Date.now() - new Date(lastReview).getTime()) / (1000 * 60 * 60 * 24));
    return days > 180;
  });

  const byAge = published.reduce(
    (acc, r) => {
      const lastReview = r.lastReviewedAt ?? r.publishedAt;
      if (!lastReview) { acc.unknown++; return acc; }
      const days = Math.floor((Date.now() - new Date(lastReview).getTime()) / (1000 * 60 * 60 * 24));
      if (days > 365) acc.overYear++;
      else if (days > 180) acc.over6mo++;
      else acc.fresh++;
      return acc;
    },
    { fresh: 0, over6mo: 0, overYear: 0, unknown: 0 }
  );

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Freshness</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Content age and overdue review schedule for published records.
          </p>
        </div>
        <button
          onClick={() => mutate()}
          className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {/* Age summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-lg border border-green-300 bg-green-50/40 dark:border-green-800 dark:bg-green-950/20 p-4 text-center">
          <div className="text-2xl font-semibold text-green-700 dark:text-green-400">{byAge.fresh}</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">Reviewed within 6 months</div>
        </div>
        <div className="rounded-lg border border-amber-300 bg-amber-50/40 dark:border-amber-800 dark:bg-amber-950/20 p-4 text-center">
          <div className="text-2xl font-semibold text-amber-700 dark:text-amber-400">{byAge.over6mo}</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">6–12 months old</div>
        </div>
        <div className="rounded-lg border border-red-300 bg-red-50/40 dark:border-red-800 dark:bg-red-950/20 p-4 text-center">
          <div className="text-2xl font-semibold text-red-700 dark:text-red-400">{byAge.overYear}</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">Over 1 year old</div>
        </div>
        <div className="rounded-lg border border-border p-4 text-center">
          <div className="text-2xl font-semibold text-muted-foreground">{byAge.unknown}</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">No review date</div>
        </div>
      </div>

      {/* Time-sensitive overdue */}
      {timeSensitive.length > 0 && (
        <div className="rounded-lg border border-red-300 bg-red-50/30 dark:border-red-800 dark:bg-red-950/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-red-600" />
            <span className="text-[13px] font-semibold text-red-800 dark:text-red-400">
              {timeSensitive.length} time-sensitive record{timeSensitive.length !== 1 ? "s" : ""} past review deadline
            </span>
          </div>
          <div className="space-y-1">
            {timeSensitive.map((r) => (
              <div key={r.id} className="flex items-center gap-3 text-[12px]">
                <span className="font-mono text-foreground/70">{r.entityId}</span>
                <span className="text-muted-foreground">review by {r.reviewBy?.slice(0, 10)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
          Loading freshness data…
        </div>
      )}

      {/* Stale records table */}
      {!isLoading && published.length > 0 && (
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="border-b border-border bg-muted/40 px-4 py-2.5 text-[12px] font-medium text-muted-foreground">
            All published records — {published.length} total
          </div>
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Entity ID</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground w-36">Last reviewed</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground w-32">Age</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground w-28">Review by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {published.map((r) => {
                const lastReview = r.lastReviewedAt ?? r.publishedAt;
                const age = lastReview ? getAge(lastReview) : { label: "Unknown", tone: "warn" as const };
                return (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-2.5">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                        {r.entityType}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-foreground/80">{r.entityId}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {lastReview ? new Date(lastReview).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }) : "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[11px] font-medium",
                        age.tone === "ok" ? "text-green-700 dark:text-green-400"
                          : age.tone === "warn" ? "text-amber-700 dark:text-amber-400"
                            : "text-red-700 dark:text-red-400"
                      )}>
                        {age.tone === "ok" ? <CheckCircle size={10} /> : <Clock size={10} />}
                        {age.label}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {r.reviewBy ? (
                        <span className={cn(
                          r.reviewBy < now ? "text-red-600 dark:text-red-400 font-medium" : ""
                        )}>
                          {r.reviewBy.slice(0, 10)}
                        </span>
                      ) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && published.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <Clock size={24} className="mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No published content to track yet.</p>
        </div>
      )}
    </div>
  );
}
