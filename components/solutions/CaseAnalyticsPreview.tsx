"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  applyCaseFilters,
  countByRegion,
  countByIndustry,
  uniqueCaseCount,
  EMPTY_CASE_FILTERS,
} from "@/lib/case-analytics";
import { CaseRegionChart, CaseIndustryChart } from "@/components/analytics/CaseCharts";

interface Props {
  /** Value matching lib/case-analytics.ts CASE_SOLUTIONS ids (Column Q). */
  caseSolutionLabel: string;
}

function noop() {}

export function CaseAnalyticsPreview({ caseSolutionLabel }: Props) {
  const filtered = useMemo(
    () => applyCaseFilters({ ...EMPTY_CASE_FILTERS, solutions: [caseSolutionLabel] }),
    [caseSolutionLabel]
  );
  const total = useMemo(() => uniqueCaseCount(filtered), [filtered]);
  const regionData = useMemo(() => countByRegion(filtered), [filtered]);
  const industryData = useMemo(() => countByIndustry(filtered), [filtered]);

  const analyticsHref = `/analytics?cs=${encodeURIComponent(caseSolutionLabel)}`;

  if (total === 0) {
    return (
      <div className="rounded border border-dashed border-border py-8 text-center text-[13px] text-muted-foreground">
        No cases tagged to this solution yet in the case registry.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[12px] text-muted-foreground">
        <span className="font-medium text-foreground">{total.toLocaleString()}</span> unique FY2021–2025
        cases are tagged to this solution in the case registry (Column Q).
      </p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CaseRegionChart
          data={regionData}
          total={total}
          showPct={false}
          displayMode="count"
          activeRegions={[]}
          onBarClick={noop}
        />
        <CaseIndustryChart
          data={industryData}
          total={total}
          showPct={false}
          displayMode="count"
          activeIndustries={[]}
          onBarClick={noop}
        />
      </div>
      <Link
        href={analyticsHref}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-foreground hover:underline"
      >
        Explore full analytics for this solution
        <ArrowRight size={12} aria-hidden="true" />
      </Link>
    </div>
  );
}
