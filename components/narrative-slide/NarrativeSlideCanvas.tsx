"use client";

/**
 * components/narrative-slide/NarrativeSlideCanvas.tsx
 *
 * Generic on-screen renderer for a narrative slide extracted verbatim from
 * the source deck (data/narrative-slides/*.json — every text run, shape,
 * image, and chart, at its exact inch position and exact styling). This
 * walks that same JSON and lays out absolutely-positioned elements at the
 * slide's own aspect ratio, scaled with `cqw` units the way SlideFrame.tsx
 * scales the hand-built section slides — so what's shown here and what
 * lib/export/pptx/render-narrative-slide.ts puts into the PPTX come from
 * the one shared source of truth and can't drift apart.
 */

import {
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import type {
  NarrativeSlideData,
  NarrativeSlideObject,
  NarrativeTextObject,
  NarrativeShapeObject,
  NarrativeImageObject,
  NarrativeChartObject,
} from "@/lib/narrative-slide-types";

const ARIAL = "Arial, Helvetica, sans-serif";

function pctX(inches: number, slideW: number) {
  return (inches / slideW) * 100;
}
function pctY(inches: number, slideH: number) {
  return (inches / slideH) * 100;
}

/** Point size → cqw, relative to the slide's own width, matching SlideFrame.tsx's convention. */
function ptToCqw(pt: number, slideW: number) {
  return (pt / 72 / slideW) * 100;
}

function toCssColor(hex?: string, transparencyPct?: number): string | undefined {
  if (!hex) return undefined;
  const clean = hex.replace("#", "");
  if (!transparencyPct) return `#${clean}`;
  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);
  const alpha = 1 - transparencyPct / 100;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function justifyFor(valign?: string) {
  if (valign === "middle") return "center";
  if (valign === "bottom") return "flex-end";
  return "flex-start";
}

function alignItemsFor(align?: string) {
  if (align === "center") return "center";
  if (align === "right") return "flex-end";
  return "flex-start";
}

function RenderText({ obj, data }: { obj: NarrativeTextObject; data: NarrativeSlideData }) {
  const { x, y, w, h, valign, fill } = obj.options as Record<string, unknown> & {
    x: number;
    y: number;
    w: number;
    h: number;
    valign?: string;
    fill?: { color: string; transparency?: number };
  };
  const firstAlign = obj.text.find((r) => r.text.trim().length > 0)?.options?.align;

  return (
    <div
      className="absolute flex flex-col overflow-hidden"
      style={{
        left: `${pctX(x, data.width)}%`,
        top: `${pctY(y, data.height)}%`,
        width: `${pctX(w, data.width)}%`,
        height: `${pctY(h, data.height)}%`,
        justifyContent: justifyFor(valign),
        alignItems: alignItemsFor(firstAlign),
        backgroundColor: fill ? toCssColor(fill.color, fill.transparency) : undefined,
        padding: "2% 2%",
      }}
    >
      {obj.text
        .filter((run) => run.text.trim().length > 0)
        .map((run, i) => (
          <p
            key={i}
            className="leading-snug"
            style={{
              width: "100%",
              textAlign: (run.options?.align as "left" | "center" | "right" | "justify") ?? "left",
              fontSize: `${ptToCqw(run.options?.fontSize ?? 12, data.width)}cqw`,
              fontFamily: run.options?.fontFace ? `"${run.options.fontFace}", ${ARIAL}` : ARIAL,
              fontWeight: run.options?.bold ? 700 : 400,
              fontStyle: run.options?.italic ? "italic" : "normal",
              color: toCssColor(run.options?.color ?? "000000"),
              marginTop: i > 0 ? "0.3em" : 0,
            }}
          >
            {run.options?.bullet ? "\u2022  " : ""}
            {run.text}
          </p>
        ))}
    </div>
  );
}

const SHAPE_RADIUS: Record<string, string> = {
  roundRect: "8%",
  round1Rect: "8%",
  ellipse: "50%",
};

function RenderShape({ obj, data }: { obj: NarrativeShapeObject; data: NarrativeSlideData }) {
  const { x, y, w, h, fill, line, rotate } = obj.options as Record<string, unknown> & {
    x: number;
    y: number;
    w: number;
    h: number;
    fill?: { color: string; transparency?: number };
    line?: { color: string; width?: number; dashType?: string };
    rotate?: number;
  };

  // Lines render as a thin bar rather than a box.
  if (obj.shape === "line") {
    return (
      <div
        className="absolute"
        style={{
          left: `${pctX(x, data.width)}%`,
          top: `${pctY(y, data.height)}%`,
          width: `${pctX(Math.max(w, 0.02), data.width)}%`,
          height: `${pctY(Math.max(h, 0.02), data.height)}%`,
          backgroundColor: toCssColor(line?.color ?? "000000"),
        }}
      />
    );
  }

  return (
    <div
      className="absolute"
      style={{
        left: `${pctX(x, data.width)}%`,
        top: `${pctY(y, data.height)}%`,
        width: `${pctX(w, data.width)}%`,
        height: `${pctY(h, data.height)}%`,
        backgroundColor: fill ? toCssColor(fill.color, fill.transparency) : "transparent",
        border: line ? `${Math.max(line.width ?? 1, 0.5)}px solid ${toCssColor(line.color)}` : undefined,
        borderRadius: SHAPE_RADIUS[obj.shape] ?? 0,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
    />
  );
}

function RenderImage({ obj, data }: { obj: NarrativeImageObject; data: NarrativeSlideData }) {
  const { x, y, w, h, data: imgData } = obj.options as Record<string, unknown> & {
    x: number;
    y: number;
    w: number;
    h: number;
    data?: string;
  };
  if (!imgData) return null;
  return (
    <img
      src={imgData.startsWith("data:") ? imgData : `data:${imgData}`}
      alt=""
      className="absolute object-cover"
      style={{
        left: `${pctX(x, data.width)}%`,
        top: `${pctY(y, data.height)}%`,
        width: `${pctX(w, data.width)}%`,
        height: `${pctY(h, data.height)}%`,
      }}
      crossOrigin="anonymous"
    />
  );
}

const CHART_COLORS = ["#CC0000", "#1F2937", "#6B7280", "#9CA3AF"];

function RenderChart({ obj, data }: { obj: NarrativeChartObject; data: NarrativeSlideData }) {
  const { x, y, w, h } = obj.options as Record<string, unknown> & { x: number; y: number; w: number; h: number };

  // Reshape each category label into one row so every series lines up on a shared x-axis.
  const labels = obj.data[0]?.labels ?? obj.data[0]?.values.map((_, i) => String(i + 1));
  const rows = labels.map((label, i) => {
    const row: Record<string, string | number | null> = { label };
    obj.data.forEach((series) => {
      row[series.name] = series.values[i] ?? null;
    });
    return row;
  });

  return (
    <div
      className="absolute"
      style={{
        left: `${pctX(x, data.width)}%`,
        top: `${pctY(y, data.height)}%`,
        width: `${pctX(w, data.width)}%`,
        height: `${pctY(h, data.height)}%`,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {obj.chartType === "scatter" || obj.chartType === "line" ? (
          <LineChart data={rows} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <CartesianGrid stroke="#E5E7EB" strokeDasharray="2 2" />
            <XAxis dataKey="label" tick={{ fontSize: 9, fontFamily: ARIAL }} stroke="#9CA3AF" />
            <YAxis tick={{ fontSize: 9, fontFamily: ARIAL }} stroke="#9CA3AF" />
            {obj.data.map((series, i) => (
              <Line
                key={series.name}
                type="monotone"
                dataKey={series.name}
                stroke={CHART_COLORS[i % CHART_COLORS.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart data={rows} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <CartesianGrid stroke="#E5E7EB" strokeDasharray="2 2" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 9, fontFamily: ARIAL }} stroke="#9CA3AF" />
            <YAxis tick={{ fontSize: 9, fontFamily: ARIAL }} stroke="#9CA3AF" />
            {obj.data.map((series, i) => (
              <Bar key={series.name} dataKey={series.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function RenderObject({ obj, data }: { obj: NarrativeSlideObject; data: NarrativeSlideData }) {
  switch (obj.type) {
    case "text":
      return <RenderText obj={obj} data={data} />;
    case "shape":
      return <RenderShape obj={obj} data={data} />;
    case "image":
      return <RenderImage obj={obj} data={data} />;
    case "chart":
      return <RenderChart obj={obj} data={data} />;
    default:
      return null;
  }
}

export interface NarrativeSlideCanvasProps {
  slide: NarrativeSlideData;
  className?: string;
}

/** Renders one narrative slide exactly as extracted, at its native 16:9 aspect ratio. */
export function NarrativeSlideCanvas({ slide, className }: NarrativeSlideCanvasProps) {
  return (
    <div
      className={`@container relative w-full overflow-hidden bg-white ${className ?? ""}`}
      style={{ aspectRatio: `${slide.width} / ${slide.height}` }}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: toCssColor(slide.background?.color ?? "FFFFFF") }}
      />
      {slide.objects.map((obj) => (
        <RenderObject key={obj.id} obj={obj} data={slide} />
      ))}
    </div>
  );
}
