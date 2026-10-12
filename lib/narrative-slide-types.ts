/**
 * lib/narrative-slide-types.ts
 *
 * Shape of the exact slide definitions extracted from the real source deck
 * (one JSON file per slide, each a literal record of every text run,
 * shape, image, and chart on that slide — positions in inches, colors as
 * hex-without-#, matching PptxGenJS's own option shapes almost verbatim).
 *
 * This is intentionally a *thin* type layer over the raw extraction, not a
 * redesigned schema: the on-screen renderer (components/narrative-slide/
 * NarrativeSlideCanvas.tsx) and the PPTX exporter (lib/export/pptx/
 * render-narrative-slide.ts) both read the SAME untouched JSON, so a
 * number or color can never drift between what's previewed and what's
 * downloaded — there is only one copy of the content to get out of sync.
 */

export interface NarrativeTextRunOptions {
  fontSize?: number;
  fontFace?: string;
  bold?: boolean;
  italic?: boolean;
  color?: string;
  align?: "left" | "center" | "right" | "justify";
  bullet?: boolean;
  charSpacing?: number;
}

export interface NarrativeTextRun {
  text: string;
  options?: NarrativeTextRunOptions;
}

export interface NarrativeFill {
  color: string;
  transparency?: number;
}

export interface NarrativeLine {
  color: string;
  width?: number;
  dashType?: string;
  endArrowType?: string;
}

interface NarrativeObjectBase {
  id: number;
  options: {
    x: number;
    y: number;
    w: number;
    h: number;
    [key: string]: unknown;
  };
}

export interface NarrativeTextObject extends NarrativeObjectBase {
  type: "text";
  text: NarrativeTextRun[];
}

export interface NarrativeShapeObject extends NarrativeObjectBase {
  type: "shape";
  shape: string; // e.g. "rect" | "roundRect" | "round1Rect" | "line" | "ellipse" | "triangle" | "chevron" | "custGeom"
}

export interface NarrativeImageObject extends NarrativeObjectBase {
  type: "image";
  options: NarrativeObjectBase["options"] & { data?: string };
}

export interface NarrativeChartSeries {
  name: string;
  labels?: string[];
  values: (number | null)[];
}

export interface NarrativeChartObject extends NarrativeObjectBase {
  type: "chart";
  chartType: string; // "bar" | "scatter" | "line" | ...
  data: NarrativeChartSeries[];
}

export type NarrativeSlideObject =
  | NarrativeTextObject
  | NarrativeShapeObject
  | NarrativeImageObject
  | NarrativeChartObject;

export interface NarrativeSlideData {
  slideNumber: number;
  title: string;
  width: number;
  height: number;
  background?: { color: string };
  objects: NarrativeSlideObject[];
}

/** Registry metadata describing one narrative slide and where it sits relative to the dashboard. */
export interface NarrativeSlideEntry {
  data: NarrativeSlideData;
  /** Short label used on the Overview card and in the Pack Builder. */
  label: string;
  /** One-line context explaining what the slide covers. */
  description: string;
}
