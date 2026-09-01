"use client";

import { Users } from "lucide-react";

interface Props {
  hasFilters: boolean;
  hasSearch: boolean;
  onClearFilters: () => void;
  onClearSearch: () => void;
  onClearAll: () => void;
}

export function ExpertsEmptyState({ hasFilters, hasSearch, onClearFilters, onClearSearch, onClearAll }: Props) {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-muted-foreground">
        <Users size={22} aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-[14px] font-semibold text-foreground">
          No experts match the current search and filters.
        </p>
        <p className="text-[12px] text-muted-foreground">
          Try adjusting your search or removing filters.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="rounded border border-border px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
          >
            Clear expert filters
          </button>
        )}
        {hasSearch && (
          <button
            onClick={onClearSearch}
            className="rounded border border-border px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
          >
            Clear search
          </button>
        )}
        {(hasFilters || hasSearch) && (
          <button
            onClick={onClearAll}
            className="rounded bg-foreground px-3 py-1.5 text-[12px] font-medium text-background hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
          >
            View all experts
          </button>
        )}
      </div>
    </div>
  );
}
