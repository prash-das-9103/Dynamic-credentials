"use client";

import {
  CEO_PRIORITY_INDEX,
  CEO_SAY_DATA,
  CEO_SAY_SOURCE,
} from "@/data/overview";
import { BAIN_COLORS } from "@/lib/chart-colors";

// ------------------------------------------------------------------
// Inline sparkline — no chart library dependency
// ------------------------------------------------------------------

function PrioritySparkline() {
  const pts = CEO_PRIORITY_INDEX.dataPoints;
  const W = 560;
  const H = 120;
  const PAD = { top: 12, right: 8, bottom: 24, left: 32 };

  const years = pts.map((p) => p.year);
  const values = pts.map((p) => p.value);
  const minV = Math.min(...values) - 5;
  const maxV = Math.max(...values) + 5;
  const xScale = (year: number) =>
    PAD.left +
    ((year - years[0]) / (years[years.length - 1] - years[0])) *
      (W - PAD.left - PAD.right);
  const yScale = (v: number) =>
    PAD.top +
    ((maxV - v) / (maxV - minV)) * (H - PAD.top - PAD.bottom);

  const actualPts = pts.filter((p) => p.type === "actual");
  const forecastPts = pts.filter((p) => p.type === "forecast");
  const transitionYear = actualPts[actualPts.length - 1];

  const toPath = (arr: typeof pts) =>
    arr
      .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.year)} ${yScale(p.value)}`)
      .join(" ");

  const yTicks = [80, 100, 120, 140, 160];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="CEO sustainability priority index 2018–2025"
    >
      {/* Y-axis gridlines + labels */}
      {yTicks.map((tick) => (
        <g key={tick}>
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={yScale(tick)}
            y2={yScale(tick)}
            stroke={BAIN_COLORS.gray100}
            strokeWidth={1}
          />
          <text
            x={PAD.left - 4}
            y={yScale(tick) + 4}
            textAnchor="end"
            fontSize={9}
            fill={BAIN_COLORS.gray300}
          >
            {tick}
          </text>
        </g>
      ))}

      {/* X-axis labels */}
      {pts
        .filter((_, i) => i % 2 === 0 || i === pts.length - 1)
        .map((p) => (
          <text
            key={p.year}
            x={xScale(p.year)}
            y={H - 4}
            textAnchor="middle"
            fontSize={9}
            fill={BAIN_COLORS.gray300}
          >
            {p.year}
          </text>
        ))}

      {/* Shaded forecast region */}
      {transitionYear && (
        <rect
          x={xScale(transitionYear.year)}
          y={PAD.top}
          width={W - PAD.right - xScale(transitionYear.year)}
          height={H - PAD.top - PAD.bottom}
          fill={BAIN_COLORS.gray100}
          fillOpacity={0.5}
        />
      )}

      {/* Actual line */}
      <path
        d={toPath(actualPts)}
        fill="none"
        stroke={BAIN_COLORS.gray500}
        strokeWidth={2}
      />

      {/* Forecast / uptick line — red */}
      {transitionYear && forecastPts.length > 0 && (
        <path
          d={`M ${xScale(transitionYear.year)} ${yScale(transitionYear.value)} L ${xScale(forecastPts[0].year)} ${yScale(forecastPts[0].value)}`}
          fill="none"
          stroke={BAIN_COLORS.red}
          strokeWidth={2}
        />
      )}

      {/* Annotation */}
      {CEO_PRIORITY_INDEX.annotation && (
        <text
          x={xScale(2023) + 4}
          y={yScale(125)}
          fontSize={8.5}
          fill={BAIN_COLORS.red}
          fontWeight={600}
        >
          {CEO_PRIORITY_INDEX.annotation}
        </text>
      )}
    </svg>
  );
}

// ------------------------------------------------------------------
// CEO Say stacked bar chart
// ------------------------------------------------------------------

const SAY_COLORS = [
  { key: "y2024" as const, year: "2024", fill: "bg-[#104C3E]", text: "text-white" },
  { key: "y2022" as const, year: "2022", fill: "bg-[#507867]", text: "text-white" },
  { key: "y2018" as const, year: "2018", fill: "bg-[#83AC9A]", text: "text-[#333333]" },
];

function SayStackedBars() {
  return (
    <div className="space-y-1">
      {CEO_SAY_DATA.map((row) => (
        <div key={row.category} className="flex items-center gap-2">
          <div className="w-28 shrink-0 text-right text-[11px] text-muted-foreground leading-snug">
            {row.category}
          </div>
          <div className="flex flex-1 items-center gap-px">
            {SAY_COLORS.map(({ key, fill, text }) => {
              const val = row[key];
              return (
                <div
                  key={key}
                  className={`flex h-7 items-center justify-center text-[10px] font-semibold ${text} ${fill}`}
                  style={{ flex: val }}
                  title={`${val}%`}
                >
                  {val}%
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {/* Year legend */}
      <div className="flex items-center gap-3 pt-1 pl-[7.5rem]">
        {SAY_COLORS.map(({ year, fill }) => (
          <div key={year} className="flex items-center gap-1">
            <div className={`h-2.5 w-2.5 shrink-0 ${fill}`} aria-hidden="true" />
            <span className="text-[10px] text-muted-foreground">{year}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Main component
// ------------------------------------------------------------------

export function MarketContext() {
  return (
    <section aria-labelledby="market-context-heading">
      <div className="mb-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Market context
        </p>
        <h2
          id="market-context-heading"
          className="text-[20px] font-bold text-foreground"
        >
          CEOs speak less about sustainability — but act more
        </h2>
        <p className="mt-1.5 max-w-2xl text-[13px] text-muted-foreground">
          While sustainability rhetoric has declined since 2022, CEO action
          continues to accelerate. Companies are scaling sustainability
          transformations designed to deliver measurable business value.
        </p>
        <p className="mt-1 text-[12px] font-semibold text-muted-foreground">
          This is the &ldquo;Do&ndash;Say gap.&rdquo;
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Priority index chart */}
        <div className="border border-border bg-card p-5">
          <p className="mb-1 text-[13px] font-semibold text-foreground">
            {CEO_PRIORITY_INDEX.title}
          </p>
          <p className="mb-4 text-[11px] text-muted-foreground">
            {CEO_PRIORITY_INDEX.subtitle}
          </p>
          <PrioritySparkline />
          <p className="mt-3 text-[10px] italic text-muted-foreground">
            Source: {CEO_PRIORITY_INDEX.sourceNote}
          </p>
        </div>

        {/* CEO Say stacked bars */}
        <div className="border border-border bg-card p-5">
          <p className="mb-1 text-[13px] font-semibold text-foreground">
            CEOs increasingly link sustainability to business performance
          </p>
          <p className="mb-4 text-[11px] text-muted-foreground">
            Share of sustainability mentions by CEOs, by framing
          </p>
          <SayStackedBars />
          <p className="mt-4 text-[10px] italic text-muted-foreground leading-snug">
            {CEO_SAY_SOURCE}
          </p>
        </div>
      </div>

    </section>
  );
}
