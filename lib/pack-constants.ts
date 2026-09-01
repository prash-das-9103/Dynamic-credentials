/**
 * lib/pack-constants.ts
 *
 * Plain, framework-agnostic constants shared by BOTH client code (the
 * in-browser pack builder, `lib/pack-store.ts`) and genuine server-only
 * code (the PPTX/PDF export routes, `lib/export/pptx/create-presentation.ts`,
 * `app/api/export/pdf/route.ts`).
 *
 * This file MUST NOT have a "use client" directive.
 *
 * Why this file exists: `DEFAULT_SECTION_FOR_TYPE` used to be defined and
 * exported directly from `lib/pack-store.ts`, which is `"use client"`. When
 * a genuine server-only module (a Node.js API route) imports a binding from
 * a `"use client"` file, Next.js substitutes a client-reference proxy for
 * every export of that module in the server bundle — not just the React
 * component(s) the directive is meant to flag. Indexing into that proxy
 * (`DEFAULT_SECTION_FOR_TYPE[item.itemType]`) silently returned `undefined`
 * instead of throwing, so every pack item's fallback section resolved to
 * `undefined`, which never equals a real section id — every section
 * appeared to have zero items, and BOTH the PPTX and PDF exports silently
 * produced a near-empty deck (cover slide + nothing else) with no error.
 *
 * The fix is structural: any constant that a server-only export path needs
 * must live in a plain module with no "use client" directive, never in the
 * "use client" pack-store module itself — re-exporting from pack-store would
 * reintroduce the exact same proxy substitution for server consumers.
 */

import type { PackItem, PackSection } from "@/types/credentials";

export const DEFAULT_SECTION_FOR_TYPE: Record<PackItem["itemType"], string> = {
  credential: "relevant-credentials",
  expert: "experts",
  partner: "ecosystem",
  publication: "thought-leadership",
  chart: "analytics",
};

export const DEFAULT_SECTIONS: PackSection[] = [
  { id: "executive-summary", label: "Executive Summary" },
  { id: "relevant-credentials", label: "Relevant Credentials" },
  { id: "experts", label: "Experts" },
  { id: "ecosystem", label: "Ecosystem" },
  { id: "thought-leadership", label: "Thought Leadership" },
  { id: "analytics", label: "Analytics" },
];
