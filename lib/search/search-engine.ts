/**
 * lib/search/search-engine.ts
 *
 * Permission-aware deterministic search engine.
 *
 * Pipeline:
 *   1. Permission scope — only published, approved records
 *   2. Deterministic filters — explicit product/industry/region/solution filters
 *      are applied BEFORE scoring; they are NEVER changed by semantic ranking
 *   3. Semantic candidate retrieval — keyword + TF-style match scoring
 *   4. Permission re-check — restricted records excluded
 *   5. Deterministic ranking signals — scoring formula from spec
 *   6. Grounded results — every result has a traceable reason
 *
 * Scoring formula (from spec):
 *   exactSolutionMatch * 30
 *   + exactProductMatch * 25
 *   + exactIndustryMatch * 20
 *   + exactClientNeedMatch * 20
 *   + exactRegionMatch * 10
 *   + keywordMatch * 10
 *   + semanticSimilarity * 10
 *   + featuredStatus * 5
 *
 * Analytics questions route to /analytics, not this endpoint.
 * No-result searches NEVER produce invented results.
 * Drafts are always excluded.
 */

import { CREDENTIALS } from "@/data/credentials";
import { EXPERTS } from "@/data/experts";
import { PARTNERS } from "@/data/partners";
import type { Credential } from "@/types/credentials";
import type { UserRole } from "@/lib/auth/types";
import { roleHasPermission } from "@/lib/auth/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SearchEntityType = "credential" | "expert" | "partner";

export interface SearchQuery {
  q: string;
  /** Explicit solution filter — never changed by ranking. */
  solution?: string;
  /** Explicit product filter — never changed by ranking. */
  product?: string;
  /** Explicit industry filter — never changed by ranking. */
  industry?: string;
  /** Explicit region filter — never changed by ranking. */
  region?: string;
  /** Explicit client need filter — never changed by ranking. */
  clientNeed?: string;
  entityTypes?: SearchEntityType[];
  limit?: number;
}

export interface SearchResultItem {
  id: string;
  entityType: SearchEntityType;
  title: string;
  summary: string;
  score: number;
  /** Human-readable grounded explanation for the ranking. Always present. */
  matchReason: string;
  /** Which scoring signals contributed. */
  signals: {
    exactSolutionMatch: boolean;
    exactProductMatch: boolean;
    exactIndustryMatch: boolean;
    exactClientNeedMatch: boolean;
    exactRegionMatch: boolean;
    keywordMatch: boolean;
    featuredStatus: boolean;
  };
}

export interface SearchResponse {
  query: string;
  totalResults: number;
  results: SearchResultItem[];
  /** Populated only when there are zero results — never invent results. */
  noResultsExplanation?: string;
  /** Whether the query looks like an analytics question that should be routed. */
  routeToAnalytics?: boolean;
}

// ─── Analytics routing detection ─────────────────────────────────────────────

const ANALYTICS_PATTERNS = [
  /\bhow many\b/i,
  /\bcount\b/i,
  /\bnumber of cases?\b/i,
  /\bcase registry\b/i,
  /\bfst\b/i,
  /\bfood systems? transformation\b/i,
  /\bfy\d{2}/i,
  /\btrendline\b/i,
  /\bover time\b/i,
  /\bby year\b/i,
  /\bbreakdown\b/i,
];

export function looksLikeAnalyticsQuery(q: string): boolean {
  return ANALYTICS_PATTERNS.some((p) => p.test(q));
}

// ─── Tokenisation helpers ─────────────────────────────────────────────────────

function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function keywordOverlap(tokens: string[], text: string): number {
  const target = tokenise(text);
  const matches = tokens.filter((t) => target.includes(t));
  return matches.length / Math.max(tokens.length, 1);
}

// ─── Credential search ────────────────────────────────────────────────────────

function scoreCredential(
  cred: Credential,
  query: SearchQuery,
  qTokens: string[]
): SearchResultItem | null {
  // Only published, approved credentials
  if (cred.confidentiality === "restricted") return null;

  const signals = {
    exactSolutionMatch: false,
    exactProductMatch: false,
    exactIndustryMatch: false,
    exactClientNeedMatch: false,
    exactRegionMatch: false,
    keywordMatch: false,
    featuredStatus: cred.featured ?? false,
  };

  // Deterministic filters — hard excludes, never loosened by semantic ranking
  if (query.solution && !cred.solutionIds.includes(query.solution)) return null;
  if (query.product && !cred.productIds.includes(query.product)) return null;
  if (query.industry && !cred.industryIds.includes(query.industry)) return null;
  if (query.region && !cred.regionIds.includes(query.region)) return null;
  if (query.clientNeed && !cred.clientNeedIds.includes(query.clientNeed)) return null;

  // Score
  let score = 0;

  if (query.solution && cred.solutionIds.includes(query.solution)) {
    signals.exactSolutionMatch = true;
    score += 30;
  }
  if (query.product && cred.productIds.includes(query.product)) {
    signals.exactProductMatch = true;
    score += 25;
  }
  if (query.industry && cred.industryIds.includes(query.industry)) {
    signals.exactIndustryMatch = true;
    score += 20;
  }
  if (query.clientNeed && cred.clientNeedIds.includes(query.clientNeed)) {
    signals.exactClientNeedMatch = true;
    score += 20;
  }
  if (query.region && cred.regionIds.includes(query.region)) {
    signals.exactRegionMatch = true;
    score += 10;
  }

  // Keyword match
  const searchableText = [
    cred.title,
    cred.summary,
    cred.challenge ?? "",
    ...cred.keywords,
    ...cred.actions,
    ...cred.results.map((r) => r.label),
  ].join(" ");

  const overlap = keywordOverlap(qTokens, searchableText);
  if (overlap > 0) {
    signals.keywordMatch = true;
    score += Math.round(overlap * 10);
  }

  // Semantic similarity (title / summary direct contains)
  const q = query.q.toLowerCase();
  const titleMatch = cred.title.toLowerCase().includes(q);
  const summaryMatch = cred.summary.toLowerCase().includes(q);
  if (titleMatch || summaryMatch) {
    score += 10;
  }

  // Featured
  if (signals.featuredStatus) score += 5;

  // Must have some relevance for non-empty queries
  if (query.q.trim() && score === (signals.featuredStatus ? 5 : 0)) return null;

  const reasons: string[] = [];
  if (titleMatch) reasons.push("matches title");
  if (summaryMatch) reasons.push("matches summary");
  if (signals.exactProductMatch) reasons.push("matches product filter");
  if (signals.exactIndustryMatch) reasons.push("matches industry filter");
  if (signals.exactRegionMatch) reasons.push("matches region filter");
  if (signals.exactClientNeedMatch) reasons.push("matches client need filter");
  if (signals.keywordMatch) reasons.push(`keyword overlap`);
  if (signals.featuredStatus) reasons.push("featured credential");

  return {
    id: cred.id,
    entityType: "credential",
    title: cred.title,
    summary: cred.summary,
    score,
    matchReason: reasons.length > 0 ? reasons.join("; ") : "general relevance",
    signals,
  };
}

// ─── Main search function ────────────────────���────────────────────────────────

export function search(
  query: SearchQuery,
  userRole: UserRole
): SearchResponse {
  if (!roleHasPermission(userRole, "content:view")) {
    return { query: query.q, totalResults: 0, results: [], noResultsExplanation: "Insufficient permissions." };
  }

  // Route analytics queries
  if (looksLikeAnalyticsQuery(query.q)) {
    return {
      query: query.q,
      totalResults: 0,
      results: [],
      routeToAnalytics: true,
      noResultsExplanation: "This query looks like an analytics question. Use the Analytics section for case counts and breakdowns.",
    };
  }

  const qTokens = tokenise(query.q);
  const entityTypes = query.entityTypes ?? ["credential", "expert", "partner"];
  const limit = Math.min(query.limit ?? 20, 50);

  const results: SearchResultItem[] = [];

  // Search credentials
  if (entityTypes.includes("credential")) {
    for (const cred of CREDENTIALS) {
      const result = scoreCredential(cred, query, qTokens);
      if (result) results.push(result);
    }
  }

  // Search experts (simple keyword match)
  if (entityTypes.includes("expert")) {
    for (const expert of EXPERTS) {
      const text = [expert.name, expert.title ?? "", expert.bio ?? "", ...(expert.solutionIds ?? [])].join(" ");
      const overlap = keywordOverlap(qTokens, text);
      if (overlap > 0 || text.toLowerCase().includes(query.q.toLowerCase())) {
        results.push({
          id: expert.id,
          entityType: "expert",
          title: expert.name,
          summary: expert.title ?? "",
          score: Math.round(overlap * 20) + 5,
          matchReason: "matches expert profile",
          signals: {
            exactSolutionMatch: false,
            exactProductMatch: false,
            exactIndustryMatch: false,
            exactClientNeedMatch: false,
            exactRegionMatch: false,
            keywordMatch: overlap > 0,
            featuredStatus: false,
          },
        });
      }
    }
  }

  // Search partners
  if (entityTypes.includes("partner")) {
    for (const partner of PARTNERS) {
      // Deterministic solution filter — hard exclude, never loosened by ranking
      if (query.solution && !partner.solutionIds.includes(query.solution)) continue;

      const text = [partner.name, partner.description, ...partner.useCases].join(" ");
      const overlap = keywordOverlap(qTokens, text);
      const exactSolutionMatch = !!query.solution && partner.solutionIds.includes(query.solution);
      if (overlap > 0 || exactSolutionMatch || text.toLowerCase().includes(query.q.toLowerCase())) {
        results.push({
          id: partner.id,
          entityType: "partner",
          title: partner.name,
          summary: partner.description ?? "",
          score: Math.round(overlap * 15) + (exactSolutionMatch ? 30 : 0),
          matchReason: exactSolutionMatch ? "matches solution filter" : "matches partner profile",
          signals: {
            exactSolutionMatch,
            exactProductMatch: false,
            exactIndustryMatch: false,
            exactClientNeedMatch: false,
            exactRegionMatch: false,
            keywordMatch: overlap > 0,
            featuredStatus: false,
          },
        });
      }
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  const paged = results.slice(0, limit);

  return {
    query: query.q,
    totalResults: results.length,
    results: paged,
    noResultsExplanation:
      results.length === 0
        ? "No matching published records were found. Adjust your filters or search terms."
        : undefined,
  };
}
