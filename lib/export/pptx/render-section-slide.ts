/**
 * lib/export/pptx/render-section-slide.ts
 *
 * Renders one slide per pack section, matching the Bain slide template:
 *
 *   [Header — 24pt Arial (Headings)]
 *   [Red rule]
 *   • <Text / Images / Framework> — one bullet per pack item, 12pt Arial (Body)
 *   [Footer — confidentiality notice (8pt Arial Body) + BAIN & COMPANY + page #]
 *
 * A section with more items than fit comfortably on one slide is paginated
 * into "(cont'd)" slides rather than overflowing the frame.
 */

import type PptxGenJS from "pptxgenjs";
import {
  MARGIN_L, SECTION_SLIDE, FONT_FACE_BODY, COLOR, TEXT,
} from "./presentation-theme";
import { addTitleBar, addFooter } from "./slide-helpers";
import {
  type SectionBulletEntry,
  paginateSectionEntries,
} from "@/lib/pack-slide-content";

export type { SectionBulletEntry };

// Line-height heuristic for pagination — not a real layout engine, just
// enough to keep a large section from silently overflowing the slide.
const LINE_H_IN = (TEXT.BULLET_SIZE + 4) / 72;
const MAX_LINES_PER_SLIDE = Math.max(4, Math.floor(SECTION_SLIDE.BODY_H / LINE_H_IN));

function paginate(entries: SectionBulletEntry[]): SectionBulletEntry[][] {
  return paginateSectionEntries(entries, MAX_LINES_PER_SLIDE);
}

/** Builds the multi-run bullet text array pptxgenjs needs for bold-title + plain-body bullets. */
function buildBulletRuns(entries: SectionBulletEntry[]): { text: string; options: Record<string, unknown> }[] {
  const runs: { text: string; options: Record<string, unknown> }[] = [];

  entries.forEach((entry) => {
    const hasTail = Boolean(entry.body) || Boolean(entry.note);

    runs.push({
      text: (entry.priority ? "★ " : "") + entry.title,
      options: {
        bullet: { code: "25CF", color: COLOR.RED, indent: 14 },
        bold: true,
        color: entry.priority ? COLOR.RED : TEXT.BULLET_TITLE_COLOR,
        breakLine: !hasTail,
      },
    });

    if (entry.body) {
      runs.push({
        text: `  —  ${entry.body}`,
        options: {
          bold: false,
          color: TEXT.BULLET_COLOR,
          breakLine: !entry.note,
        },
      });
    }

    if (entry.note) {
      runs.push({
        text: `  (Note: ${entry.note})`,
        options: {
          italic: true,
          color: "888888",
          breakLine: true,
        },
      });
    }
  });

  return runs;
}

export interface SectionSlideOptions {
  /** Slide header text — the section label (plus solution group, if applicable). */
  header: string;
  /** Optional subtitle rendered just under the red rule. */
  subtitle?: string;
  entries: SectionBulletEntry[];
  /** Footer left text; defaults to the standard Bain confidentiality notice. */
  footerText?: string;
  /** Running page-number counter — incremented by the caller for each slide added. */
  nextPageNumber: () => number;
}

/**
 * Renders one (or more, if paginated) slide(s) for a section's worth of pack
 * items. Returns the number of slides rendered.
 */
export function renderSectionSlides(
  pptx: PptxGenJS,
  opts: SectionSlideOptions
): number {
  const pages = paginate(opts.entries);

  pages.forEach((pageEntries, pageIdx) => {
    const slide = pptx.addSlide();
    const header = pageIdx === 0 ? opts.header : `${opts.header} (cont'd)`;

    addTitleBar(slide, pptx, header, pageIdx === 0 ? opts.subtitle : undefined);

    if (pageEntries.length > 0) {
      const runs = buildBulletRuns(pageEntries);
      slide.addText(runs, {
        x: MARGIN_L,
        y: SECTION_SLIDE.BODY_Y,
        w: SECTION_SLIDE.BODY_W,
        h: SECTION_SLIDE.BODY_H,
        fontSize: TEXT.BULLET_SIZE,
        fontFace: FONT_FACE_BODY,
        valign: "top",
        wrap: true,
        paraSpaceAfter: 8,
      });
    } else {
      slide.addText("No items in this section.", {
        x: MARGIN_L,
        y: SECTION_SLIDE.BODY_Y,
        w: SECTION_SLIDE.BODY_W,
        h: 0.3,
        fontSize: TEXT.BULLET_SIZE,
        fontFace: FONT_FACE_BODY,
        italic: true,
        color: "999999",
      });
    }

    addFooter(slide, pptx, opts.footerText, opts.nextPageNumber());
  });

  return pages.length;
}
