"use client";

import { SOLUTION_FILTER_OPTIONS } from "@/data/solution-config";
import { FilterDropdown } from "@/components/filters/FilterDropdown";

export interface EcosystemFilters {
  solutions: string[];
  industries: string[];
}

export const EMPTY_ECO_FILTERS: EcosystemFilters = {
  solutions: [],
  industries: [],
};

interface Props {
  filters: EcosystemFilters;
  allIndustries: { id: string; label: string }[];
  onToggle: (key: keyof EcosystemFilters, value: string) => void;
}

export function PartnerFilters({ filters, allIndustries, onToggle }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Partner filters">
      <FilterDropdown
        label="Solution"
        options={SOLUTION_FILTER_OPTIONS}
        selected={filters.solutions}
        onToggle={(id) => onToggle("solutions", id)}
      />
      {allIndustries.length > 0 && (
        <FilterDropdown
          label="Related Industry"
          options={allIndustries}
          selected={filters.industries}
          onToggle={(id) => onToggle("industries", id)}
        />
      )}
    </div>
  );
}
