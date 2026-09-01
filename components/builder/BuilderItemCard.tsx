"use client";

import { GripVertical, ChevronUp, ChevronDown, ArrowRightLeft } from "lucide-react";
import type { PackItem, PackSection } from "@/types/credentials";
import { CredentialBuilderItem } from "./CredentialBuilderItem";
import { ExpertBuilderItem } from "./ExpertBuilderItem";
import { PartnerBuilderItem } from "./PartnerBuilderItem";
import { PublicationBuilderItem } from "./PublicationBuilderItem";
import { ChartBuilderItem } from "./ChartBuilderItem";

interface BuilderItemCardProps {
  item: PackItem;
  index: number;
  total: number;
  sections: PackSection[];
  onRemove: () => void;
  onUpdateNote: (note: string) => void;
  onTogglePriority: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveToSection: (sectionId: string) => void;
}

export function BuilderItemCard({
  item,
  index,
  total,
  sections,
  onRemove,
  onUpdateNote,
  onTogglePriority,
  onMoveUp,
  onMoveDown,
  onMoveToSection,
}: BuilderItemCardProps) {
  const currentSectionId = item.section ?? item.itemType;
  const otherSections = sections.filter((s) => s.id !== currentSectionId);

  return (
    <div className="group relative flex gap-2">
      {/* Drag handle + keyboard move controls */}
      <div className="flex shrink-0 flex-col items-center gap-0.5 pt-4">
        <div
          className="cursor-grab rounded p-0.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          aria-hidden="true"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          aria-label="Move item up"
          className="rounded p-0.5 text-muted-foreground/40 hover:text-muted-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === total - 1}
          aria-label="Move item down"
          className="rounded p-0.5 text-muted-foreground/40 hover:text-muted-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex-1 min-w-0">
        {item.itemType === "credential" && (
          <CredentialBuilderItem
            item={item}
            onRemove={onRemove}
            onUpdateNote={onUpdateNote}
            onTogglePriority={onTogglePriority}
          />
        )}
        {item.itemType === "expert" && (
          <ExpertBuilderItem item={item} onRemove={onRemove} onUpdateNote={onUpdateNote} />
        )}
        {item.itemType === "partner" && (
          <PartnerBuilderItem item={item} onRemove={onRemove} onUpdateNote={onUpdateNote} />
        )}
        {item.itemType === "publication" && (
          <PublicationBuilderItem item={item} onRemove={onRemove} onUpdateNote={onUpdateNote} />
        )}
        {item.itemType === "chart" && (
          <ChartBuilderItem item={item} onRemove={onRemove} onUpdateNote={onUpdateNote} />
        )}

        {/* Move to section */}
        {otherSections.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5 px-1">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
              <ArrowRightLeft className="h-3 w-3" /> Move to:
            </span>
            {otherSections.map((s) => (
              <button
                key={s.id}
                onClick={() => onMoveToSection(s.id)}
                className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
