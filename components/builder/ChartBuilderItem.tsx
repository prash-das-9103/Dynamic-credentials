"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronUp, BarChart2 } from "lucide-react";
import type { PackItem } from "@/types/credentials";

interface Props {
  item: PackItem;
  onRemove: () => void;
  onUpdateNote: (note: string) => void;
}

export function ChartBuilderItem({ item, onRemove, onUpdateNote }: Props) {
  const [noteOpen, setNoteOpen] = useState(!!item.note);

  // Chart items carry their metadata in title/subtitle set at add-time
  const addedDate = new Date(item.addedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-foreground/50">Chart</span>
          <div className="mt-1 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-border bg-secondary">
              <BarChart2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground leading-snug">{item.title}</p>
              {item.subtitle && (
                <p className="mt-0.5 text-xs text-muted-foreground">{item.subtitle}</p>
              )}
            </div>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground/60">Added {addedDate}</p>
        </div>
        <button onClick={onRemove} aria-label="Remove from pack" className="rounded p-1 text-muted-foreground hover:text-red-500 transition-colors shrink-0">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2 border-t border-border pt-2">
        <button onClick={() => setNoteOpen((o) => !o)} className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors" aria-expanded={noteOpen}>
          {noteOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {item.note ? "Edit note" : "Add note"}
        </button>
        {noteOpen && (
          <textarea value={item.note ?? ""} onChange={(e) => onUpdateNote(e.target.value)} placeholder="Add a note about this chart..." rows={2} className="mt-1.5 w-full resize-none rounded border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-[#CC0000]/40" />
        )}
      </div>
    </div>
  );
}
