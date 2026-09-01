"use client";

export type PublicationSortKey = "recent" | "oldest" | "title" | "relevance";

interface Props {
  value: PublicationSortKey;
  onChange: (v: PublicationSortKey) => void;
}

const OPTIONS: { value: PublicationSortKey; label: string }[] = [
  { value: "recent", label: "Most recent" },
  { value: "oldest", label: "Oldest" },
  { value: "title", label: "Title A–Z" },
  { value: "relevance", label: "Relevance" },
];

export function PublicationsSort({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <label htmlFor="pub-sort" className="text-[11px] text-muted-foreground whitespace-nowrap">
        Sort by
      </label>
      <select
        id="pub-sort"
        value={value}
        onChange={(e) => onChange(e.target.value as PublicationSortKey)}
        className="rounded border border-border bg-background px-2 py-1.5 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
        aria-label="Sort publications"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
