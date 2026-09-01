"use client";

const BAIN_RED = "#CC0000";
const SLIDE_W = 1280;
const SLIDE_H = 720;

interface BarRowProps {
  label: string;
  value: number;
  maxValue: number;
  barWidth: number;
}

function HorizontalBar({ label, value, maxValue, barWidth }: BarRowProps) {
  const barPx = (value / maxValue) * barWidth;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: 13,
          color: "#555",
          width: 40,
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {label}
      </div>
      <div
        style={{
          width: barPx,
          height: 62,
          background: "#333",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: 12,
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 34,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

interface SBtiBarProps {
  label: string;
  value: number;
  maxValue: number;
  barWidth: number;
}

function SBtiBar({ label, value, maxValue, barWidth }: SBtiBarProps) {
  const barPx = (value / maxValue) * barWidth;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: 13,
          color: "#555",
          width: 116,
          flexShrink: 0,
          textAlign: "right",
        }}
      >
        {label}
      </div>
      <div
        style={{
          width: barPx,
          height: 62,
          background: "#333",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: 12,
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 34,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

export function RecreatedSlide07() {
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
          top: 18,
          left: 36,
          right: 36,
          fontSize: 11,
          fontWeight: 400,
          color: "#111",
          lineHeight: 1.28,
        }}
      >
        The &ldquo;Do&rdquo; is accelerating &ndash; CEOs are continuing to act, focusing on those areas that link directly to business value
      </div>

      {/* ── Horizontal rule ── */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 36,
          right: 36,
          height: 1,
          background: "#ddd",
        }}
      />

      {/* ── Vertical centre divider ── */}
      <div
        style={{
          position: "absolute",
          left: 640,
          top: 60,
          width: 1,
          height: SLIDE_H - 60 - 30,
          background: "#ddd",
        }}
      />

      {/* ══ LEFT COLUMN ══ */}
      <div
        style={{
          position: "absolute",
          top: 72,
          left: 36,
          width: 594,
        }}
      >
        {/* Section heading */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 4, lineHeight: 1.3 }}>
          Companies assign more business
          <br />
          to sustainable suppliers
        </div>
        <div
          style={{
            width: 64,
            height: 2,
            background: BAIN_RED,
            marginBottom: 8,
          }}
        />
        <div style={{ fontSize: 11, color: "#444", marginBottom: 22, lineHeight: 1.35 }}>
          % of respondents who say they will assign more business
          <br />
          to suppliers with superior sustainable operations
        </div>
        <HorizontalBar label="2024" value={44} maxValue={100} barWidth={480} />
        <HorizontalBar label="2025" value={56} maxValue={100} barWidth={480} />
        <HorizontalBar label="2028" value={70} maxValue={100} barWidth={480} />
      </div>

      {/* ══ RIGHT COLUMN ══ */}
      <div
        style={{
          position: "absolute",
          top: 72,
          left: 660,
          width: 582,
        }}
      >
        {/* Section heading */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 4, lineHeight: 1.3 }}>
          Corporate targets are becoming
          <br />
          more ambitious, not less
        </div>
        <div
          style={{
            width: 64,
            height: 2,
            background: BAIN_RED,
            marginBottom: 8,
          }}
        />
        <div style={{ fontSize: 11, color: "#444", marginBottom: 22, lineHeight: 1.35 }}>
          % of SBTi target revisions from 2022 to 2025
        </div>
        <SBtiBar label="More ambitious" value={10} maxValue={15} barWidth={430} />
        <SBtiBar label="Less ambitious" value={4} maxValue={15} barWidth={430} />
      </div>

      {/* ── Source note ── */}
      <div
        style={{
          position: "absolute",
          bottom: 14,
          left: 36,
          fontSize: 9,
          color: "#666",
          lineHeight: 1.4,
        }}
      >
        Note: Excludes targets corresponding to change in methodology, which includes updates to target type (e.g., absolute vs. intensity) and scope; Analysis done at target level rather than company level
        <br />
        Source: Bain analysis, Bain B2B Customer Survey, April 2025 (N=753); 2022 and 2025 SBTi Dashboards
      </div>
    </div>
  );
}

export default function SustainabilityOverview07() {

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
                                <RecreatedSlide07 />
      </div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>
        Slide 07 — Do is Accelerating (Horizontal Bars) &nbsp;|&nbsp; 1280 × 720
      </div>
    </div>
  );
}
