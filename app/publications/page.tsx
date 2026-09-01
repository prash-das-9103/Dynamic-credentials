"use client";

import { Suspense, useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PublicationSearch } from "@/components/publications/PublicationSearch";
import { PublicationsSort, type PublicationSortKey } from "@/components/publications/PublicationsSort";
import {
  PublicationFilters,
  type PublicationFilters as PubFilters,
  EMPTY_PUB_FILTERS,
} from "@/components/publications/PublicationFilters";
import { PublicationCard } from "@/components/publications/PublicationCard";
import { PublicationDetailDrawer } from "@/components/publications/PublicationDetailDrawer";
import { PublicationsEmptyState } from "@/components/publications/PublicationsEmptyState";
import { PUBLICATIONS } from "@/data/publications";
import { PRODUCTS, INDUSTRIES } from "@/data/solutions";
import { SOLUTION_FILTER_OPTIONS } from "@/data/solution-config";
import { PARTNERS } from "@/data/partners";
import type { Publication } from "@/types/credentials";

// Derive all years present in the dataset (descending)
const ALL_YEARS = Array.from(
  new Set(PUBLICATIONS.map((p) => p.year).filter((y): y is number => y !== undefined))
).sort((a, b) => b - a);

function lookup(arr: { id: string; label: string }[], id: string) {
  return arr.find((a) => a.id === id)?.label ?? id;
}

// ── Filter predicate ──────────────────────────────────────────────────────────
function matchesPublication(
  pub: Publication,
  filters: PubFilters,
  search: string
): boolean {
  if (filters.solutions.length > 0 && !pub.solutionIds.some((id) => filters.solutions.includes(id)))
    return false;
  if (filters.products.length > 0 && !pub.productIds.some((id) => filters.products.includes(id)))
    return false;
  if (
    filters.industries.length > 0 &&
    !pub.industryIds.some((id) => filters.industries.includes(id))
  )
    return false;
  if (filters.types.length > 0 && !filters.types.includes(pub.publicationType))
    return false;
  if (filters.years.length > 0 && (pub.year === undefined || !filters.years.includes(pub.year)))
    return false;
  if (filters.partners.length > 0 && !pub.partnerIds.some((id) => filters.partners.includes(id)))
    return false;

  if (search.trim()) {
    const q = search.toLowerCase();
    const productLabels = pub.productIds.map((id) => lookup(PRODUCTS, id));
    const industryLabels = pub.industryIds.map((id) => lookup(INDUSTRIES, id));
    const partnerNames = pub.partnerIds.map(
      (id) => PARTNERS.find((p) => p.id === id)?.name ?? ""
    );
    const searchable = [
      pub.title,
      pub.abstract,
      pub.publicationType,
      ...pub.authors,
      ...pub.keywords,
      ...productLabels,
      ...industryLabels,
      ...partnerNames,
    ]
      .join(" ")
      .toLowerCase();
    if (!searchable.includes(q)) return false;
  }
  return true;
}

// ── Sort ──────────────────────────────────────────────────────────────────────
function sortPublications(
  pubs: Publication[],
  sortBy: PublicationSortKey,
  search: string
): Publication[] {
  const sorted = [...pubs];
  switch (sortBy) {
    case "recent":
      return sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    case "oldest":
      return sorted.sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999));
    case "title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "relevance":
      if (!search.trim()) return sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
      // Score by number of keyword/title hits
      const q = search.toLowerCase();
      return sorted.sort((a, b) => {
        const score = (pub: Publication) =>
          (pub.title.toLowerCase().includes(q) ? 3 : 0) +
          (pub.abstract.toLowerCase().includes(q) ? 2 : 0) +
          pub.keywords.filter((k) => k.toLowerCase().includes(q)).length;
        return score(b) - score(a);
      });
    default:
      return sorted;
  }
}

// ── URL serialisation ─────────────────────────────────────────────────────────
function filtersFromParams(params: URLSearchParams): {
  filters: PubFilters;
  search: string;
  sortBy: PublicationSortKey;
} {
  function getList(key: string): string[] {
    const v = params.get(key);
    return v ? v.split(",").filter(Boolean) : [];
  }
  const rawYears = getList("year").map(Number).filter((n) => !isNaN(n));
  return {
    filters: {
      solutions: getList("solution"),
      products: getList("product"),
      industries: getList("industry"),
      types: getList("type"),
      years: rawYears,
      partners: getList("partner"),
    },
    search: params.get("search") ?? "",
    sortBy: (params.get("sort") as PublicationSortKey) ?? "recent",
  };
}

function filtersToParams(
  filters: PubFilters,
  search: string,
  sortBy: PublicationSortKey
): URLSearchParams {
  const p = new URLSearchParams();
  if (filters.solutions.length) p.set("solution", filters.solutions.join(","));
  if (filters.products.length) p.set("product", filters.products.join(","));
  if (filters.industries.length) p.set("industry", filters.industries.join(","));
  if (filters.types.length) p.set("type", filters.types.join(","));
  if (filters.years.length) p.set("year", filters.years.join(","));
  if (filters.partners.length) p.set("partner", filters.partners.join(","));
  if (search.trim()) p.set("search", search.trim());
  if (sortBy !== "recent") p.set("sort", sortBy);
  return p;
}

const SORT_LABELS: Record<PublicationSortKey, string> = {
  recent: "Most recent",
  oldest: "Oldest",
  title: "Title A–Z",
  relevance: "Relevance",
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PublicationsPage() {
  return (
    <Suspense fallback={null}>
      <PublicationsPageInner />
    </Suspense>
  );
}

function PublicationsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const init = useMemo(() => filtersFromParams(searchParams), []); // eslint-disable-line react-hooks/exhaustive-deps

  const [filters, setFilters] = useState<PubFilters>(init.filters);
  const [search, setSearch] = useState(init.search);
  const [sortBy, setSortBy] = useState<PublicationSortKey>(init.sortBy);
  const [drawerPub, setDrawerPub] = useState<Publication | null>(null);

  // Deep-link: ?publication=<id> opens that publication's drawer on mount
  useEffect(() => {
    const pubParam = searchParams.get("publication");
    if (pubParam) {
      const found = PUBLICATIONS.find((p) => p.id === pubParam);
      if (found) setDrawerPub(found);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync state → URL
  useEffect(() => {
    const params = filtersToParams(filters, search, sortBy);
    const newSearch = params.toString();
    const current = searchParams.toString();
    if (newSearch !== current) {
      router.replace(`/publications${newSearch ? `?${newSearch}` : ""}`, { scroll: false });
    }
  }, [filters, search, sortBy, router, searchParams]);

  const results = useMemo(() => {
    const filtered = PUBLICATIONS.filter((p) => matchesPublication(p, filters, search));
    return sortPublications(filtered, sortBy, search);
  }, [filters, search, sortBy]);

  const clearAll = useCallback(() => {
    setFilters(EMPTY_PUB_FILTERS);
    setSearch("");
    setSortBy("recent");
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_PUB_FILTERS);
  }, []);

  // Active filter chips
  type Chip = { key: string; label: string; onRemove: () => void };
  const activeChips: Chip[] = [
    ...filters.solutions.map((v) => ({
      key: `solution-${v}`,
      label: lookup(SOLUTION_FILTER_OPTIONS, v),
      onRemove: () =>
        setFilters((p) => ({ ...p, solutions: p.solutions.filter((x) => x !== v) })),
    })),
    ...filters.products.map((v) => ({
      key: `product-${v}`,
      label: lookup(PRODUCTS, v),
      onRemove: () =>
        setFilters((p) => ({ ...p, products: p.products.filter((x) => x !== v) })),
    })),
    ...filters.industries.map((v) => ({
      key: `industry-${v}`,
      label: lookup(INDUSTRIES, v),
      onRemove: () =>
        setFilters((p) => ({ ...p, industries: p.industries.filter((x) => x !== v) })),
    })),
    ...filters.types.map((v) => ({
      key: `type-${v}`,
      label: v,
      onRemove: () =>
        setFilters((p) => ({ ...p, types: p.types.filter((x) => x !== v) })),
    })),
    ...filters.years.map((v) => ({
      key: `year-${v}`,
      label: String(v),
      onRemove: () =>
        setFilters((p) => ({ ...p, years: p.years.filter((x) => x !== v) })),
    })),
    ...filters.partners.map((v) => ({
      key: `partner-${v}`,
      label: PARTNERS.find((p) => p.id === v)?.name ?? v,
      onRemove: () =>
        setFilters((p) => ({ ...p, partners: p.partners.filter((x) => x !== v) })),
    })),
  ];

  const hasActiveFilters =
    activeChips.length > 0 || search.trim() !== "" || sortBy !== "recent";

  return (
    <AppShell
      title="Publications"
      breadcrumb={[
        { label: "Overview", href: "/" },
        { label: "Publications" },
      ]}
    >
      <div className="flex h-full min-h-0 flex-col">
        {/* Page header */}
        <div className="border-b border-border px-6 py-5">
          <h2 className="text-[18px] font-semibold text-foreground">
            Publications and IP
          </h2>
          <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-muted-foreground">
            Find thought leadership, coalition materials, and practical perspectives relevant to
            our sustainability solutions.
          </p>

          {/* Search + sort row */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[260px]">
              <PublicationSearch
                value={search}
                onChange={setSearch}
                resultCount={results.length}
              />
            </div>
            <PublicationsSort value={sortBy} onChange={setSortBy} />
          </div>

          {/* Filter dropdowns */}
          <div className="mt-3">
            <PublicationFilters
              filters={filters}
              allYears={ALL_YEARS}
              onChange={setFilters}
            />
          </div>

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {activeChips.map((chip) => (
                <span
                  key={chip.key}
                  className="flex items-center gap-1 rounded-full border border-border bg-secondary px-2 py-0.5 text-[11px] text-foreground"
                >
                  {chip.label}
                  <button
                    onClick={chip.onRemove}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={`Remove filter: ${chip.label}`}
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              {activeChips.length > 1 && (
                <button
                  onClick={clearFilters}
                  className="text-[11px] text-muted-foreground underline hover:text-foreground"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>

        {/* Body: list */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Results list */}
          <main className="flex-1 min-w-0 overflow-y-auto px-5 py-5">
            {results.length === 0 ? (
              <PublicationsEmptyState
                onClearFilters={clearAll}
                onViewAll={clearAll}
              />
            ) : (
              <div className="space-y-3">
                {results.map((pub) => (
                  <PublicationCard
                    key={pub.id}
                    publication={pub}
                    onViewDetails={setDrawerPub}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Detail drawer */}
      <PublicationDetailDrawer
        publication={drawerPub}
        onClose={() => {
          setDrawerPub(null);
          // Remove ?publication= from URL if present (set by deep-link)
          if (searchParams.get("publication")) {
            const params = filtersToParams(filters, search, sortBy);
            router.replace(`/publications${params.toString() ? `?${params}` : ""}`, { scroll: false });
          }
        }}
      />
    </AppShell>
  );
}
