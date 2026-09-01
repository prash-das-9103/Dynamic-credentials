"use client";

import { useState } from "react";
import type { CaseAggRow } from "@/lib/case-analytics";
import { cn } from "@/lib/utils";
import type { DisplayMode } from "./types";
import { HorizBarChart, VertBarChart } from "./ChartPrimitives";
import type { ChartRow } from "./ChartPrimitives";

function toChartRows(
  data: CaseAggRow[],
  showPct: boolean,
  total: number
): ChartRow[] {
  return data.map((r) => ({
    id: r.id,
    label: r.label,
    count: r.count,
    displayCount: showPct && total > 0 ? parseFloat(((r.count / total) * 100).toFixed(1)) : r.count,
    displayValue:
      showPct && total > 0 ? `${((r.count / total) * 100).toFixed(1)}%` : String(r.count),
  }));
}

// ─── Solution chart ───────────────────────────────────────────────────────────

interface SolutionChartProps {
  /** Column Q ∪ Column S counts — a case can be counted under multiple solutions. */
  combinedData: CaseAggRow[];
  /** Column Q only — matches the case total exactly (no double-counting). */
  uniqueData: CaseAggRow[];
  total: number;
  showPct: boolean;
  displayMode: DisplayMode;
  activeSolutions: string[];
  onBarClick: (id: string) => void;
}

export function CaseSolutionChart({
  combinedData,
  uniqueData,
  total,
  showPct,
  displayMode,
  activeSolutions,
  onBarClick,
}: SolutionChartProps) {
  const [uniqueOnly, setUniqueOnly] = useState(false);

  const rows = toChartRows(
    [...(uniqueOnly ? uniqueData : combinedData)].sort((a, b) => b.count - a.count),
    showPct,
    total
  );

  return (
    <div className="rounded border border-border bg-card p-4">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[13px] font-semibold text-foreground">By Solution</div>
        <button
          onClick={() => setUniqueOnly((v) => !v)}
          aria-pressed={uniqueOnly}
          className={cn(
            "rounded border px-2 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            uniqueOnly
              ? "border-[#CC0000] bg-[#CC0000] text-white"
              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
          )}
        >
          Unique Case Count
        </button>
      </div>
      <div className="mb-3 text-[11px] text-muted-foreground">
        {uniqueOnly
          ? "Column Q — unique case counts"
          : "Column Q + Column S (Keyword) — a case can count under multiple solutions"}
      </div>
      <HorizBarChart
        data={rows}
        showPct={showPct}
        total={total}
        activeIds={activeSolutions}
        onBarClick={onBarClick}
        yWidth={220}
      />
      {!uniqueOnly && (
        <div className="mt-3 space-y-0.5 border-t border-border pt-2">
          <p className="text-[11px] text-muted-foreground">
            The case counts are higher because there are certain cases with multiple sustainability solutions involvement.
          </p>
          <p className="text-[11px] text-muted-foreground">
            Click &quot;Unique Case Count&quot; if you want to see unique case count.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Region chart ─────────────────────────────────────────────────────────────

interface RegionChartProps {
  data: CaseAggRow[];
  total: number;
  showPct: boolean;
  displayMode: DisplayMode;
  activeRegions: string[];
  onBarClick: (id: string) => void;
}

export function CaseRegionChart({
  data,
  total,
  showPct,
  displayMode,
  activeRegions,
  onBarClick,
}: RegionChartProps) {
  const rows = toChartRows(
    [...data].sort((a, b) => b.count - a.count),
    showPct,
    total
  );
  return (
    <div className="rounded border border-border bg-card p-4">
      <div className="mb-1 text-[13px] font-semibold text-foreground">By Region</div>
      <div className="mb-3 text-[11px] text-muted-foreground">
        Column A — unique case counts
      </div>
      <HorizBarChart
        data={rows}
        showPct={showPct}
        total={total}
        activeIds={activeRegions}
        onBarClick={onBarClick}
        yWidth={180}
      />
    </div>
  );
}

// ─── Industry chart ───────────────────────────────────────────────────────────

interface IndustryChartProps {
  data: CaseAggRow[];
  total: number;
  showPct: boolean;
  displayMode: DisplayMode;
  activeIndustries: string[];
  onBarClick: (id: string) => void;
}

export function CaseIndustryChart({
  data,
  total,
  showPct,
  displayMode,
  activeIndustries,
  onBarClick,
}: IndustryChartProps) {
  const rows = toChartRows(
    [...data].sort((a, b) => b.count - a.count),
    showPct,
    total
  );
  return (
    <div className="rounded border border-border bg-card p-4">
      <div className="mb-1 text-[13px] font-semibold text-foreground">By Industry</div>
      <div className="mb-3 text-[11px] text-muted-foreground">
        Column H — unique case counts. Five low-volume categories are grouped as &quot;Others&quot;.
      </div>
      <HorizBarChart
        data={rows}
        showPct={showPct}
        total={total}
        activeIds={activeIndustries}
        onBarClick={onBarClick}
        yWidth={220}
      />
    </div>
  );
}

// ─── Year chart ───────────────────────────────────────────────────────────────

interface YearChartProps {
  data: CaseAggRow[];
  total: number;
  showPct: boolean;
  displayMode: DisplayMode;
  activeYears: string[];
  onBarClick: (id: string) => void;
}

export function CaseYearChart({
  data,
  total,
  showPct,
  displayMode,
  activeYears,
  onBarClick,
}: YearChartProps) {
  const rows = toChartRows(data, showPct, total);
  return (
    <div className="rounded border border-border bg-card p-4">
      <div className="mb-1 text-[13px] font-semibold text-foreground">By Case End Year</div>
      <div className="mb-3 text-[11px] text-muted-foreground">
        Column D — unique case counts, FY2021–2025
      </div>
      <VertBarChart
        data={rows}
        showPct={showPct}
        total={total}
        activeIds={activeYears}
        onBarClick={onBarClick}
        barHeight={180}
      />
    </div>
  );
}

// ─── FST breakdown chart ──────────────────────────────────────────────────────

interface FstBreakdownProps {
  fstCount: number;
  total: number;
  showPct: boolean;
}

export function CaseFstBreakdown({ fstCount, total, showPct }: FstBreakdownProps) {
  const nonFst = total - fstCount;
  const fstPct = total > 0 ? ((fstCount / total) * 100).toFixed(1) : "0.0";
  const nonPct = total > 0 ? ((nonFst / total) * 100).toFixed(1) : "0.0";

  const rows: ChartRow[] = [
    {
      id: "fst",
      label: "Food Systems Transformation",
      count: fstCount,
      displayCount: showPct && total > 0 ? parseFloat(fstPct) : fstCount,
      displayValue: showPct && total > 0 ? `${fstPct}%` : String(fstCount),
    },
    {
      id: "non-fst",
      label: "Other sustainability cases",
      count: nonFst,
      displayCount: showPct && total > 0 ? parseFloat(nonPct) : nonFst,
      displayValue: showPct && total > 0 ? `${nonPct}%` : String(nonFst),
    },
  ];

  return (
    <div className="rounded border border-border bg-card p-4">
      <div className="mb-1 text-[13px] font-semibold text-foreground">
        Food Systems Transformation
      </div>
      <div className="mb-3 text-[11px] text-muted-foreground">
        Column T — cases where tag equals &quot;Inclusive, sustainable &amp; healthy food systems&quot;
      </div>
      <HorizBarChart
        data={rows}
        showPct={showPct}
        total={total}
        yWidth={240}
      />
    </div>
  );
}
