/**
 * lib/export/pptx/render-expert-table-slide.ts
 *
 * Renders a slide's worth of selected experts as a Bain-format roster
 * panel — a thin-bordered section box with a red, underlined label tab
 * ("Selected Experts") sitting on its top edge, containing one
 * Name / Title / Related-credentials stack per expert laid out in a grid.
 * This mirrors the visual language of the actual reference slides (e.g.
 * the "Leadership team" slide's labeled section boxes), not a generic
 * spreadsheet-style table with a solid header row and striped rows.
 *
 * This deliberately replaces the "full reference-slide exhibit" treatment
 * for experts: a registered reference slide (e.g. "Leadership Team")
 * reproduces the entire fixed roster from the original source deck, not
 * just the people the user picked. Since there is no control for a user to
 * explicitly opt into that full exhibit, selected experts always render
 * this way — a roster naming exactly who was chosen, with their own
 * credentials, never the whole original slide's cast.
 */

import type PptxGenJS from "pptxgenjs";
import type { ExpertTableRow } from "@/lib/pack-slide-content";
import {
  MARGIN_L, CONTENT_START_Y, CONTENT_W, FOOTER_Y,
  FONT_FACE_BODY, FONT_FACE_HEADING, COLOR, TEXT,
} from "./presentation-theme";
import { addTitleBar, addFooter } from "./slide-helpers";

export interface ExpertTableSlideOptions {
  header: string;
  subtitle?: string;
  rows: ExpertTableRow[];
  footerText?: string;
  pageNumber?: number;
}

// Grid geometry for the roster panel.
const COLS = 4;
const ROW_H = 0.85; // inches — room for name (up to 2 lines) + title + credentials
const BOX_PAD_X = 0.2;
const BOX_PAD_TOP = 0.32; // clears the label tab sitting on the top border

export function renderExpertTableSlide(
  pptx: PptxGenJS,
  opts: ExpertTableSlideOptions
): void {
  const slide = pptx.addSlide();

  addTitleBar(slide, pptx, opts.header, opts.subtitle);

  const boxTop = CONTENT_START_Y + 0.15;
  const boxBottom = FOOTER_Y - 0.15;
  const boxLeft = MARGIN_L;
  const boxWidth = CONTENT_W;
  const boxHeight = boxBottom - boxTop;

  if (opts.rows.length === 0) {
    slide.addText("No experts in this section.", {
      x: boxLeft, y: boxTop, w: boxWidth, h: 0.3,
      fontSize: TEXT.BULLET_SIZE, fontFace: FONT_FACE_BODY,
      italic: true, color: "999999",
    });
    addFooter(slide, pptx, opts.footerText, opts.pageNumber);
    return;
  }

  // Bordered section box — the same convention used across the reference
  // slides: a thin rectangle with a red, underlined label tab overlapping
  // its top edge, rather than a table header row.
  slide.addShape(pptx.ShapeType.rect, {
    x: boxLeft, y: boxTop, w: boxWidth, h: boxHeight,
    fill: { color: COLOR.BACKGROUND },
    line: { color: COLOR.RULE, width: 0.75 },
  });

  const labelW = 1.8;
  // Small background-matched rectangle "erases" the segment of the border
  // the label sits on, then the label itself is drawn on top of it.
  slide.addShape(pptx.ShapeType.rect, {
    x: boxLeft + 0.24, y: boxTop - 0.1, w: labelW, h: 0.2,
    fill: { color: COLOR.BACKGROUND }, line: { color: COLOR.BACKGROUND, width: 0 },
  });
  slide.addText("SELECTED EXPERTS", {
    x: boxLeft + 0.28, y: boxTop - 0.11, w: labelW, h: 0.22,
    fontSize: 9, fontFace: FONT_FACE_HEADING, bold: true, color: COLOR.RED,
    underline: { style: "sng", color: COLOR.RED }, charSpacing: 0.5, valign: "middle",
  });

  const colW = (boxWidth - BOX_PAD_X * 2) / COLS;
  const maxRows = Math.max(1, Math.floor((boxHeight - BOX_PAD_TOP - 0.15) / ROW_H));
  const capacity = COLS * maxRows;
  const displayed = opts.rows.slice(0, capacity);

  displayed.forEach((row, i) => {
    const col = i % COLS;
    const r = Math.floor(i / COLS);
    const x = boxLeft + BOX_PAD_X + col * colW;
    const y = boxTop + BOX_PAD_TOP + r * ROW_H;

    const runs: { text: string; options: Record<string, unknown> }[] = [
      { text: row.name, options: { bold: true, fontSize: 9, color: TEXT.TITLE_COLOR, breakLine: true } },
      { text: row.title || "—", options: { fontSize: 8, color: "444444", breakLine: true } },
    ];
    if (row.credentials !== "—") {
      runs.push({ text: row.credentials, options: { italic: true, fontSize: 7, color: "888888" } });
    }

    slide.addText(runs, {
      x, y, w: colW - 0.18, h: ROW_H - 0.1,
      fontFace: FONT_FACE_BODY, valign: "top", wrap: true,
      paraSpaceAfter: 2, autoFit: false, shrinkText: true,
    });
  });

  if (opts.rows.length > displayed.length) {
    const note = `… and ${opts.rows.length - displayed.length} more experts.`;
    slide.addText(note, {
      x: boxLeft, y: boxBottom - 0.24,
      w: boxWidth * 0.6, h: 0.2,
      fontSize: 8, fontFace: FONT_FACE_BODY, italic: true, color: "888888",
    });
  }

  addFooter(slide, pptx, opts.footerText, opts.pageNumber);
}
