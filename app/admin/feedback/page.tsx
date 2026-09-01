"use client";

import { useState } from "react";
import useSWR from "swr";
import { RefreshCw, MessageSquare, CheckCircle, Archive, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FeedbackItem, FeedbackType, FeedbackStatus } from "@/lib/stores/feedback-store";

const FETCHER = (url: string) =>
  fetch(url, { credentials: "include" }).then((r) => r.json());

const TYPE_LABELS: Record<FeedbackType, string> = {
  "content-error": "Content error",
  "data-quality": "Data quality",
  "missing-content": "Missing content",
  "confidentiality-concern": "Confidentiality",
  "search-quality": "Search quality",
  "recommendation-quality": "Recommendation",
  general: "General",
};

const STATUS_COLORS: Record<FeedbackStatus, string> = {
  new: "bg-[#CC0000]/10 text-[#CC0000]",
  triaged: "bg-amber-500/10 text-amber-500",
  "in-progress": "bg-blue-500/10 text-blue-500",
  resolved: "bg-green-500/10 text-green-500",
  closed: "bg-secondary text-muted-foreground",
  duplicate: "bg-secondary text-muted-foreground",
};

function relDate(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "1d ago";
  return `${d}d ago`;
}

interface FeedbackResponse {
  feedback: FeedbackItem[];
  total: number;
}

export default function AdminFeedbackPage() {
  const { data, isLoading, mutate } = useSWR<FeedbackResponse>(
    "/api/admin/feedback",
    FETCHER
  );

  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<FeedbackType | "all">("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const items = data?.feedback ?? [];
  const filtered = items
    .filter((f) => statusFilter === "all" || f.status === statusFilter)
    .filter((f) => typeFilter === "all" || f.type === typeFilter);

  const newCount = items.filter((f) => f.status === "new").length;

  async function updateStatus(id: string, status: FeedbackStatus) {
    setUpdating(id);
    try {
      await fetch(`/api/admin/feedback/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      mutate();
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-foreground">Feedback</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {items.length} submissions · {newCount} unreviewed
          </p>
        </div>
        <button
          onClick={() => mutate()}
          className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
          aria-label="Refresh feedback"
        >
          <RefreshCw size={13} aria-hidden />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter size={13} className="text-muted-foreground" aria-hidden />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as FeedbackStatus | "all")}
          className="h-8 rounded border border-border bg-background px-2.5 text-[12px] text-foreground outline-none focus:border-foreground"
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="triaged">Triaged</option>
          <option value="in-progress">In progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
          <option value="duplicate">Duplicate</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as FeedbackType | "all")}
          className="h-8 rounded border border-border bg-background px-2.5 text-[12px] text-foreground outline-none focus:border-foreground"
          aria-label="Filter by type"
        >
          <option value="all">All types</option>
          {Object.entries(TYPE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center gap-2 py-12 text-[13px] text-muted-foreground">
          <RefreshCw size={14} className="animate-spin" aria-hidden />
          Loading feedback…
        </div>
      )}

      {/* Empty */}
      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <MessageSquare size={28} className="text-muted-foreground/30" aria-hidden />
          <p className="text-[14px] font-medium text-foreground">No feedback yet</p>
          <p className="text-[13px] text-muted-foreground">
            Feedback submitted by users appears here.
          </p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="overflow-hidden rounded border border-border">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Message</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Page</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Submitted</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr
                  key={f.id}
                  className={cn(
                    "border-b border-border last:border-b-0 hover:bg-secondary/20",
                    f.status === "new" && "bg-[#CC0000]/3"
                  )}
                >
                  <td className="px-4 py-3 align-top">
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                      {TYPE_LABELS[f.type] ?? f.type}
                    </span>
                  </td>
                  <td className="max-w-sm px-4 py-3 align-top">
                    <p className="text-foreground leading-snug line-clamp-3">{f.message}</p>
                    {f.entityId && (
                      <p className="mt-0.5 text-[10px] text-muted-foreground font-mono">
                        {f.entityType}: {f.entityId}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className="font-mono text-[11px] text-muted-foreground">{f.route}</span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-medium capitalize",
                        STATUS_COLORS[f.status] ?? "bg-secondary text-muted-foreground"
                      )}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top text-muted-foreground whitespace-nowrap">
                    {relDate(f.createdAt)}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-1">
                      {f.status === "new" && (
                        <button
                          onClick={() => updateStatus(f.id, "triaged")}
                          disabled={updating === f.id}
                          className="flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] text-muted-foreground hover:border-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
                          aria-label="Mark as triaged"
                        >
                          {updating === f.id ? (
                            <RefreshCw size={10} className="animate-spin" aria-hidden />
                          ) : null}
                          Triage
                        </button>
                      )}
                      {(f.status === "triaged" || f.status === "in-progress") && (
                        <button
                          onClick={() => updateStatus(f.id, "resolved")}
                          disabled={updating === f.id}
                          className="flex items-center gap-1 rounded border border-green-500/30 px-2 py-1 text-[11px] text-green-500 hover:bg-green-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
                          aria-label="Mark as resolved"
                        >
                          <CheckCircle size={10} aria-hidden />
                          Resolve
                        </button>
                      )}
                      {f.status !== "closed" && (
                        <button
                          onClick={() => updateStatus(f.id, "closed")}
                          disabled={updating === f.id}
                          className="flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] text-muted-foreground hover:border-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
                          aria-label="Close feedback"
                        >
                          <Archive size={10} aria-hidden />
                          Close
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
