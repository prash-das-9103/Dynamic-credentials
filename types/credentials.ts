export type CredentialType =
  | "case-example"
  | "proof-point"
  | "product-offering";

export type Confidentiality =
  | "public"
  | "internal"
  | "anonymized-client-example"
  | "restricted";

export interface ResultMetric {
  label: string;
  value: number;
  unit?: string;
  displayValue?: string;
}

export interface Credential {
  id: string;
  type: CredentialType;
  title: string;
  clientAlias?: string;
  summary: string;
  challenge?: string;
  actions: string[];
  results: ResultMetric[];
  /** Practice solution(s) this credential belongs to — see data/solution-config.ts */
  solutionIds: string[];
  productIds: string[];
  industryIds: string[];
  regionIds: string[];
  capabilityIds: string[];
  clientNeedIds: string[];
  expertIds: string[];
  partnerIds: string[];
  keywords: string[];
  confidentiality: Confidentiality;
  year?: number;
  sourceSlides: number[];
  featured?: boolean;
}

// Leadership roles on the Sustainability practice
export type ExpertLeadershipRole =
  | "global-practice-leader"
  | "regional-practice-leader"
  | "executive-leadership"
  | "solution-leader"
  | "industry-leader"
  | "sustainability-interlock-champion";

export interface ExpertLeadership {
  role: ExpertLeadershipRole;
  label: string;           // e.g. "Regional Practice Leader, EMEA"
  region?: string;         // e.g. "emea" | "americas" | "apac"
  solutionId?: string;     // for solution-leader
  industryId?: string;     // for industry-leader
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  role?: string;
  bio: string;
  productIds: string[];        // solution products (circular-full-potential etc.)
  solutionIds: string[];       // four practice solutions (transition-strategy etc.)
  industryIds: string[];
  regionIds: string[];
  expertise: string[];
  centerOfExcellenceIds: string[];
  leadership: ExpertLeadership[];
  credentialIds: string[];
  sourceSlides: number[];
}

// Centers of Excellence — 9 CoEs (H2/CCUS are sub-areas of Global Energy & Materials)
export interface CenterOfExcellence {
  id: string;
  name: string;
  description?: string;
  expertiseQuestions: string[];
  expertIds: string[];
  proposedPartnerNames: string[];
  sourceImages: string[];
  reviewStatus: "needs-review";
  parentId?: string;   // set for H2/PTX and CCUS sub-areas
}

export type PartnerCategory =
  | "Technical advisory"
  | "Technology and data"
  | "Coalition and thought leadership"
  | "Implementation partner";

/**
 * Ecosystem grouping used on the Ecosystem page (as of Feb 2026 reorg).
 * A partner may belong to more than one group — e.g. EcoVadis and CDP are
 * both data vendors and rating service providers.
 */
export type EcosystemGroup = "partnership" | "data-vendor" | "rating-provider";

export interface Partner {
  id: string;
  name: string;
  category: PartnerCategory;
  description: string;
  /** Practice solution(s) this partner supports — see data/solution-config.ts */
  solutionIds: string[];
  productIds: string[];
  useCases: string[];
  credentialIds: string[];
  publicationIds: string[];
  sourceSlides: number[];
  /** Bain lead(s) for the relationship, as listed on the partner-on-a-page tracker. */
  bainLead?: string;
  /** Point of contact for further information or cross-partnership support. */
  whoToContact?: string;
  /** Link to the partnership's IRIS content-viewer page, when available. */
  irisUrl?: string;
  /** Ecosystem section(s) this entity belongs to — partnerships, data vendors, rating providers. */
  ecosystemGroups?: EcosystemGroup[];
  /**
   * Marks a separate, higher-level Bain alliance (distinct from the ecosystem
   * groups above) — e.g. CDP, WBCSD, WEF, IACPM, The Sustainable Flight Challenge.
   */
  allianceMember?: boolean;
}

export type PublicationType =
  | "Bain publication"
  | "Coalition publication"
  | "Point of view"
  | "Executive guide"
  | "Research report"
  | "Internal insight";

export interface Publication {
  id: string;
  title: string;
  abstract: string;
  year?: number;
  publicationType: PublicationType;
  /** Practice solution(s) this publication belongs to — see data/solution-config.ts */
  solutionIds: string[];
  productIds: string[];
  industryIds: string[];
  partnerIds: string[];
  credentialIds: string[];
  keywords: string[];
  authors: string[];
  sourceSlides: number[];
  /** Link to the original published article, when available */
  url?: string;
}

export type PackItemType = "credential" | "expert" | "partner" | "publication" | "chart";

export interface PackItem {
  id: string;
  type: PackItemType;      // spec alias — mirrors itemType
  itemType: PackItemType;  // primary field used in code
  title: string;
  subtitle?: string;
  section?: string;
  addedAt: number;
  exportRestricted: boolean;
  // Builder-specific
  note?: string;
  priority?: boolean;
}

export interface PackSection {
  id: string;
  label: string;
  collapsed?: boolean;
  custom?: boolean;          // true = user-added, deletable when empty
}

export interface PackMetadata {
  packTitle: string;
  clientName: string;
  clientAlias: string;
  clientSituation: string;
  preparedBy: string;
  date: string;
}

export interface PackState {
  items: PackItem[];
  clientName?: string;       // legacy compat — mirrored in metadata
  clientSituation?: string;  // legacy compat
  sectionHeadings: { id: string; label: string }[];
  // Builder extensions
  sections: PackSection[];
  metadata: PackMetadata;
  executiveSummary: string;
  summaryEdited: boolean;    // true when user has manually edited the summary
  previewMode: boolean;
}

export interface ActiveFilters {
  solutions: string[];
  products: string[];
  industries: string[];
  regions: string[];
  capabilities: string[];
  clientNeeds: string[];
  contentTypes: string[];
  confidentiality: string[];
  search: string;
  sortBy: "relevance" | "title" | "recent";
}
