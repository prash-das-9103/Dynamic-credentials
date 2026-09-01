"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface FilterDropdownOption {
  id: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  options: readonly FilterDropdownOption[];
  selected: string[];
  onToggle: (id: string) => void;
  emptyMessage?: string;
  /** Show an inline search box once there are more than this many options. */
  searchThreshold?: number;
}

export function FilterDropdown({
  label,
  options,
  selected,
  onToggle,
  emptyMessage = "No options available",
  searchThreshold = 8,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const count = selected.length;
  const showSearch = options.length > searchThreshold;

  const visibleOptions = useMemo(() => {
    if (!showSearch || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, query, showSearch]);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "gap-1.5 text-[12px]",
              count > 0 && "border-[#CC0000] text-[#CC0000] hover:text-[#CC0000]"
            )}
          />
        }
      >
        {label}
        {count > 0 && (
          <span
            className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#CC0000] px-1 text-[10px] font-semibold text-white"
            aria-hidden="true"
          >
            {count}
          </span>
        )}
        <ChevronDown
          size={12}
          className={cn("shrink-0 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          {count > 0 && (
            <button
              onClick={() => selected.forEach((id) => onToggle(id))}
              className="text-[11px] font-medium text-[#CC0000] hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {showSearch && (
          <div className="border-b border-border px-2 py-1.5">
            <div className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1">
              <Search size={12} className="shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}…`}
                className="w-full bg-transparent text-[12px] outline-none placeholder:text-muted-foreground"
                aria-label={`Search ${label} options`}
              />
            </div>
          </div>
        )}

        <div className="max-h-72 overflow-y-auto p-1.5">
          {visibleOptions.length === 0 ? (
            <p className="px-2 py-3 text-center text-[12px] text-muted-foreground">
              {options.length === 0 ? emptyMessage : "No matches"}
            </p>
          ) : (
            visibleOptions.map((opt) => {
              const checked = selected.includes(opt.id);
              return (
                <label
                  key={opt.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[13px] hover:bg-muted"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => onToggle(opt.id)}
                  />
                  <span
                    className={cn(
                      "leading-snug",
                      checked ? "font-medium text-foreground" : "text-foreground/90"
                    )}
                  >
                    {opt.label}
                  </span>
                </label>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
