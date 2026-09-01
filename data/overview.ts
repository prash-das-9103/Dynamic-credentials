/**
 * data/overview.ts
 *
 * All content for the Sustainability Practice Overview page.
 *
 * GOVERNANCE RULES — read before editing:
 *  1. Historical slide counts (historicalProofPoints) are SEPARATE from
 *     workbook-derived analytics. Never merge the two sources.
 *  2. All values read from slide images carry reviewStatus: "needs-review"
 *     and approvedForDisplay: false until manually verified.
 *  3. No Iris URLs, internal hyperlinks, or helpdesk email addresses appear
 *     anywhere in this file.
 *  4. AI/ecosystem proof points and own-operations metrics are marked
 *     timeSensitive: true — they must be manually refreshed periodically.
 *  5. Slide-based credential examples are anonymised ("Auto Supplier Co",
 *     "Investment Co", etc.) and must never be matched to named clients.
 *  6. The "Social Equity" credential example (ov-cred-08) is excluded per
 *     explicit instruction.
 *  7. This page introduces the four solutions — it is NOT an additional
 *     fifth solution itself.
 *  8. Analyst recognition and the CEO "Say" Pulse data are scoped to
 *     digital / innovation work, not sustainability-specific. Analyst
 *     recognition is shown on the Overview page (AnalystRecognition
 *     component, image-based, not driven from this file) by explicit
 *     request — it carries an in-component scope caveat rather than a
 *     scopeNote here.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ReviewStatus = "needs-review" | "approved";

export interface ActionPillar {
  id: string;
  /** Large number shown as visual anchor (1 / 2 / 3) */
  number: string;
  heading: string;
  /** Version-1 single-sentence framing */
  summary: string;
  /** Version-2 sub-steps — shown in expand or secondary layer */
  subSteps: string[];
  sourceImages: string[];
  /** "version-1" | "version-2" — pending manual reconciliation decision */
  versionConflictNote: string;
  reviewStatus: ReviewStatus;
}

export interface ValueDriver {
  id: string;
  name: string;
  proposition: string;
  proofPoints: string[];
  /** Footnote keys that apply */
  footnoteKeys: string[];
  sourceImages: string[];
  reviewStatus: ReviewStatus;
  approvedForDisplay: boolean;
}

export interface Differentiator {
  id: string;
  name: string;
  description: string;
  sourceImages: string[];
}

export interface OverviewSolution {
  id: string;
  label: string;
  tagline: string;
  description: string;
  /** Number of cases since 2021 — slide-derived, separate from workbook */
  historicalCaseCount: string;
  historicalCaseNote: string;
  href: string;
  /** Overrides the default "View credentials" CTA label when set. */
  ctaLabel?: string;
  }

export interface HistoricalProofPoint {
  id: string;
  value: string;
  label: string;
  subLabel?: string;
  /** Must always display to distinguish from live workbook numbers */
  sourceNote: string;
  methodologyNote?: string;
  solutionId?: string;
  asOfYear: number;
  sourceImages: string[];
  reviewStatus: ReviewStatus;
  approvedForDisplay: boolean;
}

export interface CredentialExample {
  id: string;
  title: string;
  city: string;
  description: string;
  solutionId?: string;
  /** Anonymised per governance rule 5 — never match to a named client */
  anonymised: true;
  sourceImages: string[];
  reviewStatus: ReviewStatus;
  approvedForDisplay: boolean;
}

export interface CapabilityProofPoint {
  id: string;
  category:
    | "sustainability-ai"
    | "general-ai"
    | "ecosystem-partnership"
    | "own-operations";
  title: string;
  value?: string;
  description: string;
  asOfDate?: string;
  /** Requires manual refresh — API / external source may change */
  timeSensitive: boolean;
  scopeNote?: string;
  sourceImages: string[];
  reviewStatus: ReviewStatus;
  approvedForDisplay: boolean;
}

export interface OwnOperationsMetric {
  id: string;
  label: string;
  value: string;
  unit?: string;
  year?: number;
  note?: string;
  timeSensitive: boolean;
  reviewStatus: ReviewStatus;
  approvedForDisplay: boolean;
}

export interface MarketContextDataPoint {
  year: number;
  value: number;
  /** "actual" = historical; "forecast" = forward-looking — must be labelled */
  type: "actual" | "forecast";
}

export interface MarketContextChart {
  id: string;
  title: string;
  subtitle: string;
  sourceNote: string;
  dataPoints: MarketContextDataPoint[];
  annotation?: string;
  reviewStatus: ReviewStatus;
  approvedForDisplay: boolean;
}

export interface CEOSayDataPoint {
  category: string;
  y2018: number;
  y2022: number;
  y2024: number;
}

// ---------------------------------------------------------------------------
// 1. Action framework — 3 pillars (Slides 4 & 7/8)
// ---------------------------------------------------------------------------

/**
 * RECONCILIATION REQUIRED — two versions exist:
 * Version 1 (Slide 4): single summary per pillar + illustrative diagrams
 * Version 2 (Slide 7/8): three sub-steps per pillar, no diagrams
 *
 * The page renders version-2 sub-steps as an expandable secondary layer
 * beneath the version-1 summary until a production decision is made.
 */
export const ACTION_PILLARS: ActionPillar[] = [
  {
    id: "accelerate",
    number: "1",
    heading: "Accelerate what works",
    summary: "Make high-ROI levers part of business-as-usual decision-making",
    subSteps: [
      "Identify profitable levers",
      "Rapidly scale these levers",
      "Feed profits back to sustain effort",
    ],
    sourceImages: ["Slide4", "Slide7", "Slide8"],
    versionConflictNote:
      "Version 1 uses summary sentence; Version 2 uses three sub-steps. Pending reconciliation.",
    reviewStatus: "needs-review",
  },
  {
    id: "anticipate",
    number: "2",
    heading: "Anticipate what\u2019s coming",
    summary:
      "Prepare to move quickly as dynamics change and new profit pools emerge",
    subSteps: [
      "Build future-sensing capabilities",
      "Pivot with tech, behavior, and policy",
      "Expect zigzags, not straight lines",
    ],
    sourceImages: ["Slide4", "Slide7", "Slide8"],
    versionConflictNote:
      "Version 1 uses summary sentence; Version 2 uses three sub-steps. Pending reconciliation.",
    reviewStatus: "needs-review",
  },
  {
    id: "build",
    number: "3",
    heading: "Build robustness",
    summary: "Focus on resiliency, redundancy, and adaptability",
    subSteps: [
      "Make resilience a design principle",
      "Monitor changes in real time",
      "Maintain a broad set of climate levers",
    ],
    sourceImages: ["Slide4", "Slide7", "Slide8"],
    versionConflictNote:
      "Version 1 uses summary sentence; Version 2 uses three sub-steps. Pending reconciliation.",
    reviewStatus: "needs-review",
  },
];

// ---------------------------------------------------------------------------
// 2. Market context — CEO sustainability priority index (Slide 2)
// ---------------------------------------------------------------------------

/**
 * All index values are read from the slide image and require verification
 * against the original Bain analysis (IBM / Gartner / PwC / KPMG aggregation).
 * The 2025 data point is preliminary and marked as a forecast/uptick.
 */
export const CEO_PRIORITY_INDEX: MarketContextChart = {
  id: "ceo-priority-index",
  title:
    "Sustainability remains a strategic priority",
  subtitle:
    "Importance of Sustainability according to CEOs, indexed to 2018 = 100",
  sourceNote:
    "Bain analysis, based on aggregation of publicly available CEO surveys (IBM, Gartner, PwC, KPMG)",
  annotation:
    "Decline is bottoming out — slow increase in priority in 2025",
  dataPoints: [
    { year: 2018, value: 100, type: "actual" },
    { year: 2019, value: 115, type: "actual" },
    { year: 2020, value: 118, type: "actual" },
    { year: 2021, value: 140, type: "actual" },
    { year: 2022, value: 148, type: "actual" },
    { year: 2023, value: 108, type: "actual" },
    { year: 2024, value: 93, type: "actual" },
    { year: 2025, value: 100, type: "forecast" },
  ],
  reviewStatus: "needs-review",
  approvedForDisplay: false,
};

/**
 * CEO sustainability mentions shifting toward business-value framing (Slide 5).
 * Values read from slide image — require verification.
 * Basis: Bain AI-powered Sustainability Pulse tool,
 * ~35k statements, 150 CEOs, top-50 companies by market cap per region.
 */
export const CEO_SAY_DATA: CEOSayDataPoint[] = [
  { category: "Business driven", y2018: 34, y2022: 48, y2024: 54 },
  { category: "Purpose driven", y2018: 26, y2022: 13, y2024: 13 },
  { category: "Public commitment", y2018: 22, y2022: 27, y2024: 21 },
  { category: "CSR reporting", y2018: 18, y2022: 12, y2024: 12 },
];

export const CEO_SAY_SOURCE =
  "Bain AI-powered Sustainability Pulse tool \u2014 ~35k statements by 150 CEOs of top companies across Americas, EMEA and APAC. Source: ~2k audio/video files (conferences, earnings calls, podcasts). Values are slide-image reads and require verification.";

// ---------------------------------------------------------------------------
// 3. Value drivers — "Sustainability frontrunners" (slide image not yet
//    provided — all values are placeholders pending source-image attachment)
// ---------------------------------------------------------------------------

export const VALUE_DRIVER_FOOTNOTES: Record<string, string> = {
  "1": "Comparing companies in top vs. bottom 25% of respective Sustainability outcome for global sample of companies $1B+ in revenues",
  "2": "Comparing carbon/sustainable procurement activity leaders in top vs. bottom 25% for global sample of companies $1B+ in revenues",
  "3": "Comparing TEV/LTM EBITDA for S&P500 companies with top 25% MSCI sustainability rating vs. bottom 75%; excludes outliers (10% bottom and 10% top TEV/E EBITDA multiples)",
};

export const VALUE_DRIVERS: ValueDriver[] = [
  {
    id: "vd-customer-growth",
    name: "Customer Growth",
    proposition: "Sustainable solutions outgrow others",
    proofPoints: [
      "~4\u20136% higher CAGR for sustainable solutions",
      "3\u00d7 as many sustainability leaders outperform on customer NPS\u00b9",
    ],
    footnoteKeys: ["1"],
    sourceImages: [],
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
  {
    id: "vd-cost-leadership",
    name: "Cost Leadership",
    proposition: "Significant energy cost savings with higher EBITDA",
    proofPoints: [
      "Carbon leaders generate 4\u20135ppt higher EBITDA\u00b2",
      "Avoidance of carbon prices, future fines & penalties",
    ],
    footnoteKeys: ["2"],
    sourceImages: [],
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
  {
    id: "vd-people-engagement",
    name: "People Engagement",
    proposition: "Higher employee satisfaction and retention",
    proofPoints: [
      "Sustainability leaders have 6ppt higher employee satisfaction\u00b9",
      "90% of HR leaders agree sustainability improves retention",
    ],
    footnoteKeys: ["1"],
    sourceImages: [],
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
  {
    id: "vd-valuation",
    name: "Valuation",
    proposition: "+1.7\u00d7 TEV/EBITDA for sustainability frontrunners",
    proofPoints: [
      "+1.7\u00d7 TEV/EBITDA for sustainability frontrunners\u00b3",
      "Lower financing cost via sustainability-linked loans and green bonds",
    ],
    footnoteKeys: ["3"],
    sourceImages: [],
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
];

// ---------------------------------------------------------------------------
// 4. Platform differentiators (Slide 11)
// ---------------------------------------------------------------------------

export const DIFFERENTIATORS: Differentiator[] = [
  {
    id: "diff-protect-value",
    name: "Protect & grow value",
    description:
      "Strong experience in protecting the business and translating sustainability into value creation, with a global thought leadership platform and deep ecosystem partnerships.",
    sourceImages: ["Slide11"],
  },
  {
    id: "diff-deep-expertise",
    name: "Deep expertise",
    description:
      "Decades of sector and sustainability expertise across all regions, tailored to each client situation to make it real for them.",
    sourceImages: ["Slide11"],
  },
  {
    id: "diff-sector-shaping",
    name: "Sector-shaping",
    description:
      "Supporting leading NGOs, coalitions and business forums at the leading edge of sustainability, building insights that help commercial clients identify new opportunities.",
    sourceImages: ["Slide11"],
  },
  {
    id: "diff-global-team",
    name: "Global team",
    description:
      "The partnership model ensures collaborative coverage across regions and sectors, bringing the right expertise to every client at the right time.",
    sourceImages: ["Slide11"],
  },
  {
    id: "diff-ai-expertise",
    name: "AI expertise",
    description:
      "At the forefront of AI development and defining the next wave of innovation in Sustainability, already deploying it with clients.",
    sourceImages: ["Slide11"],
  },
  {
    id: "diff-own-operations",
    name: "Sustainability in our own business",
    description:
      "Bain practices what it preaches, deploying Sustainability within its own operations \u2014 award-winning offset strategy, first VCMI claim approved, certified 100% carbon neutral.",
    sourceImages: ["Slide11"],
  },
];

// ---------------------------------------------------------------------------
// 5. Four solutions — gateway (Slides 14, 15, 16)
// ---------------------------------------------------------------------------

export const OVERVIEW_SOLUTIONS: OverviewSolution[] = [
  {
    id: "transition-strategy",
    label: "Transition Strategy",
    tagline: "Future-proofing strategy for global transitions",
    description:
      "Embed sustainability into long-term strategy, build a sustainable business, and define a credible path toward net-zero and competitive differentiation.",
    historicalCaseCount: "2,600+",
    historicalCaseNote:
      "Cases since 2021. Source: Bain Analysis. Slide-derived; counts may include multiple solutions per case.",
    href: "/solutions/transition-strategy",
    ctaLabel: "Solution deep-dive",
  },
  {
    id: "sustainability-value-creation",
    label: "Sustainability Value Creation",
    tagline: "Capture value from sustainability commitments",
    description:
      "Unlock commercial value from sustainability \u2014 from decarbonising the supply chain to embedding sustainability into B2B commercial excellence.",
    historicalCaseCount: "775+",
    historicalCaseNote:
      "Cases since 2021. Source: Bain Analysis. Slide-derived; counts may include multiple solutions per case.",
    href: "/solutions/sustainability-value-creation",
    ctaLabel: "Solution deep-dive",
  },
  {
    id: "circular-value-creation",
    label: "Circular Value Creation",
    tagline: "Unlock economic value from circularity",
    description:
      "Diagnose circular opportunities, design and deliver circular offers, services and resource strategies, and scale proven initiatives across the business.",
    historicalCaseCount: "270+",
    historicalCaseNote:
      "Cases since 2021. Source: Bain Analysis. Slide-derived; counts may include multiple solutions per case.",
    href: "/solutions/circular-value-creation",
    ctaLabel: "Solution deep-dive",
  },
  {
    id: "resilience-adaptation",
    label: "Resilience & Adaptation",
    tagline: "Make resilience a design principle",
    description:
      "Build business resilience against climate risk \u2014 protect asset values, secure the supply chain, and invest in climate adaptation technologies.",
    historicalCaseCount: "110+",
    historicalCaseNote:
      "Cases since 2021. Source: Bain Analysis. Slide-derived; counts may include multiple solutions per case.",
    href: "/solutions/resilience-adaptation",
    ctaLabel: "Solution deep-dive",
  },
];

// ---------------------------------------------------------------------------
// 6. Historical proof points (Slides 15, 16) — separate from workbook
// ---------------------------------------------------------------------------

export const HISTORICAL_PROOF_POINTS: HistoricalProofPoint[] = [
  {
    id: "hp-total-projects",
    value: "3,750+",
    label: "Sustainability projects",
    subLabel: "since 2021",
    sourceNote:
      "Slide-derived historical figure. Source: Bain Analysis. Cases across solutions may be counted multiple times. Does not update from the live workbook.",
    methodologyNote:
      "'Other' includes Healthcare, TMT, No Industry, etc.",
    asOfYear: 2025,
    sourceImages: ["Slide15"],
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
  {
    id: "hp-experts",
    value: "104",
    label: "Sustainability experts",
    subLabel: "in the directory",
    sourceNote:
      "Count derived from the expert directory in this application. Updates as the directory is maintained.",
    asOfYear: 2025,
    sourceImages: [],
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
];

// ---------------------------------------------------------------------------
// 7. Featured credential examples (Slide 17) — anonymised
// ---------------------------------------------------------------------------

/**
 * All descriptions are verbatim from the slide.
 * Client identities are anonymised per governance rule 5.
 * Social Equity credential (ov-cred-08) is excluded per governance rule 6.
 */
export const CREDENTIAL_EXAMPLES: CredentialExample[] = [
  {
    id: "ov-cred-01",
    title: "Sustainability Strategy",
    city: "Zurich",
    description:
      "Refreshed the sustainability strategy for a global industrial leader, benchmarking against peers and defining future-ready differentiation across climate strategy, AI-enabled sustainability, and sustainable services.",
    solutionId: "transition-strategy",
    anonymised: true,
    sourceImages: ["Slide17"],
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
  {
    id: "ov-cred-02",
    title: "Sustainable Business Models",
    city: "Chicago",
    description:
      "Defined the biofuels growth strategy for a leading ag cooperative, sizing multi-billion-dollar opportunities and shaping a scalable model to enable low-carbon feedstock supply.",
    solutionId: "transition-strategy",
    anonymised: true,
    sourceImages: ["Slide17"],
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
  {
    id: "ov-cred-03",
    title: "Circular Full Potential Transformation",
    city: "Zurich",
    description:
      "Supported an Auto Supplier in transforming fragmented circular initiatives into a scalable, value-driven roadmap through a detailed assessment, opportunity prioritization, and pilot design.",
    solutionId: "circular-value-creation",
    anonymised: true,
    sourceImages: ["Slide17"],
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
  {
    id: "ov-cred-04",
    title: "Circular Value Creation",
    city: "Madrid",
    description:
      "Supported a Recycling Co in increasing packaging waste collection through AI-driven analytics, marketing optimization, and fraud detection models to boost recycling, improve infrastructure planning, and optimize marketing spend.",
    solutionId: "circular-value-creation",
    anonymised: true,
    sourceImages: ["Slide17"],
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
  {
    id: "ov-cred-05",
    title: "Sustainability Value Creation Plan",
    city: "Denver",
    description:
      "Supported an Investment Co in embedding sustainability into the real estate investment lifecycle by defining asset-level plans, delivering higher property values, lower insurance for high-risk assets, lower energy use, and higher rents.",
    solutionId: "sustainability-value-creation",
    anonymised: true,
    sourceImages: ["Slide17"],
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
  {
    id: "ov-cred-06",
    title: "Sustainability Commercial Excellence",
    city: "Chicago",
    description:
      "Supported a Chemicals Co in driving commercial excellence by launching sustainable-offer sales plays, embedding sustainability in growth goals, kickstarting projects, and training plans.",
    solutionId: "sustainability-value-creation",
    anonymised: true,
    sourceImages: ["Slide17"],
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
  {
    id: "ov-cred-07",
    title: "Climate Asset Resilience",
    city: "Milan",
    description:
      "Supported an Energy Co to develop an Integrated Planning model and embed a Climate Asset Resilience toolkit to tackle aging assets and climate risks.",
    solutionId: "resilience-adaptation",
    anonymised: true,
    sourceImages: ["Slide17"],
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
];

// ---------------------------------------------------------------------------
// 8. Capability proof points (Slide 22 / 12 — WEF, Slide 23 — AI at scale)
// ---------------------------------------------------------------------------

/**
 * All AI and ecosystem figures are marked timeSensitive: true.
 * Slide23 figures are firm-wide AI capabilities, not sustainability-specific —
 * see scopeNote. Only the WEF collaboration (sustainability-ai) is shown on
 * the Overview page by default; the general-ai proof points are stored for
 * potential use in a separate Firm Capabilities module.
 */
export interface WefMissionPillar {
  id: string;
  label: string;
}

/** Four mission pillars of the WEF collaboration (Slide 22). */
export const WEF_MISSION_PILLARS: WefMissionPillar[] = [
  { id: "pillar-resource-use", label: "Driving efficient resource use" },
  { id: "pillar-product-design", label: "Promoting eco-friendly product design" },
  { id: "pillar-employee-wellbeing", label: "Supporting employee well-being and governance" },
  { id: "pillar-supply-chain", label: "Enhancing supply chain transparency" },
];

export interface FirmAIStat {
  id: string;
  value: string;
  label: string;
}

export interface AIEcosystemPartner {
  id: string;
  name: string;
  description: string;
}

export interface AIAcquisition {
  id: string;
  name: string;
  description: string;
}

/**
 * GOVERNANCE NOTE (exception to rule 8 above, by explicit request):
 * The figures below (Slide 23) are firm-wide AI capabilities, not
 * sustainability-exclusive. They are shown on the Overview's "AI for
 * Sustainable Future" section as context for the scale and ecosystem
 * backing the WEF collaboration — clearly labeled as firm-wide, not
 * folded into the sustainability-specific "6 platforms" claim.
 */
export const FIRM_AI_STATS: FirmAIStat[] = [
  { id: "stat-ai-clients", value: "3,000+", label: "AI, Insights & Solutions client engagements globally" },
  { id: "stat-ai-usecases", value: "420+", label: "GenAI / Agentic AI use cases and solutions delivered worldwide" },
  { id: "stat-ai-projects", value: "350+", label: "active projects" },
];

export const FIRM_AI_TEAM: FirmAIStat[] = [
  { id: "team-practitioners", value: "20+", label: "senior practitioners, ex-CDO, CAO, data science professors" },
  { id: "team-analytics", value: "900+", label: "deep analytics experts and practitioners" },
  { id: "team-engineers", value: "1,500+", label: "analytics and software engineers via our partner network" },
];

export const AI_ECOSYSTEM_PARTNERS: AIEcosystemPartner[] = [
  { id: "partner-openai", name: "OpenAI", description: "Unique alliance for 2.5+ years with strong momentum" },
  {
    id: "partner-ai-aspire",
    name: "AI Aspire by Andrew Ng",
    description: "Strategic partnership with Andrew Ng to accelerate AI transformation",
  },
  {
    id: "partner-inception",
    name: "Inception",
    description: "Strategic collaboration to bring productized, enterprise-grade AI solutions to clients worldwide",
  },
  {
    id: "partner-cloud",
    name: "Palantir, AWS, Microsoft, Google",
    description: "Strategic partnerships across the leading cloud and data platforms",
  },
];

export const AI_ACQUISITIONS: AIAcquisition[] = [
  {
    id: "acq-maxkelsen",
    name: "MaxKelsen",
    description: "Enhance operationalization of machine learning and AI enabled use cases",
  },
  {
    id: "acq-umbrage",
    name: "Umbrage",
    description: "Deep technical expertise in Product Management, UI/UX, full stack dev, DevOps, QA and Web3",
  },
];

export const CAPABILITY_PROOF_POINTS: CapabilityProofPoint[] = [
  {
    id: "cpp-wef-collaboration",
    category: "sustainability-ai",
    title: "AI for Sustainable Future — World Economic Forum",
    value: "6 platforms",
    description:
      "Tripartite partnership between the World Economic Forum, Bain and leaders across four industries to co-create six AI-powered sustainability platforms delivering measurable impact. Examples: Sustainable Finance Market Pulse, Sustainable Investments Matchmaker, Sustainability Readiness Tool.",
    asOfDate: "2026",
    timeSensitive: true,
    sourceImages: ["Slide22", "Slide12"],
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
  {
    id: "cpp-ai-clients",
    category: "general-ai",
    title: "AI, Insights & Solutions client engagements globally",
    value: "3,000+",
    description:
      "Firm-wide AI engagements across all practices, not sustainability-specific.",
    asOfDate: "2025",
    timeSensitive: true,
    scopeNote:
      "Firm-wide figure \u2014 not sustainability-specific. Excluded from default Overview display.",
    sourceImages: ["Slide23"],
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
  {
    id: "cpp-ai-usecases",
    category: "general-ai",
    title: "GenAI / Agentic AI use cases and solutions delivered worldwide",
    value: "420+",
    description:
      "Firm-wide GenAI and Agentic AI use cases, not sustainability-specific.",
    asOfDate: "2025",
    timeSensitive: true,
    scopeNote:
      "Firm-wide figure \u2014 not sustainability-specific. Excluded from default Overview display.",
    sourceImages: ["Slide23"],
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
  {
    id: "cpp-openai-alliance",
    category: "ecosystem-partnership",
    title: "OpenAI — unique alliance",
    value: "2.5+ years",
    description: "Unique alliance with strong momentum.",
    asOfDate: "2025",
    timeSensitive: true,
    scopeNote:
      "Firm-wide partnership \u2014 not sustainability-specific. Included for context.",
    sourceImages: ["Slide23"],
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
];

// ---------------------------------------------------------------------------
// 9. Bain's own sustainability commitments (Slide 26)
// ---------------------------------------------------------------------------

export const OWN_OPERATIONS_METRICS: OwnOperationsMetric[] = [
  {
    id: "own-carbon-footprint",
    label: "Carbon emissions",
    value: "10.5",
    unit: "tCO\u2082e/FTE",
    year: 2024,
    note: "Peer average 14.5\u00a0tCO\u2082e/FTE. Market-based footprint. Peer average calculated from peer sustainability reports for 2024; minor methodology differences may yield up to 5% variance.",
    timeSensitive: true,
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
  {
    id: "own-net-negative",
    label: "Net-negative carbon impact",
    value: "Since 2022",
    note: "Removes more than 100% of Bain\u2019s Scope 1, 2 and 3 emissions in 2023\u20132024.",
    timeSensitive: true,
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
  {
    id: "own-cdp",
    label: "CDP ranking",
    value: "A List",
    year: 2025,
    note: "CDP A List for Climate and A List for Supplier Engagement; B for Water.",
    timeSensitive: true,
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
  {
    id: "own-ecovadis",
    label: "EcoVadis Platinum",
    value: "Top 1%",
    year: 2025,
    timeSensitive: true,
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
  {
    id: "own-renewable",
    label: "Renewable electricity",
    value: "100%",
    note: "Across global footprint since 2020.",
    timeSensitive: false,
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
  {
    id: "own-green-teams",
    label: "Employees in Green Teams",
    value: "75%",
    note: "Offices implementing changes to reduce carbon footprint.",
    timeSensitive: true,
    reviewStatus: "needs-review",
    approvedForDisplay: false,
  },
];

export const OWN_OPERATIONS_CONTEXT = {
  heading: "We are alongside you on this journey",
  subCopy:
    "Measuring and reducing our impact on the environment is a critical priority for Bain. Our unique, collaborative approach combined with our focus on the environment enables Bain to deliver exceptional client results at significantly lower environmental impact.",
  lastUpdated: "May 2026",
  sourceImage: "Slide26",
};
