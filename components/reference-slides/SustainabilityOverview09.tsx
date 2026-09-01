"use client";

const BAIN_RED = "#CC0000";
const TEAL = "#2d7060";
const DARK_RED = "#8b0000";
const SLIDE_W = 1280;
const SLIDE_H = 720;

const BAR_H = 52;
// left margin 36 + LEFT_LABEL_W + 14 + year-col 54 + 10 + BAR_AREA_W must be <= 1244 (leaving 36px right margin)
const LEFT_LABEL_W = 200;
const BAR_AREA_W = 940; // 36+200+14+54+10 = 314 + 940 = 1254 — fits within 1280

interface SegmentDef {
  value: number;
  color: string;
  label: string;
}

interface StackedRowProps {
  year: string;
  segments: SegmentDef[];
  maxValue: number;
}

function StackedRow({ year, segments, maxValue }: StackedRowProps) {
  const total = segments.reduce((s, g) => s + g.value, 0);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      <div
        style={{
      width: 54,
        textAlign: "right",
        fontFamily: "Arial, sans-serif",
        fontSize: 11,
        color: "#555",
        flexShrink: 0,
        lineHeight: 1.25,
        }}
      >
        {year}
      </div>
      <div style={{ display: "flex", height: BAR_H, width: BAR_AREA_W }}>
        {segments.map((seg) => {
          const w = (seg.value / maxValue) * BAR_AREA_W;
          return (
            <div
              key={seg.label}
              style={{
                width: w,
                height: BAR_H,
                background: seg.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: seg.value <= 5 ? 11 : 20,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {seg.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionHeading({ text }: { text: string }) {
  return (
    <>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 700, color: "#111", lineHeight: 1.3 }}>
        {text}
      </div>
      <div style={{ width: 60, height: 2, background: BAIN_RED, margin: "4px 0 3px" }} />
    </>
  );
}

export function RecreatedSlide09() {
  return (
    <div
      style={{
        width: SLIDE_W,
        height: SLIDE_H,
        position: "relative",
        background: "#fff",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
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
        Yet significant challenges persist &ndash; many companies remain off track, costs are increasing and environmental issues remain
      </div>

      {/* ── Red rule ── */}
      <div style={{ position: "absolute", top: 104, left: 36, right: 36, height: 1, background: "#ddd" }} />

      {/* ── SECTION 1: Scope 3 ── */}
      <div style={{ position: "absolute", top: 116, left: 36, width: LEFT_LABEL_W + 30 }}>
        <SectionHeading text={"~50% of companies are behind\non their Scope 3 targets"} />
        <div style={{ fontSize: 11, color: "#555", lineHeight: 1.3, marginTop: 4 }}>
          % of companies on track to reach Scope 3 target
        </div>
      </div>

      {/* ── Column header labels for section 1 ── */}
      <div
        style={{
          position: "absolute",
          top: 116,
          left: 36 + LEFT_LABEL_W + 14 + 54 + 10,
          display: "flex",
          gap: 0,
          width: BAR_AREA_W,
        }}
      >
        <div style={{ width: (51 / 100) * BAR_AREA_W, textAlign: "center", fontSize: 12, color: "#555" }}>
          On track or ahead
        </div>
        <div style={{ width: (5 / 100) * BAR_AREA_W, textAlign: "center", fontSize: 12, color: "#555" }} />
        <div style={{ width: (44 / 100) * BAR_AREA_W, textAlign: "center", fontSize: 12, color: "#555" }}>
          Behind track
        </div>
      </div>

      {/* Bar 1 */}
      <div style={{ position: "absolute", top: 158, left: 36 + LEFT_LABEL_W + 14 }}>
        <StackedRow
          year="CDP 2024"
          segments={[
            { value: 51, color: TEAL, label: "On track" },
            { value: 5, color: "#777", label: "Slightly behind" },
            { value: 44, color: DARK_RED, label: "Behind" },
          ]}
          maxValue={100}
        />
      </div>

      {/* ── SECTION 2: Disaster losses ── */}
      <div style={{ position: "absolute", top: 265, left: 36, width: LEFT_LABEL_W + 30 }}>
        <SectionHeading text={"Companies are facing huge\ndisaster losses"} />
        <div style={{ fontSize: 11, color: "#555", lineHeight: 1.3, marginTop: 4 }}>
          Total disaster losses in $B
        </div>
      </div>

      {/* Column header labels for section 2 */}
      <div
        style={{
          position: "absolute",
          top: 265,
          left: 36 + LEFT_LABEL_W + 14 + 54 + 10,
          display: "flex",
          gap: 0,
          width: BAR_AREA_W,
        }}
      >
        <div style={{ width: (154 / 417) * BAR_AREA_W, textAlign: "center", fontSize: 12, color: "#555" }}>
          Insured
        </div>
        <div style={{ width: (263 / 417) * BAR_AREA_W, textAlign: "center", fontSize: 12, color: "#555" }}>
          Uninsured
        </div>
      </div>

      {/* Bar 2 */}
      <div style={{ position: "absolute", top: 303, left: 36 + LEFT_LABEL_W + 14 }}>
        <StackedRow
          year="2024"
          segments={[
            { value: 154, color: TEAL, label: "Insured" },
            { value: 263, color: DARK_RED, label: "Uninsured" },
          ]}
          maxValue={417}
        />
      </div>

      {/* ── SECTION 3: Plastics ── */}
      <div style={{ position: "absolute", top: 407, left: 36, width: LEFT_LABEL_W + 30 }}>
        <SectionHeading text={"Plastics continue\nto be mismanaged"} />
        <div style={{ fontSize: 11, color: "#555", lineHeight: 1.3, marginTop: 4 }}>
          % of plastic waste by type of management
        </div>
      </div>

      {/* Column header labels for section 3 */}
      <div
        style={{
          position: "absolute",
          top: 407,
          left: 36 + LEFT_LABEL_W + 14 + 54 + 10,
          display: "flex",
          gap: 0,
          width: BAR_AREA_W,
        }}
      >
        {["Recycled", "", "Incinerated", "", "", "Landfilled", "", "Mismanaged", "Export/ import"].map(
          (lbl, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 11, color: "#555" }}>
              {lbl}
            </div>
          )
        )}
      </div>

      {/* Bar 3 */}
      <div style={{ position: "absolute", top: 445, left: 36 + LEFT_LABEL_W + 14 }}>
        <StackedRow
          year="2022"
          segments={[
            { value: 14, color: TEAL, label: "Recycled" },
            { value: 34, color: "#aaa", label: "Incinerated" },
            { value: 39, color: "#888", label: "Landfilled" },
            { value: 11, color: "#666", label: "Mismanaged" },
            { value: 3, color: "#444", label: "Export" },
          ]}
          maxValue={101}
        />
      </div>

      {/* ── Arrow + call-to-action ── */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "22px solid transparent",
            borderRight: "22px solid transparent",
            borderTop: `30px solid ${DARK_RED}`,
          }}
        />
        <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>
          Navigating this turbulent environment demands clarity and decisive action
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
        }}
      >
        Source: CDP, Gallagher Re, Guardian, Bain Analysis
      </div>
    </div>
  );
}

export default function SustainabilityOverview09() {

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
                                <RecreatedSlide09 />
      </div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>
        Slide 09 — Challenges Persist (Stacked Horizontal Bars) &nbsp;|&nbsp; 1280 × 720
      </div>
    </div>
  );
}
