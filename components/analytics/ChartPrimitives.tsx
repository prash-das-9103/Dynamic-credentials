"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { CHART_STATE_COLORS } from "@/lib/chart-colors";

export interface ChartRow {
  id: string;
  label: string;
  count: number;
  displayCount: number;
  displayValue: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: { value: number; payload: ChartRow }[];
  label?: string;
  showPct: boolean;
  total: number;
}

function ChartTooltip({ active, payload, showPct, total }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded border border-border bg-background px-3 py-2 shadow-sm text-[12px]">
      <div className="font-semibold text-foreground">{row.label}</div>
      <div className="text-muted-foreground">
        {row.count} case{row.count !== 1 ? "s" : ""}
        {showPct && total > 0 ? ` (${((row.count / total) * 100).toFixed(1)}%)` : ""}
      </div>
    </div>
  );
}

interface HorizBarProps {
  data: ChartRow[];
  showPct: boolean;
  total: number;
  activeIds?: string[];
  onBarClick?: (id: string) => void;
  yWidth?: number;
  rowHeight?: number;
}

export function HorizBarChart({
  data,
  showPct,
  total,
  activeIds = [],
  onBarClick,
  yWidth = 200,
  rowHeight = 34,
}: HorizBarProps) {
  const maxVal = Math.max(...data.map((d) => d.displayCount), 1);

  return (
    <ResponsiveContainer width="100%" height={data.length * rowHeight + 16}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 4, right: 44, top: 2, bottom: 2 }}
        role="img"
        aria-label="Bar chart"
      >
        <XAxis
          type="number"
          domain={[0, maxVal]}
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          tickCount={5}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={yWidth}
          tick={{ fontSize: 11, fill: "var(--foreground)" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={<ChartTooltip showPct={showPct} total={total} />}
          cursor={{ fill: "var(--secondary)" }}
        />
        <Bar
          dataKey="displayCount"
          radius={[0, 2, 2, 0]}
          cursor={onBarClick ? "pointer" : undefined}
          onClick={onBarClick ? (d) => onBarClick(d.id as string) : undefined}
          isAnimationActive={false}
        >
          {data.map((entry) => {
            const isActive = activeIds.includes(entry.id);
            return (
              <Cell
                key={entry.id}
                fill={isActive ? CHART_STATE_COLORS.active : CHART_STATE_COLORS.inactive}
                fillOpacity={isActive ? 1 : CHART_STATE_COLORS.inactiveOpacity}
              />
            );
          })}
          <LabelList
            dataKey="displayValue"
            position="right"
            style={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface VertBarProps {
  data: ChartRow[];
  showPct: boolean;
  total: number;
  activeIds?: string[];
  onBarClick?: (id: string) => void;
  barHeight?: number;
}

export function VertBarChart({
  data,
  showPct,
  total,
  activeIds = [],
  onBarClick,
  barHeight = 160,
}: VertBarProps) {
  return (
    <ResponsiveContainer width="100%" height={barHeight}>
      <BarChart
        data={data}
        margin={{ left: 0, right: 0, top: 16, bottom: 32 }}
        role="img"
        aria-label="Bar chart"
      >
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "var(--foreground)" }}
          tickLine={false}
          axisLine={false}
          interval={0}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          width={28}
        />
        <Tooltip
          content={<ChartTooltip showPct={showPct} total={total} />}
          cursor={{ fill: "var(--secondary)" }}
        />
        <Bar
          dataKey="displayCount"
          radius={[2, 2, 0, 0]}
          cursor={onBarClick ? "pointer" : undefined}
          onClick={onBarClick ? (d) => onBarClick(d.id as string) : undefined}
          isAnimationActive={false}
        >
          {data.map((entry) => {
            const isActive = activeIds.includes(entry.id);
            return (
              <Cell
                key={entry.id}
                fill={isActive ? CHART_STATE_COLORS.active : CHART_STATE_COLORS.inactive}
                fillOpacity={isActive ? 1 : CHART_STATE_COLORS.inactiveOpacity}
              />
            );
          })}
          <LabelList
            dataKey="displayValue"
            position="top"
            style={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
