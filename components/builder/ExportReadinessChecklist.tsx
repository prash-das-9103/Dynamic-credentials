"use client";

import { Check, X, AlertTriangle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PackState } from "@/types/credentials";
import { computeChecklist, computeExportStatus } from "@/lib/pack-validation";
import type { ExportStatus } from "@/lib/pack-validation";

const STATUS_CONFIG: Record<ExportStatus, { label: string; color: string; bg: string; border: string }> = {
  draft: {
    label: "Draft",
    color: "text-muted-foreground",
    bg: "bg-secondary",
    border: "border-border",
  },
  "needs-review": {
    label: "Needs review",
    color: "text-yellow-600",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
  },
  "export-blocked": {
    label: "Export blocked",
    color: "text-red-600",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
  ready: {
    label: "Ready for future export",
    color: "text-green-600",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
  },
};

interface ExportReadinessChecklistProps {
  pack: PackState;
}

export function ExportReadinessChecklist({ pack }: ExportReadinessChecklistProps) {
  const checklist = computeChecklist(pack);
  const status = computeExportStatus(pack);
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Export readiness
      </h2>

      {/* Overall status badge */}
      <div className={cn("mb-4 flex items-center gap-2 rounded border px-3 py-2", cfg.bg, cfg.border)}>
        {status === "export-blocked" && <AlertTriangle className={cn("h-4 w-4 shrink-0", cfg.color)} />}
        {status === "ready" && <Check className={cn("h-4 w-4 shrink-0", cfg.color)} />}
        {(status === "draft" || status === "needs-review") && (
          <Circle className={cn("h-4 w-4 shrink-0", cfg.color)} />
        )}
        <span className={cn("text-xs font-semibold", cfg.color)}>{cfg.label}</span>
      </div>

      <ul className="flex flex-col gap-2" role="list" aria-label="Export readiness checklist">
        {checklist.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-2"
            aria-label={`${item.label}: ${item.passed ? "passed" : "not yet met"}`}
          >
            <span className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
              item.passed
                ? "border-green-500/40 bg-green-500/10 text-green-500"
                : item.blocking
                  ? "border-red-500/40 bg-red-500/10 text-red-500"
                  : "border-border bg-secondary text-muted-foreground"
            )}>
              {item.passed ? (
                <Check className="h-2.5 w-2.5" />
              ) : item.blocking ? (
                <X className="h-2.5 w-2.5" />
              ) : (
                <Circle className="h-2 w-2" />
              )}
            </span>
            <span className={cn(
              "text-xs",
              item.passed ? "text-foreground" : "text-muted-foreground"
            )}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
