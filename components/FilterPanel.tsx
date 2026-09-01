"use client";

import { useMemo } from "react";
import { INDUSTRIES, REGIONS, CAPABILITIES } from "@/data/solutions";
import { SOLUTION_FILTER_OPTIONS } from "@/data/solution-config";
import { FilterDropdown } from "@/components/filters/FilterDropdown";
import type { ActiveFilters } from "@/types/credentials";

interface FilterSection {
  id: string;
  label: string;
  options: { id: string; label: string }[];
  filterKey: keyof Omit<ActiveFilters, "search" | "sortBy">;
}

interface FilterPanelProps {
  filters: ActiveFilters;
  onToggle: (key: keyof Omit<ActiveFilters, "search" | "sortBy">, value: string) => void;
}

export function FilterPanel({ filters, onToggle }: FilterPanelProps) {
  const sections: FilterSection[] = useMemo(
    () => [
      { id: "solutions", label: "Solution", options: SOLUTION_FILTER_OPTIONS, filterKey: "solutions" },
      { id: "industries", label: "Industry", options: INDUSTRIES, filterKey: "industries" },
      { id: "regions", label: "Region", options: REGIONS, filterKey: "regions" },
      { id: "capabilities", label: "Capability", options: CAPABILITIES, filterKey: "capabilities" },
    ],
    []
  );

  return (
    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filters">
      {sections.map((section) => (
        <FilterDropdown
          key={section.id}
          label={section.label}
          options={section.options}
          selected={filters[section.filterKey] as string[]}
          onToggle={(v) => onToggle(section.filterKey, v)}
        />
      ))}
    </div>
  );
}
