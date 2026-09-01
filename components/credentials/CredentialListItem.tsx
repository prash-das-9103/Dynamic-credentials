"use client";

import { Plus, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Credential } from "@/types/credentials";
import { PRODUCTS, INDUSTRIES, REGIONS } from "@/data/solutions";
import { ConfidentialityBadge } from "@/components/ConfidentialityBadge";
import { usePackContext } from "@/lib/pack-context";

function lookup(arr: { id: string; label: string }[], id: string) {
  return arr.find((a) => a.id === id)?.label ?? id;
}

interface CredentialListItemProps {
  credential: Credential;
  onViewDetails: (credential: Credential) => void;
}

export function CredentialListItem({ credential, onViewDetails }: CredentialListItemProps) {
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

  return (
    <div className="flex items-start gap-3 border-b border-border px-4 py-3 hover:bg-secondary/50 transition-colors">
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onViewDetails(credential)}
            className="truncate text-[13px] font-semibold text-foreground hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground rounded-sm text-left"
          >
            {credential.title}
          </button>
          <ConfidentialityBadge value={credential.confidentiality} />
        </div>
        {credential.clientAlias && (
          <span className="text-[11px] text-muted-foreground">
            {credential.clientAlias}
          </span>
        )}
        <div className="flex flex-wrap gap-1 pt-1">
          {primaryProduct && (
            <span className="rounded bg-foreground/8 px-1.5 py-0.5 text-[10px] font-medium text-foreground">
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
            "rounded border p-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground",
            inPack
              ? "border-[#CC0000] bg-[#CC0000] text-white"
              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
          )}
          aria-label={inPack ? "Remove from pack" : "Add to pack"}
        >
          {inPack ? <Check size={12} aria-hidden="true" /> : <Plus size={12} aria-hidden="true" />}
        </button>
        <button
          onClick={() => onViewDetails(credential)}
          className="rounded border border-border p-1.5 text-muted-foreground hover:border-foreground hover:text-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
          aria-label={`View details for ${credential.title}`}
        >
          <ChevronRight size={12} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
