"use client";

import { BookOpen } from "lucide-react";

interface Props {
  onClearFilters: () => void;
  onViewAll: () => void;
}

export function PublicationsEmptyState({ onClearFilters, onViewAll }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary">
        <BookOpen size={20} className="text-muted-foreground" />
      </div>
      <div>
        <p className="text-[14px] font-medium text-foreground">
          No publications match the current search and filters.
        </p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Try adjusting your filters or search terms.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onClearFilters}
          className="rounded border border-border px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-secondary"
        >
          Clear filters
        </button>
        <button
          onClick={onViewAll}
          className="rounded border border-[#CC0000] bg-[#CC0000] px-3 py-1.5 text-[12px] font-medium text-white hover:opacity-85"
        >
          View all publications
        </button>
      </div>
    </div>
  );
}
