/**
 * lib/export/pptx/presentation-theme.ts
 *
 * All dimensional and colour constants for the PPTX presentation.
 * Slide canvas is 16:9 at 13.333 × 7.5 inches — PptxGenJS's actual
 * "LAYOUT_WIDE" size (create-presentation.ts sets `pptx.layout = "LAYOUT_WIDE"`).
 *
 * IMPORTANT: SLIDE_W / SLIDE_H must always match whatever `pptx.layout` is
 * set to in create-presentation.ts. A previous version of this file used
 * 10 × 5.625in (which is actually PptxGenJS's "LAYOUT_16x9" size) while the
 * real canvas was 13.333 × 7.5in — every element was positioned for a
 * canvas 25% smaller than the one it was rendered onto, compressing all
 * content into the top-left ~56% of the slide and leaving the rest blank.
 *
 * Colour palette derived from the uploaded reference slides.
 */

// ─── Slide canvas ─────────────────────────────────────────────────────────────

export const SLIDE_W = 13.333333; // inches — PptxGenJS "LAYOUT_WIDE" width
export const SLIDE_H = 7.5;       // inches — PptxGenJS "LAYOUT_WIDE" height

// ─── Web-preview → export coordinate conversion ──────────────────────────────

/**
 * The in-app web preview (PackPreview.tsx, SlideFrame.tsx) lays out each
 * slide at a fixed 1280×720px "design" canvas and scales it to fit the
 * viewport with CSS. Any export code that needs to translate a design-space
 * pixel coordinate into an inches-based PptxGenJS coordinate must go through
 * this single conversion — never hand-roll a different scale factor or mix
 * px / % / rem values directly into slide.addText/addShape calls.
 */
export const DESIGN_W = 1280; // px — web-preview design canvas width
export const DESIGN_H = 720;  // px — web-preview design canvas height
const PX_PER_IN = 96;

/** Converts a design-space pixel length/coordinate to inches for PptxGenJS. */
export function pxToIn(px: number): number {
  return px / PX_PER_IN;
}

// ─── Margins ──────────────────────────────────────────────────────────────────

export const MARGIN_L = 0.45;  // inches
export const MARGIN_R = 0.45;
export const MARGIN_TOP = 0.45;
export const MARGIN_BOTTOM = 0.35;

/** Usable content width */
export const CONTENT_W = SLIDE_W - MARGIN_L - MARGIN_R; // ~12.43 in
/** Usable content height (below title bar) */
export const CONTENT_H = SLIDE_H - MARGIN_TOP - MARGIN_BOTTOM; // 6.7 in

// ─── Title bar ────────────────────────────────────────────────────────────────

export const TITLE_BAR_H = 0.6;    // inches — rule sits beneath this
export const RULE_Y = MARGIN_TOP + TITLE_BAR_H; // 1.05 in from top
export const CONTENT_START_Y = RULE_Y + 0.08;   // 1.13 in — content begins here (unchanged; independent of slide height)

// ─── Typography (in points) ───────────────────────────────────────────────────

/**
 * Bain slide template's theme fonts. Both resolve to the literal "Arial"
 * typeface — the "(Headings)" / "(Body)" suffix is how PowerPoint labels
 * major/minor theme-font slots, not a distinct font family — but they're
 * kept as separate constants so every renderer states its intent (header
 * vs. body copy) even though the rendered typeface is identical.
 */
export const FONT_FACE_HEADING = "Arial";
export const FONT_FACE_BODY = "Arial";
/** @deprecated use FONT_FACE_HEADING / FONT_FACE_BODY */
export const FONT_FACE = "Arial";

export const TEXT = {
  // Slide header — 24pt Arial (Headings)
  TITLE_SIZE: 24,
  TITLE_COLOR: "111111",
  TITLE_BOLD: false,

  // Section divider heading
  DIVIDER_SIZE: 28,
  DIVIDER_COLOR: "FFFFFF",

  // Body text below the red line — 12pt Arial (Body)
  BODY_SIZE: 12,
  BODY_COLOR: "333333",

  // Small label / caption
  LABEL_SIZE: 9,
  LABEL_COLOR: "777777",

  // Bullet text — 12pt Arial (Body)
  BULLET_SIZE: 12,
  BULLET_COLOR: "222222",

  // Bullet item title (bold lead-in of a bulleted entry)
  BULLET_TITLE_SIZE: 12,
  BULLET_TITLE_COLOR: "111111",

  // KPI headline numbers
  KPI_SIZE: 28,
  KPI_COLOR: "111111",

  // KPI sub-label
  KPI_LABEL_SIZE: 9,
  KPI_LABEL_COLOR: "555555",

  // Footnote / footer — 8pt Arial (Body)
  FOOTER_SIZE: 8,
  FOOTER_COLOR: "999999",

  // Table header
  TABLE_HEADER_SIZE: 9,
  TABLE_HEADER_COLOR: "FFFFFF",

  // Table body
  TABLE_BODY_SIZE: 9,
  TABLE_BODY_COLOR: "222222",
} as const;

// ─── Colours ──────────────────────────────────────────────────────────────────

export const COLOR = {
  /** Bain red */
  RED: "CC0000",
  /** Near-black for body text */
  INK: "111111",
  /** Light rule / divider */
  RULE: "DDDDDD",
  /** Slide background */
  BACKGROUND: "FFFFFF",
  /** Section divider background */
  DIVIDER_BG: "111111",
  /** Light grey panel backgrounds */
  PANEL_LIGHT: "F7F7F7",
  PANEL_MID: "EEEEEE",
  /** Dark panel (expertise, etc.) */
  PANEL_DARK: "222222",
  /** Table header fill */
  TABLE_HEADER_BG: "222222",
  /** Table alternating row */
  TABLE_ROW_ALT: "F7F7F7",
  /** Cover background */
  COVER_BG: "FFFFFF",
  /** Confidentiality label backgrounds */
  CONF_INTERNAL: "E8F0FE",
  CONF_ANON: "FFF3E0",
  CONF_RESTRICTED: "FEECEC",
} as const;

// ─── Rule / line ──────────────────────────────────────────────────────────────

/** Thin horizontal rule below the slide title */
export const RULE = {
  x: MARGIN_L,
  y: RULE_Y,
  w: CONTENT_W,
  h: 0,
  line: { color: COLOR.RED, width: 1.5 },
} as const;

// ─── Footer ───────────────────────────────────────────────────────────────────

export const FOOTER_Y = SLIDE_H - MARGIN_BOTTOM - 0.05;

export const FOOTER = {
  /** Confidentiality disclaimer — left-aligned, spans most of the width */
  DISCLAIMER_W: CONTENT_W * 0.72,
  /** "BAIN & COMPANY" wordmark block, right-aligned */
  WORDMARK_W: 1.7,
  WORDMARK_X: SLIDE_W - MARGIN_R - 1.7 - 0.4,
  /** Page number, far right */
  PAGE_NUM_W: 0.3,
  PAGE_NUM_X: SLIDE_W - MARGIN_R - 0.3,
} as const;

// ─── Section content slide geometry ──────────────────────────────────────────

export const SECTION_SLIDE = {
  /** Bullet list starting point, just below the red rule */
  BODY_Y: CONTENT_START_Y + 0.15,
  BODY_W: CONTENT_W,
  BODY_H: FOOTER_Y - CONTENT_START_Y - 0.35,
} as const;

// ─── Cover slide geometry ─────────────────────────────────────────────────────

export const COVER = {
  /** Red accent bar on left edge */
  ACCENT_X: 0,
  ACCENT_Y: 0,
  ACCENT_W: 0.08,
  ACCENT_H: SLIDE_H,
  /**
   * Title / subtitle / meta Y-positions are fractions of SLIDE_H (rather
   * than fixed inches) so the cover slide's composition — how far down the
   * title sits, the gap before the subtitle, etc. — stays proportionally
   * identical no matter what SLIDE_H is. A fixed-inch value here would
   * silently break composition again the next time the canvas size changes.
   */
  TITLE_X: MARGIN_L + 0.2,
  TITLE_Y: SLIDE_H * 0.32,
  TITLE_W: CONTENT_W * 0.7,
  TITLE_SIZE: 30,
  /** Subtitle */
  SUBTITLE_X: MARGIN_L + 0.2,
  SUBTITLE_Y: SLIDE_H * 0.4622,
  SUBTITLE_W: CONTENT_W * 0.7,
  SUBTITLE_SIZE: 16,
  /** Meta line */
  META_X: MARGIN_L + 0.2,
  META_Y: SLIDE_H * 0.6222,
  META_SIZE: 11,
  META_COLOR: "666666",
} as const;

// ─── Utility: inches to EMU ───────────────────────────────────────────────────

/** PptxGenJS uses inches natively, but this is useful for precise sizes */
export function toEmu(inches: number): number {
  return Math.round(inches * 914400);
}
