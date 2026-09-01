/**
 * lib/export/pptx/render-cover-slide.ts
 *
 * Generates the cover / title slide.
 * Visual language: white background, left-edge red accent bar,
 * large black title, subtitle, and metadata line.
 */

import type PptxGenJS from "pptxgenjs";
import {
  SLIDE_W, SLIDE_H, MARGIN_L, FONT_FACE, COLOR, COVER, FOOTER_Y,
} from "./presentation-theme";

export interface CoverSlideData {
  title: string;
  subtitle?: string;
  clientAlias?: string;
  preparedBy?: string;
  date?: string;
  confidentiality?: string;
}

export function renderCoverSlide(
  pptx: PptxGenJS,
  data: CoverSlideData
): void {
  const slide = pptx.addSlide();

  // White background
  slide.background = { fill: COLOR.COVER_BG };

  // Left-edge red accent bar
  slide.addShape(pptx.ShapeType.rect, {
    x: COVER.ACCENT_X,
    y: COVER.ACCENT_Y,
    w: COVER.ACCENT_W,
    h: COVER.ACCENT_H,
    fill: { color: COLOR.RED },
    line: { color: COLOR.RED, width: 0 },
  });

  // Bain wordmark placeholder (text-based since no image asset available)
  slide.addText("BAIN & COMPANY", {
    x: MARGIN_L + 0.2,
    y: 0.32,
    w: 3,
    h: 0.22,
    fontSize: 9,
    fontFace: FONT_FACE,
    bold: true,
    color: COLOR.INK,
    charSpacing: 3,
  });

  // Main title
  slide.addText(data.title, {
    x: COVER.TITLE_X,
    y: COVER.TITLE_Y,
    w: COVER.TITLE_W,
    h: 0.9,
    fontSize: COVER.TITLE_SIZE,
    fontFace: FONT_FACE,
    bold: false,
    color: COLOR.INK,
    wrap: true,
    valign: "top",
  });

  // Red rule under title
  slide.addShape(pptx.ShapeType.line, {
    x: COVER.TITLE_X,
    y: COVER.TITLE_Y + 0.82,
    w: COVER.TITLE_W * 0.18,
    h: 0,
    line: { color: COLOR.RED, width: 2.5 },
  });

  // Subtitle
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: COVER.SUBTITLE_X,
      y: COVER.SUBTITLE_Y,
      w: COVER.SUBTITLE_W,
      h: 0.45,
      fontSize: COVER.SUBTITLE_SIZE,
      fontFace: FONT_FACE,
      color: "555555",
      wrap: true,
      valign: "top",
    });
  }

  // Meta line: client / date / prepared by
  const metaParts: string[] = [];
  if (data.clientAlias) metaParts.push(`Prepared for: ${data.clientAlias}`);
  if (data.preparedBy) metaParts.push(`Prepared by: ${data.preparedBy}`);
  if (data.date) metaParts.push(data.date);

  if (metaParts.length > 0) {
    slide.addText(metaParts.join("  |  "), {
      x: COVER.META_X,
      y: COVER.META_Y,
      w: COVER.TITLE_W,
      h: 0.25,
      fontSize: COVER.META_SIZE,
      fontFace: FONT_FACE,
      color: COVER.META_COLOR,
    });
  }

  // Confidentiality label bottom-right
  if (data.confidentiality) {
    slide.addText(data.confidentiality.toUpperCase(), {
      x: SLIDE_W - 2.5,
      y: FOOTER_Y,
      w: 2.3,
      h: 0.18,
      fontSize: 7,
      fontFace: FONT_FACE,
      color: "999999",
      align: "right",
    });
  }
}
