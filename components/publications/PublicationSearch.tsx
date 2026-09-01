"use client";

import { Search, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  resultCount: number;
}

export function PublicationSearch({ value, onChange, resultCount }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search title, abstract, authors, keywords, partner..."
          className="w-full rounded border border-border bg-background py-2 pl-9 pr-8 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          aria-label="Search publications"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X size={12} />
          </button>
        )}
      </div>
      <span className="shrink-0 text-[12px] tabular-nums text-muted-foreground" aria-live="polite">
        {resultCount} result{resultCount !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
