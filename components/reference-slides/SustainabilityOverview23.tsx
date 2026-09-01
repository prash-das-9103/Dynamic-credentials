"use client";
const SLIDE_W = 1280;
const SLIDE_H = 720;
const RED = "#CC0000";

const TOP_CELLS = [
  {
    isWidget: true,
  },
  {
    text: "Achieved a Carbon Integrity Platinum Claim from VCMI for 2024 footprint for high-integrity use of carbon credits",
    boldWords: ["Carbon Integrity Platinum Claim"],
  },
  {
    text: "Net-negative carbon impact since 2022 – invested in nature-based projects to remove more than 100% of Bain's scope 1, 2, and 3 emissions in 2023-2024",
    boldWords: ["Net-negative carbon impact", "remove more than 100% of Bain's scope 1, 2, and 3"],
  },
  {
    bullets: [
      { text: "Named leading company on CDP's A List for Climate, B for Water, and A List for Supplier Engagement in 2025", bold: "CDP's A List" },
      { text: "Received a Platinum medal from EcoVadis in 2025", bold: "Platinum" },
      { text: "Committed to transparent public emissions reporting, including GRI, TCFD, WEF, EU, and CA", bold: "public emissions reporting," },
    ],
  },
];

const BOTTOM_CELLS = [
  {
    text: "Committed to both near- and long-term SBTi-approved targets – 30% reduction in absolute scope 1 & 2 emissions and 35% reduction on an absolute basis per FTE in scope 3 travel emissions from 2019 baselines by 2026, and net zero by 2050",
    boldWords: ["both near-", "and long-term SBTi-", "approved targets"],
  },
  {
    text: "Utilizes 100% renewable electricity across our global footprint since 2020",
    boldWords: ["100% renewable electricity"],
  },
  {
    text: "Provides pro-bono consulting to the leading global environmental NGOs on critical climate-related initiatives",
    boldWords: ["pro-bono consulting"],
  },
  {
    text: "75% of the employees are covered by Green Teams in our offices around the world implementing changes to reduce our carbon footprint",
    boldWords: ["75% of the employees", "are covered by Green", "Teams"],
  },
];

const CERT_LOGOS = [
  { label: "Carbon\nIntegrity", color: "#2a6a40" },
  { label: "UN Global\nCompact", color: "#00529b" },
  { label: "Science\nBased\nTargets", color: "#0066a4" },
  { label: "CDP\nA List\n2025", color: "#1a3a50" },
  { label: "CDP\n2025", color: "#1a3a50" },
  { label: "ecovadis\nPlatinum", color: "#f5a200" },
];

function CellText({ text, boldWords }: { text: string; boldWords: string[] }) {
  const words = text.split(" ");
  return (
    <div style={{ fontSize: 11.5, color: "#222", lineHeight: 1.45 }}>
      {words.map((w, i) => {
        const isBold = boldWords.some((bw) => bw.toLowerCase().includes(w.toLowerCase().replace(/[^a-z]/g, "")) && w.length > 3);
        return <span key={i}>{isBold ? <strong>{w}</strong> : w}{" "}</span>;
      })}
    </div>
  );
}

export function RecreatedSlide23() {
  const LEFT_W = 450;
  const RIGHT_X = 466;
  const RIGHT_W = SLIDE_W - RIGHT_X - 20;
  const CELL_W = RIGHT_W / 4;

  return (
    <div style={{ width: SLIDE_W, height: SLIDE_H, background: "#fff", position: "relative", fontFamily: "Arial, sans-serif", overflow: "hidden" }}>
      {/* Left photo area */}
      <div style={{ position: "absolute", left: 0, top: 0, width: LEFT_W, height: SLIDE_H, background: "linear-gradient(180deg,#5a7858 0%,#3a5040 100%)", overflow: "hidden" }}>
        {/* Forest texture overlay */}
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,rgba(0,0,0,0.03) 0px,rgba(0,0,0,0) 4px)" }} />
      </div>

      {/* White overlay card on left */}
      <div style={{ position: "absolute", left: 120, top: 60, width: LEFT_W - 80, background: "#fff", padding: "20px 24px 16px", boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}>
        <div style={{ fontSize: 28, fontWeight: 400, color: "#111", lineHeight: 1.3, marginBottom: 12 }}>
          We are alongside you on this journey; measuring and reducing our impact on the environment is a{" "}
          <strong style={{ fontWeight: 700 }}>critical priority for Bain</strong>
        </div>
        <div style={{ height: 3, background: RED, width: 48, marginBottom: 14 }} />
        <div style={{ fontSize: 13, color: "#222", lineHeight: 1.5 }}>
          Our <strong>unique, collaborative approach</strong> combined with our <strong>focus on the environment</strong> enables Bain to deliver <strong>exceptional client results</strong> at significantly <strong>lower environmental impact</strong>
        </div>
        {/* Note at bottom */}
        <div style={{ marginTop: 12, fontSize: 8.5, color: "#666", lineHeight: 1.5 }}>
          Note: This page was last updated in May 2026<br />
          For more information on our sustainability effort, please see our{" "}
          <a href="#" style={{ color: "#0066cc" }}>Sustainability page</a>;<br />
          (*): Peer average is calculated based on total market-based footprint reported in peer sustainability reports for 2024; Minor methodology differences amongst peers can yield up to a 5% variance in Intensity
        </div>
      </div>

      {/* Right grid area */}
      {/* Top row: 4 cells */}
      <div style={{ position: "absolute", top: 60, left: RIGHT_X, right: 20, display: "flex", borderBottom: "1px solid #e0e0e0" }}>
        {TOP_CELLS.map((cell, i) => (
          <div key={i} style={{ flex: 1, padding: "12px 10px", borderRight: i < 3 ? "1px solid #e0e0e0" : "none", minHeight: 220 }}>
            {cell.isWidget ? (
              // Carbon widget
              <div style={{ background: "#111", padding: 10, width: "90%" }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 6 }}>
                  2024 Carbon Emissions*<br />(tCO2e/FTE)
                </div>
                <div style={{ borderTop: "1px solid #333", paddingTop: 8, marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: "#ccc", letterSpacing: 1 }}>BAIN</span>
                    <span style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>10.5</span>
                  </div>
                  <div style={{ height: 1, background: "#333", marginBottom: 6 }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 10, color: "#ccc", letterSpacing: 0.5 }}>PEER AVG</span>
                    <span style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>14.5</span>
                  </div>
                </div>
              </div>
            ) : cell.bullets ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {cell.bullets.map((b, j) => (
                  <div key={j} style={{ fontSize: 11, color: "#222", lineHeight: 1.4 }}>
                    {b.text.split(b.bold).map((part, k, arr) => (
                      k < arr.length - 1
                        ? <span key={k}>{part}<strong>{b.bold}</strong></span>
                        : <span key={k}>{part}</span>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <CellText text={cell.text!} boldWords={cell.boldWords!} />
            )}
          </div>
        ))}
      </div>

      {/* Bottom row: 4 cells */}
      <div style={{ position: "absolute", top: 340, left: RIGHT_X, right: 20, display: "flex", borderBottom: "1px solid #e0e0e0" }}>
        {BOTTOM_CELLS.map((cell, i) => (
          <div key={i} style={{ flex: 1, padding: "12px 10px", borderRight: i < 3 ? "1px solid #e0e0e0" : "none", minHeight: 180 }}>
            <CellText text={cell.text} boldWords={cell.boldWords} />
          </div>
        ))}
      </div>

      {/* Cert logos row */}
      <div style={{ position: "absolute", bottom: 32, left: RIGHT_X, right: 20, display: "flex", alignItems: "center", gap: 12 }}>
        {CERT_LOGOS.map((c) => (
          <div key={c.label} style={{ width: 80, height: 72, background: c.label.includes("ecovadis") ? "#fff" : c.color, border: `1px solid ${c.color}`, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: c.label.includes("ecovadis") ? c.color : "#fff", whiteSpace: "pre-line", textAlign: "center", lineHeight: 1.4 }}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SustainabilityOverview23() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: 24, background: "#1a1a1a", minHeight: "100vh" }}>
            <div style={{ position: "relative", width: SLIDE_W, height: SLIDE_H, flexShrink: 0 }}>
                                <RecreatedSlide23 />
      </div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>Slide 23 — Carbon Emissions &amp; Sustainability Commitments &nbsp;|&nbsp; 1280 × 720</div>
    </div>
  );
}
