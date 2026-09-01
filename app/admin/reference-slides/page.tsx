"use client";

import useSWR from "swr";
import { Layers, Check, Clock, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentWorkflowRecord } from "@/lib/stores/content-store";

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then((r) => r.json());

export default function AdminReferenceSlidesPage() {
  const { data, isLoading, mutate } = useSWR<{ records: ContentWorkflowRecord[] }>(
    "/api/admin/content",
    fetcher
  );

  const slides = (data?.records ?? []).filter((r) => r.entityType === "reference-slide");
  const published = slides.filter((r) => r.status === "published").length;
  const pending = slides.filter((r) => ["submitted", "in-review", "approved"].includes(r.status)).length;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Reference Slides</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Approved slide templates and reference materials.
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

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border p-4 text-center">
          <div className="text-2xl font-semibold text-foreground">{slides.length}</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">Total slides tracked</div>
        </div>
        <div className="rounded-lg border border-green-300 bg-green-50/40 p-4 text-center dark:border-green-800 dark:bg-green-950/20">
          <div className="text-2xl font-semibold text-green-700 dark:text-green-400">{published}</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">Published</div>
        </div>
        <div className="rounded-lg border border-amber-300 bg-amber-50/40 p-4 text-center dark:border-amber-800 dark:bg-amber-950/20">
          <div className="text-2xl font-semibold text-amber-700 dark:text-amber-400">{pending}</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">Pending approval</div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
          Loading…
        </div>
      )}

      {!isLoading && slides.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <Layers size={24} className="mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No reference slides tracked yet. Slides appear here once submitted through the
            content workflow.
          </p>
        </div>
      )}

      {!isLoading && slides.length > 0 && (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Slide ID</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground w-32">Status</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground w-36">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {slides.map((s) => (
                <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-[12px] text-foreground/80">{s.entityId}</td>
                  <td className="px-4 py-2.5">
                    <span className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                      s.status === "published"
                        ? "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/30"
                        : s.status === "submitted" || s.status === "in-review"
                          ? "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40"
                          : "text-muted-foreground bg-muted"
                    )}>
                      {s.status === "published" ? <Check size={10} /> : <Clock size={10} />}
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-muted-foreground">
                    {new Date(s.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })}
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
