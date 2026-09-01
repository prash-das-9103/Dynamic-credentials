import type { PackItem, PackState } from "@/types/credentials";
import { CREDENTIALS } from "@/data/credentials";
import { PRODUCTS, INDUSTRIES, REGIONS, CLIENT_NEEDS } from "@/data/solutions";
import { DEFAULT_SECTION_FOR_TYPE } from "@/lib/pack-constants";

function labelOrId(id: string, list: { id: string; label: string }[]): string {
  return list.find((x) => x.id === id)?.label ?? id;
}

function topN<T extends string>(items: T[], n: number): T[] {
  const counts = new Map<T, number>();
  for (const v of items) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([v]) => v);
}

function joinEnglish(parts: string[]): string {
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
}

export function generatePackSummary(pack: PackState): string {
  const credentials = pack.items.filter((i) => i.itemType === "credential");
  const experts = pack.items.filter((i) => i.itemType === "expert");
  const partners = pack.items.filter((i) => i.itemType === "partner");
  const publications = pack.items.filter((i) => i.itemType === "publication");

  if (pack.items.length === 0) return "";

  // Collect data from real credential objects
  const credData = credentials.map((ci) => CREDENTIALS.find((c) => c.id === ci.id)).filter(Boolean);

  const allProductIds = credData.flatMap((c) => c!.productIds);
  const allIndustryIds = credData.flatMap((c) => c!.industryIds);
  const allRegionIds = credData.flatMap((c) => c!.regionIds);
  const allClientNeedIds = credData.flatMap((c) => c!.clientNeedIds);

  const topProducts = topN(allProductIds, 3).map((id) => labelOrId(id, PRODUCTS));
  const topIndustries = topN(allIndustryIds, 3).map((id) => labelOrId(id, INDUSTRIES));
  const topRegions = topN(allRegionIds, 2).map((id) => labelOrId(id, REGIONS));
  const topNeeds = topN(allClientNeedIds, 3).map((id) => labelOrId(id, CLIENT_NEEDS));

  const parts: string[] = [];

  // Credential sentence
  if (credentials.length > 0) {
    const credCount = credentials.length;
    const hasAnon = credData.some((c) => c!.confidentiality === "anonymized-client-example");
    const confidentialityAdj = hasAnon ? "anonymized " : "";
    const productStr = topProducts.length > 0 ? ` across ${joinEnglish(topProducts)}` : "";
    parts.push(
      `This pack brings together ${credCount} ${confidentialityAdj}credential${credCount !== 1 ? "s" : ""}${productStr}.`
    );
  }

  // Industry + region sentence
  if (topIndustries.length > 0 || topRegions.length > 0) {
    const indStr = topIndustries.length > 0 ? `spans ${joinEnglish(topIndustries.map((i) => i.toLowerCase()))}` : "";
    const regStr = topRegions.length > 0 ? `with examples from ${joinEnglish(topRegions)}` : "";
    const combined = [indStr, regStr].filter(Boolean).join(", ");
    if (combined) parts.push(`The selected work ${combined}.`);
  }

  // Support sentence
  const supportParts: string[] = [];
  if (experts.length > 0)
    supportParts.push(`${experts.length} relevant expert${experts.length !== 1 ? "s" : ""}`);
  if (partners.length > 0)
    supportParts.push(`${partners.length} ecosystem partner${partners.length !== 1 ? "s" : ""}`);
  if (publications.length > 0)
    supportParts.push(`${publications.length} publication${publications.length !== 1 ? "s" : ""}`);
  if (supportParts.length > 0)
    parts.push(`It is supported by ${joinEnglish(supportParts)}.`);

  // Themes sentence
  if (topNeeds.length > 0) {
    parts.push(
      `The strongest themes are ${joinEnglish(topNeeds.map((n) => n.toLowerCase()))}.`
    );
  }

  return parts.join(" ");
}

export function getItemsBySection(
  items: PackItem[],
  sectionId: string
): PackItem[] {
  return items.filter(
    (i) => (i.section ?? DEFAULT_SECTION_FOR_TYPE[i.itemType]) === sectionId
  );
}
