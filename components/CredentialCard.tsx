"use client";

import { Plus, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Credential } from "@/types/credentials";
import { PRODUCTS, INDUSTRIES, REGIONS } from "@/data/solutions";
import { ConfidentialityBadge } from "./ConfidentialityBadge";
import { usePackContext } from "@/lib/pack-context";

function lookup(arr: { id: string; label: string }[], id: string) {
  return arr.find((a) => a.id === id)?.label ?? id;
}

interface CredentialCardProps {
  credential: Credential;
  onViewDetails: (credential: Credential) => void;
  compact?: boolean;
}

export function CredentialCard({
  credential,
  onViewDetails,
  compact = false,
}: CredentialCardProps) {
  const { addItem, removeItem, hasItem } = usePackContext();
  const inPack = hasItem(credential.id);

  const primaryProduct = credential.productIds[0]
    ? lookup(PRODUCTS, credential.productIds[0])
    : null;
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

  if (compact) {
    return (
      <div className="flex items-start gap-3 border-b border-border px-4 py-3 hover:bg-secondary/50">
        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-[13px] font-semibold text-foreground">
              {credential.title}
            </span>
            <ConfidentialityBadge value={credential.confidentiality} />
          </div>
          {credential.clientAlias && (
            <span className="text-[11px] text-muted-foreground">
              {credential.clientAlias}
            </span>
          )}
          <div className="flex flex-wrap gap-1 pt-1">
            {primaryProduct && (
              <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {primaryProduct}
              </span>
            )}
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
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handlePackToggle}
            className={cn(
              "rounded border p-1 text-[12px] transition-colors",
              inPack
                ? "border-[#CC0000] bg-[#CC0000] text-white"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            )}
            aria-label={inPack ? "Remove from pack" : "Add to pack"}
          >
            {inPack ? <Check size={12} /> : <Plus size={12} />}
          </button>
          <button
            onClick={() => onViewDetails(credential)}
            className="rounded border border-border p-1 text-muted-foreground hover:border-foreground hover:text-foreground"
            aria-label="View credential details"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="flex flex-col border border-border bg-background p-4 transition-shadow hover:shadow-sm">
      {/* Header */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-[14px] font-semibold leading-snug text-foreground">
            {credential.title}
          </h3>
          {credential.clientAlias && (
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              {credential.clientAlias}
            </p>
          )}
        </div>
        <ConfidentialityBadge value={credential.confidentiality} />
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
            className="rounded bg-foreground/5 px-1.5 py-0.5 text-[10px] font-medium text-foreground"
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
              <div className="text-[16px] font-bold text-foreground">
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
          className="flex-1 rounded border border-border py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-secondary"
        >
          View details
        </button>
        <button
          onClick={handlePackToggle}
          className={cn(
            "flex items-center gap-1 rounded border px-2.5 py-1.5 text-[12px] font-medium transition-colors",
            inPack
              ? "border-[#CC0000] bg-[#CC0000] text-white"
              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
          )}
          aria-label={inPack ? "Remove from pack" : "Add to pack"}
        >
          {inPack ? (
            <>
              <Check size={12} /> Added
            </>
          ) : (
            <>
              <Plus size={12} /> Add to pack
            </>
          )}
        </button>
      </div>
    </article>
  );
}
