"use client";

import { Suspense, useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ExpertSearch } from "@/components/experts/ExpertSearch";
import { ExpertFilters } from "@/components/experts/ExpertFilters";
import { ExpertCard } from "@/components/experts/ExpertCard";
import { ExpertDetailDrawer } from "@/components/experts/ExpertDetailDrawer";
import { ExpertsEmptyState } from "@/components/experts/ExpertsEmptyState";
import { EXPERTS } from "@/data/experts";
import { CREDENTIALS } from "@/data/credentials";
import { PRODUCTS, INDUSTRIES, REGIONS, SOLUTIONS } from "@/data/solutions";
import { CENTERS_OF_EXCELLENCE } from "@/data/centers-of-excellence";
import type { Expert } from "@/types/credentials";
import { cn } from "@/lib/utils";

// --- Types ---

interface ExpertFilterState {
  industries: string[];
  regions: string[];
  solutions: string[];
  centerOfExcellence: string[];
}

const EMPTY_FILTERS: ExpertFilterState = {
  industries: [],
  regions: [],
  solutions: [],
  centerOfExcellence: [],
};

// --- Helpers ---

function lookup(arr: { id: string; label: string }[], id: string) {
  return arr.find((a) => a.id === id)?.label ?? id;
}

function filtersFromParams(params: URLSearchParams): ExpertFilterState {
  function getList(key: string): string[] {
    const v = params.get(key);
    return v ? v.split(",").filter(Boolean) : [];
  }
  return {
    industries: getList("industry"),
    regions: getList("region"),
    solutions: getList("solution"),
    centerOfExcellence: getList("coe"),
  };
}

function filtersToParams(f: ExpertFilterState, search: string): URLSearchParams {
  const p = new URLSearchParams();
  if (f.industries.length) p.set("industry", f.industries.join(","));
  if (f.regions.length) p.set("region", f.regions.join(","));
  if (f.solutions.length) p.set("solution", f.solutions.join(","));
  if (f.centerOfExcellence.length) p.set("coe", f.centerOfExcellence.join(","));
  if (search.trim()) p.set("search", search.trim());
  return p;
}

// Build a map of expert id → credential count
const EXPERT_CRED_COUNT: Record<string, number> = Object.fromEntries(
  EXPERTS.map((e) => [e.id, CREDENTIALS.filter((c) => c.expertIds.includes(e.id)).length])
);

function matchesExpert(expert: Expert, filters: ExpertFilterState, query: string): boolean {
  // Filter groups use OR within, AND between
  if (filters.industries.length > 0 && !expert.industryIds.some((i) => filters.industries.includes(i)))
    return false;
  if (filters.regions.length > 0 && !expert.regionIds.some((r) => filters.regions.includes(r)))
    return false;
  if (filters.solutions.length > 0 && !expert.solutionIds.some((s) => filters.solutions.includes(s)))
    return false;
  if (
    filters.centerOfExcellence.length > 0 &&
    !expert.centerOfExcellenceIds.some((c) => filters.centerOfExcellence.includes(c))
  )
    return false;

  if (query.trim()) {
    const q = query.toLowerCase();
    // Gather all related credential titles for search
    const relatedCredTitles = CREDENTIALS.filter((c) =>
      c.expertIds.includes(expert.id)
    ).map((c) => c.title);

    const searchable = [
      expert.name,
      expert.title,
      expert.role ?? "",
      expert.bio,
      ...expert.expertise,
      ...expert.productIds.map((id) => lookup(PRODUCTS, id)),
      ...expert.industryIds.map((id) => lookup(INDUSTRIES, id)),
      ...expert.regionIds.map((id) => lookup(REGIONS, id)),
      ...relatedCredTitles,
    ]
      .join(" ")
      .toLowerCase();

    if (!searchable.includes(q)) return false;
  }

  return true;
}

// --- Page ---

export default function ExpertsPage() {
  return (
    <Suspense fallback={null}>
      <ExpertsPageInner />
    </Suspense>
  );
}

function ExpertsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [filters, setFilters] = useState<ExpertFilterState>(() =>
    filtersFromParams(searchParams)
  );
  const [activeExpert, setActiveExpert] = useState<Expert | null>(null);

  // Deep-link: ?expert=<id> opens drawer on mount
  useEffect(() => {
    const expertParam = searchParams.get("expert");
    if (expertParam) {
      const found = EXPERTS.find((e) => e.id === expertParam);
      if (found) setActiveExpert(found);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync state → URL
  useEffect(() => {
    const params = filtersToParams(filters, search);
    const newSearch = params.toString();
    const current = searchParams.toString();
    // Preserve ?expert= param if drawer is open
    if (activeExpert) params.set("expert", activeExpert.id);
    const withExpert = params.toString();
    if (withExpert !== current) {
      router.replace(`/experts${withExpert ? `?${withExpert}` : ""}`, { scroll: false });
    }
  }, [filters, search, activeExpert, router, searchParams]);

  function closeDrawer() {
    setActiveExpert(null);
    // Remove expert param from URL
    const params = filtersToParams(filters, search);
    router.replace(`/experts${params.toString() ? `?${params}` : ""}`, { scroll: false });
  }

  function toggleFilter(key: keyof ExpertFilterState, value: string) {
    setFilters((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  }

  const clearAll = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setSearch("");
  }, []);

  const clearFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);
  const clearSearch = useCallback(() => setSearch(""), []);

  const results = useMemo(
    () => EXPERTS.filter((e) => matchesExpert(e, filters, search)),
    [filters, search]
  );

  const hasActiveFilters =
    filters.industries.length > 0 ||
    filters.regions.length > 0 ||
    filters.solutions.length > 0 ||
    filters.centerOfExcellence.length > 0;

  const hasSearch = search.trim().length > 0;

  // Active chips for the filter row
  type Chip = { key: string; label: string; onRemove: () => void };
  const activeChips: Chip[] = [
    ...filters.industries.map((v) => ({
      key: `industry-${v}`,
      label: lookup(INDUSTRIES, v),
      onRemove: () => toggleFilter("industries", v),
    })),
    ...filters.regions.map((v) => ({
      key: `region-${v}`,
      label: lookup(REGIONS, v),
      onRemove: () => toggleFilter("regions", v),
    })),
    ...filters.solutions.map((v) => ({
      key: `solution-${v}`,
      label: SOLUTIONS.find((s) => s.id === v)?.label ?? v,
      onRemove: () => toggleFilter("solutions", v),
    })),
    ...filters.centerOfExcellence.map((v) => ({
      key: `coe-${v}`,
      label: CENTERS_OF_EXCELLENCE.find((c) => c.id === v)?.name ?? v,
      onRemove: () => toggleFilter("centerOfExcellence", v),
    })),
  ];

  // Related credentials for the open expert
  const relatedCredentials = useMemo(() => {
    if (!activeExpert) return [];
    return CREDENTIALS.filter((c) => c.expertIds.includes(activeExpert.id));
  }, [activeExpert]);

  return (
    <AppShell
      title="Experts"
      breadcrumb={[
        { label: "Overview", href: "/" },
        { label: "Experts" },
      ]}
    >
      <div className="flex h-full flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-background px-5 pt-5 pb-4 shrink-0 space-y-3">
          {/* Breadcrumb handled by AppShell */}
          <div>
            <h1 className="text-[20px] font-bold text-foreground leading-tight">
              Experts
            </h1>
            <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
              Find relevant experts across our sustainability solutions and review the credentials connected to their areas of expertise.
            </p>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2">
            <ExpertSearch value={search} onChange={setSearch} />
          </div>

          {/* Filter dropdowns */}
          <ExpertFilters
            filters={filters}
            onToggle={toggleFilter}
          />

          {/* Active filter chips + count */}
          <div className="flex items-center gap-2 flex-wrap">
              {activeChips.map((chip) => (
                <span
                  key={chip.key}
                  className="flex items-center gap-1 rounded border border-border bg-secondary px-2 py-1 text-[11px] text-foreground"
                >
                  {chip.label}
                  <button
                    onClick={chip.onRemove}
                    className="ml-0.5 rounded text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
                    aria-label={`Remove filter: ${chip.label}`}
                  >
                    <X size={10} aria-hidden="true" />
                  </button>
                </span>
              ))}
              {(hasActiveFilters || hasSearch) && (
                <button
                  onClick={clearAll}
                  className="text-[11px] text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground rounded"
                >
                  Clear all
                </button>
              )}
              <span
                className="ml-auto text-[12px] text-muted-foreground tabular-nums"
                aria-live="polite"
                aria-atomic="true"
              >
                {results.length} expert{results.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-4">
            {results.length === 0 ? (
              <ExpertsEmptyState
                hasFilters={hasActiveFilters}
                hasSearch={hasSearch}
                onClearFilters={clearFilters}
                onClearSearch={clearSearch}
                onClearAll={clearAll}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((expert) => (
                  <ExpertCard
                    key={expert.id}
                    expert={expert}
                    credentialCount={EXPERT_CRED_COUNT[expert.id] ?? 0}
                    onViewProfile={setActiveExpert}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

      {/* Detail drawer */}
      <ExpertDetailDrawer
        expert={activeExpert}
        relatedCredentials={relatedCredentials}
        onClose={closeDrawer}
      />
    </AppShell>
  );
}
