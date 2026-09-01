"use client";

import useSWR, { mutate } from "swr";
import { useState } from "react";
import { ClipboardCheck, CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentWorkflowRecord, ContentStatus } from "@/lib/stores/content-store";

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then((r) => r.json());

export default function AdminReviewsPage() {
  const { data, isLoading, error } = useSWR<{ records: ContentWorkflowRecord[] }>(
    "/api/admin/content",
    fetcher
  );
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  const pending = (data?.records ?? []).filter(
    (r) => r.status === "submitted" || r.status === "in-review"
  );
  const overdue = (data?.records ?? []).filter(
    (r) => r.timeSensitive && r.reviewBy && r.reviewBy < new Date().toISOString() && r.status !== "published"
  );

  const STATUS_TO_ACTION: Partial<Record<ContentStatus, string>> = {
    submitted: "submit",
    "in-review": "submit",
    approved: "approve",
    rejected: "reject",
    published: "publish",
    archived: "archive",
  };

  async function doTransition(record: ContentWorkflowRecord, newStatus: ContentStatus) {
    const action = STATUS_TO_ACTION[newStatus];
    if (!action) return;
    setActionLoading(record.id);
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/content/${record.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reviewNotes: reviewNotes[record.id] ?? "" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Action failed.");
      mutate("/api/admin/content");
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : "Unknown error.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Reviews</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Content records awaiting review or approval.
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

      {actionError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-[12px] text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          {actionError}
        </div>
      )}

      {overdue.length > 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-amber-600" />
            <span className="text-[13px] font-semibold text-amber-800 dark:text-amber-400">
              {overdue.length} overdue review{overdue.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-1">
            {overdue.map((r) => (
              <div key={r.id} className="text-[12px] text-amber-700 dark:text-amber-500">
                {r.entityType} · {r.entityId} — review by {r.reviewBy?.slice(0, 10)}
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-8">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
          Loading review queue…
        </div>
      )}

      {!isLoading && !error && pending.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <ClipboardCheck size={24} className="mx-auto mb-3 text-green-500/60" />
          <p className="text-sm font-medium text-foreground">Review queue is empty</p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            All submitted content has been reviewed.
          </p>
        </div>
      )}

      {!isLoading && !error && pending.length > 0 && (
        <div className="space-y-3">
          {pending.map((record) => {
            const isLoading = actionLoading === record.id;
            const notes = reviewNotes[record.id] ?? "";
            return (
              <div key={record.id} className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {record.entityType}
                      </span>
                      <span className="font-mono text-[12px] text-foreground">{record.entityId}</span>
                      {record.timeSensitive && (
                        <span className="flex items-center gap-0.5 text-[11px] text-amber-600">
                          <Clock size={11} />
                          Time-sensitive
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      Submitted {record.submittedAt
                        ? new Date(record.submittedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                        : "—"}
                      {record.submittedBy && ` by ${record.submittedBy}`}
                    </div>
                  </div>
                  <span className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium shrink-0",
                    record.status === "submitted"
                      ? "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40"
                      : "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40"
                  )}>
                    {record.status === "submitted" ? "Submitted" : "In Review"}
                  </span>
                </div>

                {/* Review notes */}
                <textarea
                  value={notes}
                  onChange={(e) => setReviewNotes((prev) => ({ ...prev, [record.id]: e.target.value }))}
                  placeholder="Review notes (optional)…"
                  rows={2}
                  className="w-full rounded border border-border bg-background px-3 py-2 text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30 resize-none"
                />

                <div className="flex gap-2">
                  {record.status === "submitted" && (
                    <button
                      onClick={() => doTransition(record, "in-review")}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    >
                      Begin review
                    </button>
                  )}
                  <button
                    onClick={() => doTransition(record, "approved")}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 rounded border border-green-300 px-3 py-1.5 text-[12px] text-green-700 hover:bg-green-50 transition-colors disabled:opacity-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/40"
                  >
                    {isLoading ? (
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
                    ) : (
                      <CheckCircle size={13} />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => doTransition(record, "rejected")}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 rounded border border-red-300 px-3 py-1.5 text-[12px] text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    {isLoading ? (
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                    ) : (
                      <XCircle size={13} />
                    )}
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
