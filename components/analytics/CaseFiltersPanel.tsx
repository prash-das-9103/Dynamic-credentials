"use client";

import { cn } from "@/lib/utils";
import {
  CASE_REGIONS,
  CASE_SOLUTIONS,
  CASE_INDUSTRIES,
  CASE_FISCAL_YEARS,
} from "@/lib/case-analytics";
import type { CaseFilters } from "@/lib/case-analytics";
import { FilterDropdown } from "@/components/filters/FilterDropdown";

type ArrayFilterKey = "regions" | "solutions" | "industries" | "years";

interface Props {
  filters: CaseFilters;
  onToggle: (key: ArrayFilterKey, value: string) => void;
  onFstToggle: () => void;
  onEnergyTransitionToggle: () => void;
}

export function CaseFiltersPanel({
  filters,
  onToggle,
  onFstToggle,
  onEnergyTransitionToggle,
}: Props) {
  const yearOptions = CASE_FISCAL_YEARS.map((y) => ({ id: y, label: y }));

  return (
    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Case registry filters">
      <FilterDropdown
        label="Solution"
        options={CASE_SOLUTIONS}
        selected={filters.solutions}
        onToggle={(v) => onToggle("solutions", v)}
      />
      <FilterDropdown
        label="Region"
        options={CASE_REGIONS}
        selected={filters.regions}
        onToggle={(v) => onToggle("regions", v)}
      />
      <FilterDropdown
        label="Industry"
        options={CASE_INDUSTRIES}
        selected={filters.industries}
        onToggle={(v) => onToggle("industries", v)}
      />
      <FilterDropdown
        label="Case End Year"
        options={yearOptions}
        selected={filters.years}
        onToggle={(v) => onToggle("years", v)}
      />
      <button
        onClick={onFstToggle}
        aria-pressed={filters.fstOnly}
        className={cn(
          "rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          filters.fstOnly
            ? "border-[#CC0000] bg-[#CC0000] text-white"
            : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
        )}
      >
        Food Systems Transformation only
      </button>
      <button
        onClick={onEnergyTransitionToggle}
        aria-pressed={filters.energyTransitionOnly}
        className={cn(
          "rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          filters.energyTransitionOnly
            ? "border-[#CC0000] bg-[#CC0000] text-white"
            : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
        )}
      >
        Energy Transition only
      </button>
    </div>
  );
}
