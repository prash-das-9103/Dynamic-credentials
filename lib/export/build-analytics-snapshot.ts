/**
 * lib/export/build-analytics-snapshot.ts
 *
 * Builds an AnalyticsSnapshot from the EXISTING deterministic case analytics
 * functions. Never recalculates independently of the established pipeline.
 *
 * Call client-side when the pack contains a "chart" item so the snapshot
 * can be sent alongside the packJson to the export API route.
 */

import type { AnalyticsSnapshot } from "./types";
import {
  applyCaseFilters,
  computeCaseKpis,
  countBySolution,
  countByRegion,
  countByIndustry,
  countByEndYear,
  EMPTY_CASE_FILTERS,
} from "@/lib/case-analytics";
import type { CaseFilters } from "@/lib/case-analytics";

export function buildAnalyticsSnapshot(
  filters: CaseFilters = EMPTY_CASE_FILTERS,
  workbookImportDate = "2026-08-06"
): AnalyticsSnapshot {
  const rows = applyCaseFilters(filters);
  const kpis = computeCaseKpis(rows);
  const solutionRows = countBySolution(rows);
  const regionRows = countByRegion(rows);
  const industryRows = countByIndustry(rows);
  const yearRows = countByEndYear(rows);

  const yearRange = filters.years.length > 0
    ? `${filters.years[0]}–${filters.years[filters.years.length - 1]}`
    : "FY2021–FY2025";

  return {
    kpis,
    solutionRows: solutionRows.map((r) => ({ id: r.id, label: r.label, count: r.count })),
    regionRows: regionRows.map((r) => ({ id: r.id, label: r.label, count: r.count })),
    industryRows: industryRows.map((r) => ({ id: r.id, label: r.label, count: r.count })),
    yearRows: yearRows.map((r) => ({ id: r.id, label: r.label, count: r.count })),
    filters: {
      regions: filters.regions,
      solutions: filters.solutions,
      industries: filters.industries,
      years: filters.years,
      fstOnly: filters.fstOnly,
    },
    period: yearRange,
    workbookImportDate,
  };
}
