"use client";
const SLIDE_W = 1280;
const SLIDE_H = 720;
const RED = "#CC0000";
const TEAL = "#2d6b5e";

// left marimekko: region (APAC/Americas/EMEA) proportional heights
const REGIONS = [
  { label: "APAC", pct: 18, bg: "#8a9aaa" },
  { label: "Americas", pct: 28, bg: "#6a7a8a" },
  { label: "EMEA", pct: 54, bg: "#c4ccd4" },
];

// right marimekko: industry segments
const INDUSTRIES = [
  { label: "Other", pct: 6, bg: "#1a1a2e" },
  { label: "Retail", pct: 5, bg: "#4a5a6a" },
  { label: "Financial Services", pct: 7, bg: "#3a4a5a" },
  { label: "Consumer Products", pct: 6, bg: "#6a7a8a" },
  { label: "Social Impact", pct: 6, bg: "#7a8a9a" },
  { label: "Advanced Manufacturing\n& Services", pct: 11, bg: "#8a9aaa" },
  { label: "Private Equity\n(Financial Investors)", pct: 14, bg: "#4a6070" },
  { label: "Energy &\nNatural Resources", pct: 25, bg: "#1d3a4a" },
];

// right 4-solution boxes
const SOLUTIONS = [
  { name: "Transition Strategy", count: "2,600+" },
  { name: "Sustainability Value\nCreation", count: "775+" },
  { name: "Circular Value\nCreation", count: "270+" },
  { name: "Resilience and\nAdaptation", count: "110+" },
];

export function RecreatedSlide16() {
  const CHART_TOP = 220;
  const CHART_H = 430;
  const BAR_W = 145;

  return (
    <div style={{ width: SLIDE_W, height: SLIDE_H, background: "#fff", position: "relative", fontFamily: "Arial, sans-serif", overflow: "hidden" }}>
      {/* Title */}
      <div style={{ position: "absolute", top: 18, left: 36, right: 36, fontSize: 19, fontWeight: 400, color: "#111", lineHeight: 1.3 }}>
        Bain has extensive experience in sustainability with more than 3,750 projects
      </div>
      <div style={{ position: "absolute", top: 58, left: 36, right: 36, height: 1.5, background: RED }} />

      {/* Left chart panel */}
      <div style={{ position: "absolute", top: 78, left: 36, width: 510, bottom: 48, border: "1px solid #ccc", overflow: "hidden" }}>
        {/* Photo strip — dark green header */}
        <div style={{ height: 50, background: "#3a5240", display: "flex", alignItems: "center", padding: "0 14px" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>3,750+ sustainability projects since 2021…</span>
        </div>
        <div style={{ height: 3, background: RED }} />

        {/* Two-column chart — fills remaining height */}
        <div style={{ display: "flex", gap: 18, padding: "14px 20px 8px", height: "calc(100% - 53px)", boxSizing: "border-box" }}>
          {/* Left: region marimekko */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 6, textAlign: "center" }}>3,750+</div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              {REGIONS.map((r) => (
                <div key={r.label} style={{ flex: r.pct, background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #fff" }}>
                  <span style={{ fontSize: 11, color: "#fff", fontWeight: 400 }}>{r.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: industry marimekko */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 6, textAlign: "center" }}>3,750+</div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              {INDUSTRIES.map((ind) => (
                <div key={ind.label} style={{ flex: ind.pct, background: ind.bg, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #fff", padding: "0 4px" }}>
                  <span style={{ fontSize: 9.5, color: "#fff", textAlign: "center", lineHeight: 1.2, whiteSpace: "pre-line" }}>{ind.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel: …with emphasis */}
      <div style={{ position: "absolute", top: 78, left: 558, right: 36, bottom: 48, border: "1px solid #ccc", overflow: "hidden" }}>
        <div style={{ height: 50, background: "#3a5240", display: "flex", alignItems: "center", padding: "0 14px" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>…with emphasis in four solutions</span>
        </div>
        <div style={{ height: 3, background: RED }} />

        {/* 2×2 solution grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: "calc(100% - 53px)" }}>
          {SOLUTIONS.map((s, i) => (
            <div key={s.name} style={{ padding: "18px 16px", borderRight: i % 2 === 0 ? "1px solid #e0e0e0" : "none", borderBottom: i < 2 ? "1px solid #e0e0e0" : "none", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111", lineHeight: 1.3, marginBottom: 6, whiteSpace: "pre-line" }}>{s.name}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: RED }}>
                {s.count} <span style={{ fontSize: 12, fontWeight: 400, color: "#333" }}>cases since 2021</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source */}
      <div style={{ position: "absolute", bottom: 14, left: 36, fontSize: 9, color: "#666", lineHeight: 1.5 }}>
        Note: Cases across solutions include multiple counts for cases where several sustainability solutions are involved; &apos;Other&apos; include cases belonging to other industries like Healthcare, TMT, No Industry, etc.<br />
        Source: Bain Analysis
      </div>
      {/* Footer */}
      <div style={{ position: "absolute", bottom: 14, right: 36, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#CC0000", letterSpacing: 0.5 }}>BAIN &amp; COMPANY</span>
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: RED, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: 9, fontWeight: 700 }}>+</span>
        </div>
        <span style={{ fontSize: 11, color: "#555" }}>15</span>
      </div>
    </div>
  );
}

export default function SustainabilityOverview16() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: 24, background: "#1a1a1a", minHeight: "100vh" }}>
            <div style={{ position: "relative", width: SLIDE_W, height: SLIDE_H, flexShrink: 0 }}>
                                <RecreatedSlide16 />
      </div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>Slide 16 — 3,750+ Projects &nbsp;|&nbsp; 1280 × 720</div>
    </div>
  );
}
