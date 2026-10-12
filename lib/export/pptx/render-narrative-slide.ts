/**
 * lib/export/pptx/render-narrative-slide.ts
 *
 * Renders a narrative slide (data/narrative-slides.ts) as a native,
 * editable PptxGenJS slide. Unlike render-reference-slide.ts — which
 * re-derives the deck's own template chrome around facts pulled from a
 * separate content file — this renders the extracted slide definition
 * (data/narrative-slides/*.json) close to verbatim: the same text runs,
 * shapes, images, and chart data at their exact extracted positions, with
 * none of this pack's own title bar or footer added on top. That's what
 * makes the result a 1:1 replica of the original slide rather than a
 * reproduction in this deck's house style — the same contract the
 * on-screen renderer (components/narrative-slide/NarrativeSlideCanvas.tsx)
 * follows from the same source JSON.
 */

import type PptxGenJS from "pptxgenjs";
import type {
  NarrativeSlideData,
  NarrativeTextObject,
  NarrativeShapeObject,
  NarrativeImageObject,
  NarrativeChartObject,
} from "@/lib/narrative-slide-types";

const VALID_SHAPE_TYPES = new Set([
  "rect",
  "roundRect",
  "round1Rect",
  "round2DiagRect",
  "round2SameRect",
  "ellipse",
  "line",
  "triangle",
  "rtTriangle",
  "chevron",
  "diamond",
  "hexagon",
  "parallelogram",
  "trapezoid",
  "pentagon",
  "plus",
]);

/** Falls back to a plain rectangle for any extracted shape name pptxgenjs doesn't recognize (e.g. freeform `custGeom`). */
function resolveShapeType(pptx: PptxGenJS, shape: string): PptxGenJS.ShapeType {
  const key = VALID_SHAPE_TYPES.has(shape) ? shape : "rect";
  return (pptx.ShapeType as unknown as Record<string, PptxGenJS.ShapeType>)[key];
}

const VALID_CHART_TYPES = new Set(["area", "bar", "bar3d", "bubble", "bubble3d", "doughnut", "line", "pie", "radar", "scatter"]);

function resolveChartType(pptx: PptxGenJS, chartType: string): PptxGenJS.ChartType {
  const key = VALID_CHART_TYPES.has(chartType) ? chartType : "bar";
  return (pptx.ChartType as unknown as Record<string, PptxGenJS.ChartType>)[key];
}

function addTextObject(slide: PptxGenJS.Slide, obj: NarrativeTextObject): void {
  const runs = obj.text
    .filter((run) => run.text.length > 0)
    .map((run) => ({ text: run.text, options: { ...run.options } }));
  if (runs.length === 0) return;

  slide.addText(runs as unknown as PptxGenJS.TextProps[], obj.options as PptxGenJS.TextPropsOptions);
}

function addShapeObject(slide: PptxGenJS.Slide, pptx: PptxGenJS, obj: NarrativeShapeObject): void {
  slide.addShape(resolveShapeType(pptx, obj.shape), obj.options as PptxGenJS.ShapeProps);
}

function addImageObject(slide: PptxGenJS.Slide, obj: NarrativeImageObject): void {
  if (!obj.options.data) return;
  slide.addImage(obj.options as PptxGenJS.ImageProps);
}

function addChartObject(slide: PptxGenJS.Slide, pptx: PptxGenJS, obj: NarrativeChartObject): void {
  const chartData = obj.data.map((series) => ({
    name: series.name,
    labels: series.labels ?? obj.data[0]?.labels ?? series.values.map((_, i) => String(i + 1)),
    values: series.values.map((v) => v ?? 0),
  }));

  slide.addChart(
    resolveChartType(pptx, obj.chartType) as unknown as PptxGenJS.CHART_NAME,
    chartData as unknown as PptxGenJS.IChartMulti[],
    obj.options as PptxGenJS.IChartOpts
  );
}

/**
 * Adds one new slide reproducing a narrative slide's extracted content verbatim.
 *
 * Each object is rendered independently and wrapped in its own try/catch:
 * the extracted JSON comes from a PPTX scrape that can occasionally produce
 * a malformed object (e.g. a chart part with an implausible series shape
 * pptxgenjs can't embed). Without this guard, one bad object on one slide
 * throws inside pptx.write() and corrupts the *entire* download for every
 * slide in the pack — the "file gives an error, and repairing drops
 * slides" failure mode. A skipped object just means that one piece of
 * decoration is missing; every other slide and every other object on this
 * slide still exports cleanly.
 */
export function renderNarrativeSlide(pptx: PptxGenJS, data: NarrativeSlideData): void {
  const slide = pptx.addSlide();
  slide.background = { color: data.background?.color ?? "FFFFFF" };

  for (const obj of data.objects) {
    try {
      switch (obj.type) {
        case "text":
          addTextObject(slide, obj);
          break;
        case "shape":
          addShapeObject(slide, pptx, obj);
          break;
        case "image":
          addImageObject(slide, obj);
          break;
        case "chart":
          addChartObject(slide, pptx, obj);
          break;
      }
    } catch (error) {
      console.warn(
        `[narrative-slide] Skipping object ${obj.id} (${obj.type}) on slide ${data.slideNumber}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
