"use client";

import { useState } from "react";
import { Star, ExternalLink, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { CREDENTIALS } from "@/data/credentials";
import { PRODUCTS, INDUSTRIES } from "@/data/solutions";
import type { PackItem } from "@/types/credentials";

const CONF_STYLES: Record<string, string> = {
  public: "text-green-600 bg-green-500/10 border-green-500/20",
  internal: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20",
  "anonymized-client-example": "text-blue-600 bg-blue-500/10 border-blue-500/20",
  restricted: "text-red-600 bg-red-500/10 border-red-500/20",
};
const CONF_LABELS: Record<string, string> = {
  public: "Public",
  internal: "Internal",
  "anonymized-client-example": "Anonymized",
  restricted: "Restricted",
};

interface Props {
  item: PackItem;
  onRemove: () => void;
  onUpdateNote: (note: string) => void;
  onTogglePriority: () => void;
}

export function CredentialBuilderItem({ item, onRemove, onUpdateNote, onTogglePriority }: Props) {
  const cred = CREDENTIALS.find((c) => c.id === item.id);
  const [noteOpen, setNoteOpen] = useState(!!item.note);

  if (!cred) return null;

  const product = PRODUCTS.find((p) => p.id === cred.productIds[0]);
  const industry = INDUSTRIES.find((i) => i.id === cred.industryIds[0]);
  const confStyle = CONF_STYLES[cred.confidentiality] ?? "";
  const confLabel = CONF_LABELS[cred.confidentiality] ?? cred.confidentiality;

  return (
    <div className={cn(
      "rounded-lg border bg-card p-4 transition-colors",
      item.priority ? "border-[#CC0000]/40 bg-[#CC0000]/[0.02]" : "border-border"
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[#CC0000]">Credential</span>
            <span className={cn("rounded border px-1.5 py-0.5 text-[10px] font-medium", confStyle)}>
              {confLabel}
            </span>
            {cred.confidentiality === "restricted" && (
              <span className="text-[10px] text-red-500 font-medium">— export blocked</span>
            )}
          </div>
          <p className="text-sm font-semibold text-foreground leading-snug">{cred.title}</p>
          {cred.clientAlias && (
            <p className="text-xs text-muted-foreground mt-0.5">{cred.clientAlias}</p>
          )}
          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{cred.summary}</p>

          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {product && <span className="rounded bg-secondary px-1.5 py-0.5 text-foreground/70">{product.label}</span>}
            {industry && <span className="rounded bg-secondary px-1.5 py-0.5 text-foreground/70">{industry.label}</span>}
            {cred.year && <span>{cred.year}</span>}
          </div>

          {cred.results.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-3">
              {cred.results.slice(0, 3).map((r) => (
                <div key={r.label} className="text-xs">
                  <span className="font-semibold text-foreground">{r.displayValue ?? r.value}</span>
                  <span className="ml-1 text-muted-foreground">{r.label}</span>
                </div>
              ))}
            </div>
          )}

          {cred.sourceSlides.length > 0 && (
            <p className="mt-1.5 text-[10px] text-muted-foreground/70">
              Slides: {cred.sourceSlides.join(", ")}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <button
            onClick={onTogglePriority}
            aria-label={item.priority ? "Remove priority" : "Mark as priority"}
            aria-pressed={item.priority}
            className={cn(
              "rounded p-1 transition-colors",
              item.priority ? "text-[#CC0000]" : "text-muted-foreground hover:text-[#CC0000]"
            )}
          >
            <Star className={cn("h-4 w-4", item.priority && "fill-current")} />
          </button>
          <button
            onClick={onRemove}
            aria-label="Remove from pack"
            className="rounded p-1 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Note */}
      <div className="mt-2 border-t border-border pt-2">
        <button
          onClick={() => setNoteOpen((o) => !o)}
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          aria-expanded={noteOpen}
        >
          {noteOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {item.note ? "Edit note" : "Add note"}
        </button>
        {noteOpen && (
          <textarea
            value={item.note ?? ""}
            onChange={(e) => onUpdateNote(e.target.value)}
            placeholder="Add a note about this credential..."
            rows={2}
            className="mt-1.5 w-full resize-none rounded border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-[#CC0000]/40"
          />
        )}
      </div>
    </div>
  );
}
