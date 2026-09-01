/**
 * data/practice-areas.ts
 *
 * "Practice areas" are named sub-solutions inside Transition Strategy —
 * Energy Transition and Transition Finance — each with their own
 * ecosystem partnerships, IP/coalitions, and expert roster, sourced from
 * the practice-on-a-page slide decks (Slide 8 and Slide 12).
 *
 * This is curated slide content, not a tag-filtered view: the copy below
 * (tool descriptions, coalition names, expert captions) is transcribed
 * from the source slides, distinct from the general Partner/Expert
 * directory records it links to by id where a match exists.
 */

export type PracticeAreaId = "energy-transition" | "transition-finance";

export interface PracticeAreaTool {
  /** Links to a real Partner record in data/partners.ts, when one exists. */
  partnerId?: string;
  name: string;
  description: string;
}

export interface PracticeAreaCapability {
  icon: "globe" | "factory" | "trending-up" | "shuffle";
  label: string;
}

export interface PracticeAreaExpert {
  /** Links to a real Expert record in data/experts.ts. */
  expertId: string;
  name: string;
  title: string;
  caption: string;
}

export interface PracticeAreaIp {
  title: string;
}

export interface PracticeArea {
  id: PracticeAreaId;
  parentSolutionId: "transition-strategy";
  name: string;
  heroImageSrc: string;
  heroImageAlt: string;
  /** Transition Finance only — the deal lifecycle the tools plug into. */
  processSteps?: string[];
  tools: PracticeAreaTool[];
  /** Energy Transition only — the four Intersect capability pillars. */
  capabilities?: PracticeAreaCapability[];
  ipItems: PracticeAreaIp[];
  coalitions: string[];
  specialCallout?: { badge: string; description: string };
  experts: PracticeAreaExpert[];
  sourceSlides: number[];
}

export const PRACTICE_AREAS: PracticeArea[] = [
  {
    id: "energy-transition",
    parentSolutionId: "transition-strategy",
    name: "Energy Transition",
    heroImageSrc: "/images/practice-energy-transition.png",
    heroImageAlt: "Industrial smokestacks silhouetted against a dusk sky",
    tools: [
      {
        name: "Intersect",
        description:
          "Bain's proprietary energy transition modeling solution, which assesses a vast array of energy transition-related risks and opportunities. Intersect can help clients uncover sustainability strategies and identify where to go big.",
      },
    ],
    capabilities: [
      { icon: "globe", label: "Systematic Global View" },
      { icon: "factory", label: "Carbon Transition" },
      { icon: "trending-up", label: "Sustainable Growth Opportunities" },
      { icon: "shuffle", label: "Asset Strategies" },
    ],
    ipItems: [
      { title: "Renewable Fuels: Seizing the Generational Opportunity" },
      { title: "Energy Executive Agenda 2025: New Challenges, New Innovations" },
      { title: "Fueling the Future: How Business, Finance and Policy Can Accelerate the Clean Fuels Market" },
      { title: "Sustainable Development: Beyond Regulatory Compliance, Leadership and Sustainability" },
      { title: "Renewable Fuels — Preparing for the Next Leap" },
    ],
    coalitions: [],
    experts: [
      {
        expertId: "expert-cate-hight",
        name: "Cate Hight",
        title: "Expert Partner",
        caption: "Deep expertise industrial emissions, climate negotiations and regulation",
      },
      {
        expertId: "expert-james-nixon",
        name: "James Nixon",
        title: "Expert Partner",
        caption: "Deep expertise in clean energy transition",
      },
      {
        expertId: "expert-brian-murphy",
        name: "Brian Murphy",
        title: "Partner",
        caption: "Experience in sustainability in upstream oil, gas and mining",
      },
      {
        expertId: "expert-grant-dougans",
        name: "Grant Dougans",
        title: "Partner",
        caption: "Deep expert in all aspects of power generation",
      },
      {
        expertId: "expert-emily-emmett",
        name: "Emily Emmett",
        title: "Partner",
        caption: "Senior leader in Energy & Natural Resources practice",
      },
      {
        expertId: "expert-alessandro-cadei",
        name: "Alessandro Cadei",
        title: "Partner",
        caption: "Senior leader in Energy & Natural Resources practice",
      },
    ],
    sourceSlides: [8],
  },
  {
    id: "transition-finance",
    parentSolutionId: "transition-strategy",
    name: "Transition Finance",
    heroImageSrc: "/images/practice-transition-finance.png",
    heroImageAlt: "Close-up of stacked gold and silver coins",
    processSteps: [
      "Fund strategy",
      "Deal generation & diligence",
      "Value creation plan",
      "Ongoing sustainability monitoring",
      "Exit",
    ],
    tools: [
      {
        partnerId: "partner-ecovadis",
        name: "EcoVadis",
        description:
          "Sustainability materiality by sectors, company-specific sustainability data & benchmarks, sustainability ratings including improvement levers for pre-sale support/vendor DD.",
      },
      {
        partnerId: "partner-persefoni",
        name: "Persefoni",
        description:
          "Carbon intensity of sectors or portfolio emissions baselining, carbon foot-printing of targets (by activity with tracking), industry benchmarks.",
      },
    ],
    ipItems: [
      { title: "Private Markets' Quiet Progress on Decarbonization" },
      { title: "Decarbonization That Works: Five Key Actions in Private Equity" },
      { title: "Sustainability Value Creation Council" },
    ],
    coalitions: ["GFANZ Asia", "PE Sustainable Markets Initiative Task Force (PESMIT)", "ILPA", "Level 20", "IIR", "IACPM"],
    specialCallout: {
      badge: "Dry Powder",
      description: "2-part series: Sustainability at the tipping point",
    },
    experts: [
      {
        expertId: "expert-marc-lino",
        name: "Marc Lino",
        title: "Partner",
        caption: "Global Lead of Sustainable Investing",
      },
      {
        expertId: "expert-christian-graf",
        name: "Christian Graf",
        title: "Partner",
        caption: "Global leader for Decarbonization in Financial Services",
      },
      {
        expertId: "expert-david-hoverman",
        name: "David Hoverman",
        title: "Partner",
        caption: "Deep expert in climate fund strategy and climate investing",
      },
      {
        expertId: "expert-michael-kochan",
        name: "Michael Kochan",
        title: "Partner",
        caption: "Interlock Champion of Financial Services x Sustainability",
      },
      {
        expertId: "expert-matt-stolper",
        name: "Matt Stolper",
        title: "Partner",
        caption: "Interlock Champion of Financial Services x Sustainability",
      },
      {
        expertId: "expert-yang-liu",
        name: "Yang Liu",
        title: "Expert Partner",
        caption: "Expertise in Sustainable Finance",
      },
      {
        expertId: "expert-rafael-lam",
        name: "Rafael Lam",
        title: "Partner",
        caption: "Interlock Champion of Financial Services x Sustainability",
      },
    ],
    sourceSlides: [12],
  },
];

export function getPracticeAreasForSolution(solutionId: string): PracticeArea[] {
  return PRACTICE_AREAS.filter((p) => p.parentSolutionId === solutionId);
}
