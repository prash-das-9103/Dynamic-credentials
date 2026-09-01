/**
 * lib/export/pptx/create-presentation.ts
 *
 * Server-side orchestrator: takes a PackState + optional AnalyticsSnapshot
 * and produces an in-memory PptxGenJS presentation buffer.
 *
 * Rules:
 * - Never recalculates workbook values — uses the AnalyticsSnapshot verbatim.
 * - Never exposes internal IDs or file paths.
 * - Blocked by restricted items (validated before calling this function).
 * - Client identities come only from `clientAlias`, never `clientName`.
 */

import PptxGenJS from "pptxgenjs";
import type { PackItem, PackState } from "@/types/credentials";
import type { AnalyticsSnapshot, SourceRecord } from "@/lib/export/types";
import { CREDENTIALS } from "@/data/credentials";
import { EXPERTS } from "@/data/experts";
import { PARTNERS } from "@/data/partners";
import { PUBLICATIONS } from "@/data/publications";
import { DEFAULT_SECTION_FOR_TYPE } from "@/lib/pack-constants";
import {
  SOLUTION_ORDER,
  SOLUTION_CONFIGS,
  resolveRecordSolutionGroup,
  type SolutionId,
} from "@/data/solution-config";

import { renderCoverSlide } from "./render-cover-slide";
import { renderSectionSlides } from "./render-section-slide";
import { renderAnalyticsSlide } from "./render-analytics-slide";
import { renderReferenceSlide } from "./render-reference-slide";
import { renderExpertTableSlide } from "./render-expert-table-slide";
import { renderSourceRegisterSlide } from "./render-source-register";
import { validatePackForExport, validateExportGeometry } from "./validate-presentation";
import {
  buildBulletEntry,
  buildExpertTableRows,
  expertTableHeader,
  resolveReferenceSlideNumbers,
  type SectionBulletEntry,
} from "@/lib/pack-slide-content";

export interface CreatePresentationOptions {
  pack: PackState;
  analyticsSnapshot?: AnalyticsSnapshot;
}

// Canonical group order for per-solution export sections: the four solutions
// in their standard display order, followed by items that span more than one
// solution (or have none tagged, e.g. chart items).
const GROUP_ORDER: (SolutionId | "cross-solution")[] = [...SOLUTION_ORDER, "cross-solution"];

function groupLabel(group: SolutionId | "cross-solution"): string {
  return group === "cross-solution" ? "Cross-Solution" : SOLUTION_CONFIGS[group].name;
}

/** Resolve which solution group a pack item's underlying record belongs to. */
function resolveItemSolutionGroup(item: PackItem): SolutionId | "cross-solution" {
  if (item.itemType === "credential") {
    return resolveRecordSolutionGroup(CREDENTIALS.find((c) => c.id === item.id)?.solutionIds);
  }
  if (item.itemType === "expert") {
    return resolveRecordSolutionGroup(EXPERTS.find((e) => e.id === item.id)?.solutionIds);
  }
  if (item.itemType === "partner") {
    return resolveRecordSolutionGroup(PARTNERS.find((p) => p.id === item.id)?.solutionIds);
  }
  if (item.itemType === "publication") {
    return resolveRecordSolutionGroup(PUBLICATIONS.find((p) => p.id === item.id)?.solutionIds);
  }
  // Chart / analytics items are cross-solution by nature.
  return "cross-solution";
}

export interface CreatePresentationResult {
  buffer: Buffer;
  filename: string;
  warnings: string[];
}

export async function createPresentation(
  opts: CreatePresentationOptions
): Promise<CreatePresentationResult> {
  const { pack, analyticsSnapshot } = opts;

  // ── Pre-flight validation ──────────────────────────────────────────────────
  // Geometry first: if the shared layout constants don't match the real
  // PPTX canvas, every slide below would render wrong — fail loudly before
  // spending any time building content, rather than producing a malformed
  // deck that "succeeds".
  validateExportGeometry();

  const validation = validatePackForExport(pack);
  if (!validation.ok) {
    throw new Error(
      `Export blocked: ${validation.warnings.filter((w) => w.blocking).map((w) => w.message).join("; ")}`
    );
  }

  const warnings: string[] = validation.warnings
    .filter((w) => !w.blocking)
    .map((w) => w.message);

  // ── PptxGenJS setup ────────────────────────────────────────────────────────
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE"; // 16:9, 13.333 × 7.5 in — must match SLIDE_W/SLIDE_H in presentation-theme.ts
  pptx.author = "Bain & Company — Sustainability Practice";
  pptx.company = "Bain & Company";
  pptx.title = pack.metadata.packTitle || "Sustainability Credentials Pack";
  pptx.subject = pack.metadata.clientAlias
    ? `Prepared for ${pack.metadata.clientAlias}`
    : "Credential Pack";

  // ── Cover slide ────────────────────────────────────────────────────────────
  renderCoverSlide(pptx, {
    title: pack.metadata.packTitle || "Sustainability Credentials Pack",
    subtitle: pack.metadata.clientSituation || undefined,
    clientAlias: pack.metadata.clientAlias || undefined, // never clientName
    preparedBy: pack.metadata.preparedBy || undefined,
    date: pack.metadata.date || new Date().toISOString().slice(0, 10),
    confidentiality: "Internal — not for external distribution",
  });

  // ── Source register accumulator ────────────────────────────────────────────
  const sourceRecords: SourceRecord[] = [];

  // ── Running page-number counter — cover slide is page 1 ───────────────────
  let pageCounter = 1;
  const nextPageNumber = () => ++pageCounter;

  // ── Exportable items (skip restricted) ────────────────────────────────────
  const exportableItems = pack.items.filter((i) => !i.exportRestricted);

  const datasets = { credentials: CREDENTIALS, experts: EXPERTS, partners: PARTNERS, publications: PUBLICATIONS };

  const pushSourceRecord = (item: PackItem) => {
    if (item.itemType === "credential") {
      const cred = CREDENTIALS.find((c) => c.id === item.id)!;
      sourceRecords.push({ type: "credential", id: cred.id, label: cred.title, sourceSlides: cred.sourceSlides });
    } else if (item.itemType === "expert") {
      const expert = EXPERTS.find((e) => e.id === item.id)!;
      sourceRecords.push({ type: "expert", id: expert.id, label: expert.name, sourceSlides: expert.sourceSlides });
    } else if (item.itemType === "partner") {
      const partner = PARTNERS.find((p) => p.id === item.id)!;
      sourceRecords.push({ type: "partner", id: partner.id, label: partner.name, sourceSlides: partner.sourceSlides });
    } else if (item.itemType === "publication") {
      const pub = PUBLICATIONS.find((p) => p.id === item.id)!;
      sourceRecords.push({ type: "publication", id: pub.id, label: pub.title, sourceSlides: pub.sourceSlides });
    }
  };

  // Group by section in section order
  const sectionOrder = pack.sections.map((s) => s.id);

  for (const sectionId of sectionOrder) {
    const section = pack.sections.find((s) => s.id === sectionId);
    if (!section) continue;

    const sectionItems = exportableItems.filter(
      (i) => (i.section ?? DEFAULT_SECTION_FOR_TYPE[i.itemType]) === sectionId
    );
    if (sectionItems.length === 0) continue;

    // Experts are pulled out ahead of the per-solution-group split below:
    // when a user selects experts without choosing a destination slide, the
    // ask is one table naming every expert selected into this section —
    // never split further by solution area, and never a shared full-roster
    // reference-slide exhibit (see the note on resolveReferenceSlideNumbers
    // in lib/pack-slide-content.ts).
    const sectionExpertItems = sectionItems.filter((i) => i.itemType === "expert");
    const nonExpertItems = sectionItems.filter((i) => i.itemType !== "expert");

    // Sub-group the section's non-expert items by their resolved solution,
    // in canonical order, so a pack spanning multiple solutions gets one
    // labeled slide per solution instead of a single mixed section.
    // Sections whose items all resolve to the same group (the common case
    // — e.g. an all-Circular pack) render exactly as before: one slide, the
    // plain section label as its header.
    const groupsPresent = GROUP_ORDER.filter((g) =>
      nonExpertItems.some((i) => resolveItemSolutionGroup(i) === g)
    );

    for (const group of groupsPresent) {
      const groupItems = nonExpertItems.filter((i) => resolveItemSolutionGroup(i) === group);

      const header =
        groupsPresent.length > 1 ? `${section.label} — ${groupLabel(group)}` : section.label;

      // Chart items render as their own dedicated slide (they're the
      // template's "<Images>/<Framework>" content, not a text bullet), so
      // they're rendered separately from the section's bulleted text items.
      const textItems = groupItems.filter((i) => i.itemType !== "chart");
      const chartItems = groupItems.filter((i) => i.itemType === "chart");

      const entries: SectionBulletEntry[] = [];
      // Items whose sourceSlides cite a registered reference slide skip the
      // bullet — the actual reference slide is rendered in its place,
      // deduped across every item in this group that cites the same slide.
      const exhibitSlideNumbers = new Set<number>();

      for (const item of textItems) {
        const matched = resolveReferenceSlideNumbers(item, datasets);
        if (matched.length > 0) {
          matched.forEach((n) => exhibitSlideNumbers.add(n));
          pushSourceRecord(item);
          continue;
        }

        const entry = buildBulletEntry(item, datasets);
        if (!entry) {
          if (item.itemType === "credential") {
            const cred = CREDENTIALS.find((c) => c.id === item.id);
            warnings.push(
              cred?.confidentiality === "restricted"
                ? `Credential "${cred.title}" restricted; skipped.`
                : `Credential ${item.id} not found; skipped.`
            );
          } else {
            warnings.push(`${item.itemType} ${item.id} not found; skipped.`);
          }
          continue;
        }
        entries.push(entry);
        pushSourceRecord(item);
      }

      if (entries.length > 0) {
        renderSectionSlides(pptx, {
          header,
          entries,
          nextPageNumber,
        });
      }

      for (const slideNumber of Array.from(exhibitSlideNumbers).sort((a, b) => a - b)) {
        renderReferenceSlide(pptx, slideNumber, nextPageNumber());
      }

      for (const item of chartItems) {
        // Chart items require an analytics snapshot passed from the client
        if (!analyticsSnapshot) {
          warnings.push("Analytics snapshot not provided; chart slide skipped.");
          continue;
        }
        renderAnalyticsSlide(pptx, analyticsSnapshot, nextPageNumber());
        sourceRecords.push({
          type: "chart",
          id: item.id,
          label: item.title,
          workbookRef: {
            filename: "SustainabilityCases.xlsx",
            sheet: "2021-25 Case Remapping",
            importedAt: analyticsSnapshot.workbookImportDate,
            period: analyticsSnapshot.period,
            fields: {
              region: "Column A",
              solution: "Column Q",
              time: "Column D (Case End Date)",
              uniqueId: "Case Code",
            },
          },
        });
      }
    }

    // One table for every expert selected into this section — regardless of
    // solution area — naming exactly who was added, with their own related
    // credentials. Rendered after this section's other slides.
    if (sectionExpertItems.length > 0) {
      renderExpertTableSlide(pptx, {
        header: expertTableHeader(section.label),
        rows: buildExpertTableRows(sectionExpertItems, datasets),
        pageNumber: nextPageNumber(),
      });
      sectionExpertItems.forEach(pushSourceRecord);
    }
  }

  // ── Source register appendix ───────────────────────────────────────────────
  if (sourceRecords.length > 0) {
    renderSourceRegisterSlide(
      pptx,
      sourceRecords,
      analyticsSnapshot?.workbookImportDate,
      nextPageNumber()
    );
  }

  // ── Serialise ──────────────────────────────────────────────────────────────
  // PptxGenJS writeFile returns different shapes depending on outputType.
  const arrayBuffer = await pptx.write({ outputType: "arraybuffer" }) as ArrayBuffer;
  const buffer = Buffer.from(arrayBuffer);

  // Build safe filename
  const title = (pack.metadata.packTitle || "credentials-pack")
    .replace(/[^a-zA-Z0-9_\- ]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .toLowerCase();

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const filename = `${title}_${dateStr}.pptx`;

  return { buffer, filename, warnings };
}
