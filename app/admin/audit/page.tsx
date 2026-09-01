"use client";

import { useState } from "react";
import useSWR from "swr";
import { ScrollText, RefreshCw, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuditEvent } from "@/lib/stores/audit-store";

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then((r) => r.json());

const ACTION_COLORS: Record<string, string> = {
  "user.login": "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40",
  "user.logout": "text-muted-foreground bg-muted",
  "user.created": "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/40",
  "user.updated": "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40",
  "content.submitted": "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40",
  "content.approved": "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/40",
  "content.rejected": "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/40",
  "content.published": "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/40",
  "workbook.uploaded": "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40",
  "workbook.approved": "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/40",
  "workbook.published": "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/40",
  "workbook.rollback": "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40",
};

const LIMIT = 100;

export default function AdminAuditPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [entityTypeFilter, setEntityTypeFilter] = useState("all");

  const { data, isLoading, error, mutate } = useSWR<{ events: AuditEvent[]; total: number }>(
    `/api/admin/audit?limit=${LIMIT}&offset=${page * LIMIT}`,
    fetcher
  );

  const events = data?.events ?? [];
  const total = data?.total ?? 0;

  const filtered = events.filter((e) => {
    const matchesSearch =
      !search ||
      e.action.includes(search.toLowerCase()) ||
      e.actorEmail.toLowerCase().includes(search.toLowerCase()) ||
      (e.entityId ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesType = entityTypeFilter === "all" || e.entityType === entityTypeFilter;
    return matchesSearch && matchesType;
  });

  const entityTypes = ["all", ...Array.from(new Set(events.map((e) => e.entityType)))];

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Audit Log</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Append-only record of all platform actions. {total > 0 && `${total.toLocaleString()} total events.`}
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

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, actor, entity…"
            className="rounded border border-border bg-background pl-8 pr-3 py-1.5 text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30 w-64"
          />
        </div>
        <select
          value={entityTypeFilter}
          onChange={(e) => setEntityTypeFilter(e.target.value)}
          className="rounded border border-border bg-background px-2.5 py-1.5 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
        >
          {entityTypes.map((t) => (
            <option key={t} value={t}>{t === "all" ? "All entity types" : t}</option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-8">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
          Loading audit events…
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <ScrollText size={24} className="mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            {search || entityTypeFilter !== "all" ? "No matching events." : "No audit events recorded yet."}
          </p>
        </div>
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground w-36">Timestamp</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground w-40">Action</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Actor</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Entity</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground w-20">Version</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((event) => (
                  <tr key={event.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-muted-foreground whitespace-nowrap">
                      {new Date(event.timestamp).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
                        ACTION_COLORS[event.action] ?? "text-muted-foreground bg-muted"
                      )}>
                        {event.action}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="text-foreground">{event.actorEmail}</div>
                      <div className="text-muted-foreground text-[11px]">{event.actorRole}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      {event.entityType && (
                        <span className="text-muted-foreground">{event.entityType}</span>
                      )}
                      {event.entityId && (
                        <span className="ml-1.5 font-mono text-foreground/80">{event.entityId}</span>
                      )}
                      {event.reason && (
                        <div className="text-[11px] text-muted-foreground">{event.reason}</div>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {event.previousVersion !== undefined && event.newVersion !== undefined
                        ? `v${event.previousVersion} → v${event.newVersion}`
                        : event.newVersion !== undefined
                          ? `v${event.newVersion}`
                          : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > LIMIT && (
            <div className="flex items-center justify-between text-[12px] text-muted-foreground">
              <span>
                Showing {page * LIMIT + 1}–{Math.min((page + 1) * LIMIT, total)} of {total.toLocaleString()} events
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="rounded border border-border px-3 py-1 hover:text-foreground disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={(page + 1) * LIMIT >= total}
                  className="rounded border border-border px-3 py-1 hover:text-foreground disabled:opacity-40 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
