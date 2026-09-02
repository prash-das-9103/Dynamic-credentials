/**
 * data/case-examples.ts
 *
 * "Case Example" slides — full-fidelity recreations of client engagement
 * summary slides (Situation / What We Did / Results), the format Bain uses
 * to demonstrate credentials for a named proprietary tool or methodology.
 * Distinct from data/reference-slides.ts (a different source deck, a
 * different slide template) and from data/credentials.ts (the terse,
 * card-style credential entries used elsewhere in the app) — this file
 * backs the pixel-accurate slide exhibits rendered by
 * components/solutions/CaseExampleSlide.tsx.
 *
 * All six examples below carry `product: "Carbon X-ray"` — Bain's
 * proprietary carbon baselining & target-setting toolkit — and belong to
 * the Transition Strategy solution (see SOLUTION_PROPRIETARY_TOOLS in
 * data/solution-page-content.ts).
 */

/** A bullet line; `text` may contain `**bold**` spans. */
export interface RichBullet {
  text: string;
  subBullets?: string[];
}

export interface DualBarChartSpec {
  kind: "dual-bar";
  charts: {
    title: string;
    years: string[];
    /** Relative heights (0–1), illustrative — the source slide carries no axis values. */
    values: number[];
  }[];
}

export interface BridgeChartSpec {
  kind: "bridge";
  /** First column — the inertial/starting bar. */
  startLabel: string;
  /** Last column — the target bar. */
  endLabel: string;
  /** Intermediate levers; positive = builds up toward target, negative = draws down. */
  steps: { label: string; delta: number }[];
}

export type ChartSpec = DualBarChartSpec | BridgeChartSpec;

export interface WhatWeDidBlock {
  /** Bold mini-heading with a red underline rule, e.g. "Baseline". */
  heading?: string;
  /** Paragraph copy; may contain `**bold**` spans. */
  body?: string;
  /** Flat bullet list (used where the source has no mini-headings). */
  bullets?: RichBullet[];
  chart?: ChartSpec;
}

export interface ResultItem {
  icon: "check" | "flag" | "badge";
  /** For icon="badge" — the big red figure, e.g. "63%", "67+%". */
  badgeValue?: string;
  /** Rich text; may contain `**bold**` spans. */
  text: string;
  subBullets?: string[];
}

export interface CaseExample {
  id: string;
  pageNumber: number;
  /** Red portion of the title, e.g. "Pharma Co". */
  titleAccent: string;
  /** Black portion of the title, e.g. "Decarbonization Strategy". */
  titleRest: string;
  year: string;
  industry: string;
  product: string;
  situation: RichBullet[];
  /** "WHAT WE DID" vs "WHAT BAIN DID" — the source alternates between the two. */
  whatWeDidHeading: string;
  whatWeDid: WhatWeDidBlock[];
  results: ResultItem[];
  footnote?: string;
  /** Solution IDs this example demonstrates — see data/solutions.ts SOLUTIONS. */
  solutionIds: string[];
}

export const CASE_EXAMPLES: CaseExample[] = [
  {
    id: "case-pharma-co-decarbonization-strategy",
    pageNumber: 18,
    titleAccent: "Pharma Co",
    titleRest: "Decarbonization Strategy",
    year: "2025",
    industry: "HLS",
    product: "Carbon X-ray",
    solutionIds: ["transition-strategy"],
    situation: [
      {
        text: "Pharma Co was facing a **challenging decarbonization agenda**, driven by accelerating client expectations, evolving regulatory pressure and increasing peer commitments to science-based targets",
      },
      {
        text: "The client was **exploring a potential commitment to the Science Based Targets initiative (SBTi)** and required clarity on feasibility, timing, financial implications and risk mitigation options across both near-term and long-term horizons",
      },
      {
        text: "Internally, **decarbonization initiatives existed but lacked a prioritized, integrated roadmap** linking emissions impact, economics, operational feasibility and governance",
      },
    ],
    whatWeDidHeading: "WHAT WE DID",
    whatWeDid: [
      {
        heading: "Baseline",
        body: "Development of a granular emissions baseline and forward projections, incorporating business growth, asset evolution and regulatory scenarios to quantify the abatement gap v. '35 targets",
        chart: {
          kind: "dual-bar",
          charts: [
            { title: "Scope 1&2", years: ["2023", "2024", "2028", "2030", "2035"], values: [0.32, 0.22, 0.38, 0.5, 0.7] },
            { title: "Scope 3", years: ["2023", "2024", "2028", "2030", "2035"], values: [0.55, 0.58, 0.62, 0.68, 0.78] },
          ],
        },
      },
      {
        heading: "Decarbo-initiatives short-list",
        body: "Definition, sizing and prioritization of decarbo-levers through a merit-order approach (i.e., CO2 abatement potential, Capex and Opex, market & technical readiness, execution risks and timing)",
        chart: {
          kind: "bridge",
          startLabel: "'35 inertial",
          endLabel: "'35 target",
          steps: [
            { label: "GOs", delta: 0.55 },
            { label: "Biogenic\nsolvents\n(w1)", delta: -0.28 },
            { label: "EE", delta: -0.18 },
            { label: "Biometh.", delta: -0.35 },
            { label: "Biogenic\nsolvents\n(w2)", delta: -0.22 },
            { label: "CCS", delta: -0.42 },
          ],
        },
      },
      {
        heading: "Execution roadmap",
        body: "Integrated decarbonization pathway structured in two waves (to 2030 and to 2035), complemented by sensitivity scenarios",
      },
    ],
    results: [
      { icon: "flag", text: "**Commitment to SBTi approved** by Pharma Co's BoD" },
      {
        icon: "badge",
        badgeValue: "63%",
        text: "**Scope 1&2 emissions reduction** by 2035 v. baseline (i.e., reduction of 150-160 ktons of CO2)",
      },
      {
        icon: "badge",
        badgeValue: "67+%",
        text: "**Scope 3 emissions with SBTi target** by 2030 (i.e., Supplier Engagement method on categories 1, 3 and 5)",
      },
    ],
  },

  {
    id: "case-bank-co-financed-emission-carbon-baselining",
    pageNumber: 17,
    titleAccent: "Bank Co",
    titleRest: "Financed Emission Carbon Baselining",
    year: "2025",
    industry: "FS",
    product: "Carbon X-ray",
    solutionIds: ["transition-strategy"],
    situation: [
      {
        text: "After committing to **NZBA** in 20XX, Bank Co recalculated its portfolio carbon baseline annually, tracked progress against target pathways, disclosed financed emissions through CDP and integrated annual reporting",
      },
      {
        text: "The client needed support with calculation of:",
        subBullets: [
          "Portfolio financed emissions",
          "Sector-specific financed emissions",
          "Carbon emission intensity",
          "Progress against the target pathway",
        ],
      },
      { text: "Bank Co also sought to understand the drivers behind year-on-year changes" },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        bullets: [
          { text: "Bain supported **Bank Co** in developing carbon baselining and analytics framework" },
          {
            text: "Applied Bain's **carbon baselining toolkit** combining a top-down portfolio calculation approach with sector-specific (SDA) models",
          },
          {
            text: "Calculated:",
            subBullets: [
              "Portfolio-level financed emissions",
              "Sector-specific financed emissions and carbon intensity metrics",
              "Year-on-year comparisons against target pathways",
            ],
          },
          { text: "Consolidated **portfolio and sector-level calculations** to improve overall accuracy" },
          {
            text: "Developed a **decomposition model** to isolate key drivers of change, including:",
            subBullets: [
              "Loan book growth",
              "Sectoral and macroeconomic dynamics",
              "Changes in underlying company-level sustainability performance",
            ],
          },
          {
            text: "Conducted **deep-dives across 8 priority sectors** to improve granularity and align top-down and bottom-up results",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "**Calculated portfolio carbon baseline** and ready for CDP submission and inclusion in integrated annual reporting",
      },
      { icon: "check", text: "**Established sector-level emissions** and intensity metrics" },
      {
        icon: "check",
        text: "**Assessed Progress vs. NZBA-aligned targets**, including year-on-year comparisons",
      },
      {
        icon: "check",
        text: "**Completed driver decomposition of emissions changes**, isolating impacts from portfolio mix, macro shifts, and client performance",
      },
      {
        icon: "check",
        text: "**Discussed potential next-step actions** to address structural drivers underlying emissions changes",
      },
    ],
  },

  {
    id: "case-bank-co-portfolio-decarbonization-net-zero",
    pageNumber: 19,
    titleAccent: "Bank Co",
    titleRest: "Portfolio Decarbonization to achieve Net Zero",
    year: "2024",
    industry: "FS",
    product: "Carbon X-ray",
    solutionIds: ["transition-strategy"],
    situation: [
      {
        text: "Turkey-based Bank Co is committed to **supporting Türkiye's climate transition** and is a signatory of the **Net Zero Banking Alliance (NZBA)**",
      },
      {
        text: "Bank Co needs support with **setting and disclosing decarbonization targets** for its lending portfolios, focusing on **four carbon intensive sectors** — Oil & Gas, Real Estate, Aluminum, and Agriculture",
      },
      {
        text: "**Challenges**: Fragmented nature of the Real Estate and Agriculture sectors with low emission reporting and complex emission tracking requirements across the sectors presents a unique challenge in target-setting",
      },
      {
        text: "Bank Co recently released decarbonization targets for **4 sectors** — Power Generation, Iron & Steel, Cement, and Coal",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        heading: "Emissions Measurement:",
        body: "Utilized GHG Protocol Guidelines and PCAF¹ methodology to establish baseline emissions for Oil & Gas, Real Estate, Aluminum, and Agriculture sectors within the lending portfolio.",
      },
      {
        heading: "Sector-Specific Decarbonization Levers:",
        bullets: [
          { text: "Identified effective transition levers unique to each sector." },
          {
            text: "Conducted a market sizing exercise to determine Bank Co's potential financing share in each lever.",
          },
        ],
      },
      {
        heading: "Financial and Emission Impact Modeling:",
        bullets: [
          {
            text: "Integrated market sizing with reference pathways (IEA, SBTi, TPI) to model financial and emissions impacts of selected levers.",
          },
          { text: "Projected emissions reduction potential, effects on loan balances, and net banking income." },
        ],
      },
      {
        heading: "Documentation and Process:",
        bullets: [
          { text: "Developed detailed process documentation to enable internal reproducibility." },
          { text: "Suggested team roles for baselining, impact modeling, target setting, and reporting." },
        ],
      },
      {
        heading: "Transition Plan Disclosure Preparation:",
        bullets: [
          { text: "Analyzed standard-setter (SBTi, etc.) disclosure requirements." },
          { text: "Benchmarked peer banks for level of detail in transition plan disclosures." },
          {
            text: "Crafted a disclosure report for Bank Co, aligning with industry expectations and peer benchmarks.",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "**Baseline Emissions**: Established baselines for Oil & Gas, Real Estate, Aluminum, and Agriculture sectors.",
      },
      {
        icon: "check",
        text: "**Sector-Specific Pathways**: Developed transition pathways with emissions intensity reduction targets for each sector.",
      },
      {
        icon: "check",
        text: "Created a comprehensive **Transition Plan Disclosure Report** meeting industry standards and peer practices.",
      },
      {
        icon: "check",
        text: "**Sustained Process**: Recommended organizational roles to support continuous baselining, impact modelling, target setting, and disclosure for future.",
      },
    ],
    footnote: "Note: (1) PCAF – Partnership for Carbon Accounting Financials",
  },

  {
    id: "case-bank-co-financed-emissions-decarbonization-pathways",
    pageNumber: 15,
    titleAccent: "Bank Co",
    titleRest: "Financed Emissions and Decarbonization Pathways",
    year: "2026",
    industry: "FS",
    product: "Carbon X-ray",
    solutionIds: ["transition-strategy"],
    situation: [
      {
        text: "Bank Co, a leading KSA bank, committed to **Net Zero financed emissions** by 20XX, aligned with Vision 2030 and the Kingdom's transition agenda",
      },
      {
        text: "Financed emissions represent **>95% of a bank's footprint** — central to climate strategy, risk management, and transition-finance origination",
      },
      {
        text: "Bain was engaged to design the **full net zero architecture** — baseline, sector pathways, transition finance, and governance",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        bullets: [
          {
            text: "The team ran a **9-week engagement** with teams across Corporate and Retail banking, Treasury, Risk, COO and IT/Data",
          },
          { text: "Built a **Net Zero transition framework** (7 sections, 5 delivery pillars)" },
          {
            text: "Documented PCAF-aligned methodology, data sources, and assumptions to **calculate the portfolio-wide financed emissions baseline**",
          },
          {
            text: "Prioritized **7 key sectors** (O&G, power, automotive, aviation, CRE, mortgage, sovereign): **defined sector boundaries, calculated baseline and identified decarbonization levers and setting interim targets**",
          },
          {
            text: "Sized sector **transition-finance opportunities** and designed a **governance and operating model** with a 12-month roadmap",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "Delivered a **portfolio-wide financed emissions baseline**, giving a clear view of where climate impact concentrates across sectors and asset classes",
      },
      {
        icon: "check",
        text: "Established **sector-level decarbonization pathways** with interim targets, benchmarked to recognized international reference scenarios",
      },
      {
        icon: "check",
        text: "Identified **transition-finance opportunities** linked to sector decarbonization needs",
      },
      {
        icon: "check",
        text: "Handed over a **repeatable governance and operating model** that embeds financed emissions into business processes — positioning Bank Co for future disclosure on its own terms",
      },
    ],
  },

  {
    id: "case-renewables-co-net-zero-strategy-2040",
    pageNumber: 20,
    titleAccent: "Renewables Co",
    titleRest: "Net Zero Strategy 2040 with feasibility assessment and emission baseline estimates",
    year: "2023",
    industry: "ENR",
    product: "Carbon X-ray",
    solutionIds: ["transition-strategy"],
    situation: [
      {
        text: "Renewables Co is the renewable business unit of an **oil and gas company**, mainly focused on offshore wind (OFW) but increasingly also onshore wind, solar, and battery storage",
      },
      {
        text: "To remain competitive and obtain favorable funding, **Renewables Co asked Bain to help articulate and pressure test a Net Zero strategy** towards 2040",
      },
      {
        text: "Further, the client asked Bain to **support with a high-level feasibility assessment** of pathway to Net Zero",
      },
      { text: "Lastly, Bain supported in **creating memos** for the Board of Directors along with supporting pages" },
    ],
    whatWeDidHeading: "WHAT WE DID",
    whatWeDid: [
      {
        bullets: [
          {
            text: "Bain **provided high-level guidance on how to set a Net Zero pathway** aligned to SBTi, including different emission estimation methods and decisions to make when setting the right baseline year",
          },
          {
            text: "Over a short sprint, Bain supported in **directional pressure testing the emissions estimated by the client**, provided **directional estimates for baseline emission calculations** over several years and methodologies, **supported in assessing the feasibility of the Net Zero pathway to 2040,** and outlined various **emission abatement levers** for the client to reach the target",
          },
          {
            text: "Bain further **outlined the path forward to a more robust Net Zero pathway** with detailed emission baseline estimates",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "Bain pressure **tested the existing emission estimates** from the client, highlighting several improvement areas",
      },
      {
        icon: "check",
        text: "Detailed **why a robust Net Zero strategy** is critical for renewable energy players and that it requires significant effort to estimate",
      },
      {
        icon: "check",
        text: "Supported in **creating high-level emission baseline estimates** across methodologies and years to highlight the impact of choosing the right baseline year",
      },
      {
        icon: "check",
        text: "Created an overview of what it would require in emission reductions to reach Net Zero, including a **high-level overview of emission reduction levers**",
      },
    ],
    footnote: "Note: SBTi - Science Based Targets initiative",
  },

  {
    id: "case-oil-gas-co-ghg-target-setting",
    pageNumber: 16,
    titleAccent: "Oil & Gas Co",
    titleRest: "GHG Target Setting",
    year: "2025",
    industry: "ENR",
    product: "Carbon X-ray",
    solutionIds: ["transition-strategy"],
    situation: [
      {
        text: "Oil and Gas Co, a multinational upstream Oil & Gas company, **missed its 2024/2025 emissions targets**",
      },
      {
        text: "It prompted **renewed focus on setting 2030 interim public target** for **scope 1 & 2 emissions**",
      },
      {
        text: "Bain was engaged to **help set their 2030 interim target** that:",
        subBullets: [
          "Reinforces the client's positioning as a **climate leader** while mitigating regulatory and investor risks",
          "Balances **ambition, delivery credibility, and value creation**",
        ],
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        body: "Bain helped benchmark client performance against peers, validate and build upon the current MAC (marginal abatement cost) approach, **explore target-setting options**, and recommend a credible, stakeholder-resonant 2030 target",
      },
      {
        heading: "Developed a target-setting \"action plan\" for the client, focused on five core elements:",
        bullets: [
          { text: "Benchmarking against industry peers" },
          { text: "Target structure alternatives (full company vs oil & gas operations, absolute vs intensity)" },
          { text: "Target feasibility validation" },
          { text: "Recommendation finalization & external positioning" },
          { text: "Internal operating model recommendations for implementation" },
        ],
      },
      {
        heading: "Used a triangulated approach to recommend % reduction target:",
        bullets: [
          {
            text: "**Top-down**: Continued historical intensity reduction trajectory (2019–2024) till 2030",
          },
          {
            text: "**Peer benchmarking**: Compared target ambitions and upstream intensity levels of peers (now vs. expected), particularly U.S. counterparts",
          },
          {
            text: "**Bottom-up**: Estimated reductions from abatement initiatives identified by the business, supplemented with applying similar projects across assets & cost alignment",
          },
        ],
      },
      {
        body: "Updated **MACC and decarbonization pathway** based on bottom-up inputs, finalizing the % intensity reduction potential from 2019 to 2030",
      },
      {
        body: "Suggested mechanisms to **embed the target in ongoing planning and performance reviews** to ensure sustained focus and accountability",
      },
    ],
    results: [
      {
        icon: "check",
        text: "**Suggested an external target** to cut scope 1 & 2 CO2e emissions intensity by XX% by 2030 (vs. 2019 baseline), with an internal ambition of XX + 5% to provide a delivery buffer and support climate leadership",
      },
      {
        icon: "check",
        text: "**Identified optimization opportunities** to enhance the cost-effectiveness of decarbonization; recommended cross-asset sharing of best practices to reduce costs further",
      },
      {
        icon: "check",
        text: "**Recommended additional abatement initiatives** based on internal and external benchmarking, to be applied to the client's emission intensive assets",
      },
      {
        icon: "check",
        text: "**Proposed revamping internal processes** by:",
        subBullets: [
          "Establishing central governance to cascade targets and track progress",
          "Embedding carbon into business objectives, KPIs, and incentives",
          "Establishing an internal carbon price",
        ],
      },
    ],
  },
];

export function getCaseExamplesForSolutions(solutionIds: string[]): CaseExample[] {
  if (solutionIds.length === 0) return CASE_EXAMPLES;
  return CASE_EXAMPLES.filter((c) => c.solutionIds.some((s) => solutionIds.includes(s)));
}
