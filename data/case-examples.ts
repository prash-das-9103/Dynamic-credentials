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

  {
    id: "case-beauty-co-embedding-sustainability-commercial-excellence",
    pageNumber: 32,
    titleAccent: "Beauty Co",
    titleRest: "Embedding Sustainability into Commercial Excellence",
    year: "2026",
    industry: "CP",
    product: "Sustainability Commercial Excellence (with Customer)",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "**Beauty Co** is a multinational personal care company operating across cosmetics, haircare, and fragrance, leveraging **sustainability as a core value-creation driver** with retailers",
      },
      {
        text: "The company sought to **embed sustainability more systematically into commercial operations and KAM¹** to drive joint value creation. However, **execution varied significantly** across markets and customers, with limited standardization, measurable impact, and retailer-specific tailoring",
      },
      {
        text: "Bain was engaged to **strengthen customer centricity and commercial impact,** identifying concrete opportunities to standardize and elevate sustainability-led negotiations",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        body: "The case was set-up with two key areas of analysis:",
      },
      {
        heading: "1. Outside-in benchmarking of sustainability strategy, priorities, and initiatives of Beauty Co top 10 retailers, leveraging on Bain center of excellence. This included details on retailer's sustainability ambition, targets, initiatives, activities, sustainability labelling",
        bullets: [
          {
            text: "Retailers' sustainability priorities were then compared to Beauty Co's sustainability agenda to provide a \"**cheat sheet**\" for the commercial teams to base negotiations",
          },
        ],
      },
      {
        heading: "2. Linked commercial priorities and sustainability priorities of each of the retailer with relevant sustainability actions",
      },
      {
        heading: "3. Interviews with ~15 members of Beauty Co commercial teams (KAMs, commercial directors, sustainability business leads, etc.) to complement outside in benchmarking, and collect insights on current best practices / improvement points for embedding sustainability in KAM",
      },
    ],
    results: [
      {
        icon: "check",
        text: "Identified **sustainability priorities** of top 10 retailers **around key pillars** relevant and coherent with Beauty Co priority areas",
      },
      {
        icon: "check",
        text: "Identified **key Beauty Co sustainability initiatives** per retailer based on the link between the specific retailer's commercial and sustainability priorities",
      },
      {
        icon: "check",
        text: "Provided a **diagnostic of current KAM and sustainability processes**, identifying **four key improvement areas**:",
        subBullets: [
          "Build compelling narrative to sustainability initiatives backed up with KPIs (e.g., repurchase rate for refill)",
          "Include Sust JBP² as part of main JBP and have commercial KPIs on Sust JBP (e.g., basket size on labelled products)",
          "Equip KAMs with tools to simplify data sharing with retailers, to get more recognition for our sustainability impact",
          "Set up feedback loops to further tailor SKUs³ to requirements of retailers (e.g., to obtain labelling)",
        ],
      },
    ],
    footnote: "Note: (1) KAM – Key Account Management; (2) JBP – Joint Business Plan; (3) SKU – Stock Keeping Unit",
  },

  {
    id: "case-chemical-co-sustainability-focused-sales-plays",
    pageNumber: 33,
    titleAccent: "Chemical Co",
    titleRest: "Sustainability Focused Sales Plays",
    year: "2025",
    industry: "ENR",
    product: "Sustainability Commercial Excellence (with Customer)",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Chemical Co is a leader in sustainability and has made major investments in circularity – focusing on chemical recycling for hard-to-recycle plastics",
      },
      {
        text: "To accelerate their Commercial Excellence, Chemical Co needed to **develop sales plays for their key segments, closely track their pipeline, and improve their market activation plans for top opportunities**",
      },
      {
        text: "Chemical Co faced strong headwinds as **demand for sustainable products was muted** by challenging market conditions (tariffs, inflation, etc.) – which required an assessment of their \"where to play\" choices and support in scaling **sales plays** across the BU",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        bullets: [
          { text: "Conducted an **initial diagnostic to validate and refine \"where to play\" choices** for recycled offerings" },
          { text: "Developed multiple **end-to-end sales plays and a cold outreach playbook**" },
          { text: "Reset the **sales pipeline,** aligning on clear guidance to determine the true stage of each opportunity" },
          {
            text: "Supported **improvements to sales routines and accountability** (win rooms, Salesforce discipline, priority sales opportunity action plans, account plans, etc.)",
          },
          {
            text: "Held **executive workshops** to identify priority projects for sales play implementation across the broader Business Unit (beyond recycled offerings)",
          },
          {
            text: "Implemented **sales play capability** across the BU and developed ongoing routines to drive accountability, synthesize market insights, and review and adjust",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "Launched **multiple sales plays for sustainable offerings** in both packaging and durables applications",
      },
      {
        icon: "check",
        text: "Identified **areas of improvements and key levers to instill sales discipline** in support of achieving revenue growth goals",
      },
      {
        icon: "check",
        text: "Implemented **routines to track and accelerate progress** with priority sales opportunities",
      },
      {
        icon: "check",
        text: "Built **visibility into progress of sales opportunities** within the funnel, nearly tripling the size of the business",
      },
      {
        icon: "check",
        text: "**Stood up sales play capability and routines** and kickstarted rollout with more than 10 projects",
      },
      {
        icon: "check",
        text: "**Developed six sales plays trainings** across Specialty Plastics division, focused on Marketing, Sales, Technology, and MarCom audiences",
      },
    ],
  },

  {
    id: "case-paper-packaging-co-value-based-sales-plays",
    pageNumber: 34,
    titleAccent: "Paper & Packaging Co",
    titleRest: "Value-based sales plays to unlock new growth",
    year: "2025",
    industry: "AMS",
    product: "Sustainability Commercial Excellence (with Customer)",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Bain supported an international **Paper & Packaging Co** operating in a **declining market**, with **slow business momentum**, limited sales-hunting capability, and growth dependent on winning new customer segments",
      },
      {
        text: "Bain engaged with client to:",
        subBullets: [
          "Confirm key **growth priorities**",
          "**Obtain new volumes for 2026**",
          "**Establish a sense of urgency** in the organisation",
          "**Set foundation for med-term growth**",
        ],
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        bullets: [
          { text: "Quickly **diagnosed key growth areas**" },
          {
            text: "**Mobilized cross-functional teams to \"hunt volumes\"** by closer collaboration and quick roadblocks resolution",
          },
          { text: "Developed **plans for priority accounts and key growth region**" },
          { text: "Launched **value-based sales plays**" },
          { text: "Transformed how they **approach C-level customer meetings**" },
          { text: "Launched a **customer-centric Retailer Sales Play embedding GenAI**" },
        ],
      },
    ],
    results: [
      { icon: "badge", badgeValue: "+80%", text: "growth in opportunity pipeline" },
      { icon: "badge", badgeValue: "40%", text: "of opportunities **moved or closed** during the project" },
      { icon: "badge", badgeValue: "2-3x", text: "increased **volume ambition** for select accounts" },
      { icon: "badge", badgeValue: "10+", text: "customer sales plays launched" },
      { icon: "badge", badgeValue: "3", text: "retailers engaged successfully incl. **volume indications from one**" },
      { icon: "badge", badgeValue: "20", text: "clients **adopted GenAI tool** in their day-to-day work" },
    ],
  },

  {
    id: "case-packaging-co-sustainability-driven-commercial-value-creation",
    pageNumber: 35,
    titleAccent: "Packaging Co",
    titleRest: "Sustainability-driven Commercial Value Creation",
    year: "2025",
    industry: "AMS",
    product: "Sustainability Commercial Excellence (with Customer)",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Packaging Co is a **leading global PE-owned packaging supplier** of plastic, glass, metal containers etc.",
      },
      {
        text: "They faced challenges due to rapidly evolving market dynamics:",
        subBullets: [
          "**Regulatory changes** (e.g., PPWR) accelerated requirements for recyclability and sustainability",
          "Customers demanded more proactive, strategic guidance from packaging suppliers **to meet ambitious sustainability goals**",
        ],
      },
      {
        text: "Bain was engaged to **develop a differentiated commercial strategy** focused on capturing value from sustainability-driven customer needs and regulatory shifts",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        body: "The team conducted deep-dive interviews, data analysis, and internal capability assessments:",
      },
      {
        bullets: [
          {
            text: "Identified **four key initiatives** to unlock value",
            subBullets: [
              "Winning value proposition",
              "Sales operations aligned to value",
              "Repeatable sales plays",
              "Effective enablement with tools",
            ],
          },
          { text: "**Mapped customer archetypes** by region, category, and sustainability maturity" },
          {
            text: "Designed differentiated **sales plays** for each customer archetype (compliance followers, sustainability optimizers & core sustainability brands) to achieve brand promise",
          },
          { text: "Conducted a sustainability-driven commercial excellence X-ray" },
          { text: "Developed an **AI-enabled proof-of-concept** sales tool" },
          { text: "Crafted a roadmap for commercial activation and internal enablement" },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "Identified opportunity to drive **~10% revenue uplift** through various CE initiatives over 18-36 months",
      },
      {
        icon: "check",
        text: "Identified **+3–4% sustainable wallet share** in high-propensity subcategories through targeted campaigns in \"sustainability hotspots\"",
      },
    ],
  },

  {
    id: "case-steel-co-green-steel-market-assessment",
    pageNumber: 36,
    titleAccent: "Steel Co",
    titleRest: "Green Steel market assessment and decarbonization roadmap",
    year: "2025",
    industry: "AMS",
    product: "Sustainability Commercial Excellence (with Customer)",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Steel Co's **strategy 20-30** was developed in 2019/20 and led to a comprehensive program centered around **portfolio changes, performance and transformation** regarding green steel",
      },
      {
        text: "Hit by a **series of crises** (COVID, supply shortages, regulations, etc.), Steel Co has been **loss-making the past years**, asking Bain to conduct a **market assessment until 2035** to **update** their business model, which has been carried out in the first part of the project",
      },
      {
        text: "The second part of the project was concerned with the **assessment of the green steel market**, deriving a view on Steel Co's green **expansion strategy** and possible **implications for its profitability** regarding the green steel transition",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        heading: "The Bain team assessed the green steel market development until 2035 looking at",
        bullets: [
          {
            text: "**Green steel demand outlook from industries** (until 2035) and **development of the green price premium**;",
          },
          { text: "**Development of green steel supply** from key competitors (incl. import development);" },
          { text: "**Effect** on Steel Co's **delivery volumes**;" },
          { text: "**Effect** on Steel Co's **contribution margin**." },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "Defined a **clear path** to Steel Co on their further decarbonization steps and ambition to become carbon neutral in 2045",
      },
      {
        icon: "check",
        text: "Evaluation of potential **2030 directions** and recommended **expansion strategies** for Steel Co, emphasizing the adoption of a price premium for green steel",
      },
      {
        icon: "check",
        text: "Provided guidance on the **next transformation steps** including funding and technology adoption",
      },
      {
        icon: "check",
        text: "Preparation of a **comprehensive map showcasing adaptation rates across various industries**, including Automotive, Household Products, Construction, Energy, and Industrial Goods.",
      },
      {
        icon: "check",
        text: "Creation of **detailed scenarios including margins and Opex costs** (particularly in energy and gas), to assist in strategic decision-making",
      },
    ],
  },

  {
    id: "case-bank-co-voluntary-carbon-market-opportunities",
    pageNumber: 37,
    titleAccent: "Bank Co",
    titleRest: "Voluntary Carbon Market (VCM) opportunities",
    year: "2025",
    industry: "FS",
    product: "Sustainability Commercial Excellence (with Customer)",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Realignment of business model successfully completed – Now **Bank Co is looking for growth areas** that build on its strengths and are directly related to customer needs",
      },
      {
        text: "**Voluntary carbon market identified** as an interesting future field allowing Bank Co to **leverage existing strengths in commodities** and **compliance carbon market**, among others",
      },
      {
        text: "Bank Co also has **access to the potential supply and demand side for voluntary carbon credits** and can leverage its **expertise in project development**",
      },
      {
        text: "**Positioning themselves in the field of VCM** is also interesting for Bank Co against the background of the ambitious **decarbonization plans of the main shareholder**",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        heading: "1. Carbon credits market screening",
        bullets: [
          {
            text: "**Perspective on market size and future trajectory** of carbon markets as well as likely evolution of market and regulatory changes",
          },
          {
            text: "**Market scan of carbon credits market**, incl. competitive landscape and key opportunities along value chain",
          },
          { text: "**Strategic recommendations** to navigate market landscape" },
        ],
      },
      {
        heading: "2. Strategic target picture identification",
        bullets: [
          {
            text: "**Initial blueprint of strategic initiatives** needed to capture voluntary carbon markets opportunity to **jointly create first target picture**",
          },
          {
            text: "**Overview of required capabilities** for successful participation in VCM and execution on target picture (incl. potential gaps)",
          },
        ],
      },
      {
        heading: "3. Business case",
        bullets: [
          {
            text: "**High level quantification** of associated opportunities for Bank Co incl. high-level business case (revenue potential)",
          },
          { text: "**Initial assessment of risk** (incl. reputation risk)" },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "**~20 opportunities** identified for Bank Co to engage in the USD 15-30 bn VCM (2030)",
      },
      {
        icon: "check",
        text: "**~3 opportunities** prioritized for immediate implementation (2023/24) for Bank Co to participate in VCM",
      },
      {
        icon: "check",
        text: "**>$10m net profit** in 2030 derived from detailing prioritized opportunities",
      },
    ],
  },

  {
    id: "case-energy-co-integrated-service-platform-decarbonization",
    pageNumber: 38,
    titleAccent: "Energy Co",
    titleRest: "Integrated Service Platform for Decarbonization Services",
    year: "2025",
    industry: "ENR",
    product: "Sustainability Commercial Excellence (with Customer)",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Energy Co operates in the **biogas, biomethane,** and renewables markets through **two subsidiaries,** and aims to become the **Italian leading player** in the energy transition",
      },
      {
        text: "The **Italian market** has been undergoing several changes, including **shifts in regulations and demand,** impacting future scenario",
      },
      {
        text: "Energy Co is currently exploring the **opportunity to establish an integrated platform** to leverage its existing B2B sales network with a unified approach",
      },
      {
        text: "Energy Co **has engaged Bain to:**",
        subBullets: [
          "**Assess** the potential unlocked **value** generated by synergies from the integrated platform",
          "**Develop** a **robust business plan** and an **actionable implementation roadmap**",
        ],
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        heading: "Client Mapping, Offer Scanning & Customer Life-Time Value",
        bullets: [
          {
            text: "**Identification of customer needs**, mapping of customer profiles to product preferences (incl. ESG targets) and development of **customer segments**",
          },
          {
            text: "**Assessment of fitting products** based on attractiveness and ability to win by customer segment and **quantification of customer lifetime value** through a robust proprietary tool",
          },
        ],
      },
      {
        heading: "Go-to-Market Strategy",
        bullets: [
          { text: "**Definition of the sales channels** for each customer segment, product and geography" },
          {
            text: "**Design of sales management structure** (regional vs. national, key account managers, etc.) **and of the commercial and technical draft offers**",
          },
        ],
      },
      {
        heading: "Operative Model",
        bullets: [
          {
            text: "**Understanding** of the **operating model requirements** to support governance mechanisms and processes as-is and to-be.",
          },
          {
            text: "**Design of next level organizational**, **decision-making framework** (rights / accountabilities for the major decisions) by defining key accountabilities for organizational entities, re-set ROCI and decision process roles and align expectations for how teams will work internally",
          },
        ],
      },
      {
        heading: "Business Plan and Implementation Roadmap",
        bullets: [
          {
            text: "Definition of **revenue streams, cost items and estimated breakdown of overall budget** and assessment of **profitability** for different segments and **scenarios**",
          },
          {
            text: "**High level implementation roadmap** including risk plan, milestones, metrics to measure, communication plan, and governance plan",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "Identified **potential clients** e.g. in terms of industry (Agri/Food/HTA), size and geography; and assessed the **ability to win**",
      },
      {
        icon: "check",
        text: "Assessed the **size of the prize** of the opportunity and defined **commercial strategies** on specific customer clusters",
      },
      {
        icon: "check",
        text: "Defined the **operating model** as-is, identified the key **pain-points** and **re-designed it** e.g. by optimizing key execution processes and internal roles functions",
      },
      {
        icon: "check",
        text: "Structured an **integrated implementation roadmap** for the new offering and overall P&L",
      },
    ],
  },

  {
    id: "case-chemical-co-carbon-value-creation-plan-polymer-markets",
    pageNumber: 39,
    titleAccent: "Chemical Co",
    titleRest: "Carbon value creation for circular and low-carbon polymers",
    year: "2024",
    industry: "ENR",
    product: "Sustainability Commercial Excellence (with Customer)",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      { text: "Chemical Co is a **global leader in polymer and chemical production**" },
      {
        text: "Chemical Co set an ambitious near-term target for its decarbonization journey: **~40% reduction of Scope 1&2 by 2030**",
      },
      {
        text: "Chemical Co aspires to be a **value-oriented leader through the carbon transition** by capturing customer value and capitalizing on their circular and low carbon offerings",
      },
      {
        text: "Bain supported Chemical Co in decarbonized polymer value creation by answering key questions:",
        subBullets: [
          "What are the key end markets that require circular and low carbon solutions?",
          "What is the expected demand for circular and low carbon solutions across end-markets, geographies, and customer archetypes from 2030-2040?",
          "What are future market dynamics and potential value that can be captured from low carbon solutions in the target markets?",
          "What actions are needed to enable carbon value capture?",
        ],
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        bullets: [
          {
            text: "Developed **end market deep-dives on Scope 3 emissions reductions, circularity targets, and importance of plastics as a sustainability lever** through 50+ brand owner interviews and sustainability commitments",
          },
          {
            text: "Defined **target end markets and customer archetypes** by prioritization of recycled and/or low carbon products",
          },
          {
            text: "Built **demand model for circular and low carbon solutions from a customer-back perspective,** segmenting by geography, market, and customer archetype (leaders, aspiring leaders, followers, laggards)",
            subBullets: [
              "Investigated CO2 reduction from green plastics technology including recycled (mechanical recycling, advanced recycling) and low carbon solutions (scope 1&2 reductions, bio feedstock, combination of scope 1,2,&3 reductions)",
              "Translated public, scope 3 CO2e and circularity targets across 200+ companies in 8 end-markets to model demand from 2030 onward for recycled and low-carbon plastic",
            ],
          },
          {
            text: "**Mapped low-carbon demand against anticipated supply** from upcoming low-carbon projects",
          },
          { text: "**Identified potential value capture,** linked to decarbonization costs" },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "**Alignment on priority PP/PE end-markets**",
        subBullets: [
          "Identified plastics importance for scope 3 decarbonization",
          "Developed segmentation of end-markets based on their receptiveness to recycled and low-carbon solutions",
        ],
      },
      {
        icon: "check",
        text: "**Identified 2030+ demand for green PP/PE**",
        subBullets: [
          "Developed demand model for PE/PP by geography, end-market, customer archetype, and by product (recycled and low carbon solutions)",
          "Created view of supply / demand market dynamics",
        ],
      },
      {
        icon: "check",
        text: "**Estimated decarbonization value for low carbon solutions for 2030 and 2035**",
        subBullets: ["Optimized decarbonization plan based on required supply and cost to decarbonize"],
      },
      {
        icon: "check",
        text: "**Initiated adjustments in decarbonization strategy, marketing capabilities, and advocacy strategy** to enable carbon value capture",
        subBullets: ["Prioritized PP/PE end markets", "2030+ view of recycled and low-carbon demand", "Potential $XXXM carbon value for low carbon solutions"],
      },
    ],
  },

  {
    id: "case-esg-startup-co-product-footprinting-saas",
    pageNumber: 40,
    titleAccent: "ESG Start Up Co",
    titleRest: "Designing a differentiated Product Footprinting SaaS tool",
    year: "2024",
    industry: "TCS",
    product: "Sustainability Commercial Excellence (with Customer)",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "ESG Start Up Co has a comprehensive enterprise-level carbon accounting platform, but is **seeing competitors expand into more granular footprinting tools,** that size a product-level impact",
      },
      {
        text: "They want to create a **differentiated product** that is easy-to-use but comprehensive – to capture market share away from established complex \"Life Cycle Assessment (LCA)\" tooling",
      },
      {
        text: "ESG Start Up Co has only previously offered carbon footprinting, and wants an **understanding of most critical environmental factors for consumers**",
      },
    ],
    whatWeDidHeading: "WHAT WE DID",
    whatWeDid: [
      {
        body: "Bain helped ESG Start Up Co ideate, design and define the value proposition of carbon and environmental factor tooling – to the point of being ready to build and launch",
      },
      {
        heading: "Market analysis and vision setting",
        bullets: [
          {
            text: "Collaborative workshop to define vision for the tool, leveraging inspiration from customer needs, competitive offerings and existing proposition",
          },
        ],
      },
      {
        heading: "Customer needs",
        bullets: [
          {
            text: "Qualitative (market survey) and qualitative (customer and expert interviews) to understand customer (unmet) needs, objectives, and segments",
          },
        ],
      },
      {
        heading: "Value proposition definition",
        bullets: [
          {
            text: "Ideated and prioritized features to create an initial view of the value proposition for different end users, with basic mock-ups and customer journeys",
          },
          { text: "Set out and agreed 'Leap of Faith assumptions' to validate through test phase" },
        ],
      },
      {
        heading: "Test & learn",
        bullets: [
          {
            text: "Leverage value proposition materials and clickable prototype to test tool with end users, iterating and increasing fidelity based on feedback",
          },
        ],
      },
      {
        heading: "Detailed design",
        bullets: [
          { text: "Defined methodology approach and setup calculation frameworks for carbon, water and waste footprinting" },
          { text: "Created detailed design artefacts including wireframes, information architecture, and service blueprint" },
        ],
      },
      {
        heading: "Planning and requirements",
        bullets: [
          {
            text: "Prioritized features using a defined framework (across desirability, viability and feasibility) to define MVP and roadmap of enhancements",
          },
          {
            text: "Built out delivery requirements (product backlog of epics and user stories) and handover packs to be leveraged by engineering teams in the build phase",
          },
        ],
      },
    ],
    results: [
      { icon: "badge", badgeValue: "$400m+", text: "in **incremental value** identified" },
      { icon: "badge", badgeValue: "37", text: "Experts and end users **interviewed**" },
      { icon: "badge", badgeValue: "19", text: "customer pilots with **clickable prototypes conducted**" },
      { icon: "badge", badgeValue: "54", text: "**Product features defined**, sized and prioritized" },
      { icon: "badge", badgeValue: "200+", text: "**Data points leveraged** to calculate product environmental footprints" },
      { icon: "badge", badgeValue: "70", text: "**User stories written** to define build requirements" },
      {
        icon: "check",
        text: "Defined **multi-release feature delivery roadmap** to deliver iterative user value",
      },
    ],
  },

  {
    id: "case-food-co-launch-scale-low-carbon-food-product",
    pageNumber: 41,
    titleAccent: "Food Co",
    titleRest: "Strategy to launch and scale a low carbon food product",
    year: "2023",
    industry: "SI / ENR",
    product: "Sustainability Commercial Excellence (with Customer)",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Food Co, a **European crop processor company**, wanted to launch and scale a new low carbon food product to create a competitive advantage",
      },
      {
        text: "Food co needed support in defining their low carbon food strategy and business model",
      },
      {
        text: "Furthermore, Food co sought expertise to develop a long-term partnership strategy that would maximize the potential of their low carbon food offering and create a competitive advantage",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        body: "Developed a **strategy to launch and scale a low carbon food product**, guided by 4 key deliverables:",
      },
      {
        heading: "1. Visibility on decarbonization potential, customer willingness to pay & corresponding business case",
        bullets: [
          { text: "E-curve: Created transparency on decarbonization levers & corresponding costs over time" },
          {
            text: "S-curve: Identified willingness to pay per customer segment (over time) and developed corresponding business case (i.e., based on future volumes, costs, prices and profits)",
          },
        ],
      },
      {
        heading: "2. Long-term strategic partnerships to create a competitive advantage",
        bullets: [
          {
            text: "Identified required partnerships, value propositions and contract terms to leverage low carbon product & stand out from competitors",
          },
        ],
      },
      {
        heading: "3. Sustainability criteria and framework to drive low carbon journey forward",
        bullets: [
          { text: "Defined methods for carbon calculation/ verification and drove key sustainability decisions" },
        ],
      },
      {
        heading: "4. Communication strategy & organizational set-up to scale low carbon food products in market",
        bullets: [
          {
            text: "Developed communication materials to engage upstream & downstream partners in low carbon food transformation and created governance & OP model frameworks to facilitate scaling",
          },
        ],
      },
    ],
    results: [
      { icon: "badge", badgeValue: "10-15%", text: "EBITDA growth by 2030" },
      { icon: "badge", badgeValue: "50%", text: "of total food volumes will be low carbon by 2030" },
    ],
  },

  {
    id: "case-oil-gas-co-sustainability-value-methodology",
    pageNumber: 43,
    titleAccent: "Oil & Gas Co",
    titleRest: "Sustainability Value Methodology",
    year: "2026",
    industry: "ENR",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Oil & Gas Co, a regional tanker and gas shipping company, sought to define its **long-term strategic ambition** and modernize its **fleet and commercial strategy**",
      },
      {
        text: "With strong **financial and operational foundations**, leadership required clearer strategic direction, including:",
        subBullets: [
          "Clarifying \"where to play\" and \"how to win\" across asset classes, market segments, capital structure, and commercial deployment",
          "Establishing a **fit-for-purpose governance framework** with clear decision rights and delegation of authority",
          "Translating strategy into an **execution-ready operating model** with redesigned committees, organizational structure, and performance management",
        ],
      },
      {
        text: "Bain was engaged to support a **20-week strategy, governance, and operating model transformation**",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        heading: "Current-state assessment:",
        bullets: [
          { text: "Built structured fact base across **strategy, governance, operating model, organization, KPIs,** and **processes**" },
          {
            text: "Reviewed **200+ documents**, conducted **30+ BoD / management interviews**, launched multiple organization-wide **employee survey**, benchmarked **15+ peers**, and engaged **20+ local and global experts**",
          },
          { text: "Identified strategic, governance, and operating model gaps shaping the future-state design agenda" },
        ],
      },
      {
        heading: "Strategy & commercial design:",
        bullets: [
          { text: "Refined **vision, mission, values,** and **strategic guardrails** to anchor long-term ambition and sustainability priorities" },
          {
            text: "Evaluated \"where to play\" choices across market segments (VLGCs, LR2s/Aframax, MGCs), customers, and commercial deployment models",
          },
          { text: "Assessed \"how to win\" levers across fleet expansion, client acquisition strategy, and decarbonization" },
          {
            text: "Defined **optimal capital deployment approach** and surplus cash prioritization framework, and **modelled fleet expansion scenarios** across alternative financing structure",
          },
        ],
      },
      {
        heading: "Governance & operating model:",
        bullets: [
          { text: "Assessed **existing committee mandates**, **decision rights**, and **escalation paths** to identify overlap, gaps, and formalization deficiencies" },
          { text: "Benchmarked **governance structures** and DoA practices against peers" },
          { text: "Designed **target organizational structure** and clarified division-level **mandates and responsibilities** until N-2" },
          { text: "Developed **KPI framework** linked to strategic objectives and built an integrated implementation roadmap to sequence and govern delivery" },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "Developed integrated transformation fact-base across **strategy, governance,** and **operating model**",
      },
      {
        icon: "check",
        text: "Defined **optimal capital structure and fleet expansion strategy** across alternative financing structures and growth scenarios",
      },
      {
        icon: "check",
        text: "Designed **fit-for-purpose governance model** with rationalized management committees, Board charters, and Delegation of Authority framework",
      },
      {
        icon: "check",
        text: "Translated strategy into an **execution-ready operating model** to support competitiveness, agility and value creation",
      },
    ],
    footnote: "Note: VLGCs - very large gas carriers, MGCs – medium gas carriers",
  },

  {
    id: "case-mining-co-sustainability-value-methodology",
    pageNumber: 44,
    titleAccent: "Mining Co",
    titleRest: "Sustainability Value Methodology",
    year: "2026",
    industry: "ENR",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Mining Co, a **global diversified miner**, recently launched an updated sustainability strategy and was focused on ensuring sustainability adds measurable value",
      },
      {
        text: "Mining Co sought **a more structured way to assess the value of its sustainability initiatives** to focus investment, align decision-making and demonstrate outcomes",
      },
      {
        text: "Bain was engaged to develop a **consistent, transferable methodology** and supporting **calculation toolkit**, complemented by **case examples**, **narrative**, and **training materials** to enable effective business uptake",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        bullets: [
          {
            text: "Defined the **value taxonomy across four commercial drivers** with sub-levers for each: revenue uplift, cost savings, risk avoidance and liability reduction, and future opportunity",
          },
          {
            text: "Built the **value trees by lever and developed a distinct calculation approach** for every value type, so each initiative is assessed on a consistent basis regardless of how it creates value",
          },
          {
            text: "Codified a **repeatable five-step process per initiative**: (1) Scope and cost, (2) Define sustainability outcomes and impact, (3) Define project type, discretionary status and value driver, (4) Assess financial value, (5) Review and optimise",
          },
          { text: "Ran multiple **working sessions** to co-create the approach with regional teams" },
          {
            text: "Collected and standardized **reference data** (e.g. daily revenue and EBITDA per site, discount rates, industry disruption benchmarks, closure provisions) so teams start from a credible baseline",
          },
          {
            text: "Built an **Excel tool for regional teams** that captures inputs, holds the reference data, runs the calculation by value type, and generates initiative and portfolio outputs for appraisal",
          },
          {
            text: "Delivered a clear **guidebook** with detailed guidance and templates to embed and maintain the approach",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "Developed a consistent & repeatable **methodology and an Excel tool** that link initiatives to financial value",
      },
      {
        icon: "check",
        text: "Collaborated closely with the central sustainability team and a regional business, and **built the ground for ongoing collaboration**",
      },
      {
        icon: "check",
        text: "Shared the methodology with organization leadership team and **proved which value levers are most material**, with risk and liability reduction and future opportunity carrying the largest value at stake",
      },
    ],
  },

  {
    id: "case-energy-co-ccs-business-case-de-risking-ecosystem-development",
    pageNumber: 45,
    titleAccent: "Energy Co",
    titleRest: "CCS Business Case De-risking and Ecosystem Development",
    year: "2026",
    industry: "ENR",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "As part of expected legislation change, Energy Co needed to decarbonize its waste-to-energy operations and saw **carbon capture and storage (CCS) as the key solution**",
      },
      {
        text: "Energy Co needed CCS project to meet commercial and technical maturity milestones, including preparation for an **EU Innovation Fund** subsidy application",
      },
      {
        text: "To make the commercials work, the client also needed to assess if there is enough **interest from emitters** in the country, and if the local government would be supporting the projects via subsidies",
      },
      {
        text: "Bain supported Energy Co towards **final investment decision**, **de-risking the business case** and **strengthening the path to a value-accretive investment**",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        body: "Bain supported Energy Co through a focused sprint to advance both commercial and technical maturity of the CCS project:",
      },
      {
        bullets: [
          {
            text: "Developed value proposition materials to support engagement with the stakeholders including local government, 10+ industrial emitters, prospective CO2 removal offtakers, infrastructure developers, and investors",
          },
          {
            text: "Participated with the client team in stakeholder discussions to validate ecosystem interest and strengthen project positioning across the CCS value chain",
          },
          {
            text: "Modeled the business case and key sensitivities to identify priority levers for risk reduction and value creation",
          },
          {
            text: "Tested the feasibility of establishing a CCUS ecosystem with support from infrastructure development partners and assessed local emitter interest to evaluate potential CO2 pooling opportunities and scale benefits",
          },
          {
            text: "Recommended an **EPCm model** with turnkey scopes, in line with the client's risk preferences and internal capabilities",
          },
          {
            text: "Supported alignment on next steps toward continued de-risking and preparation for a planned EU Innovation Fund application",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "Positive reception from local government, supporting a strong case for participation in the country's planned CCUS funding scheme",
      },
      {
        icon: "check",
        text: "Raised interest from industrial emitters, indicating potential to pool volumes and unlock scale benefits across value chain",
      },
      {
        icon: "check",
        text: "Preliminary **CDR\u00b9 certification process** initiated with a leading certification company",
      },
      { icon: "check", text: "Mature business case with clearer sensitivity priorities and risk-reduction focus areas" },
      { icon: "check", text: "Refined procurement approach centered on **EPCm** with selective turnkey scopes" },
      {
        icon: "check",
        text: "Aligned project organization on next steps toward further business case de-risking and EU Innovation Fund application preparation",
      },
    ],
    footnote: "Note: 1. CDR \u2013 Carbon Dioxide Removal",
  },

  {
    id: "case-energy-co-voluntary-carbon-credit-scheme-feasibility",
    pageNumber: 72,
    titleAccent: "Energy Co",
    titleRest: "National Voluntary Carbon Credit Scheme Feasibility Study",
    year: "2023",
    industry: "ENR",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      { text: "Rising pressure to reduce GHG emissions at a global and European level (Paris Agreement)" },
      {
        text: "Voluntary Carbon Market increasingly recognized as a key mean to achieve net zero strategies, expected to grow by 5-20x in 10 years ('20-'30)",
      },
      {
        text: "Several players entering the VCM market along the value chain, with supply standards taking care of the certification process (midstream)",
      },
      {
        text: "Global standards leading the market, while national/ domestic standards emerging to boost country-level decarbonization",
      },
      {
        text: "Energy Co, together with public/ gov' institutions and local stock exchange, asked for Bain support in assessing the potential for the creation of a domestic scheme and trading platform",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        heading: "1. Greek Demand/ Supply assessment",
        bullets: [
          { text: "Reviewed global trends and implications for European markets" },
          { text: "Quantified core demand and supply sources for Greece" },
        ],
      },
      {
        heading: "2. Best practices review and reason why",
        bullets: [
          {
            text: "Assessed supply standard dynamics (incl. certification process, projects covered, methodologies adopted, …)",
          },
          { text: "Analyzed and defined trading model options (incl. infrastructure, customer served,…)" },
        ],
      },
      {
        heading: "3. Scheme design for Greece",
        bullets: [
          { text: "Defined key supply standard features and trading model choices for domestic market" },
          {
            text: "Prepared a lean and quick survey, to assess awareness, current adoption and future role of VCM for local top emitters, large CPG and financial services corporations",
          },
        ],
      },
      {
        heading: "4. Operating model definition",
        bullets: [
          { text: "Designed operating model in terms of supply standard and trading model positioning along the value chain" },
          { text: "Profiled key stakeholders and partners to potentially engage" },
        ],
      },
      {
        heading: "5. Roadmap design",
        bullets: [
          {
            text: "Designed one-year roadmap for implementation (incl. guidelines, timeline, key milestones, stakeholders, enablers, …)",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "Assessed **potential for Greek VCM**",
        subBullets: [
          "Local supply of 3-5MtCo2 by 2030, analyzing ~15 major use cases (e.g., afforestation, blue carbon, …)",
          "Local demand of 4-7MtCo2 by 2030, based on country emissions trajectory and top emitters ambitions (~15 players representing >50% of total emissions)",
        ],
      },
      {
        icon: "check",
        text: "Performed **benchmark along the full VCM value chain**, with focus on supply standard and trading models",
        subBullets: [
          "Identified 4 key supply standards archetypes based on geographical reach and methodologies adopted",
          "Validated rising role of exchanges and opportunity for porting model with existing carbon-focused platforms",
        ],
      },
      { icon: "check", text: "Defined new scheme **blueprint**, scheme **positioning** along the value chain and **strategic choices**" },
      {
        icon: "check",
        text: "Designed one-year **roadmap** for **mobilization** with detailed activities to perform, owners/ actors to engage, key enablers and milestones to target",
      },
    ],
  },

  {
    id: "case-wbcsd-corporate-sustainability-impact",
    pageNumber: 69,
    titleAccent: "World Business Council For Sustainable Development",
    titleRest: "Defining and driving corporate sustainability impact",
    year: "2024",
    industry: "SI",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "WBCSD engaged Bain to:",
        subBullets: [
          "Outline the compelling business case today and a path forward to catalyze companies beyond value chain actions at scale",
          "Create an educational guide that introduces key concepts on biodiversity credits and explains how companies may use them to serve their nature-positive strategies",
          "Develop a practical tool with step-by-step instructions to help companies build carbon credit portfolios that support their net zero strategy",
        ],
      },
      {
        text: "The boundary of beyond value chain actions is **only starting to be defined for climate by SBTi, but not yet for nature and equity**. There is no clear business case for acting beyond the value chain, resulting in subscale actions vs the global ambition",
      },
      {
        text: "**Biodiversity credit is a nascent concept** with an undefined global scope. As many businesses have only begun to focus on biodiversity following COP15, they are not yet interested in exploring actions beyond value chains",
      },
      {
        text: "**Carbon credit portfolios need a deep understanding** of trends, credit types, and prioritization. Claiming credit usage has **public scrutiny and reputational risk**",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        bullets: [
          {
            text: "Conducted **member surveys, interviews, and workshops** to obtain and cultivate current perspectives, as well as to collaboratively shape messaging and approach",
          },
          {
            text: "Performed **market research** on climate, nature, and equity crises as well as the latest market developments to anticipate future trends",
          },
          {
            text: "Developed **frameworks** for classifying beyond value chain actions, biodiversity types, and constructing carbon credit portfolios",
          },
          {
            text: "Leveraged **conferences, publications, and webinars** to broaden the scope of advocacy efforts, thereby increasing their impact",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "Drove broader corporate contribution beyond value chain among WBCSD members (~200 members) and more, leveraging global forums like the New York Climate Week roundtable and the COP28 report publication. Elevated WBCSD's requirement on member corporate actions and fostered agreement among business leaders on the importance of greater corporate contribution to address the climate, nature, and equity crises",
      },
      {
        icon: "check",
        text: "Empowered greater corporate participation in the voluntary carbon market by developing well-documented policies and market guidance, as well as a systematic methodology for carbon credit portfolio construction and related reporting and claiming",
      },
      {
        icon: "check",
        text: "Promoted WBCSD's brand name and established the organization as a thought leader on fast-evolving topics such as biodiversity credits",
      },
      {
        icon: "check",
        text: "Published reports: - The Case for Beyond-Value-Chain Actions",
      },
    ],
  },

  {
    id: "case-conglomerate-co-screening-nbs-carbon-credit-projects",
    pageNumber: 74,
    titleAccent: "Conglomerate Co",
    titleRest: "Screening NbS Carbon Credit Projects",
    year: "2023",
    industry: "AMS",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "**Conglomerate Co** is looking to develop capability to source high quality carbon credits for:",
        subBullets: ["Selling to its customers having decarbonization goals", "Meeting their own corporate emissions targets"],
      },
      {
        text: "Accordingly, the client needed support in **understanding the current landscape of NbS project opportunities in Asia**, and to identify early-stage projects for potential investment.",
      },
      {
        text: "**Complications:**",
      },
      { text: "The carbon markets landscape is a rapidly evolving space." },
      { text: "Presently, there is no comprehensive database that consolidates all carbon credit-generating projects across markets." },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        body: "Bain worked for **1-month** to assess most **attractive markets for NbS project investments** featuring strong regulation, mitigation potential, and credible project pipelines. The approach included:",
      },
      {
        bullets: [
          { text: "Sourcing pre-issuance projects listed on carbon credit registries such as Verra and Gold Standard" },
          { text: "Engaging developers to obtain information about their projects in the pipeline*" },
          {
            text: "Sense-checking of project list with experienced market participants (e.g., ex-project developers) to ensure that no major projects were missing",
          },
          {
            text: "Applying a systematic approach to screen and score each project against 3 criteria – **market conditions, developer track record**, and **project feasibility & quality**",
          },
        ],
      },
      {
        bullets: [{ text: "The highest-scoring projects were shortlisted and presented to the client for investment consideration." }],
      },
    ],
    results: [
      {
        icon: "badge",
        badgeValue: "19 projects",
        text: "shortlisted from total ~300 projects — 10 projects in SEA and 9 projects in India for potential investment.",
      },
      {
        icon: "check",
        text: "Proposed **financial and technical due diligence** on key targets for the client to arrive at investment decision, and to further develop the client's overall nature-based solutions strategy.",
      },
    ],
    footnote: "(*) some of the projects may not be publicly available yet",
  },

  {
    id: "case-cpg-co-it-decarbonization-pathway",
    pageNumber: 66,
    titleAccent: "CPG Co",
    titleRest: "IT Decarbonization Pathway",
    year: "2024",
    industry: "CP",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "**CPG Co** committed to a **28% carbon reduction by 2030 vs. 2019**, translating to ~50% vs. BaU, with implications across all business units.",
      },
      {
        text: "Although IT currently contributes a **small share of emissions**, it is projected to **2–3x** due to increased cloud adoption and GenAI usage.",
      },
      {
        text: "No specific decarbonization target or pathway had been set for IT. A focused **6-week sprint** aimed to establish the first IT carbon projection and action plan.",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        heading: "Built a 2030 IT carbon projection under various growth and usage scenarios, including:",
        bullets: [
          {
            text: "BaU modeling across IaaS, SaaS, PaaS, IT services, user environment, printing, telephony, networks, and on-prem data centers.",
          },
          {
            text: "GenAI expansion scenarios, using both top-down (market + energy intensity per model) and bottom-up (employee-level usage) approaches.",
          },
        ],
      },
      { body: "Identified **carbon reduction levers** across cloud infrastructure, hardware lifecycle, suppliers' ecosystem." },
      {
        body: "Prioritized actions based on impact, feasibility, and alignment with existing IT strategic plans — categorized as:",
        bullets: [
          { text: "Strategic plan follow-through" },
          { text: "Stretch initiatives" },
          { text: "Bold moves" },
        ],
      },
      {
        body: "Developed a **preliminary IT decarbonization roadmap** and key recommendations to support internal alignment and decision-making.",
      },
    ],
    results: [
      {
        icon: "check",
        text: "Modeled **IT carbon footprint projected to 2–3x by 2030**, primarily driven by cloud growth and GenAI use.",
      },
      {
        icon: "check",
        text: "Delivered CPG Co.'s **first IT decarbonization pathway**, supporting Group-level sustainability commitments.",
      },
      {
        icon: "check",
        text: "Defined a clear reduction **potential of ~40–70%** vs. BaU, with majority of impact dependent on supplier engagement.",
      },
      { icon: "check", text: "Delivered a prioritized **list of decarbonization levers**" },
    ],
  },

  {
    id: "case-oil-gas-co-soil-carbon-offset-generation",
    pageNumber: 73,
    titleAccent: "Oil & Gas Co",
    titleRest: "Soil Carbon Offset Generation",
    year: "2023",
    industry: "ENR",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Oil & Gas Co set an ambitious **goal to offset XXM metric tons of emissions** from the use of their product(s) by 20XX; evaluating **regenerative agriculture** in North America (no-till & cover crops) to **sequester carbon and generate offsets**",
      },
      {
        text: "The project involved analysis of the traditional economics of major crop types in North America (Corn, Soy, Wheat), the **impact of regenerative agriculture on those economics**, and other economic incentives for regenerative agriculture practices which can incentivize farmers to switch from traditional methods.",
      },
      {
        text: "The project also relied heavily on getting farmer perspectives to help understand the psychological barriers to switching to these practices, which is one of the largest barriers to adoption to date.",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        bullets: [
          {
            text: "Built regenerative agriculture economic model to assess impact of adopting regenerative agriculture on farm economics for key segments of interest",
          },
          {
            text: "Conducted ~40 in-depth interviews (farmers, agronomists and industry experts) to further our understanding of carbon markets, existing carbon programs, and key drivers & barriers of adoption",
          },
          {
            text: "Created a carbon program simulator to assess which segments & how many acreages are addressable at cost per tonne of carbon that the client is willing to pay",
          },
          {
            text: "Assessed existing carbon programs and co-created a high-level structure of a potential carbon program that addresses farmers' needs while keeping cost per carbon at or below client's willingness to pay",
          },
        ],
      },
    ],
    results: [
      { icon: "check", text: "**ECONOMICS:** Defined addressable market at the cost of carbon the client is willing to pay" },
      {
        icon: "check",
        text: "**IMPACT:** Proved there is a significant opportunity (in both acreages & tonnes of carbon sequestration potential) in North American regenerative agriculture. Phase 2 decision has not been made, but will be focused on detailed offer design, capability mapping, and identifying potential partnerships to execute",
      },
      {
        icon: "check",
        text: "**INNOVATION:** Co-created a high-level structure of a carbon program with the client that better addresses farmer needs vs. competitor offerings while meeting client's target cost per carbon",
      },
    ],
  },

  {
    id: "case-district-energy-co-future-ready-contract-database",
    pageNumber: 71,
    titleAccent: "District Energy Co",
    titleRest:
      "Prepared a future-ready contract database to incorporate strategic implications of decarbonization regulations; leading to 33% EBITDA uplift",
    year: "2023",
    industry: "ENR",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      { text: "District Energy Co is a leading district energy provider in Country 1 offering reliable and cost-efficient cooling and heating solutions" },
      {
        text: "In 2023, one of the states that District Energy Co plays in, introduced a decarbonization regulation act to cap and reduce GHG emissions,",
      },
      {
        text: "This is expected to introduce additional costs, **which would erode ~60-70% of District Energy Co's current EBITDA** in that state (in the form of cost-to-purchase allowances)",
      },
      {
        text: "Further, there were discrepancies in District Energy Co's billing system which meant they were likely over/under-billing different customers",
      },
      {
        text: "Bain support was needed to identify:",
        subBullets: [
          "The strategic implications of the decarbonization regulation, including pass-through contracts and milestones for renegotiation",
          "Value of over/under billing in customer contracts, and adjustments needed for proper alignment with agreed-upon terms",
          "Summary of commercial terms, strategic options they provide, and potential EBITDA upside",
          "Way (if any) of communication to customers in a given timeframe",
        ],
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        heading: "Compiled data from across the organization to build contract database",
        bullets: [
          { text: "Summarized options to improve contract standardization" },
          { text: "Recommended naming approach and organization of files" },
        ],
      },
      {
        heading: "Estimated EBITDA impact and potential levers to drive upside",
        bullets: [
          { text: "Quantify decarbonization regulation act exposure and ability to pass through costs" },
          { text: "Quantify the impact of over-billing/under-billing by customers, due to contract to invoicing misalignment" },
          { text: "Determine the variability in pricing/profitability" },
        ],
      },
      { heading: "Developed a high-level communication plan and execution roadmap" },
    ],
    results: [
      { icon: "check", text: "Created a future-ready contract database" },
      {
        icon: "check",
        text: "Identified that **75%** of the additional costs from purchasing allowances, could be contractually passed through to customers",
      },
      { icon: "check", text: "Quantified the impact of over/under billing" },
      {
        icon: "check",
        text: "Identified various levers to drive EBITDA upside across different scenarios – with a total gain of up to **+33% EBITDA improvement** on the current base (~$XM upside) in the most optimistic scenario vs. – **60-70% downside on the current base in 'do nothing scenario'**",
        subBullets: [
          "EBITDA gain net of both decarbonization cost pass-through costs and downside from resolving invoicing misalignment",
        ],
      },
      { icon: "check", text: "Created a communication plan and execution roadmap" },
    ],
  },

  {
    id: "case-nature-co-full-potential-plan-conservation-carbon-land-use",
    pageNumber: 75,
    titleAccent: "Nature Co",
    titleRest: "Full-potential plan development focusing on conservation, carbon market, and sustainable land use",
    year: "2023",
    industry: "SI",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      { text: "Nature Co is a **global NGO** whose mission is to **conserve the land**" },
      {
        text: "Nature Co partner bought a production forest concession in Indonesia on landscape **critical landscape for conservation and biodiversity** that faces a **high risk of encroachment** from illegal logging & conversion",
      },
      {
        text: "Nature Co sought to use the concession to demonstrate a **viable, scalable multi-asset business model** to sustain and thereby protect the production of forestland",
      },
      { text: "Bain was brought in to **define a full-potential plan** for the concession and strategy to drive impact at a system-level" },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        bullets: [
          { text: "Built timber and carbon market fact bases to establish a POV on economic drivers, regulation, and value chains" },
          { text: "Ran a \"Paint the Beach\" workshop with leadership to align on future vision and theory of change" },
          { text: "Modeled cash flows from sustainable timber, carbon, and other interventions to assess profit uplift opportunities" },
          { text: "Worked with local team to craft geospatial maps highlighting focal geographies based on conservation value and economic opportunity" },
          { text: "Drafted philanthropic funding strategy and forest-positive narrative for high-potential target funders" },
          {
            text: "Created PMO & resourcing plan moving forward incl. recommendations on meeting cadence, team structure, operating budget, and partnerships",
          },
        ],
      },
    ],
    results: [
      {
        icon: "badge",
        badgeValue: "$20+/ha/year",
        text: "Unlocked new strategies to close the profit gap — incremental profit from selling carbon offsets and participating different in value chain",
      },
      {
        icon: "badge",
        badgeValue: "$10-30M",
        text: "Created pathway for pipeline of forest-positive funds — in progress from corporate funders",
      },
      { icon: "check", text: "Recommended team restructuring to meet operational needs" },
      { icon: "check", text: "Aligned leaders on near and long-term action moving forward" },
    ],
  },

  {
    id: "case-consumer-co-carbon-value-creation-plan",
    pageNumber: 67,
    titleAccent: "Consumer Co",
    titleRest: "Carbon Value Creation Plan",
    year: "2024",
    industry: "CP",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      { text: "Client was a mid-sized, European high-growth consumer products company with a broad portfolio across personal care and homecare" },
      {
        text: "Growing investor, regulatory and B2B customer pressure to share carbon data and demonstrate leadership created burning platform for action",
      },
      {
        text: "Client had dual objective to:",
        subBullets: [
          "Build CSRD-compliant baseline and set first ever Science-Based Target",
          "Identify value-creation potential from decarbonization, and build plan to implement key actions",
        ],
      },
    ],
    whatWeDidHeading: "APPROACH",
    whatWeDid: [
      {
        heading: "Defined overall carbon ambition",
        bullets: [
          { text: "Built full-scope footprint baseline, and defined process to integrate into new ERP system" },
          { text: "Defined targets based on ambition-level, peer benchmarking, and requirements from green ratings" },
        ],
      },
      {
        heading: "Developed plan to implement key value-creation levers",
        bullets: [
          { text: "Prioritized long-list of decarbonization levers, based on potential for cost-saving, risk-management and sales/ margin uplift" },
          { text: "Engaged teams across R&D, marketing, procurement, supply chain, finance to own business case and implementation plan" },
        ],
      },
      {
        heading: "Prepared client for annual investor day",
        bullets: [
          { text: "Integrated carbon story into overall corporate mission and strategy" },
          { text: "Created talking points for CEO, CFO as part of investor roadshow, with key milestones for 2025 - 2027" },
        ],
      },
    ],
    results: [
      { icon: "check", text: "**Value creation** — Successful launch at investor roadshow" },
      { icon: "check", text: "External audit approval of carbon model for CSRD" },
      {
        icon: "check",
        text: "**Commercial upside** — Double-digit margin uplift on key product lines from switch to lower-carbon packaging formats",
      },
      { icon: "check", text: "Cost-certainty from full-potential roll-out of on-site renewables and PPAs at key sites" },
    ],
  },

  {
    id: "case-cpg-co-carbon-credit-procurement-governance-model",
    pageNumber: 68,
    titleAccent: "CPG Co",
    titleRest: "Carbon credit procurement governance model to secure credits for Net Zero targets",
    year: "2024",
    industry: "CP",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "CPG Co, a top global company (>150 countries, >35 brands), has committed to:",
        subBullets: [
          "Achieve Net Zero GHG emissions by 2050 and offset the residual 10% emissions in line with the Science Based Targets initiative",
          "Start offsetting all emissions from 2035 onwards on a voluntary basis",
        ],
      },
      {
        text: "CPG Co's objective is to **secure the required carbon credits** for its **own consumption** while optimizing volume, quality, risk and costs",
      },
      {
        text: "To enable this, the client asked Bain to develop a **governance for their carbon credit procurement**, e.g.:",
        subBullets: [
          "How to ensure strategic fit between sustainability ambition and credit procurement and retirement?",
          "How to orchestrate different central and local stakeholders across the group and what are their roles and responsibilities?",
          "What resources should CPG Co mobilize to run the necessary procurement activities?",
        ],
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        bullets: [
          { text: "Validated key design principles that should inform the carbon credit procurement governance" },
          { text: "Identified key departments and roles to be involved and function holding the role of \"internal customer\"" },
          { text: "Formalized the high-level end-to-end process and key decisions along the carbon credit procurement lifecycle" },
          {
            text: "Developed a recommendation on roles and responsibilities throughout the carbon credit management process (e.g., decision-making responsibilities, key activities and owners)",
          },
          {
            text: "Shared best practices on carbon credit team setup and size, informed by industry case studies (based on specifically developed research and market participant interviews)",
          },
          {
            text: "Assessed the financial and organizational implications of different potential short-/mid-term offset strategies and resulting volumes procured in the next 10 years",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "**Clear governance model, roles and responsibilities** validated by key stakeholders, allowing the client to hit the ground running when needed",
      },
      {
        icon: "check",
        text: "**Clear understanding of urgency** to clarify ramp-up trajectory upfront as it impacts the required governance and capabilities – incl. CEO-ready narrative",
      },
      { icon: "check", text: "**New internal IP developed** on carbon credit governance (industry best practices, process & RACI frameworks)" },
      {
        icon: "badge",
        badgeValue: "15+",
        text: "client stakeholders involved (of which key sustainability and finance decision makers)",
      },
      {
        icon: "badge",
        badgeValue: "8",
        text: "market case studies of carbon credit governance models (of which 6 specifically developed for the client)",
      },
    ],
    footnote: "Note: RACI – Responsible, Accountable, Consulted, Informed",
  },

  {
    id: "case-chemical-co-internal-carbon-pricing-strategy",
    pageNumber: 56,
    titleAccent: "Chemical Co",
    titleRest: "Internal Carbon Pricing (ICP) strategy for aligning pricing logic and supporting decarbonization efforts",
    year: "2024",
    industry: "ENR",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      { text: "**Global leader** in chemical and polymer production" },
      {
        text: "Chemical Co set an ambitious near-term target for its decarbonization journey: **~40% reduction of Scope 1 & 2 emissions by 2030**",
      },
      {
        text: "Bain supported Chemical Co in its **ICP implementation and decarb journey** by answering four questions:",
        subBullets: [
          "What is the purpose of an ICP at Chemical Co?",
          "How should ICP be applied within the organization?",
          "What metrics should be used to triangulate and validate the price level?",
          "What is the right governance to ensure ICP is deployed across the organization, updated annually, and implemented consistently?",
        ],
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        bullets: [
          {
            text: "**Interviewed key stakeholders** to understand current state, pain points, and establish an agreed upon point of departure",
          },
          {
            text: "**Benchmarked competitor & customer ICPs** to understand sustainability ambitions and strategies",
          },
          {
            text: "**Developed custom ICP model** that uses a variety of inputs to determine a current year price, future escalation, and is flexible through different scenarios",
          },
          {
            text: "**Recommended price and piloted results** across projects in various stages of development to show efficacy on project financials",
          },
          {
            text: "**Developed implementation plan and governance** to equip Chemical Co with the tools to launch ICP across the organization by mid-2024",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "**Alignment on ICP price logic and level**",
        subBullets: [
          "Developed an internal carbon price that enabled both Chemical Co's sustainability and growth ambitions",
          "Built an ICP model to adjust the price based on key inputs and changes in signposts",
        ],
      },
      {
        icon: "check",
        text: "**Developed roadmap** for initial implementation as well as annual update and review",
        subBullets: [
          "Created 6-month ICP implementation plan",
          "Developed annual ICP price level and escalation refresh process",
          "Created an ICP use assessment methodology to ensure proper & consistent utilization of ICP across the org",
        ],
      },
      {
        icon: "check",
        text: "**Increased consideration** to move forward on decarbonization projects",
        subBullets: [
          "When including an ICP, several decarbonization project financials improved enough to be considered viable",
        ],
      },
      { icon: "badge", badgeValue: "63%", text: "**closer to decarb goal***" },
      { icon: "badge", badgeValue: "2.3 MMTCo2e", text: "**reduced***" },
    ],
    footnote: "Note: *If Chemical Co moves forward with the decarbonization projects that became viable with ICP",
  },

  {
    id: "case-energy-co-gas-decarbonization-opportunity",
    pageNumber: 57,
    titleAccent: "Energy Co",
    titleRest: "Gas Decarbonization Opportunity with initiatives and business models for portfolio decarbonization",
    year: "2024",
    industry: "ENR",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Client is a **main European Energy Player**, integrated along the value chain and managing one of the **largest L/T gas portfolio in Italy**, crucial to guarantee security of supply to the system in both power generation, industrial and retail sectors",
      },
      {
        text: "Client is interested in **assessing possible levers to decarbonize its gas portfolio** looking also at examples emerging on the global markets and assessing applicability to the Italian and company-specific context",
      },
      {
        text: "Key Questions:",
        subBullets: [
          "What are the **industry key trends** in gas decarbonization?",
          "How are the **gas Midstreamers tackling portfolio decarbonization** and how are they **offering decarbonized solutions** on the market?",
          "What are the opportunities to **trade green gas in Europe**?",
          "What are the **most suitable gas decarbonization initiatives** for the Energy Co.?",
          "What are the **business models** for the selected initiatives and the **value at stake** for Energy Co.?",
          "What are the **operating models** for the selected initiatives?",
          "What are **key enablers** allowing the initiatives implementation and how **possible risks** can be limited?",
          "What is the **expected roadmap** to implement the selected initiatives? What are the **detailed steps** for the next year?",
        ],
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        bullets: [
          {
            text: "**Industry key trends and market benchmark** of main gas Midstreamers in EU and US in terms of gas portfolio decarbonization",
          },
          { text: "**Analysis** of ongoing / proposed decarbonization actions from gas producers (focus US)" },
          {
            text: "**Assessment of cross-border biomethane market** in EU with deep-dive on current regulatory context and possible evolution",
          },
          {
            text: "**Gas decarbonization initiatives long-list and prioritization** based on company-specific context",
          },
          {
            text: "**Definition of business and operating models** for the prioritized initiatives with identification of key processes, actors and responsibilities",
          },
          {
            text: "**Assessment of key enablers and risks** for the identified initiatives as well as definition of de-risking actions",
          },
          {
            text: "**Design of detailed roadmap** for initiatives' implementation, identifying activities participants, timing and deliverables",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "**INNOVATION**: Defined a set of initiatives / business models to foster gas portfolio decarbonization",
      },
      {
        icon: "check",
        text: "**IMPACT**: Initiatives to support decarbonization of end-clients and of Italian system at large",
      },
      {
        icon: "check",
        text: "**ECONOMICS**: Business models with sustainable economics and unlocking synergies with downstream activities of Energy Co.",
      },
    ],
  },

  {
    id: "case-oil-gas-co-low-carbon-business-unit-decision-quality",
    pageNumber: 59,
    titleAccent: "Oil & Gas Co",
    titleRest: "Emerging 'low-carbon' business unit decision quality stand up",
    year: "2024",
    industry: "ENR",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "**Oil & Gas Co**, a company with strong historical performance in the mature Oil and Gas Exploration and Production market, is in the process of building capabilities in emerging **'Low-Carbon' markets** by **standing up a new Business Unit** within their established corporate structure",
      },
      {
        text: "Oil & Gas Co engaged Bain to **diagnose and solve pain points** between their established capital projects planning service organization and their new 'Low-Carbon' Business Unit to **improve decision quality**",
      },
    ],
    whatWeDidHeading: "WHAT WE DID",
    whatWeDid: [
      {
        bullets: [
          {
            text: "**Embedded within Oil & Gas Co service org working team** to observe issues at interface with new Business Unit",
          },
          {
            text: "**Conducted three workshops with 20+ stakeholders** to focus work on answer-changing strategic decisions",
          },
          {
            text: "**Leveraged tools** such as probabilistics, strategy tables, and excluding framing to aid major project decisions",
          },
          {
            text: "**Codified system-wide observations** to enable the future implementation of learnings from this process to improve the operating model between legacy service organizations and Oil & Gas Co's Low-Carbon Business Unit",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "Identified **six opportunities for system-level improvements** and proposed solutions to be shared throughout the internal Oil & Gas Co capital projects service organization",
      },
      {
        icon: "check",
        text: "Developed **recommendation for a major capital project strategy** in an emerging Carbon Capture market, **presenting findings to senior Business Unit leadership** – helping primary client map earn an internal award",
      },
      {
        icon: "check",
        text: "**Defined system objectives and strategies** and established clear responsibilities and workflows between the established service organization and new Low-Carbon Business Unit for high-priority Carbon Capture market",
      },
    ],
  },

  {
    id: "case-energy-co-ccs-value-chain",
    pageNumber: 60,
    titleAccent: "Energy Co",
    titleRest: "Building Carbon Capture & Storage (CCS) value chain with de-risking strategies and cost-effective solutions",
    year: "2024",
    industry: "ENR",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Energy Co is a **leading energy player headquartered in Europe** with high ambitions for CCS as an engine 2 business focused on **offshore storage and transport of CO2**",
      },
      {
        text: "Energy Co is facing challenges in **developing the CCS value chain fast enough** due to high uncertainty and market immaturity resulting in a **\"Chicken and egg problem\"** where each part of the value chain needs to wait for the others before making capital commitments",
      },
    ],
    whatWeDidHeading: "WHAT WE DID",
    whatWeDid: [
      {
        heading: "Identified solutions",
        body: "Building the **E2E value chain** with a **portfolio approach** to de-risk large transport investments and drive scale — portfolios of stores and customers matured in parallel with transport, so the totality de-risks large transport investments, with annual control points to assess progress of customer, stores and transport development to reach targeted capacity by 2030",
      },
      {
        body: "**Defined project development model** adapted to offshore CO2 storage incl. optimized stage gate process, co-creating optimized ways of working to enable schedule-driven offshore CO2 storage projects in the prioritized store development scenarios",
      },
      {
        body: "**Created cost-effective and flexible offshore facility and CO2 well concepts** to de-risk & accelerate value chain development — similar standardised subsea facilities as for O&G but with wells optimised for CO2 stores, enabling speed via pre-investment and pre-defined concepts, and reducing risk by enabling flexibility to reuse equipment between stores if one project is stopped; fit-for-purpose concepts enable ~20-30% CAPEX reduction",
      },
    ],
    results: [
      {
        icon: "badge",
        badgeValue: ">50%",
        text: "**Lower B/E cost tariff** for CO2 by enabling investments in large transport projects",
      },
      {
        icon: "badge",
        badgeValue: "~2 years",
        text: "**Shorter schedule** from pre-access to first injection (~6 years timeline for areas requiring appraisal with wells)",
      },
      { icon: "badge", badgeValue: "~20-30%", text: "**Lower CAPEX** for offshore CO2 storage" },
    ],
  },

  {
    id: "case-steel-co-strategic-plan-review-emissions-reduction",
    pageNumber: 61,
    titleAccent: "Steel Co",
    titleRest: "Strategic plan review focusing on emissions reduction and business investment needs",
    year: "2024",
    industry: "AMS",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      { text: "**Steel Co** is the leading European steelmaking company, specializing in **steel flat products**" },
      {
        text: "Steel Co is facing **significant environmental and economic challenges**, primarily due to their dependence on BOF technology, as there is a limited availability of green energy sources and difficulties in sourcing scrap metals",
      },
      {
        text: "Additionally, steel production in Europe is expensive due to the **scarcity of raw materials** and the use of costly natural gases instead of green or blue hydrogen",
      },
      {
        text: "The main objective of the case was to help Steel Co **update, refresh, and integrate its industrial plan**",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        body: "Bain worked for **6 weeks** to define Steel Co **long-term business plan** and assess the **need for government support** in terms of investment. This included:",
      },
      {
        bullets: [
          { text: "Analyzing **commercial and technological strategies** for the plant" },
          {
            text: "Exploring **alternative technologies** such as using gases or hydrogen instead of traditional fossil fuels to mitigate environmental impact",
          },
          {
            text: "Analyzing factors like **staffing levels, technology transformation**, and **carbon emissions** reduction strategies",
          },
        ],
      },
    ],
    results: [
      {
        icon: "badge",
        badgeValue: "~25%",
        text: "**Emissions level reduction** by 2030, due to the deployment of the best available technologies",
      },
      {
        icon: "badge",
        badgeValue: "€1.2B",
        text: "Identified **strategic paths** with this in **annual EBITDA increase** in the next 5 years mainly driven by volumes and margin increases",
      },
    ],
  },

  {
    id: "case-port-co-esg-value-creation-plan",
    pageNumber: 62,
    titleAccent: "Port Co",
    titleRest: "ESG Value Creation Plan",
    year: "2024",
    industry: "AMS",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "**Port Co** operates **multiple cruise ports**, with a **varied portfolio** in terms of **geography, traffic**, and **port role** in cruise itineraries (i.e., turnaround vs. transit)",
      },
      {
        text: "Port Co is in need of an **evolution of its operating model** to act as a **catalyst of decarbonization and service excellence** across the cruise industry",
      },
      {
        text: "We have collaborated with Port Co to devise an **ESG Value Creation Plan**, with a strong focus on **infrastructural developments** (e.g., cold ironing, alternative fuels)",
      },
    ],
    whatWeDidHeading: "APPROACH",
    whatWeDid: [
      {
        body: "The **ESG Value Creation Plan** was devised following a **three-step approach**:",
      },
      {
        heading: "1. Ambition & strategy",
        bullets: [
          { text: "Assessed **point of departure** across material areas and vs. peers" },
          { text: "Understood ESG **priorities for investors**" },
          { text: "Defined ESG **vision and ambition**" },
        ],
      },
      {
        heading: "2. Value roadmap",
        bullets: [
          {
            text: "Identified key **value-accretive initiatives and needed management model improvements**, with a focus on **infrastructure plays** including but not limited to cold ironing, renewable capacity installation, and alternative fuels",
          },
          { text: "**Prioritized and planned initiatives** over time based on their ESG and economic impact" },
          { text: "Identified needed boost in **internal capabilities and partnerships**" },
        ],
      },
      {
        heading: "3. Communication",
        bullets: [
          { text: "Assessed **communication / disclosure** vs. best-in-class practices" },
          { text: "Identified **areas for improvement**" },
          { text: "Defined **ESG narrative and communication plan**" },
        ],
      },
    ],
    results: [
      { icon: "flag", text: "**Identified potential improvements**" },
      { icon: "badge", badgeValue: "5+%", text: "**EBITDA improvement**" },
      { icon: "badge", badgeValue: "1x", text: "**TEV/EBITDA multiple growth**" },
      { icon: "check", text: "**Significant emission reduction** across Scope 1, 2, and 3" },
    ],
  },

  {
    id: "case-metal-packaging-co-carbon-transition-plan",
    pageNumber: 63,
    titleAccent: "Metal Packaging Co",
    titleRest: "We assisted client in developing, costing, and executing a carbon transition plan",
    year: "2024",
    industry: "AMS",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Packaging Co is a **Metal Packaging manufacturer** which aims to **lead the packaging industry on sustainability**",
      },
      {
        text: "Packaging Co, which has an **industry-leading carbon transition plan**, requested our support **to fully cost their plan**, in order to optimize it and drive delivery acceleration",
      },
      {
        text: "In order to assess decarbonization costs, the company also needed to **map relevant policies, regulations** (e.g. EU ETS, CBAM, PPWR) and their **impact on costs**",
      },
    ],
    whatWeDidHeading: "WHAT WE DID",
    whatWeDid: [
      {
        heading: "Reviewed and updated marginal abatement cost curve",
        bullets: [
          { text: "Review existing decarbonization levers, **identifying key areas to pressure test**" },
          { text: "Assessed **investments and emissions reduction potential** for decarbonization levers" },
          { text: "Identified potential **risks and opportunities** (market, technical, policy, regulatory, etc.)" },
          {
            text: "Modeled **MACC scenarios and sensitivities** based on regulatory uncertainty and ability to drive premiums/investment from customers",
          },
          { text: "**Prioritized decarbonization levers** for cost optimization" },
        ],
      },
      {
        heading: "Evaluate impact of regulation",
        bullets: [
          { text: "Identified **current and upcoming EU policies and subsidies** affecting the company" },
          {
            text: "Assessed **regulation impact across scenarios** on company's costs, abatement potential, and entire value chain",
          },
          {
            text: "Conducted **sensitivity analysis of abatement costs** based on developed scenarios, potential risks and opportunities (market, technical, policy, regulatory, etc.)",
          },
          { text: "Assessed **impact on customer differentiation and source of funding**" },
        ],
      },
      {
        body: "Conducted a **top-down analysis of customer WTP** (e.g., green premium, co-investment potential) and government subsidies (e.g., CCfD) to identify the potential sources and funding MP Co can receive for decarbonization",
      },
      {
        heading: "Developed an actionable plan and implementation timeline",
        bullets: [
          {
            text: "Detailed key **abatement levers, NPVs of investments** against base case, readiness levels of technologies, critical organization actions to mobilize value chain, etc.",
          },
          {
            text: "Engaged key stakeholders and broader organization to ensure **cross-functional buy-in and co-creation** of clear action plan",
          },
          {
            text: "Developed **actionable plan with timeline** for executive team to implement moving forward, including line engagement to ensure ownership by the line",
          },
          { text: "Highlighted **implications for current decarbonization and cost plan**" },
        ],
      },
    ],
    results: [
      { icon: "check", text: "Calculated **cost impact of decarbonization plan** and various scenarios" },
      {
        icon: "check",
        text: "Developed **high level activation plans** for the full carbon transformation of business",
      },
      {
        icon: "check",
        text: "**Dynamic and updatable MACC** to continuously optimize pathway over time",
      },
      {
        icon: "check",
        text: "Identified **potential source of funding** for decarbonisation journey",
      },
    ],
  },

  {
    id: "case-agri-co-nbs-project-assessment",
    pageNumber: 58,
    titleAccent: "Agri Co",
    titleRest: "NBS project assessment and implementation planning for decarbonization efforts",
    year: "2024",
    industry: "ENR",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      { text: "Agri Co is a **global agricultural company** that aims to decarbonize its operations" },
      {
        text: "Agri Co seeks advice to",
        subBullets: [
          "Understand decarbonization levers focusing on **NBS projects**, light touch no-deforestation and traceability",
          "Develop a **framework to prioritize NBS projects** to develop as carbon projects and gain experience with implementation",
          "Understand how NBS projects contribute to its **decarbonization agenda**",
        ],
      },
      {
        text: "Major project types include **ARR, Regen Agri, AWD, Biochar** (Artisan and Industrial)",
      },
      {
        text: "Key Questions:",
        subBullets: [
          "What are the key **eligibility criteria** for carbon projects according to the highest standards today?",
          "What is eligible for **insetting vs. offsetting**?",
          "How much is the **carbon mitigation and value creation potential** for each project? What are the key drivers?",
          "How should Agri Co **prioritize NBS projects**? What are the **financing options** to fund the selected projects?",
          "What does Agri Co's **2030 and 2050 decarbonization roadmap** look like?",
          "What does the **implementation plan and timeline** look like?",
        ],
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        body: "Bain developed a **framework** for Agri Co to evaluate NBS¹ projects – meet conditions for eligibility for carbon standards, scale, IRR > WACC, then prioritized using **feasibility** (ease of implementation), **carbon mitigation potential** and **value creation potential**",
      },
      {
        body: "**Screened long-list** of Agri Co's potential NBS projects & select **top 3-5 priority projects** based on framework",
      },
      {
        body: "Developed **archetype investment cases**, proposed **financing options** and drafted **implementation plans**. Refined **2030 decarbonization roadmap**. Also, developed **carbon models and value creation models** with expert input",
      },
      {
        heading: "Key Analysis",
        bullets: [
          {
            text: "Create **minimum boundary conditions**: suitability against carbon standards, able to generate high quality carbon credits, SBTi eligibility to reduce Scope 3, technically viable and creating value to Agri Co",
          },
          {
            text: "Helped in **carbon mitigation potential**, **project value creation** (e.g., credits etc.), **ease of implementation** (e.g., stakeholder management etc.), **financing options** and **implementation roadmap**",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "**Prioritized 5 archetype projects** resulting in **1.5 Mt CO2e** carbon mitigation potential and **~$800M net value creation** (NPV)",
      },
      {
        icon: "check",
        text: "**Shortlisted NBS projects** at full potential and no deforestation commitment give **16 Mt CO2e** in carbon mitigation in 2030",
      },
      {
        icon: "check",
        text: "**BU CEOs onboard** to pilot and learn from archetype projects, and commit to short term decarbonization targets",
      },
    ],
    footnote:
      "Note: NBS = Nature Based Solutions, IRR = Internal Rate of Return, WACC = Weighted Average Cost of Capital, SBTi = Science Based Targets initiative",
  },

  {
    id: "case-asset-management-co-sea-climate-investment-strategy",
    pageNumber: 65,
    titleAccent: "Asset Management Co",
    titleRest: "SEA Climate Investment Strategy",
    year: "2024",
    industry: "PE",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "The client, a **US-based global family office investor**, was looking to develop its climate investing strategy",
      },
      { text: "**SEA** was selected as the initial geographical region of focus" },
      {
        text: "The client hired Bain to help develop its **climate investment strategy**, inclusive of ambition, investment focus areas, investment opportunities and mobilization plan",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        bullets: [
          {
            text: "Developed **client's climate investment ambition, strategic priorities and targets**, including guiding principles and KPIs to measure success and ensure delivery",
          },
          {
            text: "Assessed **landscape of climate investing opportunities** and developed **robust framework** for prioritization and thematic investment",
          },
          {
            text: "Developed **portfolio allocation strategy** based on prioritized sectors and strategic focus areas, and identified potential investment opportunities, including funds, startups, project developers etc.",
          },
          {
            text: "Conducted **workshop with leadership team** to socialize key findings, achieve global alignment and buy-in",
          },
          {
            text: "Conducted **light touch commercial and impact due diligences** for select opportunities for near-term investment",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "**Fund vision & ambition**: Overall objectives of the fund, including quantified goals and targets",
      },
      {
        icon: "check",
        text: "**Climate investment strategy**: Methodical framework to prioritize highest impact sectors and focus areas within sectors to invest in",
      },
      {
        icon: "check",
        text: "**Investment opportunities**: List of potential investment opportunities in the short and long term, including innovative 'blue sky' ideas",
      },
    ],
  },

  {
    id: "case-swf-co-net-zero-operationalization",
    pageNumber: 64,
    titleAccent: "SWF Co",
    titleRest: "Net Zero Operationalization",
    year: "2024",
    industry: "PE",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "SWF Co aims to **achieve Net Zero by 2050** across corporate and portfolio emissions, **balancing real-world decarbonization with financial returns**",
      },
      {
        text: "Now, SWF Co seeks to **operationalize this ambition** and ensure that both existing and new investments move towards this target",
        subBullets: [
          "**Transition framework:** Framework for 'brown-to-green' assets/portfolio",
          "**Carbon wallets:** Model to guide investment decisions in line with path to Net Zero and manage expected emissions by investment unit along decarbonization trajectory",
        ],
      },
      {
        text: "To enable this, SWF Co asked Bain for support with the to **operationalize Net Zero**, e.g.:",
        subBullets: [
          "What is the best way to structure an **internal transition framework** to drive brown-to-green investments?",
          "How to ensure **real-world decarbonization impact** while making appropriate financial returns?",
          "How to **integrate carbon emissions** into the investment decision making of financial investors?",
        ],
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        heading: "① Developed Transition Framework",
        bullets: [
          {
            text: "**Reviewed transition philosophy**, cornerstones, targets and shortlisted transition approaches with SWF Co",
          },
          { text: "Evaluated **financial feasibility** and **benchmarked against global industry best practices**" },
          {
            text: "Assessed **peer strategies and transition scenarios** (e.g., IEA, GFANZ, SBTi) to define the most suitable pathways",
          },
          { text: "Defined **sector-specific decarbonization pathways** (e.g., Aluminum, Energy, Chemicals)" },
        ],
      },
      {
        heading: "② Designed Carbon Wallets",
        bullets: [
          { text: "Developed **governance and decision-making principles** for carbon management" },
          { text: "**Benchmarked peer approaches** and evaluated alternative steering mechanisms" },
          {
            text: "Enhanced **carbon emissions modeling**, integrating scenario analysis and sensitivity assessments",
          },
          { text: "Built an **automated carbon wallet tool** for tracking, analyzing, and managing carbon-linked investments" },
          { text: "Conducted **pilot testing** with select investments and refined functionalities based on feedback" },
        ],
      },
      {
        heading: "③ Supported internal socialization",
        bullets: [
          { text: "**Supported and developed materials** for socialization / key stakeholders' involvement" },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "**Structured Transition Framework** with defined governance, investment principles, and asset exit strategies",
      },
      {
        icon: "check",
        text: "**Clear decarbonization pathways** for key sectors, integrating top-down and bottom-up analyses",
      },
      {
        icon: "check",
        text: "Developed a **Carbon Wallet Model** to manage emissions at fund and sector levels",
      },
      {
        icon: "check",
        text: "**Enhanced decision-making mechanisms**, ensuring SWF Co's Net Zero strategy is actionable and scalable",
      },
      {
        icon: "badge",
        badgeValue: "~10",
        text: "**benchmarks case studies** leveraged, including best practices on offset procurement models",
      },
    ],
  },

  {
    id: "case-tech-co-net-zero-value-creation-business-case",
    pageNumber: 70,
    titleAccent: "Tech Co",
    titleRest: "Net Zero Value Creation by Bain, building a business case for Tech Co's ambitious decarbonization plan",
    year: "2024",
    industry: "TCS",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "**Tech Co committed to Net Zero by 2030 and has a plan** to achieve this reduction both through improving operations and catalyzing systems change",
      },
      {
        text: "Their Climate Ops team sought support to **build the quantified business case** for achieving Net Zero across a **range of future scenarios** (e.g., impact from policy, tech, consumer behavior, competitive dynamics, growth)",
      },
      {
        text: "Bain was brought in to **quantify outside-in** how Tech Co's Net Zero plan drives value–with a **focus on return** (i.e., not looking at required investments)",
      },
    ],
    whatWeDidHeading: "WHAT WE DID",
    whatWeDid: [
      {
        body: "Built NZ value framework to prioritize and quantify 11 levers that drive value to the client and society at large, as well as a longer list of other benefits we did not quantify",
      },
      {
        body: "We dimensionalized what the World could look like with scenarios across the pace of carbon transition, Tech Co's position on decarb. and growth rates with/without AI",
      },
      {
        body: "Based on the scenarios, we built a range of outcomes for the business case for Net Zero to inform strategic decisions and provided select deep dives (e.g., case studies) to make the \"how\" of value capture more tangible",
      },
    ],
    results: [
      {
        icon: "check",
        text: "Identified **$XB in gross profit impact** to Tech Co and **$YB in catalyzed system value** in expected case",
      },
      { icon: "check", text: "Identified the key levers with **highest impact** on business case and **sensitivity to** different scenarios" },
      { icon: "check", text: "Synthesized **strategic implications** for Tech Co on e.g., commercial and policy advocacy topics" },
      { icon: "check", text: "Built a **leave-behind, scenario-based model** for the client to use going forward" },
      ],
  },

  {
    id: "case-investment-co-real-estate-sustainability-strategy",
    pageNumber: 49,
    titleAccent: "Investment Co",
    titleRest: "Real Estate Sustainability Strategy",
    year: "2025",
    industry: "PE",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Investment Co invests **globally across public and private markets**, with a large real estate investment footprint",
      },
      {
        text: "Investment Co was seeking to:",
        subBullets: [
          "Build a unified, scalable real estate portfolio strategy with sustainability integrated across the investment lifecycle",
          "Link decarbonization and climate risks to value creation through standardized, region-specific assessments",
          "Enable execution by strengthening data systems, governance structures, and stakeholder engagement for consistency across the portfolio",
        ],
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        bullets: [
          { text: "**Assessed baseline** of current physical and transition risk of the portfolio and associated risk exposure" },
          {
            text: "**Defined a global sustainability strategy** to create and preserve value from physical and transition risk, including:",
            subBullets: [
              "How each risk type can drive value for Investment Co",
              "Building a strategy to address the risk and a roadmap to capture the highest pockets of opportunity",
            ],
          },
          {
            text: "**Created action heatmap to operationalize the strategy**, based on areas of most impact, including estimated \"size of prize\"",
          },
          {
            text: "**Shaped a strategy mobilization plan** to integrate sustainability across the full investment lifecycle - including diligence, ownership, and exit - through clearer guidance, sharper risk/opportunity assessment by region / asset class, and consistent application",
          },
        ],
      },
    ],
    results: [
      { icon: "flag", text: "Optimizing portfolio for sustainability would deliver **~4-6% increase** in property value" },
      { icon: "check", text: "**10-20% lower insurance premium** for high physical risk assets" },
      { icon: "check", text: "**40-60% reduced energy usage** through transition to green energy" },
      { icon: "check", text: "**60-120 bps lower cap rates** for green vs. brown buildings (excluded from value estimate)" },
      { icon: "check", text: "**5-15% higher rent** for greener / more resilient assets" },
      { icon: "flag", text: "Defined **asset-level plans** and aligned approach to integrate sustainability into investment lifecycle" },
    ],
  },

  {
    id: "case-chemicals-co-low-carbon-advocacy-strategy",
    pageNumber: 47,
    titleAccent: "Chemicals Co",
    titleRest: "Low Carbon Advocacy Strategy",
    year: "2025",
    industry: "ENR",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      { text: "Chemicals Co is a **large plastics producer** with operations around the world." },
      {
        text: "Chemicals Co is considering several **large investments to grow production of low carbon polyolefins** in the United States and Germany",
      },
      {
        text: "The attractiveness of these investments depends in part on **government regulation** in the United States, in Germany, and by the EU",
      },
      { text: "Government policies that could potentially affect low carbon business outcomes are **numerous and evolving rapidly**" },
      { text: "Chemicals Co was not sure **which policies to prioritize** in advocacy or what positions to take" },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        bullets: [
          { text: "**Assessed the impact** on low carbon business investments and Chemicals Co **ability to influence** outcomes for key policies" },
          { text: "**Defined potential future-state policy scenarios** and identified the one(s) that would be best and worst for Chemicals Co" },
          { text: "Estimated the **value at stake** associated with achieving desired policy outcomes (~$3B+)" },
          { text: "**Developed hypothesis on key stakeholders** to advocate with" },
          { text: "**Identified gaps** in Chemicals Co coverage of key stakeholders" },
          {
            text: "Helped Chemicals Co government relations team to **create advocacy playbooks** that provide key messaging and tactical plan for advocacy with key stakeholders",
          },
          {
            text: "**Diagnosed issues with Chemicals Co operating model** (e.g., key activities, process, and accountabilities) and recommended targeted improvements",
          },
        ],
      },
    ],
    results: [
      { icon: "check", text: "**Prioritized policies** for Chemicals Co advocacy efforts" },
      { icon: "check", text: "**Defined policy positions** and aligned internal stakeholders on key messages" },
      { icon: "check", text: "**Motivated re-allocation of resources** to stakeholders that would matter most" },
      {
        icon: "check",
        text: "**Developed Chemicals Co capabilities** to run an efficient, agile process to develop advocacy priorities, positions, and tactical plans",
      },
    ],
  },

  {
    id: "case-defence-co-climate-scenario-analysis",
    pageNumber: 48,
    titleAccent: "Defence Co",
    titleRest: "Climate Scenario Analysis",
    year: "2025",
    industry: "AMS",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      { text: "Defence Co is a **leading Aerospace & Defence player** operating in multiple market segments" },
      {
        text: "The company has made a **strong commitment to sustainability**, adopting science-based targets and embedding these goals into its industrial plan to **build a strategy resilient to evolving climate futures**",
      },
      {
        text: "To support these ambitions, Bain was engaged to help **develop a comprehensive framework** for assessing:",
        subBullets: [
          "**Physical risks**: Evaluate the potential impact of climate-related hazards and future damages to assets and operations under different global warming scenarios through 20XX",
          "**Transition risks**: Analyze exposure to policy, market, and technological shifts—and the potential associated costs",
        ],
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        body: "Bain supported the client in developing a **comprehensive analytical framework to assess climate-related risks and define appropriate mitigation strategies** across two key dimensions",
      },
      {
        heading: "Physical risk analysis",
        bullets: [
          { text: "**Selected critical sites** based on a set of strategic criteria, leveraging site-specific data and a structured screening process" },
          { text: "**Assessed company's footprint risk exposure** against chronic and acute perils using Jupiter's climate data and scenario modeling" },
          {
            text: "**Quantified the potential economic impact** under future climate scenarios through 20XX, focusing on operational disruptions and asset damage to manufacturing sites and offices",
          },
          {
            text: "**Established mitigation roadmap** with a cross-functional team to develop an action plan addressing identified risks, with measures embedded into the Enterprise Risk Management (ERM) framework to strengthen business resilience",
          },
        ],
      },
      {
        heading: "Transition risk analysis",
        bullets: [
          {
            text: "**Identified three key risk levers**—Policy & Legal, Market, and Technology—based on the ESRS framework and their potential strategic impact on Defence Co",
          },
          {
            text: "**Prioritization of levers** using Defence Co's Double Materiality matrix and benchmarked against industry peers and leading practices",
          },
          {
            text: "**Deployed dimension-specific approaches**:",
            subBullets: [
              "**Policy & Legal**: Applied scenario analysis (based on IPCC trajectories to 20XX) to estimate potential costs from carbon pricing and energy pass through",
              "**Market**: Used a mixed qualitative and quantitative approach to assess the impact of ESG requirements in public procurement processes on EBITA",
              "**Technology**: Identified technology trends specific to the industry and with a potential impact from a climate mitigation / climate adaptation perspective, conducted interviews with strategy and divisional leads to evaluate alignment of the product portfolio and technology readiness vs emerging technologies and to identify future business opportunities",
            ],
          },
        ],
      },
    ],
    results: [
      { icon: "flag", text: "Revealed that **risk-adjusted annual climate losses could be ~5x** the current damages recorded" },
      { icon: "flag", text: "Projected **future expected annual losses from climate events** to be equivalent to **~8% of Defence Co's EBITA¹**" },
      { icon: "check", text: "**Established a cross-functional physical risk task force** to embed climate risk analysis into corporate risk management" },
      { icon: "flag", text: "Estimated potential **carbon-related costs reaching up to ~7% of EBITA¹ annually** driven by Policy & Legal risk exposure" },
      { icon: "flag", text: "Estimated a potential **EBITA¹ impact of +6% or -2% in future tenders**, depending on Defence Co's ESG performance" },
      { icon: "check", text: "**Mapped current technology maturity against emerging industry trends** to identify climate-resilient opportunities, highlighting potential revenue upsides" },
    ],
    footnote: "Note: (1) EBITA is a KPI used by the client, it is the EBITDA + (D)epreciation",
  },

  {
    id: "case-utility-co-transmission-generation-strategic-due-diligence",
    pageNumber: 55,
    titleAccent: "Utility Co",
    titleRest: "Transmission and generation strategic due diligence for evaluating renewable energy investments",
    year: "2024",
    industry: "ENR",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      { text: "Utility Co is an **US regulated utility** that has been providing electric and gas service for more than 100 years" },
      { text: "The company has an **ambitious goal of reaching net-zero by 2045**, with specificity around 2030 and 2040 targets" },
      {
        text: "To enable their rapid decarbonization, Utility Co is **exploring major transmission and renewable generation projects,** with a strategic focus on a **potential multi-billion-dollar investment** that would span multiple geographic footprints",
      },
      { text: "**Utility Co asked Bain to provide a diligence assessment,** working with the Chief Renewable Officer and the broader C-Suite" },
    ],
    whatWeDidHeading: "WHAT WE DID",
    whatWeDid: [
      {
        bullets: [
          {
            text: "Developed an **investment thesis to evaluate the desirability and feasibility of the project** across key focus areas including customers, shareholders, policy & regulation, developability, deliverability, and risk",
          },
          {
            text: "**Synthesized 2+ years of prior diligence** across legal, environmental, and financial areas to create a clear view of all work done to date within the organization and by independent consultants",
          },
          {
            text: "Reviewed **20+ similar transmission and generation case studies** to identify themes that enabled project success and common pitfalls that delayed or ultimately terminated projects",
          },
        ],
      },
    ],
    results: [
      { icon: "check", text: "**Preliminary \"go / no go\" answer** on whether utility should invest in the renewable energy generation facility and transmission line" },
      { icon: "check", text: "**Identification of key investment stage gates** and the associated commitments and opportunity costs for each" },
      { icon: "check", text: "**Creation of strategic risk register and risk mitigation strategies**" },
      { icon: "check", text: "**Repeatable diligence and multi-department PMO model** for Utility Co to use in the future" },
    ],
  },

  {
    id: "case-investment-fund-co-sustainability-strategy",
    pageNumber: 54,
    titleAccent: "Investment Fund Co",
    titleRest: "Sustainability Strategy",
    year: "2025",
    industry: "FS",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "The Investment Fund Co seeks support on two key modules as part of its ESG Strategy development:",
        subBullets: [
          "**Carbon reduction framework and plan:** Developing the carbon reduction framework and plan through appropriate levers for Investment Fund Co's portfolio of investments",
          "**Carbon markets and advisory services:** Assessing opportunity to set-up viable Net-Zero advisory and carbon trading desks at Investment Fund Co as part of service offering",
        ],
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        heading: "1. Carbon reduction framework and plan:",
        bullets: [
          { text: "Benchmarked carbon reduction frameworks and extracted key lessons" },
          { text: "Defined reporting approach (including scopes 1, 2, 3 coverage) and established Investment Fund Co's emissions baseline (operational + financed)" },
          { text: "Set target-setting methodology and emissions scoring guidelines" },
          { text: "Assessed key decarbonization levers by subsector and developed marginal abatement cost curves" },
          { text: "Developed high-level action plan with signposts for monitoring" },
        ],
      },
      {
        heading: "Carbon markets and advisory services:",
        bullets: [
          { text: "Benchmarked service offerings and carbon market trends across leading financial institutions" },
          {
            text: "Evaluated client demand via survey and expert interviews and prioritized service offerings based on market attractiveness and Investment Fund Co's ability to win",
          },
          { text: "Performed scenario analysis and defined key market development signposts" },
          {
            text: "Proposed changes to Investment Fund Co's operating model to support carbon market opportunities, including capabilities required, organizational structure changes, strategic partnerships, and engagement approach",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "**Carbon reduction framework and plan:** Framework developed for Investment Fund Co's operational and financed emissions, including a high-level action plan and necessary implementation tools",
      },
      {
        icon: "check",
        text: "**Carbon markets and advisory services:** Services offerings prioritized with proposed changes to the operating model and a high-level action plan (including immediate next steps for Investment Fund Co)",
      },
    ],
  },

  {
    id: "case-asset-manager-co-climate-transition-approach-transition-model-review",
    pageNumber: 46,
    titleAccent: "Asset Manager Co",
    titleRest: "Climate Transition Approach and Transition Model Review",
    year: "2026",
    industry: "PE",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Asset Manager Co, a **US alternatives-focused financial services firm (with > 450bn AuM)**, is seeking outside-in validation and support to strengthen its proprietary **climate transition program and transition model**",
      },
      {
        text: "**Complications:**",
        subBullets: [
          "Increasing investor interest and scrutiny, not consistent use of tool or application of climate in investment program across asset classes",
          "Interest to benchmark the program against peers and the tool against industry best practices (incl. PMDR)",
          "Desire to differentiate with a credible and authentic approach and framework",
        ],
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        body: "Conducted a **hypothesis-driven review** of the climate transition program to **deliver pragmatic, decision-relevant insights** on how it can be strengthened and scaled",
      },
      {
        heading: "1. Assessed the climate program through desk review and dedicated interviews",
        bullets: [
          { text: "Engaged deal teams and the climate specialists" },
          { text: "Pinpointed key strengths, gaps, and execution challenges" },
        ],
      },
      {
        heading: "2. Developed a firm-wide climate maturity framework to assess how Asset Manager Co ranks vs key peers (informed by benchmarking)",
        bullets: [
          { text: "Evaluated how climate considerations are embedded across the investment lifecycle" },
          { text: "Reviewed supporting frameworks, tools, and governance" },
        ],
      },
      {
        heading: "3. Conducted an in-depth review of the transition model and supporting framework",
        bullets: [
          { text: "Assessed strengths, limitations, and role within the broader program and vs. PMDR" },
          { text: "Evaluated usability, scalability, and execution readiness" },
        ],
      },
      {
        heading: "4. Synthesized findings into program recommendations, including tactical tool refinements and operating model improvements",
      },
    ],
    results: [
      { icon: "check", text: "Defined a **prioritized set of targeted refinements** to strengthen program impact and adoption" },
      { icon: "check", text: "Identified **tactical enhancements to the tool** and associated framework to improve consistency, comparability and adoption" },
      { icon: "check", text: "Developed a **maturity journey framework** and benchmarked firm-wide positioning to clarify pathways for progression" },
    ],
  },

  {
    id: "case-bank-co-climate-change-strategy-transition-approach",
    pageNumber: 53,
    titleAccent: "Bank Co",
    titleRest: "Climate change strategy and transition approach",
    year: "2025",
    industry: "FS",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      { text: "Client is a **leading Bank in MENA region** with core presence in Qatar, Egypt, and Türkiye" },
      {
        text: "The bank is under pressure to develop and announce its **climate change ambition and transition approach**, driven by:",
        subBullets: [
          "**Investor expectations** leading to impact on **cost of funding**",
          "Potential impact on ESG/ credit ratings",
          "**Growing regulatory action and pressure** across core markets, especially Türkiye",
          "**Increased momentum from regional and global peer banks** announcing climate commitments",
        ],
      },
      {
        text: "Bain was engaged to support the development of the Bank's **climate ambition**, define **decarbonization strategy for the key sectors**, and outline an **execution roadmap**",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        heading: "Aspiration-setting",
        bullets: [
          { text: "Conducted **leadership interviews**, established **baseline of current efforts**, and **benchmarked regional and global peers**" },
          {
            text: "Detailed recommendation on Bank Co's **climate change ambition**, including recommendation on **external commitment**, **NZBA membership**, and **Net Zero operationalization** requirements",
          },
        ],
      },
      {
        heading: "Decarbonization strategy",
        bullets: [
          { text: "**Identified 10 priority sectors across 3 core markets** with most material impact on bank's loan portfolio and financed emissions mix" },
          {
            text: "Outlined **key decarbonization enablers** for each of the prioritized sectors, developed **decarbonization pathways** and aligned on the **interim 2030 targets**",
          },
          { text: "Outline the ambition and **action plan for** decarbonization of the bank's **operational emissions**" },
          { text: "Identified **transition finance opportunities** from Bank's climate change ambition across priority sectors and markets" },
        ],
      },
      {
        heading: "Execution roadmap",
        bullets: [
          {
            text: "Detailed **execution roadmap to operationalize** the Bank's climate change ambition (incl. designing delivery engine, outlining data mgmt. approach, etc.)",
          },
          { text: "Proposed **changes to Risk Appetite Statement** to align with new climate change ambition" },
        ],
      },
    ],
    results: [
      { icon: "check", text: "Aligned on Bank Co's **Group-level climate change ambition**, cascaded down to core markets: overall **Net Zero commitment by 2050**" },
      { icon: "check", text: "**Net Zero commitment for Scope 1 and 2 emissions by 2035**" },
      { icon: "check", text: "Detailed recommendation on **NZBA membership** and **external commitment**" },
      { icon: "flag", text: "Prioritized **10 sectors across 3 core markets**, setting **interim 2030 targets** and defining **decarbonization pathways** for each sector" },
      { icon: "flag", text: "Sized **decarbonization levers** and **transition finance opportunities** across priority sectors and markets" },
      { icon: "flag", text: "Developed **detailed execution roadmap** to operationalize Bank Co's climate change ambition" },
    ],
  },

  {
    id: "case-choco-co-sbti-operationalization-program",
    pageNumber: 50,
    titleAccent: "Choco Co",
    titleRest: "SBTi Operationalization Program to implement decarbonization action across countries and business functions",
    year: "2025",
    industry: "CP",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Choco Co committed to the **Science Based Targets initiative (SBTi)** to reduce emissions in line with requirements for a **1.5ºC pathway**",
      },
      {
        text: "Operationalizing this commitment, across 20+ countries and multiple business functions, requires a **structured approach** as well as the support of a **fit-for-case operating model**",
      },
      {
        text: "Setting-up and launching a company-wide decarbonization effort requires **dedicated expertise**, a **rapid rollout** and **operationalization of the SBT principles**, which is where Bain came into support",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        heading: "Actions and targets",
        bullets: [
          {
            text: "**Developed decarbonization action model** across countries and levers (e.g., cocoa, energy, …) to be used by countries for local plan creation, and centrally for global plan consolidation",
          },
          { text: "**Defined sprints and phases for program rollout** and supported 4 countries in the end-to-end set-up of country plans (pilot phase)" },
        ],
      },
      {
        heading: "Operating model",
        bullets: [
          { text: "Set-up **SBT decarbonization approach** to enable Choco Co decarbonization pathway (e.g., governance, resources, risks, tools, etc.)" },
          { text: "**Coordinated multiple kickoff sessions** and **drove weekly interactions** to ensure engagement and results-delivery" },
          { text: "Defined the **approach for decarbonization target setting,** incl. review and mechanism for potential gap vs. guidance allocation" },
          { text: "Created an **approach to review the carbon footprint** of countries' product portfolio (at SKU level) with marketing & sales functions" },
          { text: "**Mapped current processes** relevant for SBT and **integrated SBT tradeoffs** decisions into existing processes" },
        ],
      },
      {
        heading: "Change management and communication",
        bullets: [
          {
            text: "Supported Carbon Program Manager to **engage with key stakeholders** on program deployment (e.g., created communication material, checklists, educational material, etc.)",
          },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "**1. Targets & actions**",
        subBullets: ["Target guidance for **~20 countries**", "Country GHG reduction plans (55+ actions, time & resources)", "Energy actions for 12 locations, 1 on-site audit pilot"],
      },
      {
        icon: "check",
        text: "**2. Operating model**",
        subBullets: ["Roles/ responsibilities & FTEs", "Processes & governance (budget, investment, SBT setting)", "Accountability & incentive guidelines", "Pragmatic tools for execution"],
      },
      {
        icon: "check",
        text: "**3. Test, learn, scale-up**",
        subBullets: ["Piloted approach in **4 countries**", "Built capabilities: playbooks, training materials, 11 videos", "Engaged **100+ employees** in ~20 countries, over 7 months"],
      },
    ],
  },

  {
    id: "case-bank-co-decarbonization-strategy-co2-advisory-tool-development",
    pageNumber: 51,
    titleAccent: "Bank Co",
    titleRest: "Decarbonization Strategy and CO2 Advisory Tool Development",
    year: "2025",
    industry: "FS",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Leading European Bank launched a multi-year initiative to develop an end-to-end **CO2 advisory tool** aligned with its 20XX–20XX Industrial Plan and its ambition to support **SMEs and agribusiness clients** in their **Net Zero transition**",
      },
      { text: "The **goal** of the tool is **emissions measurement (Scope 1 & 2)**, target setting, and decarbonization actions" },
      {
        text: "Key challenges for Bank Co included:",
        subBullets: [
          "Evolving **SBTi and regulatory landscape**",
          "Need for **sector-specific methodologies** tailored to Agribusiness sub-sectors",
          "Alignment with **banking frameworks (e.g., NZBA)** for financed emissions",
          "Coordination across **multiple stakeholders** and managing delivery complexity",
        ],
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        heading: "Regulatory and methodological assessment",
        bullets: [
          { text: "Supported Bank Co in analyzing **SBTi target-setting methodologies** and ensured alignment with **EU and local regulations**" },
          { text: "Identified potential divergences across frameworks" },
        ],
      },
      {
        heading: "Sector-specific decarbonization methodology design",
        bullets: [
          { text: "Defined **sector-level emission reduction pathways** and translated them into **company-level target-setting approaches** for SMEs" },
          { text: "Collaborated closely with the **local agribusiness body** to validate assumptions and reflect sector-specific emission drivers" },
        ],
      },
      {
        heading: "Alignment with banking frameworks (NZBA)",
        bullets: [
          { text: "Assessed **leading banking practices** under NZBA" },
          { text: "Conducted **scenario analyses** to evaluate portfolio-level implications of sectoral decarbonization pathways" },
          { text: "Assessed coherence between **client-level target-setting approaches** and **banking financed-emissions frameworks**" },
        ],
      },
      {
        heading: "Tool development and Proof of Concept",
        bullets: [
          { text: "Defined **data collection and input models** supporting the calculation of sectoral reduction curves" },
          {
            text: "Developed an **Excel-based Proof of Concept**, integrating:",
            subBullets: ["Module 1: Emissions calculation", "Module 2: Target setting logic", "Module 3: Decarbonization action prioritization"],
          },
          { text: "Defined **user experience and functional architecture** for tool deployment" },
        ],
      },
    ],
    results: [
      {
        icon: "check",
        text: "End-to-end **CO₂ tool design (Modules 1–3)**, including user experience, functional logic, and integration with the emissions calculation framework",
      },
      { icon: "check", text: "**Module 1 successfully deployed**, enabling live emissions calculation usage" },
      { icon: "check", text: "An **Excel-based Proof of Concept** developed to support SME target setting and prioritization of decarbonization actions" },
      { icon: "check", text: "**Sector-specific decarbonization methodologies** established for agribusiness, addressing key data and methodological gaps" },
      { icon: "check", text: "Enhanced **ESG and decarbonization capabilities**, particularly in GHG target setting and sector-specific approaches" },
    ],
  },

  {
    id: "case-bank-co-net-zero-integration-credit-portfolio-steering",
    pageNumber: 52,
    titleAccent: "Bank Co",
    titleRest: "Net Zero Integration into Credit and Portfolio Steering",
    year: "2025",
    industry: "FS",
    product: "Sustainability Value Creation Plan",
    solutionIds: ["sustainability-value-creation"],
    situation: [
      {
        text: "Bank Co has defined a clear net zero ambition and was looking to **translate that ambition into practical steering across credit and portfolio decisions**",
      },
      { text: "The bank wanted to move beyond emissions monitoring toward a more **actionable model**." },
      {
        text: "The goal was to **link transaction-level lending decisions with portfolio-level decarbonization** objectives, while remaining aligned with growth and risk-management priorities",
      },
      {
        text: "The work focused on **embedding net zero considerations across the lending lifecycle**, from origination through monitoring, limit utilization, and portfolio rebalancing",
      },
    ],
    whatWeDidHeading: "WHAT BAIN DID",
    whatWeDid: [
      {
        body: "Designed an **integrated net zero steering model** across both credit and portfolio processes. The work included:",
      },
      {
        bullets: [
          {
            text: "**Mapping key credit and portfolio decision points** where net zero factors could be embedded, including data collection, transaction impact assessment, pricing, limit setting, utilization monitoring, and portfolio rebalancing",
          },
          {
            text: "Developing a **carbon-led steering concept** to **quantify each transaction's impact versus decarbonization pathways** and connect loan-level decisions to sector-level portfolio outcomes",
          },
          {
            text: "Recommending a **phased implementation path**, a monitoring approach in the near term and tighter integration into business decisions over time as data and operating readiness mature",
          },
          {
            text: "Designing **governance across Risk, Sustainability, Business Units, and Credit Allocation** to clarify ownership, reporting cadence, monitoring, and escalation",
          },
          {
            text: "Defining supporting **KPIs, and dashboards to reinforce adoption**, improve data quality, and **track alignment of credit decisions** with net zero objectives across functions",
          },
        ],
      },
    ],
    results: [
      { icon: "check", text: "Mapping for **end-to-end net zero integration** across credit lifecycle and portfolio steering processes" },
      {
        icon: "check",
        text: "**Carbon-led steering methodology** linking transaction-related decision making to sector pathway alignment and portfolio emission intensity outcomes",
      },
      {
        icon: "check",
        text: "Phased roadmap **defining near-term monitoring actions and long-term decision integration** across pricing and portfolio rebalancing",
      },
      { icon: "check", text: "**Excel-based simulation and dashboard prototype** to monitor impacts, updated portfolio intensity, and potential limit-allocation effects" },
      {
        icon: "check",
        text: "**Performance management framework** with prioritized scorecard metrics and OKR structure to support bank-wide adoption and behavioral change",
      },
    ],
  },
];

export function getCaseExamplesForSolutions(solutionIds: string[]): CaseExample[] {
  if (solutionIds.length === 0) return CASE_EXAMPLES;
  return CASE_EXAMPLES.filter((c) => c.solutionIds.some((s) => solutionIds.includes(s)));
}

/**
 * Selects a capped, most-recent-year-first subset for a solution page's
 * preview strip. Fills from the newest year present first (e.g. 2026); if
 * that year alone doesn't reach `max`, backfills with the next most recent
 * year(s) until the cap is reached. Never truncates a year part-way through
 * unless it's the last year needed to hit the cap.
 */
export function getFeaturedCaseExamples(examples: CaseExample[], max = 15): CaseExample[] {
  const years = Array.from(new Set(examples.map((e) => e.year))).sort(
    (a, b) => Number(b) - Number(a)
  );
  const result: CaseExample[] = [];
  for (const year of years) {
    if (result.length >= max) break;
    const forYear = examples.filter((e) => e.year === year);
    result.push(...forYear.slice(0, max - result.length));
  }
  return result;
}
