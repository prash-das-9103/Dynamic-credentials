/**
 * data/solution-page-content.ts
 *
 * Page-local narrative content for the /solutions/[id] deep-dive pages —
 * the "client need → product" framing that appears on the printed solution
 * one-pagers. This is intentionally separate from the PRODUCTS taxonomy in
 * data/solutions.ts: the taxonomy drives filtering across the app, while
 * this content is fixed slide copy for a single narrative page per solution.
 */

import type { SolutionId } from "@/data/solution-config";

export interface SolutionNeedColumn {
  productLabel: string;
  needs: string[];
}

export const SOLUTION_NEED_COLUMNS: Partial<Record<SolutionId, SolutionNeedColumn[]>> = {
  "transition-strategy": [
    {
      productLabel: "Future-Back Strategy / 10-Year Plan",
      needs: [
        "How will global sustainability transitions disrupt my sector's profit pools and create new business opportunities?",
        "How much value is at risk, and how high is the potential value?",
        "What is the speed of the transition? Where are the tipping points?",
      ],
    },
    {
      productLabel: "Sustainable Business Building",
      needs: [
        "Which business model should I pursue to capture new profit pools?",
        "What is the new market, who are the new customers, and what do I need to change to capture it?",
      ],
    },
    {
      productLabel: "Sustainability Strategy",
      needs: [
        "How do I set the strategic course toward sustainability and profitability?",
        "Which sustainability commitments should I focus my efforts on?",
        "How do I communicate my sustainability strategy to stakeholders and the board?",
      ],
    },
    {
      productLabel: "Energy Transition",
      needs: [
        "Where should we go big on carbon transition, and where do we hold?",
        "Which clean energy and sustainable growth opportunities are worth pursuing?",
        "How should our asset strategy evolve as the energy system shifts?",
      ],
    },
    {
      productLabel: "Transition Finance",
      needs: [
        "How do we underwrite sustainability materiality and carbon exposure pre-deal?",
        "How do we build a sustainability value creation plan across the hold period?",
        "How do we benchmark and report portfolio-level carbon and ESG performance to LPs?",
      ],
    },
  ],
  "sustainability-value-creation": [
    {
      productLabel: "Carbon X-Ray",
      needs: [
        "What carbon targets maximize business value? Do historical targets still hold?",
        "Where is the value? (i.e., cost, revenue, investor multiple)",
        "Which levers have the highest ROI and how should they be sequenced?",
        "How do we implement through the business?",
      ],
    },
    {
      productLabel: "Sustainability B2B ComEx",
      needs: [
        "Which customers will value our sustainable offering and why?",
        "What value proposition would effectively address their customer needs?",
        "How can our sales force be more effective?",
        "How can we capture commercial upside? (e.g., price premium, share gain, retention)",
      ],
    },
    {
      productLabel: "Sustainable Procurement / Supply Chain Decarbonization",
      needs: [
        "What is our business case for a lower carbon supply chain? What targets should I set?",
        "What are our biggest sources of emissions?",
        "Which levers are highest ROI to cut both cost and carbon?",
        "How do we collaborate with suppliers to achieve results?",
      ],
    },
  ],
  "resilience-adaptation": [
    {
      productLabel: "Protect & grow asset values",
      needs: [
        "How should we allocate investment across acquisitions, divestments, and retrofits considering climate risk?",
        "How can we deploy CAPEX for both rapid ROI and asset resilience?",
      ],
    },
    {
      productLabel: "Build resilient supply chain",
      needs: [
        "Where is the greatest value at risk across our supply chain?",
        "What can we do to mitigate disruption without inflating cost or complexity?",
        "How do we embed resilience into sourcing, logistics, and inventory strategy?",
      ],
    },
    {
      productLabel: "Secure & future-proof resource strategy",
      needs: [
        "Which critical resources are most exposed?",
        "What upstream interventions can stabilize cost and secure inputs?",
        "Where can strategic sourcing or circular models create a long-term edge?",
      ],
    },
    {
      productLabel: "Invest in climate adaptation technologies",
      needs: [
        "Where are the most attractive adaptation themes and technologies to invest behind?",
        "How can we build or scale ventures that capture value from the adaptation economy?",
      ],
    },
  ],
  "circular-value-creation": [
    {
      productLabel: "Circular Full Potential",
      needs: [
        "How can we amplify? We have been working on circular pilots for years, yet we don't succeed to scale up.",
        "How can we capture more value pools? We have 5% circular revenues, less than competitors.",
      ],
    },
    {
      productLabel: "Circular Offer Strategy",
      needs: [
        "How can we seize growing circular materials market? (e.g. recycled content-rich packaging, plastics, metals)",
        "How can we set-up new circular business models and monetize them?",
      ],
    },
    {
      productLabel: "Circular Services Boost",
      needs: [
        "How can we maximize our assets lifecycle value?",
        "How can we capture value throughout our products' lifetimes, beyond current services scope. Which partnerships?",
      ],
    },
    {
      productLabel: "Circular Resources Strategy",
      needs: [
        "How can we build resource resilience in a world with new resource constrains (e.g. tariffs, geopolitics)?",
        "How can we maximize resource efficiency and monetization of all waste?",
      ],
    },
  ],
};

export interface ProprietaryTool {
  name: string;
  description: string;
}

/**
 * Bain-owned proprietary tools called out on a solution's practice-on-a-page
 * slide, distinct from third-party ecosystem partners in data/partners.ts.
 */
export const SOLUTION_PROPRIETARY_TOOLS: Partial<Record<SolutionId, ProprietaryTool[]>> = {
  "resilience-adaptation": [
    {
      name: "Resilience-IQ",
      description: "AI-powered climate resilience & adaptation platform.",
    },
    {
      name: "Agri-commodity Risk Intelligence",
      description:
        "Science-backed, country-level climate impacts on scenario-specific yield developments.",
    },
    {
      name: "Resilience Lever Toolkit",
      description: "~100 sector-specific, strategic mitigation and value creation levers.",
    },
  ],
};
