"use client";

import { SearchX } from "lucide-react";

interface CredentialsEmptyStateProps {
  hasFilters: boolean;
  hasSearch: boolean;
  onClearFilters: () => void;
  onClearSearch: () => void;
  onClearAll: () => void;
}

export function CredentialsEmptyState({
  hasFilters,
  hasSearch,
  onClearFilters,
  onClearSearch,
  onClearAll,
}: CredentialsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <SearchX size={32} className="mb-4 text-muted-foreground/40" aria-hidden="true" />
      <p className="mb-1 text-[14px] font-semibold text-foreground">
        No credentials found
      </p>
      <p className="mb-6 text-[13px] text-muted-foreground">
        {hasSearch && hasFilters
          ? "No credentials match the current search and active filters."
          : hasSearch
          ? "No credentials match your search."
          : "No credentials match the active filters."}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {hasSearch && (
          <button
            onClick={onClearSearch}
            className="rounded border border-border px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-secondary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
          >
            Clear search
          </button>
        )}
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="rounded border border-border px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-secondary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
          >
            Clear filters
          </button>
        )}
        {hasSearch && hasFilters && (
          <button
            onClick={onClearAll}
            className="rounded border border-[#CC0000] px-3 py-1.5 text-[12px] font-medium text-[#CC0000] hover:bg-destructive/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CC0000]"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
