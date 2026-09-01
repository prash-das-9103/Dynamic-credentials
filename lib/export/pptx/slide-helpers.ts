/**
 * lib/export/pptx/slide-helpers.ts
 *
 * Shared helpers used by multiple slide renderers:
 * - slide title bar (title text + red rule)
 * - footer
 * - bullet list
 * - KPI column
 * - result metric chips
 */

import type PptxGenJS from "pptxgenjs";
import {
  MARGIN_L, MARGIN_TOP, RULE_Y, CONTENT_START_Y,
  FOOTER_Y, FOOTER, SLIDE_W, CONTENT_W,
  FONT_FACE_HEADING, FONT_FACE_BODY, COLOR, TEXT,
} from "./presentation-theme";

export const DEFAULT_CONFIDENTIALITY_NOTICE =
  "This information is confidential and was prepared by Bain & Company solely for the use of our client; it is not to be relied on by any 3rd party without Bain's prior written consent";

// ─── Title bar ────────────────────────────────────────────────────────────────

/**
 * Renders the slide header (24pt Arial Headings) + red rule beneath it.
 * Call on every content slide — the header sits above the rule, and
 * everything else (text / images / framework content) renders below it.
 */
export function addTitleBar(
  slide: PptxGenJS.Slide,
  pptx: PptxGenJS,
  title: string,
  subtitle?: string
): void {
  slide.background = { fill: COLOR.BACKGROUND };

  // Header text
  slide.addText(title, {
    x: MARGIN_L,
    y: MARGIN_TOP,
    w: CONTENT_W,
    h: TEXT.TITLE_SIZE / 72 + 0.15,
    fontSize: TEXT.TITLE_SIZE,
    fontFace: FONT_FACE_HEADING,
    bold: false,
    color: TEXT.TITLE_COLOR,
    wrap: true,
    valign: "top",
  });

  // Red rule
  slide.addShape(pptx.ShapeType.line, {
    x: MARGIN_L,
    y: RULE_Y,
    w: CONTENT_W,
    h: 0,
    line: { color: COLOR.RED, width: 1.5 },
  });

  // Subtitle if present
  if (subtitle) {
    slide.addText(subtitle, {
      x: MARGIN_L,
      y: RULE_Y + 0.07,
      w: CONTENT_W,
      h: 0.22,
      fontSize: 9,
      fontFace: FONT_FACE_BODY,
      color: "666666",
      italic: true,
    });
  }
}

// ─── Footer ───────────────────────────────────────────────────────────────────

/**
 * Standard slide footer: an 8pt Arial (Body) confidentiality notice on the
 * left, the "BAIN & COMPANY" wordmark + page number on the right — matches
 * the reference template's footer band.
 */
export function addFooter(
  slide: PptxGenJS.Slide,
  pptx: PptxGenJS,
  leftText: string = DEFAULT_CONFIDENTIALITY_NOTICE,
  pageNumber?: number
): void {
  slide.addText(leftText, {
    x: MARGIN_L,
    y: FOOTER_Y,
    w: FOOTER.DISCLAIMER_W,
    h: 0.18,
    fontSize: TEXT.FOOTER_SIZE,
    fontFace: FONT_FACE_BODY,
    color: TEXT.FOOTER_COLOR,
    valign: "top",
  });

  // "BAIN & COMPANY" wordmark
  slide.addText("BAIN & COMPANY", {
    x: FOOTER.WORDMARK_X,
    y: FOOTER_Y - 0.01,
    w: FOOTER.WORDMARK_W,
    h: 0.18,
    fontSize: TEXT.FOOTER_SIZE + 1,
    fontFace: FONT_FACE_HEADING,
    bold: true,
    color: COLOR.RED,
    charSpacing: 0.5,
    align: "right",
    valign: "top",
  });

  // Page number, far right
  if (pageNumber !== undefined) {
    slide.addText(String(pageNumber), {
      x: FOOTER.PAGE_NUM_X,
      y: FOOTER_Y,
      w: FOOTER.PAGE_NUM_W,
      h: 0.18,
      fontSize: TEXT.FOOTER_SIZE,
      fontFace: FONT_FACE_BODY,
      color: "555555",
      align: "right",
      valign: "top",
    });
  }
}

// ─── Bullet list ──────────────────────────────────────────────────────────────

export function addBulletList(
  slide: PptxGenJS.Slide,
  items: string[],
  opts: {
    x: number; y: number; w: number; maxH?: number;
    fontSize?: number; color?: string; bulletChar?: string;
  }
): void {
  if (items.length === 0) return;
  const lineH = ((opts.fontSize ?? TEXT.BULLET_SIZE) + 3) / 72;
  const maxLines = opts.maxH ? Math.floor(opts.maxH / lineH) : items.length;
  const displayed = items.slice(0, maxLines);

  const textObjs = displayed.map((text) => ({
    text,
    options: {
      bullet: { code: opts.bulletChar ?? "25CF", color: COLOR.RED, indent: 12 },
      paraSpaceAfter: 3,
    },
  }));

  slide.addText(textObjs, {
    x: opts.x,
    y: opts.y,
    w: opts.w,
    h: opts.maxH ?? lineH * displayed.length + 0.05,
    fontSize: opts.fontSize ?? TEXT.BULLET_SIZE,
    fontFace: FONT_FACE_BODY,
    color: opts.color ?? TEXT.BULLET_COLOR,
    valign: "top",
    wrap: true,
  });
}

// ─── Section heading within a slide ──────────────────────────────────────────

export function addSectionLabel(
  slide: PptxGenJS.Slide,
  pptx: PptxGenJS,
  text: string,
  x: number,
  y: number,
  w: number
): void {
  slide.addText(text.toUpperCase(), {
    x,
    y,
    w,
    h: 0.2,
    fontSize: 7.5,
    fontFace: FONT_FACE_BODY,
    bold: true,
    color: "888888",
    charSpacing: 1.5,
  });
  // Thin rule beneath label
  slide.addShape(pptx.ShapeType.line, {
    x,
    y: y + 0.2,
    w,
    h: 0,
    line: { color: COLOR.RULE, width: 0.5 },
  });
}

// ─── Result metric chip ───────────────────────────────────────────────────────

export function addResultChips(
  slide: PptxGenJS.Slide,
  pptx: PptxGenJS,
  metrics: { label: string; displayValue: string }[],
  x: number,
  y: number,
  w: number
): number /* returns height used */ {
  const maxCols = 2;
  const chipW = w / maxCols - 0.08;
  const chipH = 0.52;
  const gap = 0.08;

  metrics.slice(0, 4).forEach((m, i) => {
    const col = i % maxCols;
    const row = Math.floor(i / maxCols);
    const cx = x + col * (chipW + gap);
    const cy = y + row * (chipH + gap);

    // Light grey background chip via rect shape
    slide.addShape(pptx.ShapeType.rect, {
      x: cx,
      y: cy,
      w: chipW,
      h: chipH,
      fill: { color: COLOR.PANEL_LIGHT },
      line: { color: COLOR.RULE, width: 0.5 },
    });

    // Value
    slide.addText(m.displayValue, {
      x: cx + 0.06,
      y: cy + 0.04,
      w: chipW - 0.12,
      h: 0.28,
      fontSize: 16,
      fontFace: FONT_FACE_BODY,
      bold: true,
      color: COLOR.INK,
    });

    // Label
    slide.addText(m.label, {
      x: cx + 0.06,
      y: cy + 0.3,
      w: chipW - 0.12,
      h: 0.18,
      fontSize: 7.5,
      fontFace: FONT_FACE_BODY,
      color: "666666",
      wrap: true,
    });
  });

  const rows = Math.ceil(Math.min(metrics.length, 4) / maxCols);
  return rows * (chipH + gap);
}
