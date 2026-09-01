"use client";

import { Printer, ArrowLeft } from "lucide-react";
import type { PackItem, PackState } from "@/types/credentials";
import { CREDENTIALS } from "@/data/credentials";
import { EXPERTS } from "@/data/experts";
import { PARTNERS } from "@/data/partners";
import { PUBLICATIONS } from "@/data/publications";
import { getItemsBySection } from "@/lib/pack-summary";
import {
  SOLUTION_ORDER,
  SOLUTION_CONFIGS,
  resolveRecordSolutionGroup,
  type SolutionId,
} from "@/data/solution-config";
import {
  buildBulletEntry,
  buildExpertTableRows,
  expertTableHeader,
  paginateSectionEntries,
  resolveReferenceSlideNumbers,
  type ExpertTableRow,
  type SectionBulletEntry,
} from "@/lib/pack-slide-content";
import { SECTION_SLIDE, TEXT } from "@/lib/export/pptx/presentation-theme";
import {
  SlideFrame,
  DEFAULT_CONFIDENTIALITY_NOTICE,
  ARIAL,
  ptToCqw,
  hex,
} from "@/components/builder/SlideFrame";
import { CoverSlide } from "@/components/builder/CoverSlide";
import { ReferenceSlideExhibit } from "@/components/builder/ReferenceSlideExhibit";

// ─── Shared grouping, mirrors lib/export/pptx/create-presentation.ts ─────────

const GROUP_ORDER: (SolutionId | "cross-solution")[] = [...SOLUTION_ORDER, "cross-solution"];

function groupLabel(group: SolutionId | "cross-solution"): string {
  return group === "cross-solution" ? "Cross-Solution" : SOLUTION_CONFIGS[group].name;
}

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
  return "cross-solution";
}

// Same pagination budget as render-section-slide.ts, so the preview's page
// breaks match the exported deck's.
const LINE_H_IN = (TEXT.BULLET_SIZE + 4) / 72;
const MAX_LINES_PER_SLIDE = Math.max(4, Math.floor(SECTION_SLIDE.BODY_H / LINE_H_IN));

interface SourceRow {
  type: string;
  label: string;
  sourceSlides?: number[];
}

// ─── Bullet list, mirrors buildBulletRuns() in render-section-slide.ts ────────

function BulletList({ entries }: { entries: SectionBulletEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="italic" style={{ color: "#999999", fontSize: "1cqw" }}>
        No items in this section.
      </p>
    );
  }
  return (
    <ul className="flex flex-col" style={{ gap: "0.6cqw" }}>
      {entries.map((entry) => (
        <li key={entry.id} className="flex items-start" style={{ gap: "0.5cqw" }}>
          <span
            className="mt-[0.35em] shrink-0 rounded-full"
            style={{ width: "0.45cqw", height: "0.45cqw", backgroundColor: hex("CC0000") }}
          />
          <p className="leading-snug">
            <span className="font-bold" style={{ color: entry.priority ? hex("CC0000") : hex("111111") }}>
              {entry.priority && "★ "}
              {entry.title}
            </span>
            {entry.body && (
              <span style={{ color: hex("222222") }}>
                {"  —  "}
                {entry.body}
              </span>
            )}
            {entry.note && (
              <span className="italic" style={{ color: "#888888" }}>
                {"  (Note: "}
                {entry.note}
                {")"}
              </span>
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}

// ─── Expert table ─────────────────────────────────────────────────────────────
// Experts never get a shared/full-roster reference-slide exhibit — see the
// note on resolveReferenceSlideNumbers in lib/pack-slide-content.ts. Instead
// they always render as this compact table of exactly who was selected.

function ExpertTable({ rows }: { rows: ExpertTableRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="italic" style={{ color: "#999999", fontSize: "1cqw" }}>
        No experts in this section.
      </p>
    );
  }
  return (
    <table className="w-full border-collapse" style={{ fontSize: `${ptToCqw(9)}cqw` }}>
      <thead>
        <tr style={{ backgroundColor: hex("222222") }}>
          {["Expert", "Title", "Related credentials"].map((h) => (
            <th
              key={h}
              className="px-2 py-1.5 text-left font-bold"
              style={{ color: hex("FFFFFF"), fontSize: `${ptToCqw(9)}cqw` }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.id} style={{ backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#F7F7F7" }}>
            <td className="px-2 py-1.5 font-bold" style={{ color: hex("111111") }}>{row.name}</td>
            <td className="px-2 py-1.5" style={{ color: hex(TEXT.BODY_COLOR) }}>{row.title || "—"}</td>
            <td className="px-2 py-1.5" style={{ color: hex(TEXT.BODY_COLOR) }}>{row.credentials}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Source register table, mirrors render-source-register.ts ────────────────

function SourceRegisterTable({ rows }: { rows: SourceRow[] }) {
  return (
    <table className="w-full border-collapse" style={{ fontSize: `${ptToCqw(7.5)}cqw` }}>
      <thead>
        <tr style={{ backgroundColor: hex("222222") }}>
          {["Type", "Record", "Source slides"].map((h) => (
            <th
              key={h}
              className="px-2 py-1 text-left font-bold"
              style={{ color: hex("FFFFFF"), fontSize: `${ptToCqw(8)}cqw` }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={`${row.type}-${row.label}-${i}`} style={{ backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#F7F7F7" }}>
            <td className="px-2 py-1" style={{ color: hex(TEXT.BODY_COLOR) }}>{row.type}</td>
            <td className="px-2 py-1" style={{ color: hex(TEXT.BODY_COLOR) }}>{row.label}</td>
            <td className="px-2 py-1" style={{ color: hex(TEXT.BODY_COLOR) }}>{row.sourceSlides?.join(", ") ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface PackPreviewProps {
  pack: PackState;
  onExitPreview: () => void;
}

export function PackPreview({ pack, onExitPreview }: PackPreviewProps) {
  const meta = pack.metadata;

  // ── Build the same slide sequence create-presentation.ts would render ─────
  const datasets = { credentials: CREDENTIALS, experts: EXPERTS, partners: PARTNERS, publications: PUBLICATIONS };
  const sourceRows: SourceRow[] = [];
  let pageCounter = 1; // cover slide is page 1
  const nextPageNumber = () => ++pageCounter;

  type Slide =
    | { kind: "section"; header: string; entries: SectionBulletEntry[]; pageNumber: number }
    | { kind: "expertTable"; header: string; rows: ExpertTableRow[]; pageNumber: number }
    | { kind: "chart"; header: string; title: string; pageNumber: number }
    | { kind: "exhibit"; slideNumber: number; pageNumber: number };

  const slides: Slide[] = [];

  const pushSourceRow = (item: PackItem) => {
    if (item.itemType === "credential") {
      const cred = CREDENTIALS.find((c) => c.id === item.id)!;
      sourceRows.push({ type: "Credential", label: cred.title, sourceSlides: cred.sourceSlides });
    } else if (item.itemType === "expert") {
      const expert = EXPERTS.find((e) => e.id === item.id)!;
      sourceRows.push({ type: "Expert", label: expert.name, sourceSlides: expert.sourceSlides });
    } else if (item.itemType === "partner") {
      const partner = PARTNERS.find((p) => p.id === item.id)!;
      sourceRows.push({ type: "Partner", label: partner.name, sourceSlides: partner.sourceSlides });
    } else if (item.itemType === "publication") {
      const pub = PUBLICATIONS.find((p) => p.id === item.id)!;
      sourceRows.push({ type: "Publication", label: pub.title, sourceSlides: pub.sourceSlides });
    }
  };

  for (const section of pack.sections) {
    const sectionItems = getItemsBySection(pack.items, section.id);
    if (sectionItems.length === 0) continue;

    // Experts are pulled out ahead of the per-solution-group split below:
    // when a user selects experts without choosing a destination slide, the
    // ask is one table naming every expert selected into this section —
    // never split further by solution area, and never a shared full-roster
    // reference-slide exhibit (see the note on resolveReferenceSlideNumbers
    // in lib/pack-slide-content.ts).
    const sectionExpertItems = sectionItems.filter((i) => i.itemType === "expert");
    const nonExpertItems = sectionItems.filter((i) => i.itemType !== "expert");

    const groupsPresent = GROUP_ORDER.filter((g) =>
      nonExpertItems.some((i) => resolveItemSolutionGroup(i) === g)
    );

    for (const group of groupsPresent) {
      const groupItems = nonExpertItems.filter((i) => resolveItemSolutionGroup(i) === group);
      const header = groupsPresent.length > 1 ? `${section.label} — ${groupLabel(group)}` : section.label;

      const textItems = groupItems.filter((i) => i.itemType !== "chart");
      const chartItems = groupItems.filter((i) => i.itemType === "chart");

      const entries: SectionBulletEntry[] = [];
      // Items whose sourceSlides cite an actual reference slide (data/reference-slides.ts)
      // skip the bullet — the reference slide itself stands in for them, deduped
      // across every item in this group that cites the same slide number.
      const exhibitSlideNumbers = new Set<number>();

      for (const item of textItems) {
        if (item.itemType === "credential") {
          const cred = CREDENTIALS.find((c) => c.id === item.id);
          if (cred?.confidentiality === "restricted") {
            entries.push({
              id: item.id,
              title: cred.title,
              body: "RESTRICTED — excluded from export",
              note: item.note,
            });
            continue;
          }
        }

        const matched = resolveReferenceSlideNumbers(item, datasets);
        if (matched.length > 0) {
          matched.forEach((n) => exhibitSlideNumbers.add(n));
          pushSourceRow(item);
          continue;
        }

        const entry = buildBulletEntry(item, datasets);
        if (!entry) continue;
        entries.push(entry);
        pushSourceRow(item);
      }

      const pages = paginateSectionEntries(entries, MAX_LINES_PER_SLIDE);
      pages.forEach((pageEntries, pageIdx) => {
        slides.push({
          kind: "section",
          header: pageIdx === 0 ? header : `${header} (cont'd)`,
          entries: pageEntries,
          pageNumber: nextPageNumber(),
        });
      });

      for (const slideNumber of Array.from(exhibitSlideNumbers).sort((a, b) => a - b)) {
        slides.push({ kind: "exhibit", slideNumber, pageNumber: nextPageNumber() });
      }

      for (const item of chartItems) {
        slides.push({ kind: "chart", header: `${header} — Chart`, title: item.title, pageNumber: nextPageNumber() });
        sourceRows.push({ type: "Chart / Analytics", label: item.title });
      }
    }

    // One table for every expert selected into this section — regardless of
    // solution area — naming exactly who was added, with their own related
    // credentials. Rendered after this section's other slides.
    if (sectionExpertItems.length > 0) {
      slides.push({
        kind: "expertTable",
        header: expertTableHeader(section.label),
        rows: buildExpertTableRows(sectionExpertItems, datasets),
        pageNumber: nextPageNumber(),
      });
      sectionExpertItems.forEach(pushSourceRow);
    }
  }

  const sourceRegisterPage = sourceRows.length > 0 ? nextPageNumber() : undefined;

  return (
    <div className="flex flex-col h-full">
      {/* Preview toolbar — hidden when printing */}
      <div className="print:hidden flex items-center justify-between border-b border-border bg-background px-6 py-3 shrink-0">
        <button
          onClick={onExitPreview}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to edit
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>
      </div>

      {/* Deck */}
      <div className="print-preview flex-1 overflow-y-auto bg-muted/20 p-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          {/* Cover slide */}
          <div className="slide-page overflow-hidden rounded-lg border border-border shadow-sm print:rounded-none print:border-none print:shadow-none">
            <CoverSlide
              title={meta.packTitle || "Sustainability Credentials Pack"}
              subtitle={meta.clientSituation || undefined}
              clientAlias={meta.clientAlias || meta.clientName || undefined}
              preparedBy={meta.preparedBy || undefined}
              date={meta.date || undefined}
              confidentiality="Internal — not for external distribution"
            />
          </div>

          {/* Content slides */}
          {slides.map((slide, i) => (
            <div
              key={i}
              className="slide-page overflow-hidden rounded-lg border border-border shadow-sm print:rounded-none print:border-none print:shadow-none"
            >
              {slide.kind === "section" ? (
                <SlideFrame header={slide.header} pageNumber={slide.pageNumber}>
                  <BulletList entries={slide.entries} />
                </SlideFrame>
              ) : slide.kind === "expertTable" ? (
                <SlideFrame header={slide.header} pageNumber={slide.pageNumber}>
                  <ExpertTable rows={slide.rows} />
                </SlideFrame>
              ) : slide.kind === "exhibit" ? (
                // The reference slide already carries its own header/red rule/footer —
                // render it directly rather than nesting it inside another SlideFrame.
                <ReferenceSlideExhibit slideNumber={slide.slideNumber} />
              ) : (
                <SlideFrame header={slide.header} pageNumber={slide.pageNumber}>
                  <p className="italic" style={{ color: "#888888", fontSize: "1cqw" }}>
                    &ldquo;{slide.title}&rdquo; renders as a live chart at export time, from the
                    connected analytics snapshot.
                  </p>
                </SlideFrame>
              )}
            </div>
          ))}

          {/* Source register appendix */}
          {sourceRegisterPage !== undefined && (
            <div className="slide-page overflow-hidden rounded-lg border border-border shadow-sm print:rounded-none print:border-none print:shadow-none">
              <SlideFrame
                header="Source Register"
                subtitle="All records and their provenance"
                pageNumber={sourceRegisterPage}
                footerText={DEFAULT_CONFIDENTIALITY_NOTICE}
              >
                <SourceRegisterTable rows={sourceRows} />
              </SlideFrame>
            </div>
          )}

          {pack.items.length === 0 && (
            <p className="py-12 text-center text-sm" style={{ color: "#999999", fontFamily: ARIAL }}>
              Add items to the pack to see the slide deck preview.
            </p>
          )}
        </div>
      </div>

      {/* Print styles: one slide per printed page */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-preview, .print-preview * { visibility: visible; }
          .print-preview { position: absolute; left: 0; top: 0; width: 100%; }
          .slide-page { page-break-after: always; }
        }
      `}</style>
    </div>
  );
}
