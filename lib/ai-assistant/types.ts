/**
 * Shared types for the AI-assisted request experience.
 *
 * Architecture:
 *   User request → AI interpreter → schema-validated structured request
 *     → deterministic tools → grounded results
 *     → AI-written explanation using only returned results
 *
 * The AI NEVER calculates case counts. It interprets requests, selects tools,
 * and explains deterministic results.
 */

// ─── Intent classification ────────────────────────────────────────────────────

export type AssistantIntent =
  | "case-count"
  | "case-trend"
  | "case-breakdown"
  | "case-comparison"
  | "credential-search"
  | "expert-search"
  | "partner-search"
  | "publication-search"
  | "pack-recommendation"
  | "methodology-question"
  | "clarification"
  | "unsupported";

// ─── Scope mapping ────────────────────────────────────────────────────────────

export type SolutionScope =
  | "sustainability"
  | "sustainability-value-creation"
  | "resilience-adaptation"
  | "transition-strategy"
  | "circularity-value-creation";

export type AssistantBreakdown = "end-year" | "region" | "solution" | "none";

export type AssistantResultStatus = "ready" | "needs-clarification" | "unsupported";

// ─── Interpreted request (from AI interpreter) ────────────────────────────────

export interface InterpretedAssistantRequest {
  status: AssistantResultStatus;

  intents: AssistantIntent[];

  analyticalRequest?: {
    scope?: SolutionScope;
    isFoodSystemsTransformation: boolean;
    solutionIntersection?: Exclude<SolutionScope, "sustainability">;
    dateExpression?: string;
    resolvedDateRange?: {
      startDate: string;
      endDate: string;
      label: string;
      mode:
        | "single-year"
        | "bounded-range"
        | "onward"
        | "rolling"
        | "calendar-years"
        | "all-available"
        | "custom";
    };
    regionIds: string[];
    breakdown: AssistantBreakdown;
    metric: "unique-case-count";
  };

  contentRequest?: {
    query: string;
    solutionIds: string[];
    industryIds: string[];
    regionIds: string[];
    clientNeedIds: string[];
    contentTypes: Array<"credential" | "expert" | "partner" | "publication">;
  };

  packRequest?: {
    requested: boolean;
    clientContext?: string;
    desiredSections: string[];
    maximumItems?: number;
  };

  clarification?: {
    missingFields: Array<
      | "time-duration"
      | "solution"
      | "region"
      | "content-type"
      | "client-context"
    >;
    question: string;
    options: Array<{
      label: string;
      value: string;
    }>;
  };

  confidence: number;
  interpretationNotes: string[];
}

// ─── Tool result types ────────────────────────────────────────────────────────

export interface CaseAnalyticsToolResult {
  uniqueCaseCount: number;
  excludedInvalidEndDateCount: number;

  request: {
    scope: string;
    isFoodSystemsTransformation: boolean;
    solutionIntersection?: string;
    startDate: string;
    endDate: string;
    regions: string[];
    breakdown: string;
  };

  dataBasis: {
    uniqueIdentifier: "Case Code";
    timeField: "Column D — Case End Date";
    regionField: "Column A";
    industryField: "Column H";
    solutionField: "Column Q";
    foodSystemsField: "Column T";
  };

  casesByEndYear: Array<{ year: number; count: number }>;
  casesByRegion: Array<{ region: string; count: number }>;
  casesBySolution: Array<{ solution: string; count: number }>;
  casesByIndustry: Array<{ industry: string; count: number }>;

  workbookCoverage: {
    minimumEndDate?: string;
    maximumEndDate?: string;
    selectedPeriodPartiallyOutsideCoverage: boolean;
  };

  methodologyNotes: string[];
}

export interface ContentSearchResult {
  credentials: Array<{
    id: string;
    title: string;
    summary: string;
    year?: number;
    regionIds: string[];
    productIds: string[];
    confidentiality: string;
  }>;
  experts: Array<{
    id: string;
    name: string;
    title: string;
    expertise: string[];
  }>;
  partners: Array<{
    id: string;
    name: string;
    category: string;
    description: string;
  }>;
  publications: Array<{
    id: string;
    title: string;
    abstract: string;
    year?: number;
    publicationType: string;
  }>;
  query: string;
  totalMatches: number;
}

// ─── Scope → solution label mapping ──────────────────────────────────────────

export const SCOPE_TO_SOLUTION_LABEL: Record<SolutionScope, string> = {
  sustainability: "All Sustainability",
  "sustainability-value-creation": "Sustainability Value Creation",
  "resilience-adaptation": "Resilience & Adaptation",
  "transition-strategy": "Transition Strategy",
  "circularity-value-creation": "Circular Value Creation",
};

// Solution IDs in the case registry that map to each scope
export const SCOPE_TO_SOLUTION_IDS: Record<SolutionScope, string[] | null> = {
  sustainability: null, // all solutions
  "sustainability-value-creation": ["Sustainability Value Creation"],
  "resilience-adaptation": ["Resilience & Adaptation"],
  "transition-strategy": ["Transition Strategy"],
  "circularity-value-creation": ["Circular Value Creation"],
};

// ─── Suggested questions shown in the empty state ────────────────────────────

export const SUGGESTED_QUESTIONS = [
  "How many cases did we deliver in 2024?",
  "Show me Circularity cases in EMEA from FY2022 to FY2024",
  "Find credentials related to packaging circularity",
  "Which experts work on Transition Strategy?",
  "How have case counts trended over FY2021-2025?",
  "Find publications on carbon footprint reduction",
] as const;
