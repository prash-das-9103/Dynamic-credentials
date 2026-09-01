/**
 * Deterministic content search tool.
 *
 * Searches credentials, experts, partners, and publications using keyword
 * matching against structured data. The AI supplies only a structured
 * ContentRequest — this module does all computation.
 *
 * The AI never infers or fabricates results. It may only explain what is
 * returned here.
 */

import { CREDENTIALS } from "@/data/credentials";
import { EXPERTS } from "@/data/experts";
import { PARTNERS } from "@/data/partners";
import { PUBLICATIONS } from "@/data/publications";
import type {
  ContentSearchResult,
  InterpretedAssistantRequest,
} from "./types";

const MAX_PER_TYPE = 8;

export function runContentSearchTool(
  contentRequest: NonNullable<InterpretedAssistantRequest["contentRequest"]>
): ContentSearchResult {
  const {
    query,
    solutionIds,
    industryIds,
    regionIds,
    clientNeedIds,
    contentTypes,
  } = contentRequest;

  const normalizedQuery = query.trim().toLowerCase();
  const searchTypes = contentTypes.length > 0 ? contentTypes : ["credential", "expert", "partner", "publication"];

  // ─── Credentials ────────────────────────────────────────────────────────────
  const credentials = searchTypes.includes("credential")
    ? CREDENTIALS.filter((c) => {
        if (solutionIds.length > 0 && !c.productIds.some((p) => solutionIds.includes(p)))
          return false;
        if (industryIds.length > 0 && !c.industryIds.some((i) => industryIds.includes(i)))
          return false;
        if (regionIds.length > 0 && !c.regionIds.some((r) => regionIds.includes(r)))
          return false;
        if (clientNeedIds.length > 0 && !c.clientNeedIds.some((cn) => clientNeedIds.includes(cn)))
          return false;
        if (normalizedQuery) {
          const searchable = [
            c.title,
            c.summary,
            c.challenge ?? "",
            c.clientAlias ?? "",
            ...c.actions,
            ...c.keywords,
          ]
            .join(" ")
            .toLowerCase();
          if (!searchable.includes(normalizedQuery)) return false;
        }
        return true;
      })
        .sort((a, b) => (a.featured ? -1 : 0) - (b.featured ? -1 : 0))
        .slice(0, MAX_PER_TYPE)
        .map((c) => ({
          id: c.id,
          title: c.title,
          summary: c.summary,
          year: c.year,
          regionIds: c.regionIds,
          productIds: c.productIds,
          confidentiality: c.confidentiality,
        }))
    : [];

  // ─── Experts ─────────────────────────────────────────────────────────────────
  const experts = searchTypes.includes("expert")
    ? EXPERTS.filter((e) => {
        if (solutionIds.length > 0 && !e.productIds.some((p) => solutionIds.includes(p)))
          return false;
        if (regionIds.length > 0 && !e.regionIds.some((r) => regionIds.includes(r)))
          return false;
        if (normalizedQuery) {
          const searchable = [
            e.name,
            e.title,
            e.bio,
            e.role ?? "",
            ...e.expertise,
          ]
            .join(" ")
            .toLowerCase();
          if (!searchable.includes(normalizedQuery)) return false;
        }
        return true;
      })
        .slice(0, MAX_PER_TYPE)
        .map((e) => ({
          id: e.id,
          name: e.name,
          title: e.title,
          expertise: e.expertise,
        }))
    : [];

  // ─── Partners ─────────────────────────────────────────────────────────────────
  const partners = searchTypes.includes("partner")
    ? PARTNERS.filter((p) => {
        if (solutionIds.length > 0 && !p.productIds.some((pid) => solutionIds.includes(pid)))
          return false;
        if (normalizedQuery) {
          const searchable = [
            p.name,
            p.category,
            p.description,
            ...p.useCases,
          ]
            .join(" ")
            .toLowerCase();
          if (!searchable.includes(normalizedQuery)) return false;
        }
        return true;
      })
        .slice(0, MAX_PER_TYPE)
        .map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          description: p.description,
        }))
    : [];

  // ─── Publications ──────────────────────────────────────────────────────────
  const publications = searchTypes.includes("publication")
    ? PUBLICATIONS.filter((pub) => {
        if (solutionIds.length > 0 && !pub.productIds.some((pid) => solutionIds.includes(pid)))
          return false;
        if (industryIds.length > 0 && !pub.industryIds.some((i) => industryIds.includes(i)))
          return false;
        if (normalizedQuery) {
          const searchable = [
            pub.title,
            pub.abstract,
            ...pub.keywords,
            ...pub.authors,
          ]
            .join(" ")
            .toLowerCase();
          if (!searchable.includes(normalizedQuery)) return false;
        }
        return true;
      })
        .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
        .slice(0, MAX_PER_TYPE)
        .map((pub) => ({
          id: pub.id,
          title: pub.title,
          abstract: pub.abstract,
          year: pub.year,
          publicationType: pub.publicationType,
        }))
    : [];

  const totalMatches =
    credentials.length + experts.length + partners.length + publications.length;

  return {
    credentials,
    experts,
    partners,
    publications,
    query,
    totalMatches,
  };
}
