"use client";

import { Plus, Check, ExternalLink, Award } from "lucide-react";
import type { Expert } from "@/types/credentials";
import { PRODUCTS, INDUSTRIES, REGIONS } from "@/data/solutions";
import { CENTERS_OF_EXCELLENCE } from "@/data/centers-of-excellence";
import { usePackContext } from "@/lib/pack-context";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  expert: Expert;
  credentialCount: number;
  onViewProfile: (expert: Expert) => void;
}

function lookup(arr: { id: string; label: string }[], id: string) {
  return arr.find((a) => a.id === id)?.label ?? id;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ExpertCard({ expert, credentialCount, onViewProfile }: Props) {
  const { addItem, removeItem, hasItem } = usePackContext();
  const inPack = hasItem(expert.id);

  function togglePack() {
    if (inPack) {
      removeItem(expert.id);
    } else {
      addItem({
        id: expert.id,
        itemType: "expert",
        title: expert.name,
        subtitle: expert.title,
        exportRestricted: false,
        section: "experts",
      });
    }
  }

  const visibleExpertise = expert.expertise.slice(0, 4);
  const primaryProduct = expert.productIds[0] ? lookup(PRODUCTS, expert.productIds[0]) : null;
  const primaryIndustries = expert.industryIds.slice(0, 2).map((id) => lookup(INDUSTRIES, id));
  const primaryRegion = expert.regionIds[0] ? lookup(REGIONS, expert.regionIds[0]) : null;

  // Primary leadership role (first in array)
  const primaryRole = expert.leadership[0] ?? null;

  // CoE memberships (names, up to 2)
  const coeNames = expert.centerOfExcellenceIds
    .map((id) => CENTERS_OF_EXCELLENCE.find((c) => c.id === id)?.name ?? id)
    .slice(0, 2);

  return (
    <article className="flex flex-col rounded border border-border bg-card text-card-foreground overflow-hidden hover:border-foreground/30 transition-colors">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 pb-3">
        {/* Avatar */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-[13px] font-bold text-background"
          aria-hidden="true"
        >
          {getInitials(expert.name)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[14px] font-semibold text-foreground leading-tight truncate">
            {expert.name}
          </h3>
          <p className="text-[12px] text-muted-foreground leading-tight truncate">{expert.title}</p>
          {expert.role && (
            <p className="text-[11px] text-muted-foreground leading-tight truncate mt-0.5">{expert.role}</p>
          )}
          {primaryRole && (
            <p className="text-[11px] text-[#CC0000] leading-tight truncate mt-0.5 font-medium">
              {primaryRole.label}
            </p>
          )}
        </div>
      </div>

      {/* Bio excerpt */}
      <div className="px-4 pb-3">
        <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">
          {expert.bio}
        </p>
      </div>

      {/* Expertise tags */}
      {visibleExpertise.length > 0 && (
        <div className="flex flex-wrap gap-1 px-4 pb-3">
          {visibleExpertise.map((tag) => (
            <span
              key={tag}
              className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {expert.expertise.length > 4 && (
            <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
              +{expert.expertise.length - 4}
            </span>
          )}
        </div>
      )}

      {/* CoE badges */}
      {coeNames.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-4 pb-3">
          <Award size={11} className="text-muted-foreground shrink-0" aria-hidden="true" />
          {coeNames.map((name) => (
            <span
              key={name}
              className="rounded border border-border/60 bg-secondary/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
              title="Centre of Excellence"
            >
              {name}
            </span>
          ))}
          {expert.centerOfExcellenceIds.length > 2 && (
            <span className="text-[10px] text-muted-foreground">
              +{expert.centerOfExcellenceIds.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Meta row */}
      <div className="border-t border-border px-4 py-2.5 flex flex-wrap gap-x-3 gap-y-1">
        {primaryProduct && (
          <span className="text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground/70">Product:</span> {primaryProduct}
          </span>
        )}
        {primaryIndustries.length > 0 && (
          <span className="text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground/70">Industry:</span>{" "}
            {primaryIndustries.join(", ")}
          </span>
        )}
        {primaryRegion && (
          <span className="text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground/70">Region:</span> {primaryRegion}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-border px-4 py-2.5">
        <button
          onClick={() => onViewProfile(expert)}
          className="flex-1 rounded border border-border px-2 py-1.5 text-[12px] font-medium text-foreground hover:bg-secondary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
        >
          View profile
        </button>
        <Link
          href={`/credentials?expert=${expert.id}`}
          className="flex items-center gap-1 rounded border border-border px-2 py-1.5 text-[12px] font-medium text-foreground hover:bg-secondary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
          aria-label={`View credentials for ${expert.name}`}
        >
          <ExternalLink size={11} aria-hidden="true" />
          Credentials
        </Link>
        <button
          onClick={togglePack}
          className={cn(
            "flex items-center gap-1 rounded px-2 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground",
            inPack
              ? "bg-[#CC0000] text-white hover:opacity-85"
              : "border border-border text-foreground hover:bg-secondary"
          )}
          aria-pressed={inPack}
          aria-label={inPack ? `Remove ${expert.name} from pack` : `Add ${expert.name} to pack`}
        >
          {inPack ? <Check size={12} aria-hidden="true" /> : <Plus size={12} aria-hidden="true" />}
          {inPack ? "Added" : "Add"}
        </button>
      </div>
    </article>
  );
}
