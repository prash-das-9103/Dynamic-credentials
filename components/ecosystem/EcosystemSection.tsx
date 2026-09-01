"use client";

import type { Partner } from "@/types/credentials";
import { PartnerCard } from "./PartnerCard";

interface Props {
  title: string;
  description?: string;
  partners: Partner[];
  onViewProfile: (p: Partner) => void;
}

export function EcosystemSection({ title, description, partners, onViewProfile }: Props) {
  if (partners.length === 0) return null;

  return (
    <section aria-labelledby={`eco-section-${title}`} className="mb-8 last:mb-0">
      <div className="mb-3 flex items-baseline justify-between gap-2 border-b border-border pb-2">
        <div>
          <h2 id={`eco-section-${title}`} className="text-[15px] font-semibold text-foreground">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-[12px] text-muted-foreground leading-snug">{description}</p>
          )}
        </div>
        <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
          {partners.length} {partners.length === 1 ? "entry" : "entries"}
        </span>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {partners.map((partner) => (
          <PartnerCard key={partner.id} partner={partner} onViewProfile={onViewProfile} />
        ))}
      </div>
    </section>
  );
}
