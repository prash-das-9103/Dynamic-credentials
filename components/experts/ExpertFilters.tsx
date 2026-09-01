"use client";

import { INDUSTRIES, REGIONS, SOLUTIONS } from "@/data/solutions";
import { CENTERS_OF_EXCELLENCE } from "@/data/centers-of-excellence";
import { FilterDropdown } from "@/components/filters/FilterDropdown";

interface ExpertFilterState {
  industries: string[];
  regions: string[];
  solutions: string[];
  centerOfExcellence: string[];
}

interface Props {
  filters: ExpertFilterState;
  onToggle: (key: keyof ExpertFilterState, value: string) => void;
}

export function ExpertFilters({ filters, onToggle }: Props) {
  const centerOptions = CENTERS_OF_EXCELLENCE.filter((c) => !c.parentId).map((c) => ({
    id: c.id,
    label: c.name,
  }));

  return (
    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Expert filters">
      <FilterDropdown
        label="Solution"
        options={SOLUTIONS}
        selected={filters.solutions}
        onToggle={(id) => onToggle("solutions", id)}
      />
      <FilterDropdown
        label="Industry"
        options={INDUSTRIES}
        selected={filters.industries}
        onToggle={(id) => onToggle("industries", id)}
      />
      <FilterDropdown
        label="Region"
        options={REGIONS}
        selected={filters.regions}
        onToggle={(id) => onToggle("regions", id)}
      />
      <FilterDropdown
        label="Centre of Excellence"
        options={centerOptions}
        selected={filters.centerOfExcellence}
        onToggle={(id) => onToggle("centerOfExcellence", id)}
      />
    </div>
  );
}
