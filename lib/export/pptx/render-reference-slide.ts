/**
 * lib/export/pptx/render-reference-slide.ts
 *
 * When a pack item cites a registered reference slide (data/reference-slides.ts),
 * the PPTX export renders the actual reference slide here — a native,
 * editable pptxgenjs reproduction of its real content and hierarchy — instead
 * of a plain bullet summary. Reads the same facts
 * (data/reference-slide-content.ts) that the on-screen recreation
 * (components/reference-slides/SustainabilityOverviewNN.tsx) uses, so the two
 * surfaces can never disagree on names, titles, or questions.
 *
 * This is NOT a pixel clone of the reference image — pptxgenjs can't run
 * React, and the source reference images aren't shipped as export assets —
 * it's a faithful, editable native reproduction of the same structure: the
 * same headline, the same groupings, the same people and questions, laid out
 * with this deck's own template chrome (title bar, red rule, footer).
 */

import type PptxGenJS from "pptxgenjs";
import { MARGIN_L, MARGIN_R, SLIDE_W, CONTENT_START_Y, FOOTER_Y, FONT_FACE_BODY, COLOR } from "./presentation-theme";
import { addTitleBar, addFooter } from "./slide-helpers";
import {
  CENTERS_OF_EXCELLENCE_SLIDE,
  LEADERSHIP_TEAM_SLIDE,
  FOUR_SOLUTIONS_SLIDE,
  OFFICES_SLIDE,
  type CoECardData,
  type SlidePerson,
  type LeadershipPersonData,
} from "@/data/reference-slide-content";

const BODY_TOP = CONTENT_START_Y + 0.1;
const BODY_BOTTOM = FOOTER_Y - 0.15;
const BODY_W = SLIDE_W - MARGIN_L - MARGIN_R;

/**
 * Renders the registered reference slide (if any) as its own native slide.
 * Returns true if `slideNumber` was recognized and rendered.
 */
export function renderReferenceSlide(pptx: PptxGenJS, slideNumber: number, pageNumber: number): boolean {
  switch (slideNumber) {
    case 1:
      renderCentersOfExcellence(pptx, pageNumber);
      return true;
    case 2:
      renderLeadershipTeam(pptx, pageNumber);
      return true;
    case 3:
      renderFourSolutions(pptx, pageNumber);
      return true;
    case 4:
      renderOffices(pptx, pageNumber);
      return true;
    default:
      return false;
  }
}

// ─── Shared: a small bordered card with a name, questions, and person(s) ────

function addCard(
  slide: PptxGenJS.Slide,
  pptx: PptxGenJS,
  opts: { x: number; y: number; w: number; h: number; name: string; questions: string[]; persons: SlidePerson[] }
): void {
  slide.addShape(pptx.ShapeType.rect, {
    x: opts.x,
    y: opts.y,
    w: opts.w,
    h: opts.h,
    fill: { color: COLOR.PANEL_LIGHT },
    line: { color: COLOR.RULE, width: 0.5 },
  });

  const pad = 0.08;
  slide.addText(
    [
      { text: opts.name, options: { bold: true, fontSize: 8.5, color: COLOR.INK, breakLine: true } },
      ...opts.questions.map((q) => ({
        text: q,
        options: { italic: true, fontSize: 6.5, color: "666666", breakLine: true },
      })),
      ...opts.persons.map((p) => ({
        text: `${p.name} — ${p.title}`,
        options: { fontSize: 7, color: "222222", breakLine: true },
      })),
    ],
    {
      x: opts.x + pad,
      y: opts.y + pad,
      w: opts.w - pad * 2,
      h: opts.h - pad * 2,
      fontFace: FONT_FACE_BODY,
      valign: "top",
      wrap: true,
      paraSpaceAfter: 2,
      autoFit: false,
      shrinkText: true,
    }
  );
}

// ─── Slide 1 — 9 Centers of Excellence ───────────────────────────────────────

function renderCentersOfExcellence(pptx: PptxGenJS, pageNumber: number): void {
  const slide = pptx.addSlide();
  const d = CENTERS_OF_EXCELLENCE_SLIDE;
  addTitleBar(slide, pptx, d.title);

  // Flatten every card-shaped unit (row1 + row2 + Global Energy & Materials +
  // its 2 sub-specialties + Water + Biodiversity) into one 4-column grid —
  // a native, editable substitute for the reference image's freeform layout.
  const cards: { name: string; questions: string[]; persons: SlidePerson[] }[] = [
    ...d.row1.map((c: CoECardData) => ({ name: c.name, questions: c.questions, persons: c.persons })),
    ...d.row2.map((c: CoECardData) => ({ name: c.name, questions: c.questions, persons: c.persons })),
    { name: d.globalEnergyMaterials.name, questions: [d.globalEnergyMaterials.question], persons: d.globalEnergyMaterials.persons },
    ...d.globalEnergyMaterials.subSpecialties.map((s) => ({ name: s.name, questions: [s.question], persons: [s.person] })),
    { name: d.water.name, questions: d.water.questions, persons: d.water.persons },
    { name: d.biodiversity.name, questions: d.biodiversity.questions, persons: d.biodiversity.persons },
  ];

  const cols = 4;
  const gap = 0.1;
  const cardW = (BODY_W - gap * (cols - 1)) / cols;
  const rows = Math.ceil(cards.length / cols);
  const cardH = (BODY_BOTTOM - BODY_TOP - gap * (rows - 1)) / rows;

  cards.forEach((card, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    addCard(slide, pptx, {
      x: MARGIN_L + col * (cardW + gap),
      y: BODY_TOP + row * (cardH + gap),
      w: cardW,
      h: cardH,
      ...card,
    });
  });

  addFooter(slide, pptx, undefined, pageNumber);
}

// ─── Slide 2 — Sustainability leadership team ────────────────────────────────

function addPersonRow(
  slide: PptxGenJS.Slide,
  people: LeadershipPersonData[],
  opts: { x: number; y: number; w: number; h: number }
): void {
  const cols = Math.min(people.length, 6);
  const cardW = opts.w / cols;
  people.forEach((p, i) => {
    const x = opts.x + i * cardW;
    slide.addText(
      [
        { text: p.name, options: { bold: true, fontSize: 8, color: COLOR.INK, breakLine: true } },
        { text: p.role, options: { fontSize: 7, color: p.roleRed ? COLOR.RED : "555555", breakLine: false } },
      ],
      {
        x: x + 0.03,
        y: opts.y,
        w: cardW - 0.06,
        h: opts.h,
        fontFace: FONT_FACE_BODY,
        valign: "top",
        wrap: true,
        align: "left",
      }
    );
  });
}

function renderLeadershipTeam(pptx: PptxGenJS, pageNumber: number): void {
  const slide = pptx.addSlide();
  const d = LEADERSHIP_TEAM_SLIDE;
  addTitleBar(slide, pptx, d.title);

  const sections: { label: string; people: LeadershipPersonData[] }[] = [
    { label: "Overall", people: d.overall },
    { label: "Solution Leaders", people: d.solutionLeaders },
    { label: "Industry Leaders", people: d.industryLeaders },
  ];

  const sectionH = (BODY_BOTTOM - BODY_TOP) / sections.length;
  sections.forEach((section, i) => {
    const y = BODY_TOP + i * sectionH;
    slide.addText(section.label.toUpperCase(), {
      x: MARGIN_L,
      y,
      w: BODY_W,
      h: 0.2,
      fontSize: 8,
      fontFace: FONT_FACE_BODY,
      bold: true,
      color: "888888",
      charSpacing: 1,
    });
    slide.addShape(pptx.ShapeType.line, {
      x: MARGIN_L,
      y: y + 0.2,
      w: BODY_W,
      h: 0,
      line: { color: COLOR.RULE, width: 0.5 },
    });
    addPersonRow(slide, section.people, { x: MARGIN_L, y: y + 0.3, w: BODY_W, h: sectionH - 0.35 });
  });

  addFooter(slide, pptx, undefined, pageNumber);
}

// ─── Slide 3 — Four critical solutions ───────────────────────────────────────

function renderFourSolutions(pptx: PptxGenJS, pageNumber: number): void {
  const slide = pptx.addSlide();
  const d = FOUR_SOLUTIONS_SLIDE;
  addTitleBar(slide, pptx, d.title);

  const cols = d.columns.length;
  const gap = 0.15;
  const colW = (BODY_W - gap * (cols - 1)) / cols;

  d.columns.forEach((column, i) => {
    const x = MARGIN_L + i * (colW + gap);

    slide.addText(column.title.replace(/\n/g, " "), {
      x,
      y: BODY_TOP,
      w: colW,
      h: 0.35,
      fontSize: 10,
      fontFace: FONT_FACE_BODY,
      bold: true,
      color: COLOR.RED,
      wrap: true,
      valign: "top",
    });

    const runs = column.people.map((p) => ({
      text: `${p.name.replace(/\n/g, " ")} — ${p.role}`,
      options: {
        bullet: { code: "25CF", color: COLOR.RED, indent: 8 },
        breakLine: true,
      },
    }));

    slide.addText(runs, {
      x,
      y: BODY_TOP + 0.4,
      w: colW,
      h: BODY_BOTTOM - BODY_TOP - 0.4,
      fontSize: 7,
      fontFace: FONT_FACE_BODY,
      color: "222222",
      valign: "top",
      wrap: true,
      paraSpaceAfter: 1,
    });
  });

  addFooter(slide, pptx, undefined, pageNumber);
}

// ─── Slide 4 — 40+ Offices ────────────────────────────────────────────────────

function renderOffices(pptx: PptxGenJS, pageNumber: number): void {
  const slide = pptx.addSlide();
  const d = OFFICES_SLIDE;
  addTitleBar(slide, pptx, d.title);

  const cols = d.regions.length;
  const gap = 0.15;
  const colW = (BODY_W - gap * (cols - 1)) / cols;

  d.regions.forEach((region, i) => {
    const x = MARGIN_L + i * (colW + gap);

    slide.addText(`${region.label.toUpperCase()} (${region.people.length})`, {
      x,
      y: BODY_TOP,
      w: colW,
      h: 0.25,
      fontSize: 9,
      fontFace: FONT_FACE_BODY,
      bold: true,
      color: COLOR.RED,
    });
    slide.addShape(pptx.ShapeType.line, {
      x,
      y: BODY_TOP + 0.25,
      w: colW,
      h: 0,
      line: { color: COLOR.RULE, width: 0.5 },
    });

    // A dense, wrapped name list — the reference slide's per-office rosters
    // are too numerous (up to 44 names) to lay out as individual boxes and
    // still be legible, so the region grouping (the slide's real hierarchy)
    // is preserved and the names are listed in full underneath it.
    const nameList = region.people.map((p) => `${p.first} ${p.last}`).join("  •  ");
    slide.addText(nameList, {
      x,
      y: BODY_TOP + 0.32,
      w: colW,
      h: BODY_BOTTOM - BODY_TOP - 0.32,
      fontSize: 6.5,
      fontFace: FONT_FACE_BODY,
      color: "222222",
      valign: "top",
      wrap: true,
      lineSpacing: 9,
    });
  });

  addFooter(slide, pptx, undefined, pageNumber);
}
