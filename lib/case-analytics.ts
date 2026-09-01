/**
 * case-analytics.ts
 *
 * Pure aggregation functions over the workbook case registry.
 * All counts are based on UNIQUE Case Codes (column B).
 *
 * Column rules strictly followed (per spec):
 *   A  = region             — Col A only, case-insensitive match
 *   D  = case end date      — Col D year only for time filtering
 *   H  = industry           — Col H (Industry Practice Area); 5 low-volume
 *                              categories are bucketed into "Others"
 *   Q  = solution            — Col Q only (except FST)
 *   T  = FST tag             — Col T only; must equal the canonical phrase
 */

import CASE_DATA from "@/data/cases.json";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AnalyticalCase {
  caseCode: string;
  caseEndDate: string | null;
  caseEndYear: number | null;
  region: string;
  industry: string | null;
  solution: string;
  foodSystemsTransformation: boolean;
  /**
   * Solutions derived from Column S (Keyword), exact-match only. A cell can
   * map to more than one solution (e.g. "Circularity Embedded | Energy
   * Transition Embedded" maps to both Circular Value Creation and Transition
   * Strategy). Used only to compute the *combined* (non-unique) "By Solution"
   * view — never the authoritative Column Q `solution` field.
   */
  keywordSolutions: string[];
  /**
   * True when Column R (New products) mentions "Energy Transition", or
   * Column S (Keyword) contains an exact "Energy Transition Embedded" segment.
   */
  energyTransitionMention: boolean;
}

export interface CaseFilters {
  regions: string[];
  solutions: string[];
  industries: string[];
  years: string[];
  fstOnly: boolean;
  energyTransitionOnly: boolean;
}

export const EMPTY_CASE_FILTERS: CaseFilters = {
  regions: [],
  solutions: [],
  industries: [],
  years: [],
  fstOnly: false,
  energyTransitionOnly: false,
};

// ─── Taxonomy constants ───────────────────────────────────────────────────────

export const CASE_REGIONS = [
  { id: "EMEA", label: "EMEA" },
  { id: "Americas", label: "Americas" },
  { id: "APAC", label: "APAC" },
  { id: "Other Office Grouping", label: "Other" },
] as const;

export const CASE_SOLUTIONS = [
  { id: "Transition Strategy", label: "Transition Strategy" },
  { id: "Sustainability Value Creation", label: "Sustainability Value Creation" },
  { id: "Circular Value Creation", label: "Circular Value Creation" },
  { id: "Resilience & Adaptation", label: "Resilience & Adaptation" },
] as const;

/**
 * Industry Practice Area (Col H). "Others" is a rollup bucket covering the
 * five lowest-volume / non-industry categories in the workbook: Higher
 * Education & Training, Healthcare & Life Sciences, No Industry,
 * Government/Public Sector, and Services.
 */
export const CASE_INDUSTRIES = [
  { id: "Energy & Natural Resources", label: "Energy & Natural Resources" },
  { id: "Private Equity (Financial Investors)", label: "Private Equity" },
  { id: "Advanced Manufacturing & Services", label: "Advanced Manufacturing & Services" },
  { id: "Social Impact", label: "Social Impact" },
  { id: "Consumer Products", label: "Consumer Products" },
  { id: "Financial Services", label: "Financial Services" },
  { id: "Retail", label: "Retail" },
  { id: "Others", label: "Others" },
  { id: "Technology, Media & Telecom", label: "Technology, Media & Telecom" },
] as const;

/** FY2021-2025 — the authoritative range per workbook title. */
export const CASE_FISCAL_YEARS = ["2021", "2022", "2023", "2024", "2025"] as const;

// ─── Data access ──────────────────────────────────────────────────────────────

export function getAllCaseRows(): AnalyticalCase[] {
  return (CASE_DATA as { rows: AnalyticalCase[] }).rows;
}

/** Total unique case codes in the full registry (no filtering). */
export function getTotalCaseCount(): number {
  return new Set(getAllCaseRows().map((r) => r.caseCode)).size;
}

// ─── Filtering ────────────────────────────────────────────────────────────────

/**
 * Apply CaseFilters to the full case registry.
 * Returns only rows within FY2021-2025 by default (year filter applies on top).
 * When `fstOnly` is true, only rows where `foodSystemsTransformation === true` are included.
 */
export function applyCaseFilters(filters: CaseFilters): AnalyticalCase[] {
  return getAllCaseRows().filter((row) => {
    // Always restrict to FY2021-2025 range — out-of-range years are data anomalies
    if (row.caseEndYear === null || row.caseEndYear < 2021 || row.caseEndYear > 2025) return false;

    if (filters.regions.length > 0) {
      const norm = row.region.trim().toLowerCase();
      const match = filters.regions.some((r) => r.trim().toLowerCase() === norm);
      if (!match) return false;
    }

    // Solution filter — Col Q only
    if (filters.solutions.length > 0) {
      const match = filters.solutions.some(
        (s) => s.trim().toLowerCase() === row.solution.trim().toLowerCase()
      );
      if (!match) return false;
    }

    // Industry filter — Col H (bucketed) only
    if (filters.industries.length > 0) {
      const norm = (row.industry ?? "").trim().toLowerCase();
      const match = filters.industries.some((i) => i.trim().toLowerCase() === norm);
      if (!match) return false;
    }

    // Year filter — Col D only
    if (filters.years.length > 0) {
      if (row.caseEndYear === null) return false;
      if (!filters.years.includes(String(row.caseEndYear))) return false;
    }

    // FST filter — Col T only
    if (filters.fstOnly && !row.foodSystemsTransformation) return false;

    // Energy Transition filter — Col R substring + Col S exact match
    if (filters.energyTransitionOnly && !row.energyTransitionMention) return false;

    return true;
  });
}

/** Count unique case codes in a filtered row set. */
export function uniqueCaseCount(rows: AnalyticalCase[]): number {
  return new Set(rows.map((r) => r.caseCode)).size;
}

// ─── Aggregation ──────────────────────────────────────────────────────────────

export interface CaseAggRow {
  id: string;
  label: string;
  count: number; // unique case codes
}

function countUnique(
  rows: AnalyticalCase[],
  key: (r: AnalyticalCase) => string
): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const row of rows) {
    const k = key(row);
    if (!map.has(k)) map.set(k, new Set());
    map.get(k)!.add(row.caseCode);
  }
  return map;
}

/** Count unique cases by solution (Col Q only). This is the "Unique Case Count" mode. */
export function countBySolution(rows: AnalyticalCase[]): CaseAggRow[] {
  const map = countUnique(rows, (r) => r.solution);
  return CASE_SOLUTIONS.map(({ id, label }) => ({
    id,
    label,
    count: map.get(id)?.size ?? 0,
  }));
}

/**
 * Count unique cases by solution using Column Q OR Column S (Keyword).
 * A case with a Column S keyword tagging a different solution than its
 * Column Q value is counted under BOTH — so bucket totals can sum to more
 * than the total unique case count. This is the default "By Solution" view.
 */
export function countBySolutionCombined(rows: AnalyticalCase[]): CaseAggRow[] {
  const map = new Map<string, Set<string>>();
  for (const row of rows) {
    const solutions = new Set<string>([row.solution, ...row.keywordSolutions]);
    for (const s of solutions) {
      if (!map.has(s)) map.set(s, new Set());
      map.get(s)!.add(row.caseCode);
    }
  }
  return CASE_SOLUTIONS.map(({ id, label }) => ({
    id,
    label,
    count: map.get(id)?.size ?? 0,
  }));
}

/** Count unique cases by region (Col A). */
export function countByRegion(rows: AnalyticalCase[]): CaseAggRow[] {
  const map = countUnique(rows, (r) => r.region);
  return CASE_REGIONS.map(({ id, label }) => ({
    id,
    label,
    count: map.get(id)?.size ?? 0,
  }));
}

/** Count unique cases by industry (Col H, bucketed). */
export function countByIndustry(rows: AnalyticalCase[]): CaseAggRow[] {
  const map = countUnique(rows, (r) => r.industry ?? "Others");
  return CASE_INDUSTRIES.map(({ id, label }) => ({
    id,
    label,
    count: map.get(id)?.size ?? 0,
  }));
}

/** Count unique cases by end year (Col D), FY2021-2025 only. */
export function countByEndYear(rows: AnalyticalCase[]): CaseAggRow[] {
  const map = countUnique(rows, (r) => String(r.caseEndYear ?? "unknown"));
  return CASE_FISCAL_YEARS.map((y) => ({
    id: y,
    label: `FY${y.slice(2)}`,
    count: map.get(y)?.size ?? 0,
  }));
}

/** Count unique FST cases (Col T match). */
export function countFst(rows: AnalyticalCase[]): number {
  return new Set(rows.filter((r) => r.foodSystemsTransformation).map((r) => r.caseCode)).size;
}

/** Count unique Energy Transition cases (Col R mention + Col S exact match). */
export function countEnergyTransition(rows: AnalyticalCase[]): number {
  return new Set(rows.filter((r) => r.energyTransitionMention).map((r) => r.caseCode)).size;
}

// ─── KPIs ───────────────────────────────────────────��─────────────────────────

export interface CaseKpiValues {
  total: number;
  emea: number;
  americas: number;
  apac: number;
  fst: number;
  energyTransition: number;
}

export function computeCaseKpis(rows: AnalyticalCase[]): CaseKpiValues {
  const total = uniqueCaseCount(rows);
  const regionMap = countUnique(rows, (r) => r.region);

  return {
    total,
    emea: regionMap.get("EMEA")?.size ?? 0,
    americas: regionMap.get("Americas")?.size ?? 0,
    apac: regionMap.get("APAC")?.size ?? 0,
    fst: countFst(rows),
    energyTransition: countEnergyTransition(rows),
  };
}

// ─── Takeaways ────────────────────────────────────────────────────────────────

export interface CaseTakeaway {
  text: string;
}

export function computeCaseTakeaways(
  rows: AnalyticalCase[],
  kpis: CaseKpiValues,
  solutionData: CaseAggRow[],
  yearData: CaseAggRow[],
  industryData: CaseAggRow[],
  regionData: CaseAggRow[],
  filters: CaseFilters
): CaseTakeaway[] {
  const takeaways: CaseTakeaway[] = [];
  if (kpis.total === 0) return takeaways;

  // A "top X" statement is tautological (and uninformative) once the user has
  // already narrowed that same dimension down to a single value — in that
  // case 100% of cases trivially belong to it. Skip those.

  // Top solution — skip when exactly one solution is selected.
  if (filters.solutions.length !== 1) {
    const topSolution = [...solutionData].sort((a, b) => b.count - a.count)[0];
    if (topSolution && topSolution.count > 0) {
      const pct = kpis.total > 0 ? Math.round((topSolution.count / kpis.total) * 100) : 0;
      takeaways.push({
        text: `${topSolution.label} is the most common solution, representing ${topSolution.count} of ${kpis.total} unique cases (${pct}%).`,
      });
    }
  }

  // Top region — skip when exactly one region is selected.
  if (filters.regions.length !== 1) {
    const topRegion = [...regionData].sort((a, b) => b.count - a.count)[0];
    if (topRegion && topRegion.count > 0) {
      const pct = kpis.total > 0 ? Math.round((topRegion.count / kpis.total) * 100) : 0;
      takeaways.push({
        text: `${topRegion.label} accounts for ${topRegion.count} cases (${pct}% of the filtered total).`,
      });
    }
  }

  // Top industry — skip when exactly one industry is selected.
  if (filters.industries.length !== 1) {
    const topIndustry = [...industryData].sort((a, b) => b.count - a.count)[0];
    if (topIndustry && topIndustry.count > 0) {
      const pct = kpis.total > 0 ? Math.round((topIndustry.count / kpis.total) * 100) : 0;
      takeaways.push({
        text: `${topIndustry.label} is the leading industry, representing ${topIndustry.count} of ${kpis.total} unique cases (${pct}%).`,
      });
    }
  }

  // Year with highest volume — skip when exactly one year is selected.
  if (filters.years.length !== 1) {
    const topYear = [...yearData].sort((a, b) => b.count - a.count)[0];
    if (topYear && topYear.count > 0) {
      takeaways.push({ text: `${topYear.label} had the highest case volume with ${topYear.count} unique cases.` });
    }
  }

  return takeaways;
}
