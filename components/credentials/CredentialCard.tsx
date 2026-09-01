"use client";

import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Credential } from "@/types/credentials";
import { PRODUCTS, INDUSTRIES, REGIONS } from "@/data/solutions";
import { usePackContext } from "@/lib/pack-context";

function lookup(arr: { id: string; label: string }[], id: string) {
  return arr.find((a) => a.id === id)?.label ?? id;
}

interface CredentialCardProps {
  credential: Credential;
  onViewDetails: (credential: Credential) => void;
}

export function CredentialCard({ credential, onViewDetails }: CredentialCardProps) {
  const { addItem, removeItem, hasItem } = usePackContext();
  const inPack = hasItem(credential.id);

  const primaryIndustry = credential.industryIds[0]
    ? lookup(INDUSTRIES, credential.industryIds[0])
    : null;
  const primaryRegion = credential.regionIds[0]
    ? lookup(REGIONS, credential.regionIds[0])
    : null;

  function handlePackToggle(e: React.MouseEvent) {
    e.stopPropagation();
    if (inPack) {
      removeItem(credential.id);
    } else {
      addItem({
        id: credential.id,
        itemType: "credential",
        title: credential.title,
        subtitle: credential.clientAlias,
        exportRestricted: credential.confidentiality === "restricted",
        section: "relevant-credentials",
      });
    }
  }

  return (
    <article className="flex flex-col border border-border bg-background p-4 transition-shadow hover:shadow-sm rounded-sm">
      {/* Header */}
      <div className="mb-2">
        <button
          onClick={() => onViewDetails(credential)}
          className="text-left text-[14px] font-semibold leading-snug text-foreground hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground rounded-sm"
        >
          {credential.title}
        </button>
        {credential.clientAlias && (
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            {credential.clientAlias}
          </p>
        )}
      </div>

      {/* Summary */}
      <p className="mb-3 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
        {credential.summary}
      </p>

      {/* Taxonomy tags */}
      <div className="mb-3 flex flex-wrap gap-1">
        {credential.productIds.map((pid) => (
          <span
            key={pid}
            className="rounded bg-foreground/8 px-1.5 py-0.5 text-[10px] font-medium text-foreground"
          >
            {lookup(PRODUCTS, pid)}
          </span>
        ))}
        {primaryIndustry && (
          <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
            {primaryIndustry}
          </span>
        )}
        {primaryRegion && (
          <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
            {primaryRegion}
          </span>
        )}
      </div>

      {/* Results */}
      {credential.results.length > 0 && (
        <div className="mb-3 grid grid-cols-2 gap-2 rounded bg-secondary p-2">
          {credential.results.slice(0, 2).map((r, i) => (
            <div key={i}>
              <div className="text-[16px] font-bold text-foreground tabular-nums">
                {r.displayValue ?? r.value}
              </div>
              <div className="text-[10px] text-muted-foreground">{r.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Source */}
      {credential.sourceSlides.length > 0 && (
        <p className="mb-3 text-[10px] text-muted-foreground">
          Source: Sustainability Credentials, slide
          {credential.sourceSlides.length > 1 ? "s" : ""}{" "}
          {credential.sourceSlides.join(" and ")}
        </p>
      )}

      {/* Actions */}
      <div className="mt-auto flex gap-2 pt-1">
        <button
          onClick={() => onViewDetails(credential)}
          className="flex-1 rounded border border-border py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
        >
          View details
        </button>
        <button
          onClick={handlePackToggle}
          className={cn(
            "flex items-center gap-1 rounded border px-2.5 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground",
            inPack
              ? "border-[#CC0000] bg-[#CC0000] text-white"
              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
          )}
          aria-label={inPack ? "Remove from pack" : "Add to pack"}
        >
          {inPack ? (
            <>
              <Check size={12} aria-hidden="true" /> Added
            </>
          ) : (
            <>
              <Plus size={12} aria-hidden="true" /> Add to pack
            </>
          )}
        </button>
      </div>
    </article>
  );
}
