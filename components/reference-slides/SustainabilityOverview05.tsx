"use client";

const BAIN_RED = "#CC0000";
const SLIDE_W = 1280;
const SLIDE_H = 720;

// Data points for the line chart
const DATA: { year: number; value: number; isRed?: boolean }[] = [
  { year: 2018, value: 100 },
  { year: 2019, value: 115 },
  { year: 2020, value: 119 },
  { year: 2021, value: 141 },
  { year: 2022, value: 148 },
  { year: 2023, value: 108 },
  { year: 2024, value: 93 },
  { year: 2025, value: 101, isRed: true },
];

// Chart area constants — measured from reference overlay
const CHART_LEFT = 370;
const CHART_TOP = 148;
const CHART_W = 856; // right edge ~x=1226
const CHART_H = 420; // bottom edge ~y=568
const Y_MIN = 80;
const Y_MAX = 160;
const DASHED_X = 794; // x position of the 2023→2024 dashed line

function xFor(year: number) {
  const years = DATA.map((d) => d.year);
  const minY = Math.min(...years);
  const maxY = Math.max(...years);
  return CHART_LEFT + ((year - minY) / (maxY - minY)) * CHART_W;
}

function yFor(value: number) {
  return CHART_TOP + CHART_H - ((value - Y_MIN) / (Y_MAX - Y_MIN)) * CHART_H;
}

export function RecreatedSlide05() {
  // Build SVG polyline points — black segment 2018-2024, red 2024-2025
  const blackPts = DATA.filter((d) => !d.isRed || d.year === 2023)
    .slice(0, 7) // 2018..2024
    .map((d) => `${xFor(d.year)},${yFor(d.value)}`)
    .join(" ");

  const redPts = DATA.slice(6) // 2024, 2025
    .map((d) => `${xFor(d.year)},${yFor(d.value)}`)
    .join(" ");

  const yTicks = [80, 100, 120, 140, 160];

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
      {/* ── Left cream panel ── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 352,
          height: SLIDE_H,
          background: "#e5ddd2",
        }}
      />

      {/* ── Left panel large text ── */}
      <div
        style={{
          position: "absolute",
          left: 34,
          top: 320,
          width: 282,
          fontSize: 30,
          fontWeight: 400,
          color: "#1a1a1a",
          lineHeight: 1.28,
        }}
      >
        Sustainability remains below peak hype levels, but the decline is bottoming out
      </div>

      {/* ── Chart area ── */}
      <div
        style={{
          position: "absolute",
          left: CHART_LEFT,
          top: CHART_TOP,
          width: CHART_W + 80,
          height: SLIDE_H - CHART_TOP - 60,
        }}
      >
        {/* Chart label */}
        <div
          style={{
            fontSize: 11,
            color: "#333",
            marginBottom: 6,
          }}
        >
          Importance of Sustainability according to CEOs, indexed to 2018
        </div>

        {/* SVG chart */}
        <svg
          width={CHART_W + 60}
          height={CHART_H + 60}
          style={{ overflow: "visible" }}
        >
          {/* Y-axis ticks and grid lines */}
          {yTicks.map((tick) => {
            const cy = yFor(tick) - CHART_TOP;
            return (
              <g key={tick}>
                <line
                  x1={0}
                  y1={cy}
                  x2={CHART_W}
                  y2={cy}
                  stroke="#e0e0e0"
                  strokeWidth={tick === Y_MIN ? 1.5 : 0.8}
                />
                <text
                  x={-8}
                  y={cy + 4}
                  textAnchor="end"
                  fontSize={12}
                  fill="#555"
                  fontFamily="Arial, sans-serif"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Shaded region from 2023 onwards */}
          <rect
            x={DASHED_X - CHART_LEFT}
            y={0}
            width={CHART_W - (DASHED_X - CHART_LEFT)}
            height={CHART_H}
            fill="#f0f0f0"
            opacity={0.5}
          />

          {/* Dashed vertical line at 2023 */}
          <line
            x1={DASHED_X - CHART_LEFT}
            y1={0}
            x2={DASHED_X - CHART_LEFT}
            y2={CHART_H}
            stroke="#aaa"
            strokeWidth={1}
            strokeDasharray="5,4"
          />

          {/* Black line 2018–2024 */}
          <polyline
            points={blackPts
              .split(" ")
              .map((pt) => {
                const [x, y] = pt.split(",").map(Number);
                return `${x - CHART_LEFT},${y - CHART_TOP}`;
              })
              .join(" ")}
            fill="none"
            stroke="#111"
            strokeWidth={2.5}
            strokeLinejoin="round"
          />

          {/* Red line 2024–2025 */}
          <polyline
            points={redPts
              .split(" ")
              .map((pt) => {
                const [x, y] = pt.split(",").map(Number);
                return `${x - CHART_LEFT},${y - CHART_TOP}`;
              })
              .join(" ")}
            fill="none"
            stroke={BAIN_RED}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />

          {/* X-axis labels */}
          {DATA.map((d) => (
            <text
              key={d.year}
              x={xFor(d.year) - CHART_LEFT}
              y={CHART_H + 22}
              textAnchor="middle"
              fontSize={12}
              fill="#555"
              fontFamily="Arial, sans-serif"
            >
              {d.year}
            </text>
          ))}

          {/* Bottom axis line */}
          <line
            x1={0}
            y1={CHART_H}
            x2={CHART_W}
            y2={CHART_H}
            stroke="#555"
            strokeWidth={1}
          />
        </svg>

        {/* Annotation box — sits just right of the dashed line near the peak */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: DASHED_X - CHART_LEFT + 20,
            width: 156,
            fontSize: 10,
            color: BAIN_RED,
            fontWeight: 400,
            lineHeight: 1.35,
            background: "#fff8f0",
            border: `1.5px dashed ${BAIN_RED}`,
            padding: "6px 8px",
            boxSizing: "border-box",
          }}
        >
          Decline is bottoming out,{" "}
          <strong style={{ color: BAIN_RED }}>slow increase in priority in 2025</strong>
        </div>
      </div>

      {/* ── Source note ── */}
      <div
        style={{
          position: "absolute",
          bottom: 14,
          left: 16,
          fontSize: 9,
          color: "#555",
          lineHeight: 1.4,
        }}
      >
        Source: Bain analysis, based on aggregation of publicly
        <br />
        available CEO surveys (IBM, Gartner, PwC, KPMG)
      </div>
    </div>
  );
}

export default function SustainabilityOverview05() {

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
                                <RecreatedSlide05 />
      </div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>
        Slide 05 — Sustainability Hype Line Chart &nbsp;|&nbsp; 1280 × 720
      </div>
    </div>
  );
}
