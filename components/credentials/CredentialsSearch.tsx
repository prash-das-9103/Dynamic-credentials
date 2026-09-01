"use client";

import { Search, X } from "lucide-react";

interface CredentialsSearchProps {
  value: string;
  onChange: (v: string) => void;
}

export function CredentialsSearch({ value, onChange }: CredentialsSearchProps) {
  return (
    <div className="relative flex-1">
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by title, industry, region, keyword…"
        className="h-9 w-full rounded border border-border bg-background pl-9 pr-8 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground focus-visible:ring-2 focus-visible:ring-foreground/20 transition-colors"
        aria-label="Search credentials"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
          aria-label="Clear search"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
