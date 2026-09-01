/**
 * lib/export/pptx/render-analytics-slide.ts
 *
 * Renders a case analytics summary slide from the deterministic
 * AnalyticsSnapshot — never recalculates workbook values independently.
 *
 * Layout:
 *   Title: "Case Analytics: [period]"
 *   Row of 4 KPI tiles: Total cases / EMEA / Americas / APAC
 *   Left chart: Cases by solution (horizontal bar chart via table rows)
 *   Right chart: Cases by region (same pattern)
 *   Bottom row: Year-on-year trend table
 *   Footer: workbook reference
 */

import type PptxGenJS from "pptxgenjs";
import type { AnalyticsSnapshot } from "@/lib/export/types";
import {
  MARGIN_L, CONTENT_START_Y, CONTENT_W, FOOTER_Y,
  FONT_FACE, COLOR, TEXT,
} from "./presentation-theme";
import { addTitleBar, addFooter, addSectionLabel } from "./slide-helpers";

const BAR_MAX_W = 1.8; // max width of bar within chart column

// Rough Arial-8pt average character width, in inches, used only to decide
// where to truncate a row label so it never wraps. Wrapping (rather than
// truncating) inside a fixed-height bar row is what let long labels bleed
// visually into the row below — truncation keeps every row exactly `barH`
// tall no matter how long the source label is.
const CHAR_W_8PT_IN = 0.052;

function truncateLabel(label: string, maxW: number): string {
  const maxChars = Math.max(4, Math.floor(maxW / CHAR_W_8PT_IN));
  if (label.length <= maxChars) return label;
  return `${label.slice(0, maxChars - 1).trimEnd()}…`;
}

// Shared bar-chart geometry — a single source of truth so the divider lines
// and the year-trend table positioned below these charts (in
// renderAnalyticsSlide) can derive exactly how tall a rendered chart will
// be, instead of using an independently-tuned magic number that silently
// drifts out of sync (and starts overlapping) whenever the bar geometry
// above changes.
const BAR_ROWS = 5;
const BAR_H = 0.24;
const BAR_GAP = 0.1;
/** Minimum spacing between the section label's rule and the first bar. */
const LABEL_TO_BARS_GAP = 0.32;
/** Full height from a chart column's `y` (where its label is drawn) to the bottom edge of its last bar. */
export const CHART_BODY_H = LABEL_TO_BARS_GAP + BAR_ROWS * BAR_H + (BAR_ROWS - 1) * BAR_GAP;

function renderBarChart(
  slide: PptxGenJS.Slide,
  pptx: PptxGenJS,
  rows: { label: string; count: number }[],
  maxCount: number,
  x: number,
  y: number,
  w: number,
  label: string
): void {
  addSectionLabel(slide, pptx, label, x, y, w);
  // Minimum spacing between the section label's rule and the chart body,
  // so the two never visually run together.
  let ry = y + LABEL_TO_BARS_GAP;
  const barH = BAR_H;
  const gap = BAR_GAP;
  const labelW = w * 0.4;
  const countW = 0.34;
  const barAreaW = w - labelW - countW - 0.1;

  rows.slice(0, BAR_ROWS).forEach((row) => {
    const barW = maxCount > 0 ? (row.count / maxCount) * barAreaW : 0;

    // Row label — truncated (never wrapped) so it can't overflow into the
    // next row or overlap the bar area.
    slide.addText(truncateLabel(row.label, labelW - 0.06), {
      x, y: ry, w: labelW, h: barH,
      fontSize: 8, fontFace: FONT_FACE, color: TEXT.BODY_COLOR,
      valign: "middle", wrap: false,
    });

    // Bar background
    slide.addShape(pptx.ShapeType.rect, {
      x: x + labelW, y: ry, w: barAreaW, h: barH,
      fill: { color: "EEEEEE" },
      line: { color: "EEEEEE", width: 0 },
    });

    // Filled bar
    if (barW > 0.02) {
      slide.addShape(pptx.ShapeType.rect, {
        x: x + labelW, y: ry, w: barW, h: barH,
        fill: { color: COLOR.RED },
        line: { color: COLOR.RED, width: 0 },
      });
    }

    // Count label — sits in its own reserved column outside the bar area,
    // so it never overlaps the bar or the axis regardless of bar length.
    slide.addText(String(row.count), {
      x: x + labelW + barAreaW + 0.1,
      y: ry, w: countW, h: barH,
      fontSize: 8, fontFace: FONT_FACE,
      bold: true, color: COLOR.INK,
      valign: "middle",
    });

    ry += barH + gap;
  });
}

export function renderAnalyticsSlide(
  pptx: PptxGenJS,
  snapshot: AnalyticsSnapshot,
  pageNumber?: number
): void {
  const slide = pptx.addSlide();

  addTitleBar(slide, pptx,
    `Case Analytics — ${snapshot.period}`,
    `Workbook imported: ${snapshot.workbookImportDate} · Unique Case Codes, Col D end date`
  );

  const bodyY = CONTENT_START_Y + 0.3;

  // ── KPI row ────────────────────────────────────────────────────────────────
  const kpis = [
    { label: "Total cases", value: snapshot.kpis.total },
    { label: "EMEA", value: snapshot.kpis.emea },
    { label: "Americas", value: snapshot.kpis.americas },
    { label: "APAC", value: snapshot.kpis.apac },
    { label: "Food Systems", value: snapshot.kpis.fst },
  ];

  const kpiW = CONTENT_W / kpis.length;

  kpis.forEach((kpi, i) => {
    const kx = MARGIN_L + i * kpiW;

    slide.addShape(pptx.ShapeType.rect, {
      x: kx, y: bodyY, w: kpiW - 0.06, h: 0.68,
      fill: { color: i === 0 ? "F7F7F7" : "FAFAFA" },
      line: { color: COLOR.RULE, width: 0.5 },
    });

    // Value
    slide.addText(String(kpi.value), {
      x: kx + 0.06, y: bodyY + 0.04, w: kpiW - 0.18, h: 0.38,
      fontSize: i === 0 ? 26 : 22,
      fontFace: FONT_FACE, bold: true,
      color: i === 0 ? COLOR.INK : COLOR.RED,
    });

    // Label
    slide.addText(kpi.label, {
      x: kx + 0.06, y: bodyY + 0.42, w: kpiW - 0.18, h: 0.22,
      fontSize: 7.5, fontFace: FONT_FACE, color: "777777", wrap: true,
    });
  });

  // ── Bar charts row ─────────────────────────────────────────────────────────
  const chartY = bodyY + 0.82;
  const colGap = 0.1;
  const colW = (CONTENT_W - colGap * 2) / 3;

  const maxSolution = Math.max(...snapshot.solutionRows.map((r) => r.count), 1);
  renderBarChart(
    slide, pptx, snapshot.solutionRows, maxSolution,
    MARGIN_L, chartY, colW, "Cases by solution (Col Q)"
  );

  const maxRegion = Math.max(...snapshot.regionRows.map((r) => r.count), 1);
  renderBarChart(
    slide, pptx, snapshot.regionRows, maxRegion,
    MARGIN_L + colW + colGap, chartY, colW, "Cases by region (Col A)"
  );

  const maxIndustry = Math.max(...snapshot.industryRows.map((r) => r.count), 1);
  renderBarChart(
    slide, pptx, snapshot.industryRows, maxIndustry,
    MARGIN_L + (colW + colGap) * 2, chartY, colW, "Cases by industry (Col H)"
  );

  // Dividers between chart columns — spans the actual rendered chart height
  // (derived from the same bar geometry the charts use above) rather than a
  // separately-tuned constant, so it can't fall short of or overshoot the
  // bars it's meant to separate.
  [1, 2].forEach((i) => {
    slide.addShape(pptx.ShapeType.line, {
      x: MARGIN_L + i * colW + (i - 0.5) * colGap,
      y: chartY,
      w: 0,
      h: CHART_BODY_H,
      line: { color: COLOR.RULE, width: 0.5 },
    });
  });

  // ── Year trend table ───────────────────────────────────────────────────────
  // Minimum spacing (0.2in) below the last bar row, derived from the charts'
  // own geometry so this table can never overlap the chart above it.
  const tableY = chartY + CHART_BODY_H + 0.2;

  if (tableY < FOOTER_Y - 0.45) {
    addSectionLabel(slide, pptx, "Cases by end year (Col D)", MARGIN_L, tableY, CONTENT_W);

    const years = snapshot.yearRows;
    const colWy = CONTENT_W / (years.length + 1);
    const headerY = tableY + 0.22;
    const headerH = 0.22;
    const dataH = 0.26;

    // Header
    slide.addShape(pptx.ShapeType.rect, {
      x: MARGIN_L, y: headerY, w: CONTENT_W, h: headerH,
      fill: { color: "222222" }, line: { color: "222222", width: 0 },
    });

    years.forEach((y, i) => {
      slide.addText(y.label, {
        x: MARGIN_L + (i + 1) * colWy, y: headerY,
        w: colWy, h: headerH,
        fontSize: 8, fontFace: FONT_FACE,
        bold: true, color: "FFFFFF", align: "center", valign: "middle",
      });
    });

    // Data row
    slide.addShape(pptx.ShapeType.rect, {
      x: MARGIN_L, y: headerY + headerH, w: CONTENT_W, h: dataH,
      fill: { color: "F7F7F7" }, line: { color: COLOR.RULE, width: 0.5 },
    });

    slide.addText("Unique cases", {
      x: MARGIN_L + 0.06, y: headerY + headerH,
      w: colWy, h: dataH,
      fontSize: 8, fontFace: FONT_FACE, color: TEXT.BODY_COLOR, valign: "middle",
    });

    years.forEach((y, i) => {
      slide.addText(String(y.count), {
        x: MARGIN_L + (i + 1) * colWy, y: headerY + headerH,
        w: colWy, h: dataH,
        fontSize: 9, fontFace: FONT_FACE,
        bold: true, color: COLOR.INK, align: "center", valign: "middle",
      });
    });
  }

  // ── Footer ─────────────────────────────────────────────────────────────────
  // Standard confidentiality notice on every slide; the workbook reference /
  // "historical values" caveat is already surfaced as the header subtitle.
  addFooter(slide, pptx, undefined, pageNumber);
}
