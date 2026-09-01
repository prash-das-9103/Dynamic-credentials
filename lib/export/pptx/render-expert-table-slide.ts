/**
 * lib/export/pptx/render-expert-table-slide.ts
 *
 * Renders a slide's worth of selected experts as a plain table — Name |
 * Title | Related credentials — one row per expert actually added to the
 * pack.
 *
 * This deliberately replaces the "full reference-slide exhibit" treatment
 * for experts: a registered reference slide (e.g. "Leadership Team")
 * reproduces the entire fixed roster from the original source deck, not
 * just the people the user picked. Since there is no control for a user to
 * explicitly opt into that full exhibit, selected experts always render
 * this way — a table naming exactly who was chosen, with their own
 * credentials, never the whole original slide's cast.
 */

import type PptxGenJS from "pptxgenjs";
import type { ExpertTableRow } from "@/lib/pack-slide-content";
import {
  MARGIN_L, CONTENT_START_Y, CONTENT_W, FOOTER_Y,
  FONT_FACE_BODY, COLOR, TEXT,
} from "./presentation-theme";
import { addTitleBar, addFooter } from "./slide-helpers";

export interface ExpertTableSlideOptions {
  header: string;
  subtitle?: string;
  rows: ExpertTableRow[];
  footerText?: string;
  pageNumber?: number;
}

export function renderExpertTableSlide(
  pptx: PptxGenJS,
  opts: ExpertTableSlideOptions
): void {
  const slide = pptx.addSlide();

  addTitleBar(slide, pptx, opts.header, opts.subtitle);

  const bodyY = CONTENT_START_Y + 0.15;
  const rowH = 0.32;
  const maxRows = Math.floor((FOOTER_Y - bodyY - 0.15) / rowH);

  if (opts.rows.length === 0) {
    slide.addText("No experts in this section.", {
      x: MARGIN_L, y: bodyY, w: CONTENT_W, h: 0.3,
      fontSize: TEXT.BULLET_SIZE, fontFace: FONT_FACE_BODY,
      italic: true, color: "999999",
    });
    addFooter(slide, pptx, opts.footerText, opts.pageNumber);
    return;
  }

  // Column widths are proportions of CONTENT_W, so the table always fills
  // the full canvas width regardless of slide size.
  const colRatios = [2.4, 3.0, 5.0]; // Expert | Title | Related credentials
  const ratioSum = colRatios.reduce((a, b) => a + b, 0);
  const colWidths = colRatios.map((r) => (r / ratioSum) * CONTENT_W);
  const colX = colWidths.reduce<number[]>((acc, w, i) => {
    acc.push(i === 0 ? MARGIN_L : acc[i - 1] + colWidths[i - 1]);
    return acc;
  }, []);
  const headers = ["Expert", "Title", "Related credentials"];

  // Header row background
  slide.addShape(pptx.ShapeType.rect, {
    x: MARGIN_L, y: bodyY, w: CONTENT_W, h: rowH,
    fill: { color: COLOR.TABLE_HEADER_BG }, line: { color: COLOR.TABLE_HEADER_BG, width: 0 },
  });

  headers.forEach((h, i) => {
    slide.addText(h, {
      x: colX[i] + 0.06, y: bodyY, w: colWidths[i] - 0.12, h: rowH,
      fontSize: TEXT.TABLE_HEADER_SIZE, fontFace: FONT_FACE_BODY,
      bold: true, color: TEXT.TABLE_HEADER_COLOR, valign: "middle",
    });
  });

  const displayed = opts.rows.slice(0, maxRows - 1);
  displayed.forEach((row, i) => {
    const ry = bodyY + (i + 1) * rowH;
    const bg = i % 2 === 0 ? COLOR.BACKGROUND : COLOR.PANEL_LIGHT;

    slide.addShape(pptx.ShapeType.rect, {
      x: MARGIN_L, y: ry, w: CONTENT_W, h: rowH,
      fill: { color: bg }, line: { color: COLOR.RULE, width: 0.25 },
    });

    slide.addText(row.name, {
      x: colX[0] + 0.06, y: ry, w: colWidths[0] - 0.12, h: rowH,
      fontSize: TEXT.TABLE_BODY_SIZE, fontFace: FONT_FACE_BODY,
      bold: true, color: TEXT.TITLE_COLOR, valign: "middle", wrap: true,
    });
    slide.addText(row.title || "—", {
      x: colX[1] + 0.06, y: ry, w: colWidths[1] - 0.12, h: rowH,
      fontSize: TEXT.TABLE_BODY_SIZE, fontFace: FONT_FACE_BODY,
      color: TEXT.TABLE_BODY_COLOR, valign: "middle", wrap: true,
    });
    slide.addText(row.credentials, {
      x: colX[2] + 0.06, y: ry, w: colWidths[2] - 0.12, h: rowH,
      fontSize: TEXT.TABLE_BODY_SIZE, fontFace: FONT_FACE_BODY,
      color: TEXT.TABLE_BODY_COLOR, valign: "middle", wrap: true,
    });
  });

  if (opts.rows.length > maxRows - 1) {
    const note = `… and ${opts.rows.length - (maxRows - 1)} more experts.`;
    slide.addText(note, {
      x: MARGIN_L, y: FOOTER_Y - 0.25,
      w: CONTENT_W * 0.6, h: 0.2,
      fontSize: 8, fontFace: FONT_FACE_BODY, color: "888888",
    });
  }

  addFooter(slide, pptx, opts.footerText, opts.pageNumber);
}
