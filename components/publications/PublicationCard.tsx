"use client";

import { BookOpen, Plus, Check, ExternalLink, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCTS, INDUSTRIES } from "@/data/solutions";
import { PARTNERS } from "@/data/partners";
import { usePackContext } from "@/lib/pack-context";
import type { Publication } from "@/types/credentials";

interface Props {
  publication: Publication;
  onViewDetails: (pub: Publication) => void;
}

function lookup(arr: { id: string; label: string }[], id: string) {
  return arr.find((a) => a.id === id)?.label ?? id;
}

export function PublicationCard({ publication: pub, onViewDetails }: Props) {
  const { addItem, removeItem, hasItem } = usePackContext();
  const inPack = hasItem(pub.id);

  const partners = PARTNERS.filter((p) => pub.partnerIds.includes(p.id));

  function togglePack() {
    if (inPack) {
      removeItem(pub.id);
    } else {
      addItem({
        id: pub.id,
        itemType: "publication",
        title: pub.title,
        subtitle: pub.publicationType,
        exportRestricted: false,
        section: "thought-leadership",
      });
    }
  }

  return (
    <article className="flex flex-col gap-3 rounded border border-border bg-background p-4 transition-colors hover:border-foreground/30">
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border bg-secondary"
          aria-hidden="true"
        >
          <BookOpen size={14} className="text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-semibold leading-snug text-foreground">
            {pub.url ? (
              <a
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#CC0000] hover:underline transition-colors"
              >
                {pub.title}
              </a>
            ) : (
              pub.title
            )}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {pub.publicationType}
            </span>
            {pub.year && (
              <span className="text-[11px] tabular-nums text-muted-foreground">{pub.year}</span>
            )}
            {pub.authors.length > 0 && (
              <span className="text-[11px] text-muted-foreground truncate">
                {pub.authors.join(", ")}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={togglePack}
          className={cn(
            "flex shrink-0 items-center gap-1 rounded border px-2 py-1 text-[11px] font-medium transition-colors",
            inPack
              ? "border-[#CC0000] bg-[#CC0000] text-white"
              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
          )}
          aria-label={inPack ? `Remove "${pub.title}" from pack` : `Add "${pub.title}" to pack`}
          aria-pressed={inPack}
        >
          {inPack ? <Check size={10} /> : <Plus size={10} />}
          {inPack ? "Added" : "Add to pack"}
        </button>
      </div>

      {/* Abstract */}
      <p className="text-[12px] leading-relaxed text-muted-foreground line-clamp-2">
        {pub.abstract}
      </p>

      {/* Products */}
      {pub.productIds.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {pub.productIds.map((id) => (
            <span
              key={id}
              className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {lookup(PRODUCTS, id)}
            </span>
          ))}
        </div>
      )}

      {/* Industries */}
      {pub.industryIds.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {pub.industryIds.map((id) => (
            <span
              key={id}
              className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {lookup(INDUSTRIES, id)}
            </span>
          ))}
        </div>
      )}

      {/* Keywords */}
      {pub.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {pub.keywords.slice(0, 5).map((kw) => (
            <span
              key={kw}
              className="rounded bg-secondary/60 px-1.5 py-0.5 text-[10px] italic text-muted-foreground"
            >
              {kw}
            </span>
          ))}
          {pub.keywords.length > 5 && (
            <span className="text-[10px] text-muted-foreground">+{pub.keywords.length - 5}</span>
          )}
        </div>
      )}

      {/* Related partner */}
      {partners.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {partners.map((p) => (
            <span
              key={p.id}
              className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {p.name}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border pt-2 mt-0.5">
        <button
          onClick={() => onViewDetails(pub)}
          className="flex items-center gap-1 text-[11px] font-medium text-foreground hover:text-[#CC0000] transition-colors"
          aria-label={`View details for ${pub.title}`}
        >
          View details
          <ChevronRight size={11} />
        </button>
        {pub.url ? (
          <a
            href={pub.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-medium text-foreground hover:text-[#CC0000] transition-colors"
            aria-label={`Open "${pub.title}" — original article in a new tab`}
          >
            <ExternalLink size={11} />
            Open publication
          </a>
        ) : (
          <button
            disabled
            title="Link not included in the prototype dataset."
            className="flex items-center gap-1 text-[11px] text-muted-foreground opacity-40 cursor-not-allowed"
            aria-label="Open publication — link not available in prototype"
            aria-disabled="true"
          >
            <ExternalLink size={11} />
            Open publication
          </button>
        )}
      </div>
    </article>
  );
}
