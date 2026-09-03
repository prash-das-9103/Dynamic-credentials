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
 * The first six examples below carry `product: "Carbon X-ray"` — Bain's
 * proprietary carbon baselining & target-setting toolkit — and belong to
 * the Sustainability Value Creation solution (see SOLUTION_PROPRIETARY_TOOLS
 * in data/solution-page-content.ts). The remaining examples are additional
 * client engagement summaries also tagged to Sustainability Value Creation.
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
    solutionIds: ["sustainability-value-creation"],
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
    solutionIds: ["sustainability-value-creation"],
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
    solutionIds: ["sustainability-value-creation"],
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
    solutionIds: ["sustainability-value-creation"],
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
    solutionIds: ["sustainability-value-creation"],
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
    solutionIds: ["sustainability-value-creation"],
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

  {
    id: "case-nature-co-beef-supply-chain-emissions-reduction",
    pageNumber: 27,
    titleAccent: "Nature Co",
    titleRest:
      "Emissions reduction in the beef supply chain through sustainable practices and GHG reduction interventions",
    year: "2023",
    industry: "SI / ENR",
    product: "Operations Sustainability (with PI)",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Beef represents the **single largest source of greenhouse gas emissions** in the animal agriculture sector",
      },
      {
        text: "Ranchers and other key players throughout the beef supply chain have an **enormous opportunity to address some of the greatest environmental challenges** facing the world today: climate change, water supplies, and biodiversity loss",
      },
      {
        text: "Bain partnered with Nature Co to **design a model to drive greater adoption of sustainable practices along the full value chain**, design a pilot to test the model, and craft a stakeholder engagement strategy",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        bullets: [
          {
            text: "**Created a robust fact base** on the supply economics, downstream demand and barriers to change",
          },
          {
            text: "**Compiled and prioritized actions** that reduce GHG emissions by consulting top academic researchers, interviewing major companies and conducting extensive secondary research",
          },
          {
            text: "The attractiveness of each intervention was evaluated on two primary dimensions:",
            subBullets: [
              "Current feasibility, incorporating technical readiness to scale, ease of implementation, and traceability",
              "Economic viability, incorporating net cost per head and net cost trajectory",
            ],
          },
          { text: "**Designed three pilots** based on the most viable interventions" },
        ],
      },
    ],
    results: [
      { icon: "check", text: "**Established three pilots**, and set up Nature Co's team for the launch" },
      {
        icon: "check",
        text: "**Identified a 10-year full potential** for the beef cattle industry: ~20-30% methane emissions reduction and 120-250M MT CO2e",
      },
      {
        icon: "check",
        text: "**Prioritized ~20 GHG reduction / carbon sequestration interventions** based on economic viability, current feasibility and GHG impact potential to inform where Nature Co should differentially invest efforts over the next 5-10 years",
      },
      { icon: "check", text: "**Created a 5-year roadmap** focused on building scalable demonstration models" },
      { icon: "check", text: "**Articulated the ambition** of Nature Co role in the beef industry" },
      { icon: "check", text: "**Forged or strengthened relationships** with key stakeholders" },
    ],
  },

  {
    id: "case-beer-co-net-zero-logistics-brazil-mexico",
    pageNumber: 26,
    titleAccent: "Beer Co",
    titleRest: "The Future of Net Zero Logistics in Brazil and Mexico",
    year: "2024",
    industry: "CP",
    product: "Operations Sustainability (with PI)",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Beer Co is a **leading beverage manufacturer**, present across main markets globally and operating within both the alcoholic beverage category (beer) and in non-alcoholic drinks",
      },
      {
        text: "Beer Co is committed to **significantly reduce its GHG emissions** with a bold ambition to achieve **Net Zero in Scope 1+2 by 2030**",
        subBullets: [
          "Manufacturing is the biggest contributor of their Scope 1+2 carbon footprint, followed by logistics",
          "While manufacturing had a well laid out reduction roadmap, logistics still needed to trace the key initiatives and targets to reach Beer Co's NZ ambition in Scope 1+2 by 2030",
        ],
      },
      {
        text: "Beer Co needed a partner to support them to:",
        subBullets: [
          "Build a robust diagnostic of the decarbonization landscape in logistics in Brazil and Mexico and potential emission reduction levers for Beer Co",
          "Articulate plausible scenarios to reduce carbon emissions in both Beer Co's Brazil and Mexico fleets by 2030",
          "Assess and quantify key implications for Beer Co and provide an input to Beer Co's strategic plan for the following 3 years",
        ],
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        bullets: [
          {
            text: "**Interviewed** sustainability, business leaders and full executive team to **understand their positioning**",
          },
          {
            text: "Studied the Brazilian and Mexican markets to develop a **diagnosis of the current status and future trends** logistics decarbonization efforts and movements taken by players on Scopes 1+2:",
            subBullets: [
              "Legislative & Regulatory evolution",
              "Infrastructure requirements",
              "Technological breakthrough and adoption",
              "CP peers benchmark on net zero efforts",
            ],
          },
          {
            text: "Modeled **current and future-back fleet carbon emissions** for BR and MX in multiple scenarios (30, 50, 70, 90% reduction) with CAPEX/OPEX trade-off",
          },
          {
            text: "Ran **two leadership team alignment workshops** to share project learnings, hear from sustainability experts, and prioritize implications and scenarios for Beer Co",
          },
          {
            text: "Developed a **comprehensive emission reduction roadmap** for Beer Co with key initiatives and owners",
          },
        ],
      },
    ],
    results: [
      {
        icon: "badge",
        badgeValue: "#1",
        text: "Leveled executive's knowledge and fueled the discussion on Scopes 1+2 targets through an in-depth and consolidated PoV of the BR and MX markets",
      },
      {
        icon: "badge",
        badgeValue: "#2",
        text: "**Aligned key global executives** at Beer Co around main trade-offs per emission reduction scenario and implications for the company until 2030",
      },
      {
        icon: "badge",
        badgeValue: "#3",
        text: "**Provided a quantitative tool** able to simulate and project CO2 emission scenarios and CAPEX/OPEX implications",
      },
      {
        icon: "badge",
        badgeValue: "#4",
        text: "**Designed and aligned a roadmap** with initiatives summing up to **hundreds of CO2 ktons** supporting Beer Co in becoming one of the **most ambitious CP players on decarbonization**",
      },
      {
        icon: "badge",
        badgeValue: "#5",
        text: "**Provided a platform for change** in the way Beer Co plans decarbonization levers across all OpCos, globally",
      },
    ],
  },

  {
    id: "case-building-products-co-scope3-decarbonization",
    pageNumber: 24,
    titleAccent: "Building Products Co",
    titleRest: "Full Potential Scope 3 Decarbonization",
    year: "2024",
    industry: "AMS",
    product: "Operations Sustainability (with PI)",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "**Building Products Co** is an international window manufacturer with a global footprint and the **most ambitious SBTi Scope 3 target in the industry of 50% by Year 11**",
      },
      {
        text: "Building Products Co's current Scope 3 decarbonisation journey and investment plan **will not reach the target,** and seeks a plan to accelerate decarb., deliver on target, and transformation to remain industry leading",
      },
      {
        text: "After a 5-week project, Bain was engaged again for 12 weeks to support on EGM updates/ Board meetings incl. further substantiation on carbon, cost impact and complexity of initiatives to deliver full potential to make informed decisions based on **quantified trade-offs** and **realistic scenarios** for Scope 3 delivery, and **clear path towards Year 11** with a realistic **execution plan** anchored in **functional budget** and **roadmap**, and backed by a strong **operating model** and **governance** to deliver on the plan",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        bullets: [
          {
            text: "**Built option space / designed 3 different scenarios** for each key lever for achieving the target through further substantiation of decarb. potential, cost impact and complexity on **Procurement** (raw materials), **Product Design** (new & existing products), and **Operations** (logistics & indirect spend)",
            subBullets: [
              "Inspiration: Shared fact packs to stretch current ways of thinking",
              "Brainstorm: Held workshops to identify bold moves to take Building Material Co to full potential",
              "Quantification: Held working sessions to align on carbon and costs of identified bold moves, and built scenario model per stream",
            ],
          },
          {
            text: "**Recommended a plan** to significantly accelerate decarbonisation delivery based on **holistic assessment** of business case and **carbon-out potential** while balancing against other initiatives",
            subBullets: [
              "Built a central scenario model to consolidate impact of levers in each scenario",
              "Held workshop to share trade-offs and align on recommended plan",
            ],
          },
          {
            text: "Established **clear path towards Year 11** (with focus on near term) and immediate decisions to be taken",
            subBullets: [
              "Defined execution plan incl. budget implications and roadmap",
              "Defined required operating model and governance (incl. based on performed maturity assessment survey)",
            ],
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "Defined a **decarbonisation plan** delivering on SBTi Scope 3 target under certain growth assumptions",
      },
      {
        icon: "check",
        text: "**Evaluated all options** to decarbonise Scope 3 emissions incl. substantiated or identified additional levers",
      },
      {
        icon: "check",
        text: "Performed **holistic assessment** and **identified trade-offs** for evaluated options",
      },
      {
        icon: "check",
        text: "Established **clear execution roadmap** and required investments to deliver on ambition (incl. FTEs)",
      },
      { icon: "check", text: "Laid out **high level operating model and governance** requirements" },
    ],
  },

  {
    id: "case-nonprofit-co-sme-decarbonization-pilot",
    pageNumber: 30,
    titleAccent: "Non-Profit Co",
    titleRest: "SME Decarbonization Pilot",
    year: "2024",
    industry: "SI",
    product: "Scope 1, 2 Decarbonization (with PI)",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "A national **Non-Profit Co**, set out to support SMEs in accelerating their decarbonization journeys, aligning with the country's goal of net-zero emissions by 2050.",
      },
      {
        text: "Despite their economic importance, SMEs show **low uptake of sustainability initiatives** due to resource constraints and limited understanding of decarbonization.",
      },
      {
        text: "The organization aimed to **pilot a scalable decarbonization program** with targeted support and tools tailored to SME capabilities.",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        bullets: [
          {
            text: "**Surveyed SMEs** to assess current emissions baselines, barriers, and ambition levels",
          },
          {
            text: "Designed and ran a **three-sprint workshop series** for SMEs in the Food Manufacturing sector:",
            subBullets: [
              "Understand: Introduced carbon emissions concepts and established baseline.",
              "Explore: Identified decarbonization levers and pathways.",
              "Plan: Created actionable, SME-specific implementation plans.",
            ],
          },
          {
            text: "Developed a **GenAI-powered decarbonization tool** tailored to SMEs – enabling rapid, cost-effective emissions planning without requiring in-house technical expertise.",
          },
          {
            text: "Built a **comprehensive toolkit** to allow Non-Profit Co to independently scale the program across other SME segments.",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "**21 food manufacturing SMEs** participated in the pilot program",
      },
      { icon: "check", text: "Each SME set an average carbon reduction target of **~50%**" },
      {
        icon: "check",
        text: "Successfully **deployed GenAI tool** that generates tailored decarbonization pathways based on business type and emissions profile",
      },
    ],
  },

  {
    id: "case-cpg-co-truck-utilization-supply-chain-efficiencies",
    pageNumber: 25,
    titleAccent: "CPG Co",
    titleRest:
      "Identified ~25% reduction in CO2 emissions and cost baselines through enhanced truck utilization and supply chain efficiencies at CPG Co",
    year: "2024",
    industry: "CP",
    product: "Operations Sustainability (with PI)",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "CPG Co is a **snacking and pet nutrition leader** with presence in 80+ countries and global brands across a wide set of categories",
      },
      {
        text: "The company is going through **multiple challenges** impacting logistics and operational efficiencies in the wider supply chain",
      },
      {
        text: "CPG Co was looking to:",
        subBullets: [
          "Improve truck utilization by influencing customers behavior to order better (fuller trucks)",
          "Unlock the potential of double stacking",
          "Reset their trade terms",
        ],
      },
      {
        text: "The prior phase of this work focused on **reviewing present-forward benefits** and setting up the objectives and 'size of prize' across key levers.",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        heading: "Set-up market teams to pursue bettering ordering program and drive efficiencies in internal processes",
        bullets: [
          { text: "Prepared bespoke materials for each priority customer in collaboration with Sales" },
          {
            text: "**Supported initial customer discussions** including preparing negotiation scripts, conducting dry runs with teams and additional analytics required",
          },
          { text: "**Updated negotiation playbook** and strategies" },
          { text: "Validated execution resource plan and make recommendations for execution in 2024" },
        ],
      },
      {
        heading: "Developed plan to reset trade terms with sequenced timeline of activities based on point of departure in each market",
        bullets: [
          {
            text: "Develop the **incremental cost to retailer modelling** and **recommended future trade term's structure** including KPI and thresholds",
          },
          { text: "Prepared for **discussions with customers** to align on the future trade structure" },
          { text: "Outlined key steps for execution" },
        ],
      },
      {
        body: "Created a **detailed bottoms-up business case** for **unconstrained doubletracking** including modelling the impact on CO2, capex and opex cost and savings that can be realized",
        bullets: [
          {
            text: "Investigated business case requirements for 10-12 pilot SKUs, including packaging reinforcement with Bain Design to Value Lab and end-to-end investments for double stacking from factory to customer.",
          },
          {
            text: "Refined the business case by integrating insights from pilot learnings and cross-functional forums with Sales, Engineering, R&D, and Supply Chain.",
          },
        ],
      },
    ],
    results: [
      {
        icon: "badge",
        badgeValue: "~25%",
        text: "**Reduction in CO2 emissions and cost baselines** achievable in next 24-36 months",
      },
      {
        icon: "badge",
        badgeValue: "~15+",
        text: "**New tools and capabilities** were created to drive team change",
        subBullets: [
          "Established dedicated forums and charters for each initiative to ensure effective implementation governance and sustained benefits.",
        ],
      },
    ],
    footnote: "Source: Bain client case study (PI/one pager/2469)",
  },

  {
    id: "case-mining-equipment-co-procurement-strategy",
    pageNumber: 23,
    titleAccent: "Mining Equipment Co",
    titleRest: "Developed a detailed procurement strategy covering Risk, ESG & Cost and established framework for managing trade-offs",
    year: "2024",
    industry: "AMS",
    product: "Operations Sustainability (with PI)",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Mining Equipment Co is a **leading mining and construction equipment manufacturer** with customers across the globe and a strong financial performance",
      },
      {
        text: "Mining Equipment Co's supplier base was **not optimized for future footprint and customer map,** and changing external factors require Mining Equipment Co to **handle trade-offs between resilience, ESG and cost**",
      },
      {
        text: "An assessment of **current procurement set-up and strategy** for procurement 2030 including operating model was required to address Mining Equipment Co's future needs",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        bullets: [
          {
            text: "Bain worked with Mining Equipment Co on a **procurement strategy for 10 weeks** – the first step in a longer journey where the next steps would be \"Nail it\" and \"Scale it\" phases to further detail and implement the strategy",
          },
          {
            text: "The approach was **holistic**, covering risk/resiliency, ESG, cost (and associated trade-offs) – as well as operating model and enablers",
          },
          {
            text: "To solve the case, we combined **spend and carbon cube construction / analysis**, **supplier performance analysis**, **~100 client-internal interviews**, frequent client work team meetings, **3 rounds of workshops**, and external benchmarking",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "Bain helped Mining Equipment Co to outline a strategy which would **position them better across four key dimensions**",
        subBullets: [
          "Risk: Supplier base more aligned with future manufacturing footprint and customer map, limiting geopolitical risks and reducing dependency on single source suppliers",
          "ESG: As is transparency and case for change regarding upstream carbon emissions and compliance",
          "Cost: Optimized cost base and higher ability to capture synergies",
          "Enablers (incl. operating model): Key changes to procurement op model and other enablers defined to fulfil strategy",
        ],
      },
      { icon: "check", text: "Established a **framework for managing trade-offs** in daily operations" },
      {
        icon: "check",
        text: "Established a **high-level implementation plan**, with good organizational buy-in following successful category workshops",
      },
    ],
    footnote: "Source: Bain client case study (PI/one pager/2433)",
  },

  {
    id: "case-bank-co-sustainable-procurement-climate-ambition",
    pageNumber: 22,
    titleAccent: "Bank Co",
    titleRest: "Scope 3 emissions reduction roadmap",
    year: "2025",
    industry: "FS",
    product: "Operations Sustainability (with PI)",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Bank Co is a bank with **~$XX in total assets**; providing services in retail and commercial banking, wealth management, and investment services to **~XX customers globally**",
      },
      {
        text: "Bank Co has made **significant climate commitments**, reaching **Net Zero GHG emissions by 2050** and **30% reduced emissions by 2030.**",
      },
      {
        text: "The ambitions is to become **\"world-class\"** and build a **leading sustainable procurement function** which will be a key enabler on the climate journey",
      },
      {
        text: "To date, most of the effort has been focused on the \"S\" of ESG, specifically in building supplier diversity, and they are **now interested in accelerating the \"E\" portion of this journey**, specifically on carbon transition, in order to become **a leader in sustainable procurement**",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        heading: "Over 8 weeks, Bain focused on:",
        bullets: [
          { text: "Understanding Bank Co's current state of procurement maturity" },
          { text: "Defining their procurement ambition" },
          { text: "Establishing the key actions, capabilities & enablers needed to achieve their ambition." },
        ],
      },
      {
        heading: "Bain did this with a team of experts, including embedded experts (Proxima):",
        bullets: [
          {
            text: "Assessed **current Scope 3 procurement maturity** benchmarked against industry leaders & identified their **Upstream Scope 3 carbon emissions baseline** for FY0 using spend data & category-level carbon factors",
          },
          {
            text: "Defined **Procurement Climate Ambition**, ensuring it aligned with enterprise-wide Net Zero Ambitions",
          },
          {
            text: "Created a **high-level 2-year ambition roadmap** to help improve their sustainable procurement maturity & developed a detailed action plan",
          },
          {
            text: "Defined **enablers, levers & capabilities** required by Bank Co to become a leading sustainable procurement function",
          },
        ],
      },
      {
        body: "Worked closely with Bank Co's **Sustainability & Procurement stakeholders** to define Sustainable Procurement Climate Ambition and review capabilities needed to achieve these goals",
      },
    ],
    results: [
      {
        icon: "check",
        text: "**Defined Bank Co's Procurement Climate Ambition** and outlined a set of guiding principles to help deliver on the ambition, which was aligned with the broader leadership",
      },
      {
        icon: "check",
        text: "Demonstrated what **'best in class sustainable procurement'** looked like across peers and identified critical dimensions to prioritize next actions against in order to make meaningful progress toward establishing a sustainable procurement function",
      },
      {
        icon: "check",
        text: "**Identified key carbon emissions hotspots** across different categories, business units, and suppliers",
      },
      {
        icon: "check",
        text: "**Defined key capabilities** needed to establish a sustainable procurement function (e.g., people, data, partnerships & investment, etc.)",
      },
    ],
  },

  {
    id: "case-food-confectionery-co-product-carbon-footprint-strategy",
    pageNumber: 29,
    titleAccent: "Food & Confectionery Co",
    titleRest: "Product Carbon Footprint Strategy",
    year: "2026",
    industry: "CP",
    product: "Scope 1, 2 Decarbonization (with PI)",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Food & Confectionery Co is a **global confectionery manufacturer** with a strong sustainability foundation, including SBTi alignment, a defined decarbonization roadmap, and existing sustainability data partnerships to improve visibility into upstream emissions",
      },
      {
        text: "Emissions are currently managed using a **portfolio-level CO2/kg metric**, rather than category- or SKU-level PCFs, limiting the ability to provide granular product-level carbon information",
      },
      {
        text: "Retailers are **increasingly requesting category- and SKU-level PCF data** to support compliance requirements (e.g., Scope 3 reporting) and sustainability agendas, while peer companies are progressively developing product-level PCF capabilities and disclosure approaches",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        heading: "Part 1: Build the case for action - Why move to PCF now?",
        bullets: [
          { text: "Assessed retailer requirements, peer PCF maturity, and regulatory developments" },
          { text: "Evaluated risks related to confidentiality, comparability, and disclosure" },
          { text: "Defined the strategic rationale for moving toward PCFs" },
        ],
      },
      {
        heading: "Part 2: Define the PCF strategy - What PCF approach should client adopt?",
        bullets: [
          { text: "Assessed PCF design options across scope, granularity, methodology, and disclosure" },
          {
            text: "Recommended an **internally managed SKU-level cradle-to-gate PCF capacity**, combined with selective external disclosure at brand level to balance transparency and confidentiality",
          },
          {
            text: "Developed a **phased rollout roadmap** prioritizing hero products and leading brands based on demand, value, and feasibility",
          },
        ],
      },
      {
        heading: "Part 3: Define implementation and value creation - How can PCFs create value?",
        bullets: [
          {
            text: "Assessed how PCFs can strengthen retailer engagement, sustainability positioning, and joint business planning",
          },
          {
            text: "Developed a **commercial excellence framework** linking PCFs to retailer-specific value propositions and partnership opportunities",
          },
          {
            text: "Identified opportunities to use PCFs as a strategic lever for **portfolio optimization, supply chain initiatives, and broader sustainability value creation**",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "Built the **strategic rationale** (e.g., retailer demand is accelerating, peers are already moving, etc.) for PCF adoption, highlighting the **risks of inaction** and the benefits of proactively shaping retailer discussions and disclosure standards",
      },
      {
        icon: "check",
        text: "Defined a **target-state PCF approach** centered on internally managed SKU-level cradle-to-gate PCFs and selective external disclosure at brand level",
      },
      {
        icon: "check",
        text: "Developed a **phased roadmap** to scale PCFs starting with hero products and leading brands, while leveraging existing capabilities and partnerships",
      },
      {
        icon: "check",
        text: "Positioned PCFs as a **commercial differentiator** through a retailer engagement and joint business planning framework focused on **long-term value creation**",
      },
    ],
  },
];

export function getCaseExamplesForSolutions(solutionIds: string[]): CaseExample[] {
  if (solutionIds.length === 0) return CASE_EXAMPLES;
  return CASE_EXAMPLES.filter((c) => c.solutionIds.some((s) => solutionIds.includes(s)));
}
