"use client";

const SLIDE_W = 1280;
const SLIDE_H = 720;

const TEAL = "#2d7060";
const WHITE = "#ffffff";
const COL_W = 426; // 1280/3

// ── Horizontal waterfall bar chart (column 1) ──────────────────────────────
function WaterfallChart() {
  // Bars: tall green on far left, diminishing horizontal bars going right
  const bars = [
    { h: 190 }, { h: 170 }, { h: 155 }, { h: 140 }, { h: 126 },
    { h: 110 }, { h: 95 }, { h: 82 }, { h: 68 }, { h: 58 },
    { h: 48 }, { h: 40 }, { h: 34 }, { h: 28 }, { h: 22 },
    { h: 18 }, { h: 15 }, { h: 12 }, { h: 10 }, { h: 8 },
  ];
  const chartW = 280;
  const chartH = 190;
  const barW = 10;
  const gap = 4;

  return (
    <div style={{ position: "relative", width: chartW, marginTop: 8 }}>
      <svg width={chartW} height={chartH + 10} style={{ overflow: "visible" }}>
        {bars.map((bar, i) => (
          <rect
            key={i}
            x={i * (barW + gap)}
            y={chartH - bar.h}
            width={barW}
            height={bar.h}
            fill={i === 0 ? TEAL : "#4a7a5a"}
          />
        ))}
        {/* Long horizontal green bar across the top */}
        <rect x={0} y={chartH - 190} width={chartW} height={14} fill={TEAL} opacity={0.5} />
      </svg>
      {/* Checkmark + Positive ROI label */}
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <div style={{ fontSize: 36, color: TEAL }}>✓</div>
        <div style={{ fontSize: 14, color: TEAL, fontWeight: 700, fontFamily: "Arial, sans-serif" }}>
          Positive ROI
        </div>
        <div style={{ fontSize: 13, color: TEAL, fontFamily: "Arial, sans-serif" }}>
          <strong>25%</strong> of emissions
        </div>
      </div>
    </div>
  );
}

// ── S-curve chart (column 2) ──────────────────────────────────────────────
function SCurveChart() {
  const W = 300;
  const H = 200;

  // S-curve path points
  const path = "M 20,180 Q 60,175 100,160 Q 140,140 160,110 Q 180,80 200,50 Q 220,25 280,20";

  return (
    <div style={{ position: "relative", width: W, height: H + 20 }}>
      <svg width={W} height={H + 20} style={{ overflow: "visible" }}>
        {/* S-curve line */}
        <path d={path} fill="none" stroke="#bbb" strokeWidth={2.5} strokeLinecap="round" />
        {/* Start dot */}
        <circle cx={20} cy={180} r={7} fill="#222" />
        {/* End dot */}
        <circle cx={280} cy={20} r={7} fill="#222" />
        {/* Inflection dot (red) */}
        <circle cx={160} cy={110} r={9} fill="#CC0000" />
        {/* Arrow at end */}
        <line x1={270} y1={24} x2={295} y2={12} stroke="#bbb" strokeWidth={2} />
        <polygon points="295,12 283,18 289,8" fill="#bbb" />
      </svg>
      {/* Inflection Point label */}
      <div
        style={{
          position: "absolute",
          left: 170,
          top: 95,
          fontFamily: "Arial, sans-serif",
          fontSize: 13,
          color: "#333",
          lineHeight: 1.2,
        }}
      >
        Inflection
        <br />
        Point
      </div>
    </div>
  );
}

// ── Column 3: icons ────────────────────────────────────────────────────────
function Col3Icons() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 32,
        paddingTop: 20,
      }}
    >
      {/* Gear icon */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <svg width={64} height={64} viewBox="0 0 64 64" fill="none">
          <circle cx={32} cy={32} r={28} stroke="#555" strokeWidth={2} fill="none" />
          <circle cx={32} cy={32} r={12} stroke="#555" strokeWidth={2} fill="none" />
          <circle cx={32} cy={8} r={4} stroke="#555" strokeWidth={1.5} fill="none" />
          <circle cx={32} cy={56} r={4} stroke="#555" strokeWidth={1.5} fill="none" />
          <circle cx={8} cy={32} r={4} stroke="#555" strokeWidth={1.5} fill="none" />
          <circle cx={56} cy={32} r={4} stroke="#555" strokeWidth={1.5} fill="none" />
        </svg>
        <div style={{ fontSize: 12, color: "#333", fontFamily: "Arial, sans-serif", textAlign: "center", lineHeight: 1.3, maxWidth: 100 }}>
          Hyper-efficiency and performance
        </div>
      </div>

      {/* >> Arrow */}
      <div style={{ fontSize: 28, color: "#CC0000", fontWeight: 900 }}>&rsaquo;&rsaquo;</div>

      {/* Tree icon */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <svg width={64} height={64} viewBox="0 0 64 64" fill="none">
          <circle cx={32} cy={26} r={18} stroke="#CC0000" strokeWidth={2} fill="none" />
          <line x1={32} y1={44} x2={32} y2={58} stroke="#CC0000" strokeWidth={2} />
          <line x1={22} y1={54} x2={42} y2={54} stroke="#CC0000" strokeWidth={2} />
        </svg>
        <div style={{ fontSize: 12, color: "#CC0000", fontFamily: "Arial, sans-serif", textAlign: "center", fontWeight: 700, lineHeight: 1.3 }}>
          Robustness
        </div>
      </div>
    </div>
  );
}

export function RecreatedSlide10() {
  return (
    <div
      style={{
        width: SLIDE_W,
        height: SLIDE_H,
        position: "relative",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* ── Background: misty lake photo (simulated) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, #3a4a3a 0%, #4a5a48 15%, #6a7a60 25%, #a8b890 35%, #d0c890 45%, #e8d880 50%, #c8b86a 55%, #a89050 60%, #302820 75%, #181410 100%)",
        }}
      />

      {/* ── Version 1 tag ── */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "#1a5a8a",
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
          padding: "3px 10px",
          borderRadius: 2,
          fontFamily: "Arial, sans-serif",
        }}
      >
        Version 1
      </div>

      {/* ── Title ── */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 36,
          right: 140,
          fontSize: 26,
          fontWeight: 400,
          color: WHITE,
          lineHeight: 1.25,
          fontFamily: "Arial, sans-serif",
        }}
      >
        With 2030 targets now on the horizon, CEOs must take action
      </div>

      {/* ── Dark lower band — starts at ~50% of the photo ── */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(10, 8, 5, 0.85)",
        }}
      />

      {/* ── Three columns with vertical dividers ── */}
      {[0, 1, 2].map((ci) => (
        <div
          key={ci}
          style={{
            position: "absolute",
            left: ci * COL_W + (ci > 0 ? 1 : 0),
            top: 280,
            width: COL_W - (ci < 2 ? 1 : 0),
            bottom: 0,
            borderRight: ci < 2 ? "1px solid #555" : "none",
          }}
        />
      ))}

      {/* ── Column 1: Accelerate ── */}
      <div style={{ position: "absolute", left: 28, top: 296, width: COL_W - 28 }}>
        <div style={{ fontSize: 42, fontWeight: 700, color: WHITE }}>1</div>
        <div style={{ fontSize: 22, color: WHITE, lineHeight: 1.2 }}>
          <strong>Accelerate</strong> what works
        </div>
        <div style={{ fontSize: 12, color: "#bbb", marginTop: 8, lineHeight: 1.4 }}>
          Make high-ROI levers part of business-as-usual decision-making
        </div>
        <WaterfallChart />
      </div>

      {/* ── Column 2: Anticipate ── */}
      <div style={{ position: "absolute", left: COL_W + 16, top: 296, width: COL_W - 32 }}>
        <div style={{ fontSize: 42, fontWeight: 700, color: WHITE }}>2</div>
        <div style={{ fontSize: 22, color: WHITE, lineHeight: 1.2 }}>
          <strong>Anticipate</strong> what&apos;s coming
        </div>
        <div style={{ fontSize: 12, color: "#bbb", marginTop: 8, lineHeight: 1.4 }}>
          Prepare to move quickly as dynamics change and new profit pools emerge
        </div>
        <SCurveChart />
      </div>

      {/* ── Column 3: Build ── */}
      <div style={{ position: "absolute", left: COL_W * 2 + 16, top: 296, width: COL_W - 32 }}>
        <div style={{ fontSize: 42, fontWeight: 700, color: WHITE }}>3</div>
        <div style={{ fontSize: 22, color: WHITE, lineHeight: 1.2 }}>
          <strong>Build</strong> robustness
        </div>
        <div style={{ fontSize: 12, color: "#bbb", marginTop: 8, lineHeight: 1.4 }}>
          Focus on resiliency, redundancy, and adaptability
        </div>
        <Col3Icons />
      </div>
    </div>
  );
}

export default function SustainabilityOverview10() {

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
                                <RecreatedSlide10 />
      </div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>
        Slide 10 — CEOs Must Act V1 (Photo Background + 3 Columns) &nbsp;|&nbsp; 1280 × 720
      </div>
    </div>
  );
}
