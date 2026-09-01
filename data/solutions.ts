export interface Product {
  id: string;
  label: string;
  description: string;
  questions: string[];
  color: string;
  /** Practice solution(s) this product belongs to — see data/solution-config.ts */
  solutionIds: string[];
}

export interface Industry {
  id: string;
  label: string;
}

export interface Region {
  id: string;
  label: string;
}

export interface Capability {
  id: string;
  label: string;
}

export interface ClientNeed {
  id: string;
  label: string;
  /** Practice solution(s) this client need belongs to — see data/solution-config.ts */
  solutionIds: string[];
}

// Practice-level solution IDs (used in Expert.solutionIds and CoE ownership)
export const SOLUTIONS: { id: string; label: string }[] = [
  { id: "transition-strategy", label: "Transition Strategy" },
  { id: "sustainability-value-creation", label: "Sustainability Value Creation" },
  { id: "circular-value-creation", label: "Circular Value Creation" },
  { id: "resilience-adaptation", label: "Resilience & Adaptation" },
];

export const PRODUCTS: Product[] = [
  // ── Transition Strategy ──────────────────────────────────────────────────
  {
    id: "transition-net-zero-pathway",
    label: "Net-Zero Pathway Design",
    description:
      "Define a credible, sequenced pathway to net-zero that balances ambition with commercial realism, and embed it into long-term strategy.",
    questions: [
      "What is a credible net-zero pathway for our business?",
      "How do we sequence abatement levers against cost and feasibility?",
      "How do we align the pathway with corporate strategy and capital allocation?",
    ],
    color: "#1a1a1a",
    solutionIds: ["transition-strategy"],
  },
  {
    id: "transition-future-back-strategy",
    label: "Future-Back Strategy",
    description:
      "Build a future-back point of view on how sustainability reshapes the competitive landscape, and define where to play and how to win.",
    questions: [
      "How will sustainability reshape our industry over the next decade?",
      "Where should we build differentiated positions?",
      "What capabilities do we need to build now versus later?",
    ],
    color: "#333333",
    solutionIds: ["transition-strategy"],
  },
  {
    id: "transition-policy-navigation",
    label: "Policy & Regulatory Navigation",
    description:
      "Anticipate and navigate an evolving climate policy and disclosure landscape to protect and create value.",
    questions: [
      "Which regulations will materially affect our business?",
      "How do we build a policy-engagement strategy?",
      "How do we turn compliance requirements into competitive advantage?",
    ],
    color: "#4d4d4d",
    solutionIds: ["transition-strategy"],
  },
  {
    id: "transition-energy-transition",
    label: "Energy Transition",
    description:
      "Identify the opportunities, risks, and costs associated with the shift to low-carbon energy systems, and build a strategy that balances energy security, cost, and decarbonization commitments.",
    questions: [
      "How does the energy transition change our cost base and asset footprint?",
      "Where are the opportunities and risks in low-carbon energy markets?",
      "How do we sequence investment against energy policy and price signals?",
    ],
    color: "#666666",
    solutionIds: ["transition-strategy"],
  },

  // ── Sustainability Value Creation ────────────────────────────────────────
  {
    id: "svc-supply-chain-decarbonization",
    label: "Supply Chain Decarbonization",
    description:
      "Reduce Scope 3 emissions at the lowest cost by identifying, prioritizing, and executing supplier and logistics abatement levers.",
    questions: [
      "Where are our largest Scope 3 emissions sources?",
      "Which abatement levers are most cost-effective?",
      "How do we engage suppliers to deliver reductions?",
    ],
    color: "#0F6B4A",
    solutionIds: ["sustainability-value-creation"],
  },
  {
    id: "svc-commercial-excellence",
    label: "Sustainable Commercial Excellence",
    description:
      "Embed sustainability into B2B commercial models to win share, command premiums, and grow with sustainability-driven buyers.",
    questions: [
      "How do we win deals where sustainability is a purchasing criterion?",
      "Can we command a premium for lower-carbon products?",
      "How do we equip sales teams to sell sustainability credentials?",
    ],
    color: "#14834F",
    solutionIds: ["sustainability-value-creation"],
  },
  {
    id: "svc-carbon-markets",
    label: "Carbon & Environmental Markets",
    description:
      "Develop a strategy for voluntary and compliance carbon markets, including credit sourcing, portfolio design, and market positioning.",
    questions: [
      "Should we participate in voluntary carbon markets?",
      "How do we build a credible, high-quality credit portfolio?",
      "What is our exposure to compliance carbon markets?",
    ],
    color: "#1F9160",
    solutionIds: ["sustainability-value-creation"],
  },

  {
    id: "circular-full-potential",
    label: "Circular Full Potential",
    description:
      "Identify and prioritize circular value pools, evaluate existing initiatives, and build a practical pilot and scale-up roadmap.",
    questions: [
      "Where are the largest circular value pools?",
      "Why have existing pilots not scaled?",
      "Which initiatives should we prioritize?",
    ],
    color: "#CC0000",
    solutionIds: ["circular-value-creation"],
  },
  {
    id: "circular-offer-strategy",
    label: "Circular Offer Strategy",
    description:
      "Design circular products, materials, and business models that unlock new growth and commercial value.",
    questions: [
      "How can we seize the growing circular materials market?",
      "Which customers will pay for circular offerings?",
      "How should we commercialize recycled-content products?",
    ],
    color: "#1a1a1a",
    solutionIds: ["circular-value-creation"],
  },
  {
    id: "circular-services-boost",
    label: "Circular Services Boost",
    description:
      "Capture value throughout the product lifecycle through repair, refurbishment, resale, maintenance, and installed-base services.",
    questions: [
      "How can we increase lifecycle revenue?",
      "Which circular services should we build?",
      "Which partnerships are required?",
    ],
    color: "#444444",
    solutionIds: ["circular-value-creation"],
  },
  {
    id: "circular-resources-strategy",
    label: "Circular Resources Strategy",
    description:
      "Improve resource efficiency, monetize waste, recover high-value materials, and secure future access to constrained resources.",
    questions: [
      "How can we monetize waste streams?",
      "Which critical resources are at risk?",
      "How can circularity improve supply resilience?",
    ],
    color: "#666666",
    solutionIds: ["circular-value-creation"],
  },

  // ── Resilience & Adaptation ───────────────────────────────────────────────
  {
    id: "resilience-climate-risk-assessment",
    label: "Climate Risk Assessment",
    description:
      "Quantify physical and transition climate risk to assets, sites, and supply chains, and translate exposure into investment priorities.",
    questions: [
      "Which assets and sites face the greatest physical climate risk?",
      "How do we quantify financial exposure under different climate scenarios?",
      "Where should adaptation investment be prioritized?",
    ],
    color: "#1D4E89",
    solutionIds: ["resilience-adaptation"],
  },
  {
    id: "resilience-supply-chain-resilience",
    label: "Supply Chain Resilience",
    description:
      "Build supply chains that can withstand climate shocks, resource scarcity, and geopolitical disruption without sacrificing cost position.",
    questions: [
      "Where are our supply chains most exposed to climate disruption?",
      "How do we build redundancy without eroding cost competitiveness?",
      "Which suppliers need resilience support or diversification?",
    ],
    color: "#2C6CB0",
    solutionIds: ["resilience-adaptation"],
  },
  {
    id: "resilience-adaptation-investment",
    label: "Adaptation Investment Strategy",
    description:
      "Identify and evaluate adaptation technologies and infrastructure investments that protect asset value and unlock new markets.",
    questions: [
      "Which adaptation technologies offer the best risk-adjusted returns?",
      "How do we build the business case for adaptation capex?",
      "Are there new markets created by the need for adaptation?",
    ],
    color: "#3F7DC4",
    solutionIds: ["resilience-adaptation"],
  },
];

export const INDUSTRIES: Industry[] = [
  { id: "advanced-manufacturing", label: "Advanced Manufacturing & Services" },
  { id: "consumer-products", label: "Consumer Products" },
  { id: "retail", label: "Retail" },
  { id: "energy-natural-resources", label: "Energy & Natural Resources" },
  { id: "private-equity", label: "Private Equity" },
  { id: "financial-services", label: "Financial Services" },
  { id: "social-impact", label: "Social Impact" },
  { id: "cross-industry", label: "Cross-industry" },
  { id: "aerospace-defense-logistics", label: "Aerospace, Defense & Airlines and Logistics" },
  { id: "paper-packaging", label: "Paper & Packaging" },
  { id: "agribusiness", label: "Agribusiness" },
  { id: "chemicals", label: "Chemicals" },
  { id: "technology-media-telecom", label: "Technology, Media & Telecom" },
];

export const REGIONS: Region[] = [
  { id: "americas", label: "Americas" },
  { id: "emea", label: "EMEA" },
  { id: "apac", label: "APAC" },
  { id: "global", label: "Global" },
  { id: "not-specified", label: "Not specified" },
];

export const CAPABILITIES: Capability[] = [
  { id: "strategy-transformation", label: "Strategy & Transformation" },
  { id: "performance-improvement", label: "Performance Improvement" },
  { id: "customer", label: "Customer" },
  { id: "sustainability", label: "Sustainability" },
  { id: "digital-ai", label: "Digital / AI" },
  { id: "private-equity-transactions", label: "Private Equity Transactions" },
];

export const CLIENT_NEEDS: ClientNeed[] = [
  // ── Transition Strategy ──────────────────────────────────────────────────
  { id: "define-net-zero-pathway", label: "Define a credible net-zero pathway", solutionIds: ["transition-strategy"] },
  { id: "build-future-back-strategy", label: "Build a future-back sustainability strategy", solutionIds: ["transition-strategy"] },
  { id: "navigate-climate-policy", label: "Navigate climate policy and disclosure", solutionIds: ["transition-strategy"] },
  { id: "align-capital-allocation", label: "Align capital allocation to transition strategy", solutionIds: ["transition-strategy"] },
  { id: "build-transition-capabilities", label: "Build transition capabilities", solutionIds: ["transition-strategy"] },
  { id: "differentiate-through-sustainability", label: "Differentiate competitively through sustainability", solutionIds: ["transition-strategy"] },

  // ── Sustainability Value Creation ────────────────────────────────────────
  { id: "reduce-scope3-emissions", label: "Reduce Scope 3 emissions", solutionIds: ["sustainability-value-creation"] },
  { id: "win-share-with-sustainability", label: "Win share with sustainability credentials", solutionIds: ["sustainability-value-creation"] },
  { id: "commercialize-lower-carbon-products", label: "Commercialize lower-carbon products", solutionIds: ["sustainability-value-creation"] },
  { id: "engage-suppliers-on-decarbonization", label: "Engage suppliers on decarbonization", solutionIds: ["sustainability-value-creation"] },
  { id: "build-carbon-market-strategy", label: "Build a carbon market strategy", solutionIds: ["sustainability-value-creation"] },
  { id: "equip-sales-on-sustainability", label: "Equip sales teams on sustainability", solutionIds: ["sustainability-value-creation"] },

  // ── Circular Value Creation ──────────────────────────────────────────────
  { id: "scale-circular-pilots", label: "Scale circular pilots", solutionIds: ["circular-value-creation"] },
  { id: "build-circular-business-models", label: "Build circular business models", solutionIds: ["circular-value-creation"] },
  { id: "monetize-circular-offerings", label: "Monetize circular offerings", solutionIds: ["circular-value-creation"] },
  { id: "reduce-virgin-material", label: "Reduce virgin material dependency", solutionIds: ["circular-value-creation"] },
  { id: "improve-recycling-economics", label: "Improve recycling economics", solutionIds: ["circular-value-creation"] },
  { id: "build-resource-resilience", label: "Build resource resilience", solutionIds: ["circular-value-creation"] },
  { id: "extend-product-lifecycle", label: "Extend product lifecycle", solutionIds: ["circular-value-creation"] },
  { id: "monetize-waste-streams", label: "Monetize waste streams", solutionIds: ["circular-value-creation"] },
  { id: "improve-circular-supply-chains", label: "Improve circular supply chains", solutionIds: ["circular-value-creation"] },

  // ── Resilience & Adaptation ───────────────────────────────────────────────
  { id: "quantify-physical-climate-risk", label: "Quantify physical climate risk", solutionIds: ["resilience-adaptation"] },
  { id: "protect-asset-values", label: "Protect asset values from climate risk", solutionIds: ["resilience-adaptation"] },
  { id: "build-supply-chain-resilience", label: "Build supply chain resilience", solutionIds: ["resilience-adaptation"] },
  { id: "invest-in-adaptation-technology", label: "Invest in adaptation technology", solutionIds: ["resilience-adaptation"] },
  { id: "diversify-supplier-base", label: "Diversify a climate-exposed supplier base", solutionIds: ["resilience-adaptation"] },
  { id: "build-adaptation-business-case", label: "Build the business case for adaptation capex", solutionIds: ["resilience-adaptation"] },
];

export const CONTENT_TYPES = [
  { id: "case-example", label: "Case example" },
  { id: "proof-point", label: "Proof point" },
  { id: "product-offering", label: "Product or offering" },
];

export const CONFIDENTIALITY_OPTIONS = [
  { id: "public", label: "Public" },
  { id: "internal", label: "Internal" },
  { id: "anonymized-client-example", label: "Anonymized client example" },
  { id: "restricted", label: "Restricted" },
];
