/**
 * lib/pack-slide-content.ts
 *
 * Shared, framework-agnostic bullet-entry + pagination logic used by BOTH
 * the in-app Pack Preview (components/builder/PackPreview.tsx) and the
 * PPTX export (lib/export/pptx/render-section-slide.ts), so the two
 * surfaces show identical bullet text and identical page breaks for the
 * same pack. Has no dependency on pptxgenjs or any Node-only API — safe to
 * import from client components.
 */

import type { PackItem, Credential, Expert, Partner, Publication } from "@/types/credentials";
import { getReferenceSlide } from "@/data/reference-slides";

export interface SectionBulletEntry {
  /** Bold lead-in of the bullet, e.g. the credential/expert/partner title. */
  title: string;
  /** Plain-weight continuation on the same bullet, e.g. a one-line summary. */
  body?: string;
  /** Builder note, rendered italic in a muted colour. */
  note?: string;
  /** Priority items get a red star + red title. */
  priority?: boolean;
  /** Source item id, for keying lists. */
  id: string;
}

interface BulletDatasets {
  credentials: Credential[];
  experts: Expert[];
  partners: Partner[];
  publications: Publication[];
}

/**
 * Resolves a pack item into its bullet entry (title + one-line body),
 * looking it up in the provided datasets. Returns undefined for chart
 * items (rendered as their own slide, not a bullet) or unresolvable ids.
 */
export function buildBulletEntry(
  item: PackItem,
  datasets: BulletDatasets
): SectionBulletEntry | undefined {
  if (item.itemType === "credential") {
    const cred = datasets.credentials.find((c) => c.id === item.id);
    if (!cred || cred.confidentiality === "restricted") return undefined;
    const result = cred.results[0];
    // `displayValue` is already the fully-formatted string (e.g. "80% by
    // 2030") — only append `unit` when falling back to the raw numeric
    // `value`, or the unit gets rendered twice (e.g. "80% by 2030%").
    const resultText = result
      ? ` (${result.displayValue ?? `${result.value}${result.unit ?? ""}`} ${result.label})`
      : "";
    return {
      id: item.id,
      title: cred.title,
      body: `${cred.clientAlias ? `${cred.clientAlias} — ` : ""}${cred.summary}${resultText}`,
      note: item.note,
      priority: item.priority,
    };
  }

  if (item.itemType === "expert") {
    const expert = datasets.experts.find((e) => e.id === item.id);
    if (!expert) return undefined;
    return {
      id: item.id,
      title: expert.name,
      body: [expert.title, expert.role].filter(Boolean).join(" · "),
      note: item.note,
      priority: item.priority,
    };
  }

  if (item.itemType === "partner") {
    const partner = datasets.partners.find((p) => p.id === item.id);
    if (!partner) return undefined;
    return {
      id: item.id,
      title: partner.name,
      body: `${partner.category} — ${partner.description}`,
      note: item.note,
      priority: item.priority,
    };
  }

  if (item.itemType === "publication") {
    const pub = datasets.publications.find((p) => p.id === item.id);
    if (!pub) return undefined;
    return {
      id: item.id,
      title: pub.title,
      body: `${pub.publicationType}${pub.year ? ` · ${pub.year}` : ""}${pub.abstract ? ` — ${pub.abstract}` : ""}`,
      note: item.note,
      priority: item.priority,
    };
  }

  return undefined;
}

/**
 * Looks up an item's `sourceSlides` in its dataset record, without regard
 * to whether any of them are registered reference slides.
 */
function getSourceSlides(item: PackItem, datasets: BulletDatasets): number[] {
  switch (item.itemType) {
    case "credential":
      return datasets.credentials.find((c) => c.id === item.id)?.sourceSlides ?? [];
    case "expert":
      return datasets.experts.find((e) => e.id === item.id)?.sourceSlides ?? [];
    case "partner":
      return datasets.partners.find((p) => p.id === item.id)?.sourceSlides ?? [];
    case "publication":
      return datasets.publications.find((p) => p.id === item.id)?.sourceSlides ?? [];
    default:
      return [];
  }
}

/**
 * Of an item's `sourceSlides`, returns only the numbers that are registered
 * in data/reference-slides.ts — i.e. slides we can actually render (either
 * on-screen or in the PPTX export) rather than merely cite.
 *
 * Experts are deliberately excluded here and always return `[]`: a
 * registered reference slide (e.g. "Leadership Team") reproduces the
 * *entire, fixed* roster from the original source deck, not just the
 * specific people a user actually added to the pack. Promoting an expert
 * to that exhibit would mean adding two people to a pack and exporting a
 * slide naming seventeen. When a user hasn't explicitly chosen to include
 * a specific reference slide (there is no such control today — this is
 * always the case), selected experts render instead as a compact table of
 * just the people picked, with their own credentials (see
 * `buildExpertTableRows`).
 */
export function resolveReferenceSlideNumbers(item: PackItem, datasets: BulletDatasets): number[] {
  if (item.itemType === "expert") return [];
  return getSourceSlides(item, datasets).filter((n) => getReferenceSlide(n) !== undefined);
}

// ─── Expert table ───────────────────────────────────────────────────────────
// Experts never get a shared/full-roster exhibit slide (see the note on
// `resolveReferenceSlideNumbers` above) — they always render as a table of
// exactly the experts the user selected, alongside their own credentials.

export interface ExpertTableRow {
  id: string;
  name: string;
  title: string;
  /** Related credential titles, joined into one display string (never a raw count-only placeholder). */
  credentials: string;
}

const MAX_CREDENTIALS_LISTED = 3;

/** Builds one table row for a single expert, resolving their credential titles (restricted ones excluded). */
export function buildExpertTableRow(expert: Expert, datasets: BulletDatasets): ExpertTableRow {
  const titleParts = [expert.title, expert.role].filter(Boolean);

  const credentialTitles = expert.credentialIds
    .map((id) => datasets.credentials.find((c) => c.id === id))
    .filter((c): c is Credential => c != null && c.confidentiality !== "restricted")
    .map((c) => c.title);

  let credentials: string;
  if (credentialTitles.length === 0) {
    credentials = "—";
  } else if (credentialTitles.length <= MAX_CREDENTIALS_LISTED) {
    credentials = credentialTitles.join("; ");
  } else {
    const shown = credentialTitles.slice(0, MAX_CREDENTIALS_LISTED).join("; ");
    credentials = `${shown}; +${credentialTitles.length - MAX_CREDENTIALS_LISTED} more`;
  }

  return {
    id: expert.id,
    name: expert.name,
    title: titleParts.join(" · "),
    credentials,
  };
}

/** Builds one table row per expert pack item, skipping any that no longer resolve to a record. */
export function buildExpertTableRows(items: PackItem[], datasets: BulletDatasets): ExpertTableRow[] {
  return items
    .filter((i) => i.itemType === "expert")
    .map((i) => datasets.experts.find((e) => e.id === i.id))
    .filter((e): e is Expert => Boolean(e))
    .map((e) => buildExpertTableRow(e, datasets));
}

/**
 * Slide header for the expert table, avoiding a redundant "Experts —
 * Experts" when the section itself is already named "Experts".
 */
export function expertTableHeader(sectionHeader: string): string {
  return sectionHeader.trim().toLowerCase() === "experts" ? sectionHeader : `${sectionHeader} — Experts`;
}

export interface ResolvedSectionContent {
  /** Items with no renderable reference slide — rendered as plain bullets. */
  bulletEntries: SectionBulletEntry[];
  /**
   * Distinct, sorted reference-slide numbers cited by this section's items.
   * Any item that cites one of these is excluded from `bulletEntries` —
   * the reference slide itself stands in for it, deduped across items that
   * cite the same slide (e.g. several experts who all appear on the same
   * leadership-team slide).
   */
  exhibitSlideNumbers: number[];
}

/**
 * Splits a section's items into plain bullets vs. actual reference-slide
 * exhibits. Shared by the in-app Pack Preview and the PPTX export so both
 * surfaces make the identical call about which items get a bullet vs. a
 * full reference-slide reproduction.
 */
export function resolveSectionContent(
  items: PackItem[],
  datasets: BulletDatasets
): ResolvedSectionContent {
  const bulletEntries: SectionBulletEntry[] = [];
  const exhibitSlideNumbers = new Set<number>();

  for (const item of items) {
    const matched = resolveReferenceSlideNumbers(item, datasets);
    if (matched.length > 0) {
      matched.forEach((n) => exhibitSlideNumbers.add(n));
      continue;
    }
    const entry = buildBulletEntry(item, datasets);
    if (entry) bulletEntries.push(entry);
  }

  return {
    bulletEntries,
    exhibitSlideNumbers: Array.from(exhibitSlideNumbers).sort((a, b) => a - b),
  };
}

// ─── Pagination ─────────────────────────────────────────────────────────────
// Rough text-fit heuristic — not a real layout engine, just enough to keep
// a large section from silently overflowing a single slide's body height.

const CHARS_PER_LINE = 100;

export function estimateEntryLines(entry: SectionBulletEntry): number {
  let lines = 1; // title
  if (entry.body) lines += Math.max(1, Math.ceil(entry.body.length / CHARS_PER_LINE));
  if (entry.note) lines += 1;
  return lines;
}

/** Greedily packs bullet entries into pages that fit within maxLinesPerSlide. */
export function paginateSectionEntries(
  entries: SectionBulletEntry[],
  maxLinesPerSlide: number
): SectionBulletEntry[][] {
  const pages: SectionBulletEntry[][] = [];
  let current: SectionBulletEntry[] = [];
  let currentLines = 0;

  for (const entry of entries) {
    const lines = estimateEntryLines(entry);
    if (current.length > 0 && currentLines + lines > maxLinesPerSlide) {
      pages.push(current);
      current = [];
      currentLines = 0;
    }
    current.push(entry);
    currentLines += lines;
  }
  if (current.length > 0) pages.push(current);
  return pages.length > 0 ? pages : [[]];
}
