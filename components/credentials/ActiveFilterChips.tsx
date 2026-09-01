"use client";

import { X } from "lucide-react";

export interface FilterChip {
  key: string;
  label: string;
  onRemove: () => void;
}

interface ActiveFilterChipsProps {
  chips: FilterChip[];
  onClearAll: () => void;
}

export function ActiveFilterChips({ chips, onClearAll }: ActiveFilterChipsProps) {
  if (chips.length === 0) return null;
  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="flex items-center gap-1 rounded border border-border bg-secondary pl-2 pr-1 py-0.5 text-[11px] text-foreground"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            className="rounded p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
            aria-label={`Remove ${chip.label} filter`}
          >
            <X size={10} />
          </button>
        </span>
      ))}
      {chips.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-[11px] font-medium text-[#CC0000] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CC0000] rounded"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
