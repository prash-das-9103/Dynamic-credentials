"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Plus, Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  applyCaseFilters,
  computeCaseKpis,
  computeCaseTakeaways,
  countBySolution,
  countBySolutionCombined,
  countByRegion,
  countByIndustry,
  countByEndYear,
  countFst,
  countEnergyTransition,
  getTotalCaseCount,
  EMPTY_CASE_FILTERS,
} from "@/lib/case-analytics";
import { usePackContext } from "@/lib/pack-context";
import { cn } from "@/lib/utils";
import { CaseFiltersPanel } from "@/components/analytics/CaseFiltersPanel";
import { CaseKpis } from "@/components/analytics/CaseKpis";
import {
  CaseSolutionChart,
  CaseRegionChart,
  CaseIndustryChart,
  CaseYearChart,
  CaseFstBreakdown,
} from "@/components/analytics/CaseCharts";
import { CaseTakeaways } from "@/components/analytics/CaseTakeaways";
import type { DisplayMode } from "@/components/analytics/types";
import type { CaseFilters } from "@/lib/case-analytics";

// ─── URL helpers ──────────────────────────────────────────────────────────────

function caseFiltersToParams(filters: CaseFilters, mode: DisplayMode): URLSearchParams {
  const p = new URLSearchParams();
  for (const r of filters.regions) p.append("cr", r);
  for (const s of filters.solutions) p.append("cs", s);
  for (const i of filters.industries) p.append("ci", i);
  for (const y of filters.years) p.append("cy", y);
  if (filters.fstOnly) p.set("fst", "1");
  if (filters.energyTransitionOnly) p.set("et", "1");
  if (mode === "pct") p.set("mode", "pct");
  return p;
}

function caseFiltersFromParams(sp: URLSearchParams): CaseFilters {
  return {
    regions: sp.getAll("cr"),
    solutions: sp.getAll("cs"),
    industries: sp.getAll("ci"),
    years: sp.getAll("cy"),
    fstOnly: sp.get("fst") === "1",
    energyTransitionOnly: sp.get("et") === "1",
  };
}

const TOTAL_REGISTRY = getTotalCaseCount();

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <AnalyticsPageInner />
    </Suspense>
  );
}

function AnalyticsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMounted = useRef(false);

  // Display mode
  const mode: DisplayMode = searchParams.get("mode") === "pct" ? "pct" : "count";

  // Filter state
  const caseFilters = useMemo(() => caseFiltersFromParams(searchParams), [searchParams]);

  function setMode(m: DisplayMode) {
    const p = caseFiltersToParams(caseFilters, m);
    router.replace(`/analytics?${p.toString()}`, { scroll: false });
  }

  const updateCaseFilters = useCallback(
    (next: CaseFilters) => {
      const p = caseFiltersToParams(next, mode);
      router.replace(`/analytics?${p.toString()}`, { scroll: false });
    },
    [mode, router]
  );

  type ArrayFilterKey = "regions" | "solutions" | "industries" | "years";

  function toggleCaseFilter(key: ArrayFilterKey, value: string) {
    const arr = caseFilters[key];
    const next = {
      ...caseFilters,
      [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    };
    updateCaseFilters(next);
  }

  // Turning either focused view ON resets every other filter (region/solution/
  // industry/year) and turns the other focused view OFF — the two are
  // mutually exclusive, single-purpose lenses on the full registry.
  function toggleFstOnly() {
    if (caseFilters.fstOnly) {
      updateCaseFilters({ ...caseFilters, fstOnly: false });
    } else {
      updateCaseFilters({
        ...EMPTY_CASE_FILTERS,
        fstOnly: true,
      });
    }
  }

  function toggleEnergyTransitionOnly() {
    if (caseFilters.energyTransitionOnly) {
      updateCaseFilters({ ...caseFilters, energyTransitionOnly: false });
    } else {
      updateCaseFilters({
        ...EMPTY_CASE_FILTERS,
        energyTransitionOnly: true,
      });
    }
  }

  function resetCaseFilters() {
    router.replace("/analytics", { scroll: false });
  }

  useEffect(() => {
    isMounted.current = true;
  }, []);

  // ─── Derived data ────────────────────────────────────────────────────────────

  const filteredCases = useMemo(() => applyCaseFilters(caseFilters), [caseFilters]);
  const caseTotal = useMemo(
    () => new Set(filteredCases.map((r) => r.caseCode)).size,
    [filteredCases]
  );
  const caseKpis = useMemo(() => computeCaseKpis(filteredCases), [filteredCases]);
  const solutionDataCombined = useMemo(() => countBySolutionCombined(filteredCases), [filteredCases]);
  const solutionDataUnique = useMemo(() => countBySolution(filteredCases), [filteredCases]);
  const caseRegionData = useMemo(() => countByRegion(filteredCases), [filteredCases]);
  const caseIndustryData = useMemo(() => countByIndustry(filteredCases), [filteredCases]);
  const caseYearData = useMemo(() => countByEndYear(filteredCases), [filteredCases]);
  const fstCount = useMemo(() => countFst(filteredCases), [filteredCases]);
  const energyTransitionCount = useMemo(() => countEnergyTransition(filteredCases), [filteredCases]);
  const caseTakeaways = useMemo(
    () =>
      computeCaseTakeaways(
        filteredCases,
        caseKpis,
        solutionDataUnique,
        caseYearData,
        caseIndustryData,
        caseRegionData,
        caseFilters
      ),
    [filteredCases, caseKpis, solutionDataUnique, caseYearData, caseIndustryData, caseRegionData, caseFilters]
  );
  const hasActiveCaseFilters =
    caseFilters.regions.length > 0 ||
    caseFilters.solutions.length > 0 ||
    caseFilters.industries.length > 0 ||
    caseFilters.years.length > 0 ||
    caseFilters.fstOnly ||
    caseFilters.energyTransitionOnly;

  // FST-only and Energy Transition-only are focused, single-purpose lenses:
  // they drop the Solution breakdown (every case already shares that trait)
  // and show just Region / Case End Year / Industry.
  const isFocusedView = caseFilters.fstOnly || caseFilters.energyTransitionOnly;

  const showPct = mode === "pct";

  // ─── Pack integration ───────────────────────────────────────────────────────

  const { addItem, hasItem, removeItem } = usePackContext();
  const summaryId = "chart-analytics-summary";
  const summaryInPack = hasItem(summaryId);

  function toggleSummaryPack() {
    if (summaryInPack) {
      removeItem(summaryId);
    } else {
      addItem({
        id: summaryId,
        itemType: "chart",
        title: "Analytics Summary",
        subtitle: `${caseTotal} cases · ${mode === "pct" ? "%" : "Count"} mode`,
        exportRestricted: false,
        section: "analytics",
      });
    }
  }

  return (
    <AppShell
      title="Analytics"
      breadcrumb={[
        { label: "Overview", href: "/" },
        { label: "Analytics" },
      ]}
    >
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-5 px-6 py-6">

          {/* ── Page header ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-[20px] font-semibold text-foreground">Analytics</h2>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                Explore the FY2021-2025 Bain sustainability case registry derived from the uploaded workbook.
              </p>
            </div>

            {/* Header controls */}
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {/* Add summary to pack */}
              <button
                onClick={toggleSummaryPack}
                aria-label={summaryInPack ? "Remove analytics summary from pack" : "Add analytics summary to pack"}
                className={cn(
                  "flex items-center gap-1.5 rounded border px-3 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  summaryInPack
                    ? "border-[#CC0000] bg-[#CC0000] text-white"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                )}
              >
                {summaryInPack ? <Check size={12} aria-hidden /> : <Plus size={12} aria-hidden />}
                {summaryInPack ? "Summary added" : "Add summary to pack"}
              </button>

              {/* Reset */}
              {hasActiveCaseFilters && (
                <button
                  onClick={resetCaseFilters}
                  className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <RotateCcw size={12} aria-hidden />
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* ── Filters ──────────────────────────────────────────────────── */}
          <CaseFiltersPanel
            filters={caseFilters}
            onToggle={toggleCaseFilter}
            onFstToggle={toggleFstOnly}
            onEnergyTransitionToggle={toggleEnergyTransitionOnly}
          />

          {/* ── KPIs ─────────────────────────────────────────────────────── */}
          <CaseKpis kpis={caseKpis} totalRegistry={TOTAL_REGISTRY} />

          {/* ── Takeaways ────────────────────────────────────────────────── */}
          {caseTotal > 0 && <CaseTakeaways takeaways={caseTakeaways} />}

          {/* ── Methodology ──────────────────────────────────────────────── */}
          {caseTotal > 0 && (
            <p className="text-[11px] text-muted-foreground">
              <span className="font-medium">Methodology note:</span> Each row is counted by its unique Case Code. By default, Solution counts combine Column Q and Column S (Keyword, exact matches only) — a case can appear under more than one solution; use &quot;Unique Case Count&quot; on that chart to see Column Q only. Industry counts reflect Column H (Industry Practice Area); Higher Education &amp; Training, Healthcare &amp; Life Sciences, No Industry, Government/Public Sector, and Services are grouped as &quot;Others&quot;. Food Systems Transformation reflects exact Column T matches to &quot;Inclusive, sustainable &amp; healthy food systems&quot;. Energy Transition reflects a Column R mention of &quot;Energy Transition&quot; or an exact Column S match to &quot;Energy Transition Embedded&quot;.
            </p>
          )}

          {/* ── Count / % toggle ─────────────────────────────────────────── */}
          {caseTotal > 0 && (
            <div className="flex justify-end">
              <div
                className="flex overflow-hidden rounded border border-border"
                role="group"
                aria-label="Display mode"
              >
                <button
                  onClick={() => setMode("count")}
                  aria-pressed={mode === "count"}
                  className={cn(
                    "px-3 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    mode === "count"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Count
                </button>
                <button
                  onClick={() => setMode("pct")}
                  aria-pressed={mode === "pct"}
                  className={cn(
                    "px-3 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    mode === "pct"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  %
                </button>
              </div>
            </div>
          )}

          {/* ── Charts ───────────────────────────────────────────────────── */}
          {caseTotal === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded border border-dashed border-border py-12 text-center">
              <p className="text-[13px] text-muted-foreground">No cases match the current filters.</p>
              <button
                onClick={resetCaseFilters}
                className="rounded border border-border px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground"
              >
                Reset filters
              </button>
            </div>
          ) : isFocusedView ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <CaseYearChart
                data={caseYearData}
                total={caseTotal}
                showPct={showPct}
                displayMode={mode}
                activeYears={caseFilters.years}
                onBarClick={(id) => toggleCaseFilter("years", id)}
              />
              <CaseRegionChart
                data={caseRegionData}
                total={caseTotal}
                showPct={showPct}
                displayMode={mode}
                activeRegions={caseFilters.regions}
                onBarClick={(id) => toggleCaseFilter("regions", id)}
              />
              <CaseIndustryChart
                data={caseIndustryData}
                total={caseTotal}
                showPct={showPct}
                displayMode={mode}
                activeIndustries={caseFilters.industries}
                onBarClick={(id) => toggleCaseFilter("industries", id)}
              />
              {caseFilters.fstOnly && (
                <CaseFstBreakdown
                  fstCount={fstCount}
                  total={caseTotal}
                  showPct={showPct}
                />
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <CaseYearChart
                data={caseYearData}
                total={caseTotal}
                showPct={showPct}
                displayMode={mode}
                activeYears={caseFilters.years}
                onBarClick={(id) => toggleCaseFilter("years", id)}
              />
              <CaseRegionChart
                data={caseRegionData}
                total={caseTotal}
                showPct={showPct}
                displayMode={mode}
                activeRegions={caseFilters.regions}
                onBarClick={(id) => toggleCaseFilter("regions", id)}
              />
              <CaseSolutionChart
                combinedData={solutionDataCombined}
                uniqueData={solutionDataUnique}
                total={caseTotal}
                showPct={showPct}
                displayMode={mode}
                activeSolutions={caseFilters.solutions}
                onBarClick={(id) => toggleCaseFilter("solutions", id)}
              />
              <CaseIndustryChart
                data={caseIndustryData}
                total={caseTotal}
                showPct={showPct}
                displayMode={mode}
                activeIndustries={caseFilters.industries}
                onBarClick={(id) => toggleCaseFilter("industries", id)}
              />
            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
}
