"use client";

import { INDUSTRIES } from "@/data/solutions";
import { SOLUTION_FILTER_OPTIONS, getProductsForSolutions } from "@/data/solution-config";
import { PARTNERS } from "@/data/partners";
import { PUBLICATION_TYPES } from "@/data/publications";
import { FilterDropdown } from "@/components/filters/FilterDropdown";

export interface PublicationFilters {
  solutions: string[];
  products: string[];
  industries: string[];
  types: string[];
  years: number[];
  partners: string[];
}

export const EMPTY_PUB_FILTERS: PublicationFilters = {
  solutions: [],
  products: [],
  industries: [],
  types: [],
  years: [],
  partners: [],
};

interface Props {
  filters: PublicationFilters;
  allYears: number[];
  onChange: (next: PublicationFilters) => void;
}

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function PublicationFilters({ filters, allYears, onChange }: Props) {
  const productOptions = getProductsForSolutions(filters.solutions);
  const yearOptions = allYears.map((y) => ({ id: String(y), label: String(y) }));
  const partnerOptions = PARTNERS.map((p) => ({ id: p.id, label: p.name }));

  return (
    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Publication filters">
      <FilterDropdown
        label="Solution"
        options={SOLUTION_FILTER_OPTIONS}
        selected={filters.solutions}
        onToggle={(id) => onChange({ ...filters, solutions: toggle(filters.solutions, id) })}
      />
      <FilterDropdown
        label="Product"
        options={productOptions}
        selected={filters.products}
        onToggle={(id) => onChange({ ...filters, products: toggle(filters.products, id) })}
      />
      <FilterDropdown
        label="Industry"
        options={INDUSTRIES}
        selected={filters.industries}
        onToggle={(id) => onChange({ ...filters, industries: toggle(filters.industries, id) })}
      />
      <FilterDropdown
        label="Publication Type"
        options={PUBLICATION_TYPES}
        selected={filters.types}
        onToggle={(id) => onChange({ ...filters, types: toggle(filters.types, id) })}
      />
      {yearOptions.length > 0 && (
        <FilterDropdown
          label="Year"
          options={yearOptions}
          selected={filters.years.map(String)}
          onToggle={(id) =>
            onChange({ ...filters, years: toggle(filters.years, Number(id)) })
          }
        />
      )}
      <FilterDropdown
        label="Related Partner"
        options={partnerOptions}
        selected={filters.partners}
        onToggle={(id) => onChange({ ...filters, partners: toggle(filters.partners, id) })}
      />
    </div>
  );
}
