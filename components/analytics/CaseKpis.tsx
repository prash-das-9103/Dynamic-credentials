"use client";

import type { CaseKpiValues } from "@/lib/case-analytics";

interface KpiTileProps {
  value: string | number;
  label: string;
  sub?: string;
}

function KpiTile({ value, label, sub }: KpiTileProps) {
  return (
    <div className="flex flex-col gap-0.5 rounded border border-border bg-card px-4 py-3">
      <span className="text-[22px] font-semibold tabular-nums text-foreground leading-tight">
        {value}
      </span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
      {sub && (
        <span className="text-[10px] text-muted-foreground/70">{sub}</span>
      )}
    </div>
  );
}

interface Props {
  kpis: CaseKpiValues;
  totalRegistry: number;
}

export function CaseKpis({ kpis, totalRegistry }: Props) {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      role="region"
      aria-label="Case registry key metrics"
    >
      <KpiTile
        value={kpis.total.toLocaleString()}
        label="Unique cases (FY21–25)"
        sub={totalRegistry !== kpis.total ? `of ${totalRegistry.toLocaleString()} total in registry` : undefined}
      />
      <KpiTile value={kpis.emea.toLocaleString()} label="EMEA cases" />
      <KpiTile value={kpis.americas.toLocaleString()} label="Americas cases" />
      <KpiTile value={kpis.apac.toLocaleString()} label="APAC cases" />
    </div>
  );
}
