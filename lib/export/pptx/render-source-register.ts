/**
 * lib/export/pptx/render-source-register.ts
 *
 * Appendix slide listing all source records and their slide references.
 * Required for analytical integrity and source traceability.
 */

import type PptxGenJS from "pptxgenjs";
import type { SourceRecord } from "@/lib/export/types";
import {
  MARGIN_L, CONTENT_START_Y, CONTENT_W, FOOTER_Y,
  FONT_FACE, COLOR, TEXT,
} from "./presentation-theme";
import { addTitleBar, addFooter } from "./slide-helpers";

const TYPE_LABEL: Record<SourceRecord["type"], string> = {
  "credential": "Credential",
  "expert": "Expert",
  "partner": "Partner",
  "publication": "Publication",
  "chart": "Chart / Analytics",
  "reference-slide": "Reference slide",
};

export function renderSourceRegisterSlide(
  pptx: PptxGenJS,
  sources: SourceRecord[],
  workbookImportDate?: string,
  pageNumber?: number
): void {
  const slide = pptx.addSlide();

  addTitleBar(
    slide,
    pptx,
    "Source Register",
    workbookImportDate
      ? `All records and their provenance · Workbook imported: ${workbookImportDate}`
      : "All records and their provenance"
  );

  const bodyY = CONTENT_START_Y + 0.15;
  const rowH = 0.26;
  const maxRows = Math.floor((FOOTER_Y - bodyY - 0.15) / rowH);

  // Table header — column widths are proportions of CONTENT_W (not fixed
  // inches), so the table always fills the full canvas width regardless of
  // slide size instead of leaving a blank strip on the right.
  const colRatios = [0.9, 3.2, 2.0, 2.8]; // Type | Label | Source slides | Notes
  const ratioSum = colRatios.reduce((a, b) => a + b, 0);
  const colWidths = colRatios.map((r) => (r / ratioSum) * CONTENT_W);
  const colX = colWidths.reduce<number[]>((acc, w, i) => {
    acc.push(i === 0 ? MARGIN_L : acc[i - 1] + colWidths[i - 1]);
    return acc;
  }, []);
  const headers = ["Type", "Record", "Source slides", "Notes"];

  // Header row background
  slide.addShape(pptx.ShapeType.rect, {
    x: MARGIN_L, y: bodyY, w: CONTENT_W, h: rowH,
    fill: { color: "222222" }, line: { color: "222222", width: 0 },
  });

  headers.forEach((h, i) => {
    slide.addText(h, {
      x: colX[i] + 0.04, y: bodyY, w: colWidths[i] - 0.08, h: rowH,
      fontSize: 8, fontFace: FONT_FACE,
      bold: true, color: "FFFFFF", valign: "middle",
    });
  });

  // Data rows
  const displayed = sources.slice(0, maxRows - 1);
  displayed.forEach((src, i) => {
    const ry = bodyY + (i + 1) * rowH;
    const bg = i % 2 === 0 ? "FFFFFF" : "F7F7F7";

    slide.addShape(pptx.ShapeType.rect, {
      x: MARGIN_L, y: ry, w: CONTENT_W, h: rowH,
      fill: { color: bg }, line: { color: COLOR.RULE, width: 0.25 },
    });

    const cells = [
      TYPE_LABEL[src.type] ?? src.type,
      src.label,
      src.sourceSlides?.join(", ") ?? "—",
      src.workbookRef
        ? `Workbook: ${src.workbookRef.filename} (${src.workbookRef.importedAt})`
        : "",
    ];

    cells.forEach((val, ci) => {
      slide.addText(val, {
        x: colX[ci] + 0.04, y: ry, w: colWidths[ci] - 0.08, h: rowH,
        fontSize: 7.5, fontFace: FONT_FACE, color: TEXT.BODY_COLOR, valign: "middle",
        wrap: true,
      });
    });
  });

  if (sources.length > maxRows - 1) {
    const note = `… and ${sources.length - (maxRows - 1)} more records.`;
    slide.addText(note, {
      x: MARGIN_L, y: FOOTER_Y - 0.25,
      w: CONTENT_W * 0.6, h: 0.2,
      fontSize: 8, fontFace: FONT_FACE, color: "888888",
    });
  }

  addFooter(slide, pptx, undefined, pageNumber);
}
