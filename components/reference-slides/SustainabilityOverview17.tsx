"use client";
const SLIDE_W = 1280;
const SLIDE_H = 720;
const RED = "#CC0000";

// Segments listed top-to-bottom (matching the reference slide visual order)
const COLS = [
  { label: "Transition Strategy", total: "2,600+", segments: [
    { label: "Healthcare & Life Sciences", pct: 20, bg: "#c0c8c8" },
    { label: "Other", pct: 4, bg: "#1a2830" },
    { label: "Retail", pct: 5, bg: "#b8c0c0" },
    { label: "Consumer Products", pct: 6, bg: "#a0aaaa" },
    { label: "Financial Services", pct: 7, bg: "#4a6070" },
    { label: "Social Impact", pct: 8, bg: "#2d5060" },
    { label: "Energy &\nNatural Resources", pct: 18, bg: "#6a7a8a" },
    { label: "Advanced Manufacturing\n& Services", pct: 12, bg: "#8a9aaa" },
    { label: "Private Equity\n(Financial Investors)", pct: 20, bg: "#c8cdd2" },
  ]},
  { label: "Sustainability Value Creation", total: "775+", segments: [
    { label: "Healthcare & Life Sciences", pct: 10, bg: "#c8d0d0" },
    { label: "Other", pct: 5, bg: "#1a2830" },
    { label: "Private Equity\n(Financial Investors)", pct: 16, bg: "#3a5060" },
    { label: "Financial Services", pct: 9, bg: "#5a6a7a" },
    { label: "Retail", pct: 8, bg: "#7a8a9a" },
    { label: "Social Impact", pct: 8, bg: "#4a6070" },
    { label: "Advanced Manufacturing\n& Services", pct: 14, bg: "#6a7a8a" },
    { label: "Consumer Products", pct: 8, bg: "#8a9aaa" },
    { label: "Energy &\nNatural Resources", pct: 22, bg: "#b8c0c0" },
  ]},
  { label: "Circular Value Creation", total: "270+", segments: [
    { label: "Healthcare & Life Sciences", pct: 15, bg: "#c0c8c8" },
    { label: "Other", pct: 5, bg: "#1a2830" },
    { label: "Financial Services", pct: 8, bg: "#4a6070" },
    { label: "Social Impact", pct: 6, bg: "#2d5060" },
    { label: "Retail", pct: 6, bg: "#7a8a9a" },
    { label: "Consumer Products", pct: 10, bg: "#9aaaaa" },
    { label: "Private Equity\n(Financial Investors)", pct: 10, bg: "#6a7a8a" },
    { label: "Energy &\nNatural Resources", pct: 18, bg: "#8a9aaa" },
    { label: "Advanced Manufacturing\n& Services", pct: 22, bg: "#b8c0c0" },
  ]},
  { label: "Resilience & Adaptation", total: "110+", segments: [
    { label: "Private Equity\n(Financial Investors)", pct: 5, bg: "#3a5060" },
    { label: "Social Impact", pct: 24, bg: "#b8c0c0" },
    { label: "Healthcare & Life Sciences,\nConsumer Products", pct: 10, bg: "#c0c8c8" },
    { label: "Consumer Products", pct: 5, bg: "#aab8b8" },
    { label: "Financial Services", pct: 7, bg: "#5a6a7a" },
    { label: "Retail", pct: 6, bg: "#9aaaaa" },
    { label: "Advanced Manufacturing\n& Services", pct: 14, bg: "#8a9aaa" },
    { label: "Energy &\nNatural Resources", pct: 22, bg: "#6a7a8a" },
    { label: "Other", pct: 7, bg: "#1a2830" },
  ]},
];

export function RecreatedSlide17() {
  // Reference measurements: chart starts at x≈60, y≈148, ends at x≈1240, y≈610
  const CHART_LEFT = 58;
  const CHART_TOP = 148;
  const CHART_H = 462;
  const CHART_W = 1182; // 1240 - 58
  // 4 cols with 3 gaps of 8px each: col = (1182 - 3*8) / 4 = 291
  const GAP = 8;
  const COL_W = (CHART_W - 3 * GAP) / 4;
  const Y_TICKS = [0, 20, 40, 60, 80, 100];

  // yFor: pct=0 → bottom of chart, pct=100 → top
  function yFor(pct: number) {
    return CHART_TOP + CHART_H * (1 - pct / 100);
  }

  return (
    <div style={{ width: SLIDE_W, height: SLIDE_H, background: "#fff", position: "relative", fontFamily: "Arial, sans-serif", overflow: "hidden" }}>
      {/* Title */}
      <div style={{ position: "absolute", top: 18, left: 36, right: 36, fontSize: 19, fontWeight: 400, color: "#111", lineHeight: 1.25 }}>
        Bain has global experience across all industries and sustainability solutions
      </div>
      <div style={{ position: "absolute", top: 56, left: 36, right: 36, height: 1.5, background: RED }} />

      {/* Sub-heading */}
      <div style={{ position: "absolute", top: 68, left: 36, fontSize: 13, fontWeight: 700, color: "#111" }}>
        Recent Sustainability cases by solution and industry
      </div>
      <div style={{ position: "absolute", top: 86, left: 36, right: 36, height: 1, background: "#ccc" }} />
      <div style={{ position: "absolute", top: 94, left: 36, fontSize: 11, color: "#555" }}>
        Sustainability-related cases by solution and industry, 2021 – 2025
      </div>

      {/* Y axis labels — sit just left of the bars */}
      {Y_TICKS.map((t) => (
        <div key={t} style={{ position: "absolute", left: CHART_LEFT - 28, top: yFor(t) - 6, fontSize: 10, color: "#555", width: 26, textAlign: "right" }}>{t}</div>
      ))}

      {/* Gridlines */}
      {Y_TICKS.map((t) => (
        <div key={t} style={{ position: "absolute", left: CHART_LEFT, right: 36, top: yFor(t), height: 1, background: t === 0 ? "#777" : "#e8e8e8" }} />
      ))}

      {/* Columns */}
      {COLS.map((col, ci) => {
        const x = CHART_LEFT + ci * (COL_W + GAP);
        // Render top-to-bottom: segments in data order appear from top of column downward
        let topPct = 0;
        return (
          <div key={col.label} style={{ position: "absolute", left: x, top: CHART_TOP, width: COL_W, height: CHART_H }}>
            {/* Total label */}
            <div style={{ position: "absolute", top: -30, left: 0, width: COL_W, textAlign: "center", fontSize: 13, fontWeight: 700, color: "#111" }}>{col.total}</div>
            {/* Stacked segments top-to-bottom */}
            {col.segments.map((seg) => {
              const h = (seg.pct / 100) * CHART_H;
              const t = (topPct / 100) * CHART_H;
              topPct += seg.pct;
              return (
                <div key={seg.label} style={{ position: "absolute", top: t, left: 0, width: COL_W, height: h, background: seg.bg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderBottom: "1px solid #fff", boxSizing: "border-box" }}>
                  {seg.pct >= 5 && (
                    <span style={{ fontSize: 9, color: "#fff", textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line", padding: "0 2px" }}>{seg.label}</span>
                  )}
                </div>
              );
            })}
            {/* X label */}
            <div style={{ position: "absolute", top: CHART_H + 10, left: 0, width: COL_W, textAlign: "center", fontSize: 11.5, color: "#333" }}>{col.label}</div>
          </div>
        );
      })}

      {/* Source */}
      <div style={{ position: "absolute", bottom: 34, left: 36, fontSize: 9, color: "#666", lineHeight: 1.5 }}>
        Note: Cases across solutions include multiple counts for cases where several sustainability solutions are involved; &apos;Other&apos; include cases belonging to other industries like Healthcare, TMT, No Industry, etc.<br />
        Source: Bain Analysis
      </div>
      <div style={{ position: "absolute", bottom: 24, left: 36, right: 36, height: 1, background: "#e8e8e8" }} />
      <div style={{ position: "absolute", bottom: 8, left: 36, right: 200, fontSize: 8, color: "#888" }}>This information is confidential and was prepared by Bain &amp; Company solely for the use of our client; it is not to be relied on by any 3rd party without Bain&apos;s prior written consent</div>
      <div style={{ position: "absolute", bottom: 8, right: 36, display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: RED, letterSpacing: 0.3 }}>BAIN &amp; COMPANY</span>
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: RED, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: 8, fontWeight: 700 }}>+</span></div>
        <span style={{ fontSize: 10, color: "#555" }}>16</span>
      </div>
    </div>
  );
}

export default function SustainabilityOverview17() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: 24, background: "#1a1a1a", minHeight: "100vh" }}>
            <div style={{ position: "relative", width: SLIDE_W, height: SLIDE_H, flexShrink: 0 }}>
                                <RecreatedSlide17 />
      </div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>Slide 17 — Global Experience Chart &nbsp;|&nbsp; 1280 × 720</div>
    </div>
  );
}
