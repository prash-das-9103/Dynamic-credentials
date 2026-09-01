"use client";

import { Suspense, useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PartnerFilters, type EcosystemFilters, EMPTY_ECO_FILTERS } from "@/components/ecosystem/PartnerFilters";
import { PartnerDetailDrawer } from "@/components/ecosystem/PartnerDetailDrawer";
import { EcosystemEmptyState } from "@/components/ecosystem/EcosystemEmptyState";
import { EcosystemSection } from "@/components/ecosystem/EcosystemSection";
import { AllianceStrip } from "@/components/ecosystem/AllianceStrip";
import { PARTNERS } from "@/data/partners";
import { CREDENTIALS } from "@/data/credentials";
import { PUBLICATIONS } from "@/data/publications";
import { PRODUCTS, INDUSTRIES } from "@/data/solutions";
import { SOLUTION_FILTER_OPTIONS } from "@/data/solution-config";
import type { Partner } from "@/types/credentials";

// Derive industry options from credentials and publications linked to partners
function deriveIndustries(): { id: string; label: string }[] {
  const ids = new Set<string>();
  PARTNERS.forEach((p) => {
    p.credentialIds.forEach((cid) => {
      const cred = CREDENTIALS.find((c) => c.id === cid);
      cred?.industryIds.forEach((ind) => ids.add(ind));
    });
    p.publicationIds.forEach((pid) => {
      const pub = PUBLICATIONS.find((pub) => pub.id === pid);
      pub?.industryIds.forEach((ind) => ids.add(ind));
    });
  });
  return INDUSTRIES.filter((ind) => ids.has(ind.id));
}

const ALL_INDUSTRIES = deriveIndustries();

function lookup(arr: { id: string; label: string }[], id: string) {
  return arr.find((a) => a.id === id)?.label ?? id;
}

function matchesPartner(partner: Partner, filters: EcosystemFilters, search: string): boolean {
  if (filters.solutions.length > 0 && !partner.solutionIds.some((s) => filters.solutions.includes(s)))
    return false;
  if (filters.industries.length > 0) {
    // Check if any linked credential or publication has a matching industry
    const credIndustries = partner.credentialIds.flatMap(
      (cid) => CREDENTIALS.find((c) => c.id === cid)?.industryIds ?? []
    );
    const pubIndustries = partner.publicationIds.flatMap(
      (pid) => PUBLICATIONS.find((p) => p.id === pid)?.industryIds ?? []
    );
    const allInds = [...credIndustries, ...pubIndustries];
    if (!allInds.some((i) => filters.industries.includes(i))) return false;
  }
  if (search.trim()) {
    const q = search.toLowerCase();
    const productLabels = partner.productIds.map((id) => lookup(PRODUCTS, id));
    const credTitles = partner.credentialIds.map(
      (cid) => CREDENTIALS.find((c) => c.id === cid)?.title ?? ""
    );
    const pubTitles = partner.publicationIds.map(
      (pid) => PUBLICATIONS.find((p) => p.id === pid)?.title ?? ""
    );
    const searchable = [
      partner.name,
      partner.category,
      partner.description,
      ...partner.useCases,
      ...productLabels,
      ...credTitles,
      ...pubTitles,
    ]
      .join(" ")
      .toLowerCase();
    if (!searchable.includes(q)) return false;
  }
  return true;
}

function filtersFromParams(params: URLSearchParams): { filters: EcosystemFilters; search: string } {
  function getList(key: string): string[] {
    const v = params.get(key);
    return v ? v.split(",").filter(Boolean) : [];
  }
  return {
    filters: {
      solutions: getList("solution"),
      industries: getList("industry"),
    },
    search: params.get("search") ?? "",
  };
}

function filtersToParams(filters: EcosystemFilters, search: string): URLSearchParams {
  const p = new URLSearchParams();
  if (filters.solutions.length) p.set("solution", filters.solutions.join(","));
  if (filters.industries.length) p.set("industry", filters.industries.join(","));
  if (search.trim()) p.set("search", search.trim());
  return p;
}

export default function EcosystemPage() {
  return (
    <Suspense fallback={null}>
      <EcosystemPageInner />
    </Suspense>
  );
}

function EcosystemPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const init = useMemo(() => filtersFromParams(searchParams), []); // eslint-disable-line react-hooks/exhaustive-deps

  const [filters, setFilters] = useState<EcosystemFilters>(init.filters);
  const [search, setSearch] = useState(init.search);
  const [activePartner, setActivePartner] = useState<Partner | null>(null);

  // Deep-link: ?partner=<id> opens detail drawer on mount
  useEffect(() => {
    const partnerId = searchParams.get("partner");
    if (partnerId) {
      const found = PARTNERS.find((p) => p.id === partnerId);
      if (found) setActivePartner(found);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync filters + search → URL
  useEffect(() => {
    const params = filtersToParams(filters, search);
    if (activePartner) params.set("partner", activePartner.id);
    const newSearch = params.toString();
    const current = searchParams.toString();
    if (newSearch !== current) {
      router.replace(`/ecosystem${newSearch ? `?${newSearch}` : ""}`, { scroll: false });
    }
  }, [filters, search, activePartner, router, searchParams]);

  const results = useMemo(
    () => PARTNERS.filter((p) => matchesPartner(p, filters, search)),
    [filters, search]
  );

  const alliances = useMemo(() => results.filter((p) => p.allianceMember), [results]);
  const partnerships = useMemo(
    () => results.filter((p) => p.ecosystemGroups?.includes("partnership")),
    [results]
  );
  const dataVendors = useMemo(
    () => results.filter((p) => p.ecosystemGroups?.includes("data-vendor")),
    [results]
  );
  const ratingProviders = useMemo(
    () => results.filter((p) => p.ecosystemGroups?.includes("rating-provider")),
    [results]
  );
  const otherCollaborations = useMemo(
    () =>
      results.filter(
        (p) => (!p.ecosystemGroups || p.ecosystemGroups.length === 0) && !p.allianceMember
      ),
    [results]
  );

  function toggleFilter(key: keyof EcosystemFilters, value: string) {
    setFilters((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  }

  const clearAll = useCallback(() => {
    setFilters(EMPTY_ECO_FILTERS);
    setSearch("");
  }, []);

  const hasActiveFilters =
    filters.solutions.length > 0 ||
    filters.industries.length > 0 ||
    search.trim().length > 0;

  // Active chips for toolbar
  type Chip = { key: string; label: string; onRemove: () => void };
  const activeChips: Chip[] = [
    ...filters.solutions.map((v) => ({
      key: `solution-${v}`,
      label: lookup(SOLUTION_FILTER_OPTIONS, v),
      onRemove: () => toggleFilter("solutions", v),
    })),
    ...filters.industries.map((v) => ({
      key: `industry-${v}`,
      label: lookup(ALL_INDUSTRIES, v),
      onRemove: () => toggleFilter("industries", v),
    })),
  ];

  return (
    <AppShell
      title="Ecosystem"
      breadcrumb={[
        { label: "Overview", href: "/" },
        { label: "Ecosystem" },
      ]}
    >
      <div className="flex h-full flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="shrink-0 border-b border-border bg-background px-4 py-3 space-y-2.5">
          {/* Row 1: header text */}
          <p className="text-[12px] text-muted-foreground leading-snug max-w-md">
            Explore technology, technical-advisory, and coalition partners that strengthen delivery across our sustainability solutions.
          </p>

          {/* Row 2: filter dropdowns */}
          <PartnerFilters
            filters={filters}
            allIndustries={ALL_INDUSTRIES}
            onToggle={toggleFilter}
          />

          {/* Row 3: active chips + result count */}
          <div className="flex items-center gap-2 flex-wrap">
            {activeChips.map((chip) => (
              <span
                key={chip.key}
                className="flex items-center gap-1 rounded border border-border bg-secondary px-2 py-0.5 text-[11px] text-foreground"
              >
                {chip.label}
                <button
                  onClick={chip.onRemove}
                  aria-label={`Remove ${chip.label} filter`}
                  className="text-muted-foreground hover:text-foreground focus-visible:outline-none"
                >
                  <X size={10} aria-hidden="true" />
                </button>
              </span>
            ))}
            {activeChips.length > 1 && (
              <button
                onClick={clearAll}
                className="text-[11px] text-muted-foreground hover:text-foreground focus-visible:outline-none"
              >
                Clear all
              </button>
            )}
            <span
              className="ml-auto text-[12px] text-muted-foreground tabular-nums"
              aria-live="polite"
              aria-atomic="true"
            >
              {results.length} partner{results.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Results, grouped into ecosystem sections */}
        <div className="flex-1 overflow-y-auto p-4">
          {results.length === 0 ? (
            <EcosystemEmptyState
              hasFilters={hasActiveFilters}
              onClearFilters={clearAll}
            />
          ) : (
            <>
              <AllianceStrip alliances={alliances} onViewProfile={setActivePartner} />
              <EcosystemSection
                title="Partnerships"
                description="Technology, technical-advisory, and implementation partners embedded in our sustainability delivery."
                partners={partnerships}
                onViewProfile={setActivePartner}
              />
              <EcosystemSection
                title="Data Vendors"
                description="Providers of underlying sustainability, carbon, and ESG data used across our solutions."
                partners={dataVendors}
                onViewProfile={setActivePartner}
              />
              <EcosystemSection
                title="Rating Service Providers"
                description="Third-party providers of corporate sustainability and ESG ratings."
                partners={ratingProviders}
                onViewProfile={setActivePartner}
              />
              <EcosystemSection
                title="Other Collaborations"
                description="Additional coalitions and relationships supporting specific solutions."
                partners={otherCollaborations}
                onViewProfile={setActivePartner}
              />
            </>
          )}
        </div>
      </div>

      {/* Detail drawer */}
      {activePartner && (
        <PartnerDetailDrawer
          partner={activePartner}
          onClose={() => setActivePartner(null)}
        />
      )}
    </AppShell>
  );
}
