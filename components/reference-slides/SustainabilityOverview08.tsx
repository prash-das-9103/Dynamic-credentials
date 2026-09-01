"use client";

const BAIN_RED = "#CC0000";
const SLIDE_W = 1280;
const SLIDE_H = 720;

// Stacked bar data — each column sums to 100%
// Segments from bottom: CSR reporting, Public commitment, Purpose driven, Business driven
const BARS = [
  {
    year: "2018",
    segments: [
      { label: "CSR reporting", value: 18, color: "#c8d8cc" },
      { label: "Public commitment", value: 22, color: "#8db8a0" },
      { label: "Purpose driven", value: 26, color: "#5a9878" },
      { label: "Business driven", value: 34, color: "#1e6b50" },
    ],
  },
  {
    year: "2022",
    segments: [
      { label: "CSR reporting", value: 12, color: "#c8d8cc" },
      { label: "Public commitment", value: 27, color: "#8db8a0" },
      { label: "Purpose driven", value: 13, color: "#5a9878" },
      { label: "Business driven", value: 48, color: "#1e6b50" },
    ],
  },
  {
    year: "2024",
    segments: [
      { label: "CSR reporting", value: 12, color: "#c8d8cc" },
      { label: "Public commitment", value: 21, color: "#8db8a0" },
      { label: "Purpose driven", value: 13, color: "#5a9878" },
      { label: "Business driven", value: 54, color: "#1e6b50" },
    ],
  },
];

const BAR_W = 120;
const BAR_H = 380;
const BAR_GAP = 48;
const CHART_LEFT = 60; // relative to chart container

export function RecreatedSlide08() {
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
          top: 14,
          left: 36,
          right: 36,
          fontSize: 26,
          fontWeight: 400,
          color: "#111",
          lineHeight: 1.25,
        }}
      >
        The &ldquo;Say&rdquo; is evolving &ndash; CEOs are speaking less, but linking sustainability to performance and business value
      </div>

      {/* ── Horizontal rule ── */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 36,
          right: 36,
          height: 1,
          background: "#ddd",
        }}
      />

      {/* ── LEFT: photo + black panel ── */}
      <div
        style={{
          position: "absolute",
          top: 112,
          left: 36,
          width: 388,
          height: 562,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Photo placeholder — warm sunset/wind turbines */}
        <div
          style={{
            width: "100%",
            height: 238,
            flexShrink: 0,
            background: "linear-gradient(180deg, #a8b8c8 0%, #7090a0 40%, #506080 60%, #304050 100%)",
          }}
        />
        {/* Black panel */}
        <div
          style={{
            width: "100%",
            flex: 1,
            background: "#111",
            padding: "18px 18px 18px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 14, color: "#fff", lineHeight: 1.5, marginBottom: 14 }}>
            We used <strong>Bain&apos;s AI-powered Sustainability Pulse tool</strong>, to analyze
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div>
              <span style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>35k+</span>
              <span style={{ fontSize: 14, color: "#fff" }}> statements made by</span>
            </div>
            <div>
              <span style={{ fontSize: 42, fontWeight: 900, color: "#fff" }}>150</span>
              <span style={{ fontSize: 14, color: "#ccc" }}> CEOs</span>
            </div>
            <div style={{ fontSize: 13, color: "#ccc" }}>of top companies</div>
          </div>
        </div>
      </div>

      {/* ── Vertical centre divider ── */}
      <div
        style={{
          position: "absolute",
          left: 448,
          top: 112,
          width: 1,
          height: 562,
          background: "#e0e0e0",
        }}
      />

      {/* ── RIGHT: stacked bar chart ── */}
      <div
        style={{
          position: "absolute",
          top: 112,
          left: 464,
          width: 782,
        }}
      >
        {/* Chart heading */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 4, marginTop: 4 }}>
          CEOs increasingly link sustainability to business performance
        </div>
        <div style={{ width: 80, height: 2, background: BAIN_RED, marginBottom: 6 }} />
        <div style={{ fontSize: 11, color: "#555", marginBottom: 16 }}>
          Share of sustainability mentions by CEOs
        </div>

        {/* Chart */}
        <div style={{ position: "relative", height: BAR_H + 80 }}>
          {/* Y axis label "100" */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              fontSize: 11,
              color: "#555",
            }}
          >
            100
          </div>

          {/* Bars */}
          {BARS.map((bar, bi) => {
            const x = CHART_LEFT + bi * (BAR_W + BAR_GAP);
            let yOffset = 0;
            return (
              <div key={bar.year}>
                {/* Stacked bar */}
                <div
                  style={{
                    position: "absolute",
                    left: x,
                    top: 18,
                    width: BAR_W,
                    height: BAR_H,
                    display: "flex",
                    flexDirection: "column-reverse",
                  }}
                >
                  {bar.segments.map((seg) => {
                    const segH = (seg.value / 100) * BAR_H;
                    const el = (
                      <div
                        key={seg.label}
                        style={{
                          width: "100%",
                          height: segH,
                          background: seg.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#fff",
                            fontFamily: "Arial, sans-serif",
                          }}
                        >
                          {seg.value}%
                        </span>
                      </div>
                    );
                    yOffset += segH;
                    return el;
                  })}
                </div>
                {/* Year label */}
                <div
                  style={{
                    position: "absolute",
                    left: x,
                    top: 18 + BAR_H + 10,
                    width: BAR_W,
                    textAlign: "center",
                    fontSize: 13,
                    color: "#444",
                  }}
                >
                  {bar.year}
                </div>
              </div>
            );
          })}

          {/* Right legend labels */}
          {[
            { label: "Business driven", color: "#1e6b50", topPct: 34 / 2 },
            { label: "Purpose driven", color: "#5a9878", topPct: 34 + 26 / 2 },
            { label: "Public commitment", color: "#8db8a0", topPct: 34 + 26 + 22 / 2 },
            { label: "CSR reporting", color: "#c8d8cc", topPct: 34 + 26 + 22 + 18 / 2 },
          ].map((leg) => (
            <div
              key={leg.label}
              style={{
                position: "absolute",
                left: CHART_LEFT + 3 * (BAR_W + BAR_GAP) + 12,
                top: 18 + BAR_H - (leg.topPct / 100) * BAR_H - 8,
                fontSize: 12,
                color: "#333",
              }}
            >
              {leg.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Source note ── */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 36,
          fontSize: 9,
          color: "#666",
          lineHeight: 1.4,
        }}
      >
        Note: The selected CEOs lead the top 50 companies by market capitalization in each of the Americas, EMEA, and APAC regions, totaling 150 CEOs
        <br />
        Source: ~2k audio/video files across major conferences, earning calls, podcasts, etc.
      </div>
    </div>
  );
}

export default function SustainabilityOverview08() {

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
                                <RecreatedSlide08 />
      </div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>
        Slide 08 — Say is Evolving (Stacked Bar Chart) &nbsp;|&nbsp; 1280 × 720
      </div>
    </div>
  );
}
