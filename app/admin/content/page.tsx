"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { FileText, ChevronDown, Check, X, Clock, RotateCcw, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentWorkflowRecord, ContentStatus } from "@/lib/stores/content-store";

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then((r) => r.json());

const STATUS_LABELS: Record<ContentStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  "in-review": "In Review",
  approved: "Approved",
  published: "Published",
  rejected: "Rejected",
  archived: "Archived",
};

const STATUS_COLORS: Record<ContentStatus, string> = {
  draft: "text-muted-foreground bg-muted",
  submitted: "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40",
  "in-review": "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40",
  approved: "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/40",
  published: "text-green-700 bg-green-100 font-semibold dark:text-green-300 dark:bg-green-900/40",
  rejected: "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/40",
  archived: "text-muted-foreground bg-muted",
};

function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium", STATUS_COLORS[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}

const TRANSITIONS: Partial<Record<ContentStatus, ContentStatus[]>> = {
  draft: ["submitted"],
  submitted: ["in-review", "rejected"],
  "in-review": ["approved", "rejected"],
  approved: ["published", "rejected"],
  published: ["archived"],
  rejected: ["draft"],
};

type FilterStatus = ContentStatus | "all";

export default function AdminContentPage() {
  const { data, isLoading, error } = useSWR<{ records: ContentWorkflowRecord[] }>(
    "/api/admin/content",
    fetcher
  );
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const records = data?.records ?? [];
  const filtered = filter === "all" ? records : records.filter((r) => r.status === filter);

  const STATUS_TO_ACTION: Partial<Record<ContentStatus, string>> = {
    submitted: "submit",
    "in-review": "submit",
    approved: "approve",
    rejected: "reject",
    published: "publish",
    archived: "archive",
    draft: "submit", // rejected→draft uses submit to resubmit
  };

  async function transition(record: ContentWorkflowRecord, newStatus: ContentStatus) {
    // Map the target status to the API action verb
    const action = STATUS_TO_ACTION[newStatus];
    if (!action) return;
    setActionLoading(record.id);
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/content/${record.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Transition failed.");
      mutate("/api/admin/content");
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : "Unknown error.");
    } finally {
      setActionLoading(null);
    }
  }

  const filterOptions: { label: string; value: FilterStatus; count: number }[] = [
    { label: "All", value: "all", count: records.length },
    { label: "Pending", value: "submitted", count: records.filter((r) => r.status === "submitted").length },
    { label: "In Review", value: "in-review", count: records.filter((r) => r.status === "in-review").length },
    { label: "Published", value: "published", count: records.filter((r) => r.status === "published").length },
    { label: "Rejected", value: "rejected", count: records.filter((r) => r.status === "rejected").length },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Content</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Workflow status for all tracked content records.
          </p>
        </div>
        <button
          onClick={() => mutate("/api/admin/content")}
          className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {/* Filter strip */}
      <div className="flex gap-1.5 flex-wrap">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium transition-colors border",
              filter === opt.value
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            )}
          >
            {opt.label}
            <span className={cn(
              "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px]",
              filter === opt.value ? "bg-background/20" : "bg-muted"
            )}>
              {opt.count}
            </span>
          </button>
        ))}
      </div>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-[12px] text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
          {actionError}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-8">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
          Loading content records…
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
          Failed to load content records.
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <FileText size={24} className="mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            {filter === "all"
              ? "No content workflow records yet. Records appear here once content is submitted for review."
              : `No records with status "${filter}".`}
          </p>
        </div>
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Entity ID</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-32">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-36">Updated</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-48">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((record) => {
                const nextStatuses = TRANSITIONS[record.status] ?? [];
                const isLoading = actionLoading === record.id;
                return (
                  <tr key={record.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {record.entityType}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-foreground/80">
                      {record.entityId}
                      {record.timeSensitive && (
                        <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] text-amber-600">
                          <Clock size={10} />
                          Time-sensitive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-[12px]">
                      {new Date(record.updatedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {isLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
                      ) : (
                        <div className="flex gap-1.5 flex-wrap">
                          {nextStatuses.map((ns) => (
                            <button
                              key={ns}
                              onClick={() => transition(record, ns)}
                              className={cn(
                                "rounded px-2 py-1 text-[11px] font-medium transition-colors border",
                                ns === "approved" || ns === "published"
                                  ? "border-green-300 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/40"
                                  : ns === "rejected"
                                    ? "border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40"
                                    : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                              )}
                            >
                              {ns === "approved" ? <Check size={11} className="inline mr-0.5" /> : null}
                              {ns === "rejected" ? <X size={11} className="inline mr-0.5" /> : null}
                              {ns === "published" ? <Check size={11} className="inline mr-0.5" /> : null}
                              {ns === "draft" ? <RotateCcw size={11} className="inline mr-0.5" /> : null}
                              {STATUS_LABELS[ns]}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
