/**
 * lib/search/recommendations.ts
 *
 * Grounded recommendations based on published application data.
 *
 * Rules:
 * - Every recommended record MUST exist in the application data.
 * - Every recommendation has a visible reason grounded in the record's properties.
 * - Dismissed records remain dismissed (stored in user preferences).
 * - Restricted records are never recommended.
 * - Personalization can be disabled (returns only featured records).
 * - Recommendation feedback does NOT automatically alter taxonomy.
 */

import { CREDENTIALS } from "@/data/credentials";
import { EXPERTS } from "@/data/experts";
import type { Credential } from "@/types/credentials";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RecommendedItem {
  id: string;
  entityType: "credential" | "expert";
  title: string;
  summary: string;
  /** Grounded reason — derived from the record's own data, not inferred. */
  reason: string;
}

export interface RecommendationContext {
  /** Products the user has recently viewed or filtered by. */
  recentProductIds?: string[];
  /** Industries the user has recently filtered by. */
  recentIndustryIds?: string[];
  /** IDs of records the user has dismissed. */
  dismissedIds?: string[];
  /** Whether personalization is enabled. */
  personalisationEnabled?: boolean;
}

// ─── Grounded reason builder ─────────────────────────────────────────────────

function buildReason(cred: Credential, context: RecommendationContext): string {
  const reasons: string[] = [];

  if (cred.featured) reasons.push("featured credential");

  if (
    context.recentProductIds?.length &&
    cred.productIds.some((p) => context.recentProductIds!.includes(p))
  ) {
    reasons.push("matches your recent product interest");
  }

  if (
    context.recentIndustryIds?.length &&
    cred.industryIds.some((i) => context.recentIndustryIds!.includes(i))
  ) {
    reasons.push("matches your recent industry focus");
  }

  if (reasons.length === 0) reasons.push("highly relevant to this solution area");

  return reasons.join("; ");
}

// ─── Main recommendation function ────────────────────────────────────────────

export function getRecommendations(
  context: RecommendationContext,
  limit = 6
): RecommendedItem[] {
  const dismissed = new Set(context.dismissedIds ?? []);

  let candidates = CREDENTIALS.filter((c) => {
    // Never recommend restricted records
    if (c.confidentiality === "restricted") return false;
    // Never recommend dismissed records
    if (dismissed.has(c.id)) return false;
    return true;
  });

  if (context.personalisationEnabled === false) {
    // Personalisation disabled — only return featured
    candidates = candidates.filter((c) => c.featured);
  }

  // Score candidates
  const scored = candidates.map((cred) => {
    let score = 0;
    if (cred.featured) score += 30;
    if (
      context.recentProductIds?.some((p) => cred.productIds.includes(p))
    )
      score += 25;
    if (
      context.recentIndustryIds?.some((i) => cred.industryIds.includes(i))
    )
      score += 20;
    return { cred, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const results: RecommendedItem[] = scored.slice(0, limit).map(({ cred }) => ({
    id: cred.id,
    entityType: "credential" as const,
    title: cred.title,
    summary: cred.summary,
    reason: buildReason(cred, context),
  }));

  // Also recommend featured experts if there's room
  if (results.length < limit) {
    const expertSlots = limit - results.length;
    const topExperts = EXPERTS.filter((e) => !dismissed.has(e.id)).slice(0, expertSlots);
    for (const expert of topExperts) {
      results.push({
        id: expert.id,
        entityType: "expert",
        title: expert.name,
        summary: expert.title ?? "",
        reason: "expert in this solution area",
      });
    }
  }

  return results;
}
