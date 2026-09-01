"use client";

const BAIN_RED = "#CC0000";
const SLIDE_W = 1280;
const SLIDE_H = 720;

export function RecreatedSlide14() {
  const CX = 640;
  const CY = 355;
  const R_OUTER = 200;
  const R_INNER = 95;

  return (
    <div
      style={{
        width: SLIDE_W,
        height: SLIDE_H,
        position: "relative",
        background: "#fff",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* ── Title ── */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 36,
          right: 36,
          fontSize: 19,
          fontWeight: 400,
          color: "#111",
          lineHeight: 1.25,
        }}
      >
        Sustainability frontrunners drive competitive advantage
      </div>

      {/* ── Horizontal rule ── */}
      <div style={{ position: "absolute", top: 62, left: 36, right: 36, height: 1, background: "#ddd" }} />

      {/* ── Central circle SVG diagram ── */}
      <svg
        style={{ position: "absolute", left: 0, top: 0 }}
        width={SLIDE_W}
        height={SLIDE_H}
        overflow="visible"
      >
        {/* Outer circle (ring only) */}
        <circle cx={CX} cy={CY} r={R_OUTER} stroke="#111" strokeWidth={1.5} fill="none" />

        {/* Inner black filled circle */}
        <circle cx={CX} cy={CY} r={R_INNER} fill="#111" />

        {/* Diamond / gem icon inside inner circle */}
        <polygon
          points={`${CX},${CY - 44} ${CX - 38},${CY - 10} ${CX},${CY + 44} ${CX + 38},${CY - 10}`}
          fill="none"
          stroke="#fff"
          strokeWidth={1.5}
        />
        <line x1={CX - 38} y1={CY - 10} x2={CX + 38} y2={CY - 10} stroke="#fff" strokeWidth={1} />
        <line x1={CX - 38} y1={CY - 10} x2={CX} y2={CY - 44} stroke="#fff" strokeWidth={1} />
        <line x1={CX + 38} y1={CY - 10} x2={CX} y2={CY - 44} stroke="#fff" strokeWidth={1} />
        <line x1={CX} y1={CY - 10} x2={CX - 38} y2={CY - 44 + 34} stroke="#fff" strokeWidth={0.8} opacity={0.5} />
        <line x1={CX} y1={CY - 10} x2={CX + 38} y2={CY - 44 + 34} stroke="#fff" strokeWidth={0.8} opacity={0.5} />

        {/* Arrows on the circular path — top-right and bottom-left */}
        {/* Top arrow (going clockwise at ~1 o'clock) */}
        <path
          d={`M ${CX + R_OUTER * 0.5} ${CY - R_OUTER * 0.87} A ${R_OUTER} ${R_OUTER} 0 0 1 ${CX + R_OUTER * 0.87} ${CY - R_OUTER * 0.5}`}
          fill="none"
          stroke="#111"
          strokeWidth={2}
          markerEnd="url(#arrowhead)"
        />
        {/* Bottom arrow (going clockwise at ~7 o'clock) */}
        <path
          d={`M ${CX - R_OUTER * 0.5} ${CY + R_OUTER * 0.87} A ${R_OUTER} ${R_OUTER} 0 0 1 ${CX - R_OUTER * 0.87} ${CY + R_OUTER * 0.5}`}
          fill="none"
          stroke="#111"
          strokeWidth={2}
          markerEnd="url(#arrowhead2)"
        />

        {/* Red icon shapes at 12, 3, 6, 9 o'clock positions */}
        {/* 12 o'clock — plant/leaf */}
        <circle cx={CX} cy={CY - R_OUTER} r={22} fill="#fff" stroke="#ddd" strokeWidth={1} />
        <path d={`M ${CX} ${CY - R_OUTER + 10} C ${CX - 16} ${CY - R_OUTER - 8} ${CX + 16} ${CY - R_OUTER - 8} ${CX} ${CY - R_OUTER + 10}Z`} fill={BAIN_RED} />
        <line x1={CX} y1={CY - R_OUTER + 10} x2={CX} y2={CY - R_OUTER + 18} stroke={BAIN_RED} strokeWidth={2} />

        {/* 3 o'clock — chart bars */}
        <circle cx={CX + R_OUTER} cy={CY} r={22} fill="#fff" stroke="#ddd" strokeWidth={1} />
        <rect x={CX + R_OUTER - 14} y={CY - 8} width={8} height={14} fill={BAIN_RED} />
        <rect x={CX + R_OUTER - 4} y={CY - 14} width={8} height={20} fill={BAIN_RED} />
        <line x1={CX + R_OUTER - 14} y1={CY + 6} x2={CX + R_OUTER + 6} y2={CY + 6} stroke={BAIN_RED} strokeWidth={1.5} />

        {/* 6 o'clock — pot/coin stack */}
        <circle cx={CX} cy={CY + R_OUTER} r={22} fill="#fff" stroke="#ddd" strokeWidth={1} />
        <ellipse cx={CX} cy={CY + R_OUTER + 8} rx={12} ry={4} stroke={BAIN_RED} strokeWidth={1.5} fill="none" />
        <ellipse cx={CX} cy={CY + R_OUTER + 2} rx={12} ry={4} stroke={BAIN_RED} strokeWidth={1.5} fill="none" />
        <ellipse cx={CX} cy={CY + R_OUTER - 4} rx={12} ry={4} stroke={BAIN_RED} strokeWidth={1.5} fill="none" />

        {/* 9 o'clock — person running */}
        <circle cx={CX - R_OUTER} cy={CY} r={22} fill="#fff" stroke="#ddd" strokeWidth={1} />
        <circle cx={CX - R_OUTER} cy={CY - 12} r={5} stroke={BAIN_RED} strokeWidth={1.5} fill="none" />
        <path d={`M ${CX - R_OUTER} ${CY - 7} L ${CX - R_OUTER - 6} ${CY + 4} L ${CX - R_OUTER + 4} ${CY + 2}`} stroke={BAIN_RED} strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${CX - R_OUTER - 3} ${CY + 4} L ${CX - R_OUTER - 8} ${CY + 14}`} stroke={BAIN_RED} strokeWidth={1.5} strokeLinecap="round" />
        <path d={`M ${CX - R_OUTER + 1} ${CY + 1} L ${CX - R_OUTER + 6} ${CY + 10}`} stroke={BAIN_RED} strokeWidth={1.5} strokeLinecap="round" />
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#111" />
          </marker>
          <marker id="arrowhead2" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#111" />
          </marker>
        </defs>
      </svg>

      {/* "Value" text in circle */}
      <div
        style={{
          position: "absolute",
          left: CX - 40,
          top: CY - 20,
          width: 80,
          textAlign: "center",
          fontSize: 18,
          fontWeight: 700,
          color: "#fff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Value
      </div>

      {/* ══ LEFT TEXT BLOCKS ══ */}
      {/* Customer Growth — top left */}
      <div style={{ position: "absolute", top: 84, left: 36, width: 350 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111", letterSpacing: "0.14em", marginBottom: 4 }}>
          CUSTOMER GROWTH
        </div>
        <div style={{ width: 50, height: 2, background: BAIN_RED, marginBottom: 10 }} />
        <div style={{ fontSize: 13, color: "#333", lineHeight: 1.45, marginBottom: 8 }}>
          Sustainable solutions outgrow others by <strong>~4-6% higher CAGR</strong>
        </div>
        <div style={{ fontSize: 13, color: "#333", lineHeight: 1.45 }}>
          <strong>3X</strong> as many <strong>sustainability leaders outperform on customer NPS</strong>
          <sup>1</sup>
        </div>
      </div>

      {/* People Engagement — bottom left */}
      <div style={{ position: "absolute", top: 430, left: 36, width: 350 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111", letterSpacing: "0.14em", marginBottom: 4 }}>
          PEOPLE ENGAGEMENT
        </div>
        <div style={{ width: 50, height: 2, background: BAIN_RED, marginBottom: 10 }} />
        <div style={{ fontSize: 13, color: "#333", lineHeight: 1.45, marginBottom: 8 }}>
          Sustainability leaders have <strong>6ppt higher employee satisfaction</strong>
          <sup>1</sup>
        </div>
        <div style={{ fontSize: 13, color: "#333", lineHeight: 1.45 }}>
          <strong>90% of HR leaders</strong> agree sustainability improves retention
        </div>
      </div>

      {/* ══ RIGHT TEXT BLOCKS ══ */}
      {/* Cost Leadership — top right */}
      <div style={{ position: "absolute", top: 84, right: 36, width: 350, textAlign: "right" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111", letterSpacing: "0.14em", marginBottom: 4 }}>
          COST LEADERSHIP
        </div>
        <div style={{ width: 50, height: 2, background: BAIN_RED, marginBottom: 10, marginLeft: "auto" }} />
        <div style={{ fontSize: 13, color: "#333", lineHeight: 1.45, marginBottom: 8 }}>
          Significant <strong>energy cost savings,</strong> with carbon leaders generating{" "}
          <strong>4-5ppt higher EBITDA</strong>
          <sup>2</sup>
        </div>
        <div style={{ fontSize: 13, color: "#333", lineHeight: 1.45 }}>
          Avoidance of <strong>carbon prices, future sustainability fines &amp; penalties</strong>
        </div>
      </div>

      {/* Valuation — bottom right */}
      <div style={{ position: "absolute", top: 430, right: 36, width: 350, textAlign: "right" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111", letterSpacing: "0.14em", marginBottom: 4 }}>
          VALUATION
        </div>
        <div style={{ width: 50, height: 2, background: BAIN_RED, marginBottom: 10, marginLeft: "auto" }} />
        <div style={{ fontSize: 13, color: "#333", lineHeight: 1.45, marginBottom: 8 }}>
          <strong>+1.7x TEV/EBITDA</strong> for sustainability front-runners<sup>3</sup>
        </div>
        <div style={{ fontSize: 13, color: "#333", lineHeight: 1.45 }}>
          <strong>Lower financing cost</strong> driven by subsidies, sustainability-linked loans, green bonds
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: 36,
          right: 36,
          fontSize: 8.5,
          color: "#666",
          lineHeight: 1.4,
        }}
      >
        Note: (1) Comparing companies in top vs. bottom 25% of respective Sustainability outcome for global sample of companies $1B+ in revenues; (2) Comparing carbon/ sustainable procurement activity leaders in top vs. bottom 25% for global sample of companies $1B+ in revenues; (3) Comparing TEV/ LTM EBITDA for S&amp;P500 companies with top 25% MSCI sustainability rating vs. bottom 75%, excludes outliers (10% bottom and 10% top TEV/E BITDA multiples).
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 36,
          right: 36,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 8,
          color: "#888",
        }}
      >
        <span>This information is confidential and was prepared by Bain &amp; Company solely for the use of our client</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontWeight: 700, letterSpacing: "0.04em", color: "#111" }}>BAIN &amp; COMPANY</span>
          <span style={{ color: BAIN_RED }}>&#9711;</span>
          <span>12</span>
        </div>
      </div>
    </div>
  );
}

export default function SustainabilityOverview14() {

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        padding: 24,
        background: "#1a1a1a",
        minHeight: "100vh",
      }}
    >
      
      <div style={{ position: "relative", width: SLIDE_W, height: SLIDE_H, flexShrink: 0 }}>
                                <RecreatedSlide14 />
      </div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>
        Slide 14 — Frontrunners Drive Competitive Advantage &nbsp;|&nbsp; 1280 × 720
      </div>
    </div>
  );
}
