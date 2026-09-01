"use client";

import Link from "next/link";

interface Props {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export function EcosystemEmptyState({ hasFilters, onClearFilters }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-[14px] font-medium text-foreground">
        No ecosystem partners match the current search and filters.
      </p>
      <p className="mt-1 text-[12px] text-muted-foreground">
        Try adjusting your filters or clearing your search.
      </p>
      <div className="mt-4 flex items-center gap-3">
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="rounded border border-border px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
          >
            Clear filters
          </button>
        )}
        <Link
          href="/ecosystem"
          className="rounded border border-border px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
        >
          View all partners
        </Link>
      </div>
    </div>
  );
}
