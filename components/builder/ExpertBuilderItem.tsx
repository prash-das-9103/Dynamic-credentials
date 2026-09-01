"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { EXPERTS } from "@/data/experts";
import type { PackItem } from "@/types/credentials";

interface Props {
  item: PackItem;
  onRemove: () => void;
  onUpdateNote: (note: string) => void;
}

export function ExpertBuilderItem({ item, onRemove, onUpdateNote }: Props) {
  const expert = EXPERTS.find((e) => e.id === item.id);
  const [noteOpen, setNoteOpen] = useState(!!item.note);
  if (!expert) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-foreground/50">Expert</span>
          <p className="mt-0.5 text-sm font-semibold text-foreground">{expert.name}</p>
          <p className="text-xs text-muted-foreground">{expert.title}</p>
          {expert.role && <p className="text-xs text-muted-foreground/70 mt-0.5">{expert.role}</p>}
          <div className="mt-2 flex flex-wrap gap-1">
            {expert.expertise.slice(0, 4).map((e) => (
              <span key={e} className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-foreground/70">
                {e}
              </span>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            {expert.credentialIds.length} related credential{expert.credentialIds.length !== 1 ? "s" : ""}
          </p>
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
          <textarea value={item.note ?? ""} onChange={(e) => onUpdateNote(e.target.value)} placeholder="Add a note..." rows={2} className="mt-1.5 w-full resize-none rounded border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-[#CC0000]/40" />
        )}
      </div>
    </div>
  );
}
