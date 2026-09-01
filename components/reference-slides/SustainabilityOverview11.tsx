"use client";

const SLIDE_W = 1280;
const SLIDE_H = 720;

const WHITE = "#ffffff";
const COL_W = 426;

const COLS = [
  {
    num: "1",
    bold: "Accelerate",
    rest: " what works",
    bullets: ["Identify profitable levers", "Rapidly scale these levers", "Feed profits back to sustain effort"],
  },
  {
    num: "2",
    bold: "Anticipate",
    rest: " what\u2019s coming",
    bullets: [
      "Build future-sensing capabilities",
      "Pivot with tech, behavior, and policy",
      "Expect zigzags, not straight lines",
    ],
  },
  {
    num: "3",
    bold: "Build",
    rest: " robustness",
    bullets: [
      "Make resilience a design principle",
      "Monitor changes in real time",
      "Maintain a broad set of climate levers",
    ],
  },
];

export function RecreatedSlide11() {
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
      {/* ── Background photo (misty lake) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, #3a4a3a 0%, #4a5a48 15%, #6a7a60 25%, #a8b890 35%, #d0c890 45%, #e8d880 50%, #c8b86a 55%, #a89050 60%, #302820 75%, #181410 100%)",
        }}
      />

      {/* ── Version 2 tag ── */}
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
        Version 2
      </div>

      {/* ── Title ── */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 36,
          right: 140,
          fontSize: 18,
          fontWeight: 400,
          color: WHITE,
          lineHeight: 1.25,
        }}
      >
        With 2030 targets now on the horizon, CEOs must take action
      </div>

      {/* ── Dark lower band ── */}
      <div
        style={{
          position: "absolute",
          top: 215,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(10, 8, 5, 0.88)",
        }}
      />

      {/* ── Three columns header row ── */}
      {COLS.map((col, ci) => (
        <div
          key={ci}
          style={{
            position: "absolute",
            left: ci * COL_W + (ci > 0 ? 1 : 0),
            top: 215,
            width: COL_W - 1,
          height: 110,
          background: "rgba(20, 15, 10, 0.92)",
            borderRight: ci < 2 ? "1px solid #555" : "none",
            boxSizing: "border-box",
            padding: "18px 18px 0",
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 900, color: WHITE, lineHeight: 1 }}>{col.num}</div>
          <div style={{ fontSize: 18, color: WHITE, lineHeight: 1.2, marginTop: 2 }}>
            <strong>{col.bold}</strong>
            {col.rest}
          </div>
        </div>
      ))}

      {/* ── Column dividers in bullet area ── */}
      {[1, 2].map((ci) => (
        <div
          key={ci}
          style={{
            position: "absolute",
            left: ci * COL_W,
            top: 325,
            width: 1,
            height: SLIDE_H - 325,
            background: "#444",
          }}
        />
      ))}

      {/* ── Bullet points per column ── */}
      {COLS.map((col, ci) => (
        <div
          key={ci}
          style={{
            position: "absolute",
            left: ci * COL_W + 18,
            top: 346,
            width: COL_W - 36,
          }}
        >
          {col.bullets.map((b, bi) => (
            <div
              key={bi}
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: WHITE,
                marginBottom: 16,
                lineHeight: 1.3,
              }}
            >
              {b}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function SustainabilityOverview11() {

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
                                <RecreatedSlide11 />
      </div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>
        Slide 11 — CEOs Must Act V2 (Photo Background + Bullet Points) &nbsp;|&nbsp; 1280 × 720
      </div>
    </div>
  );
}
