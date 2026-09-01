/**
 * Deterministic case-count tool.
 *
 * The AI NEVER calls this directly — it only supplies an InterpretedAnalyticalRequest.
 * This module runs the deterministic calculation against the workbook registry.
 *
 * Column rules (per spec):
 *   A  = region      (Col A only)
 *   D  = end date    (Col D year only)
 *   Q  = solution    (Col Q only)
 *   T  = FST flag    (Col T only)
 */

import {
  getAllCaseRows,
  CASE_REGIONS,
  CASE_SOLUTIONS,
  CASE_INDUSTRIES,
  CASE_FISCAL_YEARS,
  type AnalyticalCase,
} from "@/lib/case-analytics";
import type {
  CaseAnalyticsToolResult,
  SolutionScope,
  InterpretedAssistantRequest,
} from "./types";
import { SCOPE_TO_SOLUTION_IDS } from "./types";

// ─── Date helpers ─────────────────────────────────────────────────────────────

function yearFromDate(dateStr: string): number {
  return new Date(dateStr).getFullYear();
}

function parseYearRange(
  startDate: string,
  endDate: string
): { startYear: number; endYear: number } {
  return {
    startYear: yearFromDate(startDate),
    endYear: yearFromDate(endDate),
  };
}

// ─── Core tool function ───────────────────────────────────────────────────────

export function runCaseAnalyticsTool(
  analyticalRequest: NonNullable<InterpretedAssistantRequest["analyticalRequest"]>
): CaseAnalyticsToolResult {
  const {
    scope = "sustainability",
    isFoodSystemsTransformation,
    resolvedDateRange,
    regionIds,
    breakdown,
  } = analyticalRequest;

  // Date range — default to full FY2021-2025 coverage if unresolved
  const startDate = resolvedDateRange?.startDate ?? "2021-01-01";
  const endDate = resolvedDateRange?.endDate ?? "2025-12-31";
  const { startYear, endYear } = parseYearRange(startDate, endDate);

  const allRows = getAllCaseRows();
  const invalidRows = allRows.filter((r) => r.caseEndYear === null || r.caseEndYear < 2021 || r.caseEndYear > 2025);

  // Workbook coverage
  const validYears = allRows.map((r) => r.caseEndYear).filter((y): y is number => y !== null);
  const minYear = validYears.length > 0 ? Math.min(...validYears) : undefined;
  const maxYear = validYears.length > 0 ? Math.max(...validYears) : undefined;
  const selectedPeriodPartiallyOutsideCoverage =
    startYear < (minYear ?? 2021) || endYear > (maxYear ?? 2025);

  // Filter rows
  const filteredRows = filterRows(allRows, {
    scope: scope as SolutionScope,
    isFoodSystemsTransformation,
    startYear,
    endYear,
    regionIds,
  });

  // Unique case codes
  const uniqueCodes = new Set(filteredRows.map((r) => r.caseCode));
  const uniqueCaseCount = uniqueCodes.size;

  // Breakdown by end year
  const yearMap = new Map<number, Set<string>>();
  for (const row of filteredRows) {
    if (row.caseEndYear !== null) {
      if (!yearMap.has(row.caseEndYear)) yearMap.set(row.caseEndYear, new Set());
      yearMap.get(row.caseEndYear)!.add(row.caseCode);
    }
  }
  const casesByEndYear = CASE_FISCAL_YEARS
    .filter((y) => {
      const yr = Number(y);
      return yr >= startYear && yr <= endYear;
    })
    .map((y) => ({
      year: Number(y),
      count: yearMap.get(Number(y))?.size ?? 0,
    }));

  // Breakdown by region
  const regionMap = new Map<string, Set<string>>();
  for (const row of filteredRows) {
    if (!regionMap.has(row.region)) regionMap.set(row.region, new Set());
    regionMap.get(row.region)!.add(row.caseCode);
  }
  const casesByRegion = CASE_REGIONS.map(({ id, label }) => ({
    region: label,
    count: regionMap.get(id)?.size ?? 0,
  })).filter((r) => r.count > 0);

  // Breakdown by solution
  const solutionMap = new Map<string, Set<string>>();
  for (const row of filteredRows) {
    if (!solutionMap.has(row.solution)) solutionMap.set(row.solution, new Set());
    solutionMap.get(row.solution)!.add(row.caseCode);
  }
  const casesBySolution = CASE_SOLUTIONS.map(({ id, label }) => ({
    solution: label,
    count: solutionMap.get(id)?.size ?? 0,
  })).filter((s) => s.count > 0);

  // Breakdown by industry
  const industryMap = new Map<string, Set<string>>();
  for (const row of filteredRows) {
    const key = row.industry ?? "Others";
    if (!industryMap.has(key)) industryMap.set(key, new Set());
    industryMap.get(key)!.add(row.caseCode);
  }
  const casesByIndustry = CASE_INDUSTRIES.map(({ id, label }) => ({
    industry: label,
    count: industryMap.get(id)?.size ?? 0,
  })).filter((i) => i.count > 0);

  // Methodology notes
  const methodologyNotes: string[] = [
    "Counts deduplicated on Case Code (Column B). Each unique Case Code is counted once regardless of row repetitions.",
    "Time filter applied on Column D (Case End Date) — year extracted from end date.",
    "Solution filter applied on Column Q only.",
    "Industry breakdown applied on Column H (Industry Practice Area); five low-volume categories are grouped as \"Others\".",
    isFoodSystemsTransformation
      ? "Food Systems Transformation filter applied on Column T — only rows where Column T equals the canonical FST phrase are included."
      : "Food Systems Transformation filter not applied — all cases included regardless of Column T.",
  ];

  if (regionIds.length > 0) {
    methodologyNotes.push(
      `Region filter applied on Column A: ${regionIds.join(", ")}.`
    );
  }

  if (invalidRows.length > 0) {
    methodologyNotes.push(
      `${invalidRows.length} row(s) excluded due to missing or out-of-range end dates (outside FY2021-2025).`
    );
  }

  return {
    uniqueCaseCount,
    excludedInvalidEndDateCount: invalidRows.length,
    request: {
      scope: scope ?? "sustainability",
      isFoodSystemsTransformation,
      startDate,
      endDate,
      regions: regionIds,
      breakdown,
    },
    dataBasis: {
      uniqueIdentifier: "Case Code",
      timeField: "Column D — Case End Date",
      regionField: "Column A",
      industryField: "Column H",
      solutionField: "Column Q",
      foodSystemsField: "Column T",
    },
    casesByEndYear,
    casesByRegion,
    casesBySolution,
    casesByIndustry,
    workbookCoverage: {
      minimumEndDate: minYear ? `${minYear}-01-01` : undefined,
      maximumEndDate: maxYear ? `${maxYear}-12-31` : undefined,
      selectedPeriodPartiallyOutsideCoverage,
    },
    methodologyNotes,
  };
}

// ─── Row filter ───────────────────────────────────────────────────────────────

function filterRows(
  rows: AnalyticalCase[],
  opts: {
    scope: SolutionScope;
    isFoodSystemsTransformation: boolean;
    startYear: number;
    endYear: number;
    regionIds: string[];
  }
): AnalyticalCase[] {
  const { scope, isFoodSystemsTransformation, startYear, endYear, regionIds } = opts;

  // Allowed solution IDs for this scope
  const allowedSolutions = SCOPE_TO_SOLUTION_IDS[scope];

  return rows.filter((row) => {
    // Year range filter (Col D)
    if (row.caseEndYear === null || row.caseEndYear < startYear || row.caseEndYear > endYear)
      return false;
    // Only consider FY2021-2025
    if (row.caseEndYear < 2021 || row.caseEndYear > 2025) return false;

    // Solution filter (Col Q)
    if (allowedSolutions !== null) {
      const solutionNorm = row.solution.trim().toLowerCase();
      const match = allowedSolutions.some(
        (s) => s.trim().toLowerCase() === solutionNorm
      );
      if (!match) return false;
    }

    // FST filter (Col T)
    if (isFoodSystemsTransformation && !row.foodSystemsTransformation) return false;

    // Region filter (Col A)
    if (regionIds.length > 0) {
      const regionNorm = row.region.trim().toLowerCase();
      const match = regionIds.some((r) => r.trim().toLowerCase() === regionNorm);
      if (!match) return false;
    }

    return true;
  });
}
