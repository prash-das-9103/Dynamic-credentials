"use client";

import { Search, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  resultCount: number;
}

export function PartnerSearch({ value, onChange, resultCount }: Props) {
  return (
    <div className="relative flex items-center w-full max-w-sm">
      <Search
        size={14}
        className="pointer-events-none absolute left-2.5 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        type="search"
        placeholder="Search partners, use cases, products…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full rounded border border-border bg-background pl-8 pr-7 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
        aria-label="Search ecosystem partners"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 text-muted-foreground hover:text-foreground focus-visible:outline-none"
          aria-label="Clear search"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
