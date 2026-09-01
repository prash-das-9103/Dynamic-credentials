"use client";
const SLIDE_W = 1280;
const SLIDE_H = 720;
const RED = "#CC0000";

const INDUSTRIES = [
  {
    id: "PE", label: "P E",
    cases: [
      { icon: "🌱", title: "Responsible Investment Strategy", body: "Refreshed responsible investment strategy for a global investment platform, benchmarking ESG and climate practices and redesigning governance to meet evolving investor expectations while enabling long-term value creation." },
      { icon: "📋", title: "Dynamic Credit & ESG Integration", body: "Upgraded dynamic credit strategies for a leading European bank, embedding ESG and forward-looking sector views into pricing to optimize risk/return, strengthen origination steering, and enhance capital efficiency across international subsidiaries." },
      { icon: "🌍", title: "SEA Climate Investment Strategy", body: "Developed climate investment strategy by setting ambition and KPIs, building a prioritization framework and portfolio allocation strategy, and identifying near-term opportunities" },
    ],
  },
  {
    id: "AMS", label: "A M S",
    cases: [
      { icon: "♻", title: "Circularity Commercial Excellence", body: "Accelerated Packaging Co's plastics-to-fiber transition by redesigning the commercial model and embedding Gen AI in sales hunting to unlock circular packaging growth" },
      { icon: "🎯", title: "Full Potential Scope 3 Decarbonization", body: "Developed SBTi Scope 3 decarbonization plan by testing procurement/product design/ operations levers through scenario modeling, quantifying carbon and cost trade-offs, and defining an execution roadmap" },
      { icon: "🌡", title: "Climate Scenario Analysis", body: "Conducted climate scenario analysis by assessing physical and transition risks across sites and the value chain, quantifying potential impacts (up to ~8% EBITDA loss, carbon-related costs up to ~7% of EBITDA) and establishing a risk task force and opportunity roadmap" },
    ],
  },
  {
    id: "ENR", label: "E N R",
    cases: [
      { icon: "🗺", title: "Enterprise Risk Mapping", body: "Built a custom AI platform to map enterprise risk and integrate Climate X intelligence on climate hazards across priority assets to demonstrate value chain risk levels and identify high ROI adaptations" },
      { icon: "💨", title: "Offshore Wind Industry Strategy", body: "Developed a strategic industry paper for a leading offshore wind developer outlining solutions to restore competitiveness and secure Europe's long-term clean energy future." },
      { icon: "📜", title: "CVCC Policy Mapping", body: "Developed CLCS policy advocacy strategy by identifying US/EU policies impacting low-carbon polyolefin investments the most, conducting scenario analysis to estimate value under different policy, defining focus areas, creating engagement plans and recommending improvements." },
    ],
  },
  {
    id: "CP", label: "C P",
    cases: [
      { icon: "🏆", title: "Sustainability-driven Commercial Excellence", body: "Embedded sustainability into Beauty Co's commercial excellence plan by benchmarking key retailers' sustainability strategies, linking their priorities to Beauty Co's commercial plan, and integrating KPI-backed Green JBP, and setting up feedback loops on retailer requirements." },
      { icon: "🔄", title: "Circular Portfolio Reset", body: "Partnered with a global personal care leader to navigate a plastic-free transition, support a key supplier divestiture, and reshape its diapers portfolio—restoring competitiveness while advancing circular value creation." },
      { icon: "🌐", title: "Global Sustainability Strategy", body: "Redefined global sustainability strategy for a leading beverage company, aligning commitments, governance, and reporting while defining a quantified, execution-ready roadmap." },
    ],
  },
  {
    id: "FS", label: "F S",
    cases: [
      { icon: "📊", title: "Monitoring Tool for CO2", body: "Developed a regulatory-compliant CO₂ calculator for a bank to help SMEs measure their GHG footprint. Designed and validated sector-specific emissions factors and delivered an Excel prototype enabling rollout to 150k+ SMEs and setting up future modules for target-setting and transition planning." },
      { icon: "💰", title: "Fund Sustainability Strategy", body: "Defined an integrated carbon reduction strategy for a leading Middle Eastern investment fund and assessed entry into carbon trading and net-zero advisory, shaping a scalable operating model and transition-finance growth roadmap." },
      { icon: "⚖", title: "Climate Strategy and Risk Management", body: "Defined Bank Co's climate mission and identified strategic initiatives to integrate climate risk into credit decisioning & portfolio risk management using climate-adjusted probability of default models" },
    ],
  },
  {
    id: "RETAIL", label: "R E T A I L",
    cases: [
      { icon: "🔄", title: "ESG 2030 Strategy Refresh", body: "Redefined the ESG 2030 Agenda for a global beauty leader, benchmarking peers and establishing science-aligned pillars, measurable targets, and governance across climate, nature, and the value chain to drive long-term value creation." },
      { icon: "🌿", title: "Fruit & Veg Resilience Strategy", body: "Enhanced supply resilience for key food categories by identifying supply risks and mitigation levers; developed strategic procurement capabilities" },
      { icon: "♻", title: "Circularity Strategy", body: "Supported Restaurant Co in resetting its circularity strategy by redefining packaging commitments, assessing regulations and modeling pathways to inform decisions across material types" },
    ],
  },
];

function IndustryCol({ data }: { data: typeof INDUSTRIES[number] }) {
  return (
    <div style={{ flex: 1, minWidth: 0, paddingLeft: 10, paddingRight: 6, borderRight: "1px solid #e0e0e0" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#333", letterSpacing: 2, marginBottom: 6, textAlign: "center" }}>{data.label}</div>
      {data.cases.map((c) => (
        <div key={c.title} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 5, alignItems: "flex-start", marginBottom: 2 }}>
            <span style={{ fontSize: 14, lineHeight: 1 }}>{c.icon}</span>
            <div style={{ fontSize: 11, fontWeight: 700, color: RED, lineHeight: 1.25 }}>{c.title}</div>
          </div>
          <div style={{ fontSize: 9.5, color: "#222", lineHeight: 1.38 }}>{c.body}</div>
        </div>
      ))}
    </div>
  );
}

export function RecreatedSlide19() {
  return (
    <div style={{ width: SLIDE_W, height: SLIDE_H, background: "#fff", position: "relative", fontFamily: "Arial, sans-serif", overflow: "hidden" }}>
      {/* Title */}
      <div style={{ position: "absolute", top: 14, left: 36, right: 80, fontSize: 21, fontWeight: 400, color: "#111", lineHeight: 1.3 }}>
        We have proven success stories on sustainability with clients across industries
      </div>
      {/* Brain icon placeholder top-right */}
      <div style={{ position: "absolute", top: 14, right: 36, width: 48, height: 48, borderRadius: "50%", border: "1.5px solid #999", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🧠</div>
      <div style={{ position: "absolute", top: 70, left: 36, right: 36, height: 1.5, background: "#e0e0e0" }} />

      {/* 6-column grid */}
      <div style={{ position: "absolute", top: 80, left: 12, right: 12, bottom: 20, display: "flex" }}>
        {INDUSTRIES.map((ind) => <IndustryCol key={ind.id} data={ind} />)}
      </div>
    </div>
  );
}

export default function SustainabilityOverview19() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: 24, background: "#1a1a1a", minHeight: "100vh" }}>
            <div style={{ position: "relative", width: SLIDE_W, height: SLIDE_H, flexShrink: 0 }}>
                                <RecreatedSlide19 />
      </div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>Slide 19 — Proven Success Stories &nbsp;|&nbsp; 1280 × 720</div>
    </div>
  );
}
