"use client";

import { Suspense, useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { FilterPanel } from "@/components/FilterPanel";
import { CredentialCard } from "@/components/credentials/CredentialCard";
import { CredentialListItem } from "@/components/credentials/CredentialListItem";
import { CredentialDetailDrawer } from "@/components/credentials/CredentialDetailDrawer";
import { ActiveFilterChips } from "@/components/credentials/ActiveFilterChips";
import { CredentialsSearch } from "@/components/credentials/CredentialsSearch";
import { CredentialsViewToggle } from "@/components/credentials/CredentialsViewToggle";
import { CredentialsEmptyState } from "@/components/credentials/CredentialsEmptyState";
import { SaveSearchButton } from "@/components/saved-searches/SaveSearchButton";
import { CREDENTIALS } from "@/data/credentials";
import {
  PRODUCTS,
  INDUSTRIES,
  REGIONS,
  CAPABILITIES,
  CLIENT_NEEDS,
  CONTENT_TYPES,
  CONFIDENTIALITY_OPTIONS,
} from "@/data/solutions";
import { EXPERTS } from "@/data/experts";
import { PARTNERS } from "@/data/partners";
import { SOLUTION_FILTER_OPTIONS } from "@/data/solution-config";
import type { ActiveFilters, Credential } from "@/types/credentials";
import { cn } from "@/lib/utils";

const EMPTY_FILTERS: ActiveFilters = {
  solutions: [],
  products: [],
  industries: [],
  regions: [],
  capabilities: [],
  clientNeeds: [],
  contentTypes: [],
  confidentiality: [],
  search: "",
  sortBy: "relevance",
};

// Expert filter is a special overlay — not part of ActiveFilters
// It narrows results to credentials where expertIds includes the given expert id.
// Stored separately so it can show a named chip and be dismissed independently.
interface ExpertOverlay {
  expertId: string;
  expertName: string;
}

// Partner overlay — narrows results to credentials linked to the given partner.
interface PartnerOverlay {
  partnerId: string;
  partnerName: string;
}

function lookup(arr: { id: string; label: string }[], id: string) {
  return arr.find((a) => a.id === id)?.label ?? id;
}

function matchesFilters(c: Credential, f: ActiveFilters): boolean {
  if (f.solutions.length > 0 && !c.solutionIds.some((s) => f.solutions.includes(s)))
    return false;
  if (f.products.length > 0 && !c.productIds.some((p) => f.products.includes(p)))
    return false;
  if (f.industries.length > 0 && !c.industryIds.some((i) => f.industries.includes(i)))
    return false;
  if (f.regions.length > 0 && !c.regionIds.some((r) => f.regions.includes(r)))
    return false;
  if (f.capabilities.length > 0 && !c.capabilityIds.some((cap) => f.capabilities.includes(cap)))
    return false;
  if (f.clientNeeds.length > 0 && !c.clientNeedIds.some((cn) => f.clientNeeds.includes(cn)))
    return false;
  if (f.contentTypes.length > 0 && !f.contentTypes.includes(c.type))
    return false;
  if (f.confidentiality.length > 0 && !f.confidentiality.includes(c.confidentiality))
    return false;
  if (f.search.trim()) {
    const q = f.search.toLowerCase();
    // Resolve expert names + partner names for search
    const expertNames = c.expertIds.map(
      (eid) => EXPERTS.find((e) => e.id === eid)?.name ?? ""
    );
    const partnerNames = c.partnerIds.map(
      (pid) => PARTNERS.find((p) => p.id === pid)?.name ?? ""
    );
    const searchable = [
      c.title,
      c.summary,
      c.challenge ?? "",
      c.clientAlias ?? "",
      ...c.actions,
      ...c.results.map((r) => r.label),
      ...c.keywords,
      ...c.productIds.map((id) => lookup(PRODUCTS, id)),
      ...c.industryIds.map((id) => lookup(INDUSTRIES, id)),
      ...c.regionIds.map((id) => lookup(REGIONS, id)),
      ...c.capabilityIds.map((id) => lookup(CAPABILITIES, id)),
      ...c.clientNeedIds.map((id) => lookup(CLIENT_NEEDS, id)),
      ...expertNames,
      ...partnerNames,
    ]
      .join(" ")
      .toLowerCase();
    if (!searchable.includes(q)) return false;
  }
  return true;
}

function sortResults(
  results: Credential[],
  sortBy: ActiveFilters["sortBy"],
  query: string
): Credential[] {
  if (sortBy === "title") {
    return [...results].sort((a, b) => a.title.localeCompare(b.title));
  }
  if (sortBy === "recent") {
    return [...results].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  }
  return [...results].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    if (query) {
      const q = query.toLowerCase();
      const aTitle = a.title.toLowerCase().includes(q) ? 0 : 1;
      const bTitle = b.title.toLowerCase().includes(q) ? 0 : 1;
      return aTitle - bTitle;
    }
    return 0;
  });
}

function filtersFromParams(params: URLSearchParams): Partial<ActiveFilters> {
  function getList(key: string): string[] {
    const v = params.get(key);
    return v ? v.split(",").filter(Boolean) : [];
  }
  const result: Partial<ActiveFilters> = {};
  const solutions = getList("solution");
  if (solutions.length) result.solutions = solutions;
  const products = getList("product");
  if (products.length) result.products = products;
  const industries = getList("industry");
  if (industries.length) result.industries = industries;
  const regions = getList("region");
  if (regions.length) result.regions = regions;
  const capabilities = getList("capability");
  if (capabilities.length) result.capabilities = capabilities;
  const clientNeeds = getList("clientNeed");
  if (clientNeeds.length) result.clientNeeds = clientNeeds;
  const search = params.get("search");
  if (search) result.search = search;
  return result;
}

function expertOverlayFromParams(params: URLSearchParams): ExpertOverlay | null {
  const expertId = params.get("expert");
  if (!expertId) return null;
  const expert = EXPERTS.find((e) => e.id === expertId);
  if (!expert) return null;
  return { expertId, expertName: expert.name };
}

function partnerOverlayFromParams(params: URLSearchParams): PartnerOverlay | null {
  const partnerId = params.get("partner");
  if (!partnerId) return null;
  const partner = PARTNERS.find((p) => p.id === partnerId);
  if (!partner) return null;
  return { partnerId, partnerName: partner.name };
}

function filtersToParams(f: ActiveFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.solutions.length) p.set("solution", f.solutions.join(","));
  if (f.products.length) p.set("product", f.products.join(","));
  if (f.industries.length) p.set("industry", f.industries.join(","));
  if (f.regions.length) p.set("region", f.regions.join(","));
  if (f.capabilities.length) p.set("capability", f.capabilities.join(","));
  if (f.clientNeeds.length) p.set("clientNeed", f.clientNeeds.join(","));
  if (f.search.trim()) p.set("search", f.search.trim());
  return p;
}

const VIEW_STORAGE_KEY = "dsc-creds-view-v1";

function getStoredView(): "card" | "list" {
  if (typeof window === "undefined") return "card";
  return (localStorage.getItem(VIEW_STORAGE_KEY) as "card" | "list") ?? "card";
}

export default function CredentialsPage() {
  return (
    <Suspense fallback={null}>
      <CredentialsPageInner />
    </Suspense>
  );
}

function CredentialsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialise filters from URL on first render
  const [filters, setFilters] = useState<ActiveFilters>(() => ({
    ...EMPTY_FILTERS,
    ...filtersFromParams(searchParams),
  }));
  // Expert overlay — narrows results to one expert's credentials, shows a named chip
  const [expertOverlay, setExpertOverlay] = useState<ExpertOverlay | null>(() =>
    expertOverlayFromParams(searchParams)
  );
  // Partner overlay — narrows results to credentials linked to one partner, shows a named chip
  const [partnerOverlay, setPartnerOverlay] = useState<PartnerOverlay | null>(() =>
    partnerOverlayFromParams(searchParams)
  );
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [drawerCred, setDrawerCred] = useState<Credential | null>(null);

  // Deep-link: ?credential=<id> opens that credential's drawer on mount
  useEffect(() => {
    const credParam = searchParams.get("credential");
    if (credParam) {
      const found = CREDENTIALS.find((c) => c.id === credParam);
      if (found) setDrawerCred(found);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Restore persisted view preference on mount
  useEffect(() => {
    setViewMode(getStoredView());
  }, []);

  // Sync filters + overlays → URL
  useEffect(() => {
    const params = filtersToParams(filters);
    if (expertOverlay) params.set("expert", expertOverlay.expertId);
    if (partnerOverlay) params.set("partner", partnerOverlay.partnerId);
    const newSearch = params.toString();
    const current = searchParams.toString();
    if (newSearch !== current) {
      router.replace(`/credentials${newSearch ? `?${newSearch}` : ""}`, {
        scroll: false,
      });
    }
  }, [filters, expertOverlay, partnerOverlay, router, searchParams]);

  // Persist view preference
  function handleViewChange(v: "card" | "list") {
    setViewMode(v);
    if (typeof window !== "undefined") {
      localStorage.setItem(VIEW_STORAGE_KEY, v);
    }
  }

  const results = useMemo(() => {
    const filtered = CREDENTIALS.filter((c) => {
      // Expert overlay: only show credentials where this expert is listed
      if (expertOverlay && !c.expertIds.includes(expertOverlay.expertId)) return false;
      // Partner overlay: only show credentials linked to this partner
      if (partnerOverlay && !c.partnerIds.includes(partnerOverlay.partnerId)) return false;
      return matchesFilters(c, filters);
    });
    return sortResults(filtered, filters.sortBy, filters.search);
  }, [filters, expertOverlay, partnerOverlay]);

  function toggleFilter(
    key: keyof Omit<ActiveFilters, "search" | "sortBy">,
    value: string
  ) {
    setFilters((prev) => {
      const arr = prev[key] as string[];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  }

  const clearAll = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setExpertOverlay(null);
    setPartnerOverlay(null);
  }, []);
  const clearSearch = useCallback(
    () => setFilters((p) => ({ ...p, search: "" })),
    []
  );
  const clearFilters = useCallback(() => {
    setFilters((p) => ({
      ...p,
      solutions: [],
      products: [],
      industries: [],
      regions: [],
      capabilities: [],
      clientNeeds: [],
      contentTypes: [],
      confidentiality: [],
    }));
    setExpertOverlay(null);
    setPartnerOverlay(null);
  }, []);

  // Called from drawer — apply a taxonomy filter and close the drawer
  const handleDrawerFilter = useCallback(
    (
      key: "product" | "industry" | "region" | "capability" | "clientNeed",
      value: string
    ) => {
      const map: Record<string, keyof Omit<ActiveFilters, "search" | "sortBy">> = {
        product: "products",
        industry: "industries",
        region: "regions",
        capability: "capabilities",
        clientNeed: "clientNeeds",
      };
      toggleFilter(map[key], value);
      setDrawerCred(null);
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Build active chips
  type Chip = { key: string; label: string; onRemove: () => void };
  const activeChips: Chip[] = [
    ...(expertOverlay
      ? [
          {
            key: `expert-${expertOverlay.expertId}`,
            label: expertOverlay.expertName,
            onRemove: () => setExpertOverlay(null),
          },
        ]
      : []),
    ...(partnerOverlay
      ? [
          {
            key: `partner-${partnerOverlay.partnerId}`,
            label: partnerOverlay.partnerName,
            onRemove: () => setPartnerOverlay(null),
          },
        ]
      : []),
    ...filters.solutions.map((v) => ({
      key: `solution-${v}`,
      label: lookup(SOLUTION_FILTER_OPTIONS, v),
      onRemove: () => toggleFilter("solutions", v),
    })),
    ...filters.products.map((v) => ({
      key: `product-${v}`,
      label: lookup(PRODUCTS, v),
      onRemove: () => toggleFilter("products", v),
    })),
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
    ...filters.capabilities.map((v) => ({
      key: `capability-${v}`,
      label: lookup(CAPABILITIES, v),
      onRemove: () => toggleFilter("capabilities", v),
    })),
    ...filters.clientNeeds.map((v) => ({
      key: `clientNeed-${v}`,
      label: lookup(CLIENT_NEEDS, v),
      onRemove: () => toggleFilter("clientNeeds", v),
    })),
    ...filters.contentTypes.map((v) => ({
      key: `contentType-${v}`,
      label: lookup(CONTENT_TYPES, v),
      onRemove: () => toggleFilter("contentTypes", v),
    })),
    ...filters.confidentiality.map((v) => ({
      key: `conf-${v}`,
      label: lookup(CONFIDENTIALITY_OPTIONS, v),
      onRemove: () => toggleFilter("confidentiality", v),
    })),
  ];

  const hasActiveFilters = activeChips.length > 0;
  const hasSearch = filters.search.trim().length > 0;

  return (
    <AppShell
      title="Case Examples Explorer"
      breadcrumb={[
        { label: "Overview", href: "/" },
        { label: "Case Examples" },
      ]}
    >
      <div className="flex h-full flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-border bg-background px-4 py-3 space-y-2.5 shrink-0">
          {/* Row 1: search */}
          <div className="flex items-center gap-2">
            <CredentialsSearch
              value={filters.search}
              onChange={(v) => setFilters((p) => ({ ...p, search: v }))}
            />
          </div>

          {/* Row 2: filter dropdowns */}
          <FilterPanel filters={filters} onToggle={toggleFilter} />

          {/* Row 3: chips + count + sort + view toggle */}
          <div className="flex flex-wrap items-center gap-2">
              {hasActiveFilters ? (
                <ActiveFilterChips chips={activeChips} onClearAll={clearAll} />
              ) : (
                <span className="flex-1" aria-hidden="true" />
              )}
              <div className="flex items-center gap-2 ml-auto shrink-0">
                <span className="text-[12px] text-muted-foreground tabular-nums whitespace-nowrap" aria-live="polite" aria-atomic="true">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </span>
                <CredentialsViewToggle value={viewMode} onChange={handleViewChange} />
                <SaveSearchButton
                  type="credentials"
                  queryParams={{
                    ...(filters.search ? { q: filters.search } : {}),
                    ...(filters.solutions.length ? { solutions: filters.solutions } : {}),
                    ...(filters.products.length ? { products: filters.products } : {}),
                    ...(filters.industries.length ? { industries: filters.industries } : {}),
                    ...(filters.regions.length ? { regions: filters.regions } : {}),
                    ...(filters.capabilities.length ? { capabilities: filters.capabilities } : {}),
                    ...(filters.clientNeeds.length ? { clientNeeds: filters.clientNeeds } : {}),
                    ...(filters.contentTypes.length ? { contentTypes: filters.contentTypes } : {}),
                    ...(filters.confidentiality.length ? { confidentiality: filters.confidentiality } : {}),
                    ...(filters.sortBy !== "relevance" ? { sortBy: filters.sortBy } : {}),
                    ...(expertOverlay ? { expert: expertOverlay.expertId } : {}),
                    ...(partnerOverlay ? { partner: partnerOverlay.partnerId } : {}),
                  }}
                  defaultName={filters.search ? `"${filters.search}"` : ""}
                  hasResults={results.length > 0}
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-4">
            {results.length === 0 ? (
              <CredentialsEmptyState
                hasFilters={hasActiveFilters}
                hasSearch={hasSearch}
                onClearFilters={clearFilters}
                onClearSearch={clearSearch}
                onClearAll={clearAll}
              />
            ) : viewMode === "card" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((c) => (
                  <CredentialCard
                    key={c.id}
                    credential={c}
                    onViewDetails={setDrawerCred}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded border border-border overflow-hidden">
                {results.map((c) => (
                  <CredentialListItem
                    key={c.id}
                    credential={c}
                    onViewDetails={setDrawerCred}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      <CredentialDetailDrawer
        credential={drawerCred}
        onClose={() => {
          setDrawerCred(null);
          // Remove ?credential= from URL if present (set by deep-link)
          if (searchParams.get("credential")) {
            const params = filtersToParams(filters);
            if (expertOverlay) params.set("expert", expertOverlay.expertId);
            if (partnerOverlay) params.set("partner", partnerOverlay.partnerId);
            router.replace(`/credentials${params.toString() ? `?${params}` : ""}`, { scroll: false });
          }
        }}
        onApplyFilter={handleDrawerFilter}
      />
    </AppShell>
  );
}
