/**
 * data/solution-config.ts
 *
 * Central registry for the four practice solutions (Transition Strategy,
 * Sustainability Value Creation, Circular Value Creation, Resilience &
 * Adaptation). This is the ONE place other data/components should read
 * solution metadata and solution-scoped data from, rather than
 * re-implementing filtering logic per page.
 *
 * Sustainability is the umbrella practice — these four are its solutions.
 * There is intentionally no fifth "Sustainability" solution entry.
 */

import { PRODUCTS, CLIENT_NEEDS } from "@/data/solutions";
import type { Product, ClientNeed } from "@/data/solutions";
import { CREDENTIALS } from "@/data/credentials";
import { EXPERTS } from "@/data/experts";
import { PARTNERS } from "@/data/partners";
import { PUBLICATIONS } from "@/data/publications";
import type { Credential, Expert, Partner, Publication } from "@/types/credentials";

export type SolutionId =
  | "transition-strategy"
  | "sustainability-value-creation"
  | "circular-value-creation"
  | "resilience-adaptation";

export interface SolutionConfig {
  id: SolutionId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  accentColor: string;
}

// Copy reused from data/overview.ts OVERVIEW_SOLUTIONS — do not duplicate/drift.
export const SOLUTION_CONFIGS: Record<SolutionId, SolutionConfig> = {
  "transition-strategy": {
    id: "transition-strategy",
    name: "Transition Strategy",
    shortName: "Transition Strategy",
    tagline: "Future-proofing strategy for global transitions",
    description:
      "Embed sustainability into long-term strategy, build a sustainable business, and define a credible path toward net-zero and competitive differentiation.",
    accentColor: "#1a1a1a",
  },
  "sustainability-value-creation": {
    id: "sustainability-value-creation",
    name: "Sustainability Value Creation",
    shortName: "SVC",
    tagline: "Capture value from sustainability commitments",
    description:
      "Unlock commercial value from sustainability — from decarbonising the supply chain to embedding sustainability into B2B commercial excellence.",
    accentColor: "#0F6B4A",
  },
  "circular-value-creation": {
    id: "circular-value-creation",
    name: "Circular Value Creation",
    shortName: "Circular Value Creation",
    tagline: "Unlock economic value from circularity",
    description:
      "Diagnose circular opportunities, design and deliver circular offers, services and resource strategies, and scale proven initiatives across the business.",
    accentColor: "#CC0000",
  },
  "resilience-adaptation": {
    id: "resilience-adaptation",
    name: "Resilience & Adaptation",
    shortName: "R&A",
    tagline: "Make resilience a design principle",
    description:
      "Build business resilience against climate risk — protect asset values, secure the supply chain, and invest in climate adaptation technologies.",
    accentColor: "#1D4E89",
  },
};

// Canonical display order used across filters, exports, and navigation.
export const SOLUTION_ORDER: SolutionId[] = [
  "transition-strategy",
  "sustainability-value-creation",
  "circular-value-creation",
  "resilience-adaptation",
];

export const SOLUTION_FILTER_OPTIONS: { id: SolutionId; label: string }[] = SOLUTION_ORDER.map(
  (id) => ({ id, label: SOLUTION_CONFIGS[id].name })
);

export function isSolutionId(value: string): value is SolutionId {
  return (SOLUTION_ORDER as string[]).includes(value);
}

export function getSolutionConfig(id: string): SolutionConfig | undefined {
  return isSolutionId(id) ? SOLUTION_CONFIGS[id] : undefined;
}

export function getSolutionLabel(id: string): string {
  return getSolutionConfig(id)?.name ?? id;
}

// ─── Solution-scoped data helpers ──────────────────────────────────────────
// Empty `solutionIds` array = no solutions selected = no narrowing.

export function getProductsForSolutions(solutionIds: string[]): Product[] {
  if (solutionIds.length === 0) return PRODUCTS;
  return PRODUCTS.filter((p) => p.solutionIds?.some((s) => solutionIds.includes(s)));
}

export function getClientNeedsForSolutions(solutionIds: string[]): ClientNeed[] {
  if (solutionIds.length === 0) return CLIENT_NEEDS;
  return CLIENT_NEEDS.filter((n) => n.solutionIds?.some((s) => solutionIds.includes(s)));
}

export function getCredentialsForSolutions(solutionIds: string[]): Credential[] {
  if (solutionIds.length === 0) return CREDENTIALS;
  return CREDENTIALS.filter((c) => c.solutionIds?.some((s) => solutionIds.includes(s)));
}

export function getExpertsForSolutions(solutionIds: string[]): Expert[] {
  if (solutionIds.length === 0) return EXPERTS;
  return EXPERTS.filter((e) => e.solutionIds?.some((s) => solutionIds.includes(s)));
}

export function getPartnersForSolutions(solutionIds: string[]): Partner[] {
  if (solutionIds.length === 0) return PARTNERS;
  return PARTNERS.filter((p) => p.solutionIds?.some((s) => solutionIds.includes(s)));
}

export function getPublicationsForSolutions(solutionIds: string[]): Publication[] {
  if (solutionIds.length === 0) return PUBLICATIONS;
  return PUBLICATIONS.filter((p) => p.solutionIds?.some((s) => solutionIds.includes(s)));
}

/**
 * Resolve the "owning" solution for a pack item's underlying record, for
 * grouping in exports. Returns "cross-solution" when the record spans more
 * than one solution or has none tagged.
 */
export function resolveRecordSolutionGroup(solutionIds: string[] | undefined): SolutionId | "cross-solution" {
  if (!solutionIds || solutionIds.length !== 1) return "cross-solution";
  return isSolutionId(solutionIds[0]) ? (solutionIds[0] as SolutionId) : "cross-solution";
}
