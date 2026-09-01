/**
 * lib/export/pptx/validate-presentation.ts
 *
 * Pre-export validation. Returns blocking and non-blocking warnings.
 * Never recalculates workbook values.
 */

import type { PackState, PackItem } from "@/types/credentials";
import type { ExportWarning } from "@/lib/export/types";
import { CREDENTIALS } from "@/data/credentials";
import { EXPERTS } from "@/data/experts";
import {
  SLIDE_W, SLIDE_H, MARGIN_L, MARGIN_R, MARGIN_TOP, MARGIN_BOTTOM,
  CONTENT_W, CONTENT_H, RULE_Y, CONTENT_START_Y, FOOTER_Y,
  DESIGN_W, DESIGN_H, pxToIn,
} from "./presentation-theme";

export interface ValidationResult {
  ok: boolean; // false = blocked
  warnings: ExportWarning[];
}

const GEOMETRY_EPSILON_IN = 0.01;

/**
 * Structural geometry check, run once before every export. PptxGenJS gives
 * no way to introspect where shapes actually landed after rendering, so
 * this validates the shared layout CONSTANTS every renderer positions
 * itself against — the same class of bug that caused the "content
 * compressed top-left, blank bottom-right" export defect (SLIDE_W/SLIDE_H
 * silently out of sync with the real `pptx.layout` canvas size). If these
 * invariants hold, no renderer built on top of them can place an element
 * outside the slide or leave the declared canvas underused.
 *
 * Throws (rather than returning a warning) because a geometry mismatch
 * here means every single slide in the deck is laid out wrong — there is
 * no partial/non-blocking version of this failure.
 */
export function validateExportGeometry(): void {
  const problems: string[] = [];

  if (SLIDE_W <= 0 || SLIDE_H <= 0) {
    problems.push(`Slide canvas must be positive: ${SLIDE_W} × ${SLIDE_H}in.`);
  }

  // The design canvas (web-preview pixel space) must convert to exactly the
  // same size as the PPTX canvas — this is the exact invariant that broke
  // previously (SLIDE_W/SLIDE_H used PptxGenJS's LAYOUT_16x9 size while
  // `pptx.layout` was set to LAYOUT_WIDE).
  const designWIn = pxToIn(DESIGN_W);
  const designHIn = pxToIn(DESIGN_H);
  if (Math.abs(designWIn - SLIDE_W) > GEOMETRY_EPSILON_IN) {
    problems.push(
      `Design canvas width (${DESIGN_W}px → ${designWIn.toFixed(3)}in) does not match SLIDE_W (${SLIDE_W}in). ` +
      `Check that SLIDE_W matches the real inch size of the \`pptx.layout\` set in create-presentation.ts.`
    );
  }
  if (Math.abs(designHIn - SLIDE_H) > GEOMETRY_EPSILON_IN) {
    problems.push(
      `Design canvas height (${DESIGN_H}px → ${designHIn.toFixed(3)}in) does not match SLIDE_H (${SLIDE_H}in). ` +
      `Check that SLIDE_H matches the real inch size of the \`pptx.layout\` set in create-presentation.ts.`
    );
  }

  // Margins must leave positive usable content area, and must sum back to
  // the full canvas — if not, content is either negative-sized or the
  // canvas has unused space that no renderer accounts for.
  if (CONTENT_W <= 0 || CONTENT_H <= 0) {
    problems.push(`Content area must be positive: ${CONTENT_W.toFixed(3)} × ${CONTENT_H.toFixed(3)}in.`);
  }
  if (Math.abs(MARGIN_L + CONTENT_W + MARGIN_R - SLIDE_W) > GEOMETRY_EPSILON_IN) {
    problems.push(`Horizontal margins + content width (${(MARGIN_L + CONTENT_W + MARGIN_R).toFixed(3)}in) do not sum to SLIDE_W (${SLIDE_W}in).`);
  }
  if (Math.abs(MARGIN_TOP + CONTENT_H + MARGIN_BOTTOM - SLIDE_H) > GEOMETRY_EPSILON_IN) {
    problems.push(`Vertical margins + content height (${(MARGIN_TOP + CONTENT_H + MARGIN_BOTTOM).toFixed(3)}in) do not sum to SLIDE_H (${SLIDE_H}in).`);
  }

  // Every derived Y-anchor used by the renderers must stay strictly within
  // the canvas and in the right order, or some slide's title/body/footer
  // will render outside the visible frame or on top of another element.
  if (!(0 < RULE_Y && RULE_Y < CONTENT_START_Y && CONTENT_START_Y < FOOTER_Y && FOOTER_Y < SLIDE_H)) {
    problems.push(
      `Vertical anchors out of order or out of bounds: 0 < RULE_Y(${RULE_Y.toFixed(3)}) < ` +
      `CONTENT_START_Y(${CONTENT_START_Y.toFixed(3)}) < FOOTER_Y(${FOOTER_Y.toFixed(3)}) < SLIDE_H(${SLIDE_H}) does not hold.`
    );
  }

  if (problems.length > 0) {
    throw new Error(`Export geometry invalid — refusing to render:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
  }
}

export function validatePackForExport(pack: PackState): ValidationResult {
  const warnings: ExportWarning[] = [];

  for (const item of pack.items) {
    // Restricted items are always blocking
    if (item.exportRestricted) {
      warnings.push({
        code: "restricted-item",
        message: `"${item.title}" is marked restricted and cannot be exported.`,
        blocking: true,
      });
      continue;
    }

    // Credentials with "restricted" confidentiality
    if (item.itemType === "credential") {
      const cred = CREDENTIALS.find((c) => c.id === item.id);
      if (cred?.confidentiality === "restricted") {
        warnings.push({
          code: "restricted-item",
          message: `Credential "${cred.title}" has restricted confidentiality.`,
          blocking: true,
        });
      }
      // Credentials without client alias
      if (cred && !cred.clientAlias) {
        warnings.push({
          code: "missing-client-alias",
          message: `Credential "${cred.title}" has no client alias; client name will be omitted.`,
          blocking: false,
        });
      }
      // Long narrative warning
      if (cred && cred.summary.length > 800) {
        warnings.push({
          code: "long-narrative",
          message: `Credential "${cred.title}" has a very long summary; text may be clipped in export.`,
          blocking: false,
        });
      }
    }

    // Expert slides without a photo field
    if (item.itemType === "expert") {
      const expert = EXPERTS.find((e) => e.id === item.id);
      if (expert && !("photoUrl" in expert)) {
        warnings.push({
          code: "missing-expert-photo",
          message: `Expert "${expert.name}" has no photo; a placeholder will be used.`,
          blocking: false,
        });
      }
    }
  }

  // Must have at least one exportable item
  const exportableItems = pack.items.filter((i: PackItem) => !i.exportRestricted);
  if (exportableItems.length === 0) {
    warnings.push({
      code: "restricted-item",
      message: "No exportable items remain after confidentiality filtering.",
      blocking: true,
    });
  }

  const blocking = warnings.filter((w) => w.blocking);
  return { ok: blocking.length === 0, warnings };
}
