"use client";

import type { ActiveFilters } from "@/types/credentials";

interface CredentialsSortProps {
  value: ActiveFilters["sortBy"];
  onChange: (v: ActiveFilters["sortBy"]) => void;
}

export function CredentialsSort({ value, onChange }: CredentialsSortProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ActiveFilters["sortBy"])}
      className="h-7 rounded border border-border bg-background px-2 text-[12px] text-foreground outline-none focus:border-foreground focus-visible:ring-2 focus-visible:ring-foreground/20 cursor-pointer"
      aria-label="Sort credentials"
    >
      <option value="relevance">Relevance</option>
      <option value="title">Title A–Z</option>
      <option value="recent">Most recent</option>
    </select>
  );
}
