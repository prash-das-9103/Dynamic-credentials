"use client";

import { Check, Plus, ChevronRight, FileText, BookOpen, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@/data/solutions";
import { PartnerUseCases } from "./PartnerUseCases";
import { usePackContext } from "@/lib/pack-context";
import { useRouter } from "next/navigation";
import type { Partner } from "@/types/credentials";

interface Props {
  partner: Partner;
  onViewProfile: (p: Partner) => void;
}

function lookup(arr: { id: string; label: string }[], id: string) {
  return arr.find((a) => a.id === id)?.label ?? id;
}

export function PartnerCard({ partner, onViewProfile }: Props) {
  const router = useRouter();
  const { addItem, removeItem, hasItem } = usePackContext();
  const inPack = hasItem(partner.id);

  function handlePackToggle(e: React.MouseEvent) {
    e.stopPropagation();
    if (inPack) {
      removeItem(partner.id);
    } else {
      addItem({
        id: partner.id,
        itemType: "partner",
        title: partner.name,
        subtitle: partner.category,
        exportRestricted: false,
        section: "ecosystem",
      });
    }
  }

  return (
    <article className="flex flex-col rounded border border-border bg-card p-4 hover:border-foreground/30 transition-colors">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[14px] font-semibold text-foreground leading-snug">{partner.name}</h3>
          <button
            onClick={handlePackToggle}
            aria-label={inPack ? `Remove ${partner.name} from pack` : `Add ${partner.name} to pack`}
            className={cn(
              "shrink-0 rounded border p-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground",
              inPack
                ? "border-[#CC0000] bg-[#CC0000] text-white"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            )}
          >
            {inPack ? <Check size={12} aria-hidden="true" /> : <Plus size={12} aria-hidden="true" />}
          </button>
        </div>
        <span className="mt-0.5 inline-block text-[11px] text-muted-foreground">{partner.category}</span>
      </div>

      {/* Description */}
      <p className="mb-3 text-[12px] text-muted-foreground leading-relaxed line-clamp-3">
        {partner.description}
      </p>

      {/* Products */}
      <div className="mb-3 flex flex-wrap gap-1">
        {partner.productIds.map((id) => (
          <span
            key={id}
            className="inline-block rounded bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground leading-none"
          >
            {lookup(PRODUCTS, id)}
          </span>
        ))}
      </div>

      {/* Use cases */}
      {partner.useCases.length > 0 && (
        <div className="mb-4">
          <PartnerUseCases useCases={partner.useCases} maxVisible={4} />
        </div>
      )}

      {/* Bain lead / who to contact */}
      {(partner.bainLead || partner.whoToContact) && (
        <div className="mb-4 space-y-1 text-[11px] text-muted-foreground">
          {partner.bainLead && (
            <p>
              <span className="font-medium text-foreground">Bain lead:</span> {partner.bainLead}
            </p>
          )}
          {partner.whoToContact && (
            <p>
              <span className="font-medium text-foreground">Who to contact:</span> {partner.whoToContact}
            </p>
          )}
        </div>
      )}

      {/* Footer counts + actions */}
      <div className="mt-auto space-y-2.5">
        {/* Counts */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          {partner.credentialIds.length > 0 && (
            <span className="flex items-center gap-1">
              <FileText size={11} aria-hidden="true" />
              {partner.credentialIds.length} credential{partner.credentialIds.length !== 1 ? "s" : ""}
            </span>
          )}
          {partner.publicationIds.length > 0 && (
            <span className="flex items-center gap-1">
              <BookOpen size={11} aria-hidden="true" />
              {partner.publicationIds.length} publication{partner.publicationIds.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewProfile(partner)}
            className="flex items-center gap-1 rounded border border-border px-2.5 py-1.5 text-[12px] font-medium text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground transition-colors"
          >
            View profile
            <ChevronRight size={12} aria-hidden="true" />
          </button>
          {partner.credentialIds.length > 0 && (
            <button
              onClick={() => router.push(`/credentials?partner=${partner.id}`)}
              className="rounded border border-border px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground transition-colors"
            >
              View credentials
            </button>
          )}
          {partner.irisUrl && (
            <a
              href={partner.irisUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 rounded border border-border px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground transition-colors"
              aria-label={`More details on ${partner.name} — IRIS partnership page (opens in a new tab)`}
            >
              More details
              <ExternalLink size={11} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
