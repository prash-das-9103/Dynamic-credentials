"use client";

import type { Partner } from "@/types/credentials";

interface Props {
  alliances: Partner[];
  onViewProfile: (p: Partner) => void;
}

/**
 * Compact strip for Bain's standing alliances (CDP, WBCSD, WEF, IACPM,
 * The Sustainable Flight Challenge) — distinct from the partnerships /
 * data-vendor / rating-provider ecosystem groups below it.
 */
export function AllianceStrip({ alliances, onViewProfile }: Props) {
  if (alliances.length === 0) return null;

  return (
    <div className="mb-6 rounded border border-border bg-secondary/40 p-3">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Bain Strategic Alliances
      </p>
      <div className="flex flex-wrap gap-2">
        {alliances.map((partner) => (
          <button
            key={partner.id}
            onClick={() => onViewProfile(partner)}
            className="rounded border border-border bg-card px-2.5 py-1 text-[12px] font-medium text-foreground hover:border-foreground/30 hover:bg-card/80 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
          >
            {partner.name}
          </button>
        ))}
      </div>
    </div>
  );
}
