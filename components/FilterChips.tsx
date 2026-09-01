"use client";

import { X } from "lucide-react";

interface Chip {
  label: string;
  onRemove: () => void;
}

interface FilterChipsProps {
  chips: Chip[];
  onClearAll?: () => void;
}

export function FilterChips({ chips, onClearAll }: FilterChipsProps) {
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {chips.map((chip, i) => (
        <span
          key={i}
          className="flex items-center gap-1 rounded border border-border bg-secondary px-2 py-0.5 text-[12px] text-foreground"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            className="rounded-sm text-muted-foreground hover:text-foreground"
            aria-label={`Remove filter: ${chip.label}`}
          >
            <X size={11} />
          </button>
        </span>
      ))}
      {onClearAll && (
        <button
          onClick={onClearAll}
          className="text-[12px] font-medium text-[#CC0000] hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
