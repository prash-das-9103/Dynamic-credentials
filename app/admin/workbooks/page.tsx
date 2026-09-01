"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import {
  Database,
  Upload,
  CheckCircle,
  XCircle,
  RotateCcw,
  ChevronDown,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkbookVersion, WorkbookStatus } from "@/lib/stores/workbook-store";

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then((r) => r.json());

const STATUS_COLORS: Record<WorkbookStatus, string> = {
  uploaded: "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40",
  validating: "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40",
  "needs-review": "text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-950/40",
  approved: "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/40",
  published: "text-green-700 bg-green-100 font-semibold dark:text-green-300 dark:bg-green-900/40",
  rejected: "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/40",
  superseded: "text-muted-foreground bg-muted",
};

function WorkbookStatusBadge({ status }: { status: WorkbookStatus }) {
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium", STATUS_COLORS[status])}>
      {status.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
    </span>
  );
}

export default function AdminWorkbooksPage() {
  const { data, isLoading, error } = useSWR<{
    versions: WorkbookVersion[];
    activeVersionId: string | null;
  }>("/api/admin/workbooks", fetcher);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const versions = data?.versions ?? [];
  const activeId = data?.activeVersionId ?? null;

  async function doAction(id: string, action: "approve" | "publish" | "rollback" | "reject", notes?: string) {
    setActionLoading(`${id}-${action}`);
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/workbooks/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, notes }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `Action "${action}" failed.`);
      mutate("/api/admin/workbooks");
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : "Unknown error.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Workbooks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Version history for the analytical dataset (SustainabilityCases.xlsx).
            Only one version is active at a time.
          </p>
        </div>
        <button
          onClick={() => mutate("/api/admin/workbooks")}
          className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {/* Column governance notice */}
      <div className="rounded-lg border border-border bg-muted/20 px-4 py-3 text-[12px] text-muted-foreground">
        <span className="font-semibold text-foreground">Column governance:</span>{" "}
        Col A = Region · Col D = Case End Date (time field) · Col Q = Solution · Col T = Food Systems Transformation.
        Raw row data is never stored in logs.
      </div>

      {actionError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-[12px] text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          {actionError}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-8">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
          Loading workbook versions…
        </div>
      )}

      {!isLoading && !error && versions.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <Database size={24} className="mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No workbook versions uploaded yet.
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Use the API route POST /api/admin/workbooks to register a new version.
          </p>
        </div>
      )}

      {!isLoading && !error && versions.length > 0 && (
        <div className="space-y-2">
          {versions.map((v) => {
            const isActive = v.id === activeId;
            const isExp = expanded === v.id;
            const loading = (s: string) => actionLoading === `${v.id}-${s}`;

            return (
              <div
                key={v.id}
                className={cn(
                  "rounded-lg border transition-colors",
                  isActive
                    ? "border-green-300 dark:border-green-800"
                    : "border-border"
                )}
              >
                {/* Row header */}
                <button
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                  onClick={() => setExpanded(isExp ? null : v.id)}
                >
                  <div className="shrink-0 w-8 text-center">
                    <span className="text-[11px] font-mono font-semibold text-muted-foreground">
                      v{v.versionNumber}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-[13px] text-foreground truncate">{v.fileName}</span>
                      {isActive && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                          <CheckCircle size={10} />
                          Active
                        </span>
                      )}
                      <WorkbookStatusBadge status={v.status} />
                    </div>
                    <div className="mt-0.5 flex gap-3 text-[11px] text-muted-foreground">
                      <span>Uploaded {new Date(v.uploadedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })}</span>
                      <span>{v.uniqueCaseCount.toLocaleString()} unique cases</span>
                      {v.validationSummary.errors > 0 && (
                        <span className="text-red-600">{v.validationSummary.errors} errors</span>
                      )}
                      {v.validationSummary.warnings > 0 && (
                        <span className="text-amber-600">{v.validationSummary.warnings} warnings</span>
                      )}
                    </div>
                  </div>
                  <ChevronDown
                    size={15}
                    className={cn("shrink-0 text-muted-foreground transition-transform", isExp && "rotate-180")}
                  />
                </button>

                {/* Expanded detail */}
                {isExp && (
                  <div className="border-t border-border px-4 py-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-[12px] sm:grid-cols-4">
                      <div>
                        <div className="text-muted-foreground">Raw rows</div>
                        <div className="font-medium">{v.rawRowCount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Unique cases</div>
                        <div className="font-medium">{v.uniqueCaseCount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Date range</div>
                        <div className="font-medium">
                          {v.minimumEndDate && v.maximumEndDate
                            ? `${v.minimumEndDate.slice(0, 7)} — ${v.maximumEndDate.slice(0, 7)}`
                            : "—"}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Uploaded by</div>
                        <div className="font-medium truncate">{v.uploadedByEmail}</div>
                      </div>
                    </div>

                    {v.notes && (
                      <div className="rounded bg-muted/40 px-3 py-2 text-[12px] text-muted-foreground">
                        {v.notes}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2 flex-wrap">
                      {v.status === "needs-review" || v.status === "uploaded" ? (
                        <>
                          <button
                            onClick={() => doAction(v.id, "approve")}
                            disabled={!!actionLoading}
                            className="flex items-center gap-1.5 rounded border border-green-300 px-3 py-1.5 text-[12px] text-green-700 transition-colors hover:bg-green-50 disabled:opacity-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/40"
                          >
                            {loading("approve") ? (
                              <div className="h-3 w-3 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
                            ) : (
                              <CheckCircle size={13} />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => doAction(v.id, "reject")}
                            disabled={!!actionLoading}
                            className="flex items-center gap-1.5 rounded border border-red-300 px-3 py-1.5 text-[12px] text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40"
                          >
                            {loading("reject") ? (
                              <div className="h-3 w-3 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                            ) : (
                              <XCircle size={13} />
                            )}
                            Reject
                          </button>
                        </>
                      ) : null}

                      {v.status === "approved" && (
                        <button
                          onClick={() => doAction(v.id, "publish")}
                          disabled={!!actionLoading}
                          className="flex items-center gap-1.5 rounded border border-green-400 bg-green-600 px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                        >
                          {loading("publish") ? (
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <Upload size={13} />
                          )}
                          Publish
                        </button>
                      )}

                      {(v.status === "superseded" || v.status === "approved") && !isActive && (
                        <button
                          onClick={() => doAction(v.id, "rollback")}
                          disabled={!!actionLoading}
                          className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/40 disabled:opacity-50"
                        >
                          {loading("rollback") ? (
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-border border-t-foreground" />
                          ) : (
                            <RotateCcw size={13} />
                          )}
                          Roll back to this version
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
