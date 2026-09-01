"use client";

import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PackState } from "@/types/credentials";
import { computeConfidentialityCounts } from "@/lib/pack-validation";

interface ConfidentialityReviewProps {
  pack: PackState;
}

const CONF_ROWS = [
  { key: "public" as const, label: "Public", color: "text-green-600" },
  { key: "internal" as const, label: "Internal", color: "text-yellow-600" },
  { key: "anonymized" as const, label: "Anonymized", color: "text-blue-600" },
  { key: "restricted" as const, label: "Restricted", color: "text-red-600" },
];

export function ConfidentialityReview({ pack }: ConfidentialityReviewProps) {
  const counts = computeConfidentialityCounts(pack);
  const hasRestricted = counts.restricted > 0;
  const hasAnon = counts.anonymized > 0;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        {hasRestricted ? (
          <ShieldAlert className="h-4 w-4 text-red-500" />
        ) : (
          <ShieldCheck className="h-4 w-4 text-green-500" />
        )}
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Confidentiality Review
        </h2>
      </div>

      {pack.items.length === 0 ? (
        <p className="text-xs text-muted-foreground/60 italic">No items in pack.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {CONF_ROWS.map(({ key, label, color }) => (
              <div key={key} className="rounded bg-secondary/50 border border-border px-3 py-2">
                <p className={cn("text-base font-bold tabular-nums", color)}>
                  {counts[key]}
                </p>
                <p className="text-[11px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
            {hasAnon && (
              <div className="flex items-start gap-1.5 rounded bg-blue-500/5 border border-blue-500/20 px-2.5 py-2">
                <AlertTriangle className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
                <span>Client identities must remain anonymized.</span>
              </div>
            )}
            {hasRestricted && (
              <div className="flex items-start gap-1.5 rounded bg-red-500/5 border border-red-500/30 px-2.5 py-2">
                <ShieldAlert className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
                <span>Restricted items prevent this pack from becoming export-ready.</span>
              </div>
            )}
          </div>

          {/* Export-blocked banner */}
          {hasRestricted && (
            <div className="mt-3 flex items-center gap-2 rounded bg-red-600 px-3 py-2">
              <AlertTriangle className="h-4 w-4 text-white shrink-0" />
              <span className="text-xs font-semibold text-white">Export blocked — remove restricted items to proceed.</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
