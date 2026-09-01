"use client";

const SLIDE_W = 1280;
const SLIDE_H = 720;

export function RecreatedSlide06() {
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
      {/* ── Full-bleed background photo (wind/mountains) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(160deg, #5a6e4a 0%, #3d5035 20%, #1e3520 40%, #0d1e10 60%, #1a2530 80%, #2a3540 100%)",
        }}
      />

      {/* ── White top strip for title ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 76,
          background: "#fff",
        }}
      />

      {/* ── Title ── */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 36,
          right: 36,
          fontSize: 17,
          fontWeight: 400,
          color: "#111",
          lineHeight: 1.25,
        }}
      >
        CEOs speak less about sustainability but continue to act
      </div>

      {/* ── Red DO circle ── */}
      <div
        style={{
          position: "absolute",
          left: 30,
          top: 148,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "#c0161a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 900, color: "#fff", lineHeight: 1 }}>DO</div>
        <div style={{ fontSize: 18, fontWeight: 400, color: "#fff", lineHeight: 1.2 }}>more</div>
      </div>

      {/* ── Gray SAY circle (overlapping, shifted right+down) ── */}
      <div
        style={{
          position: "absolute",
          left: 158,
          top: 268,
          width: 178,
          height: 178,
          borderRadius: "50%",
          background: "#c8c4be",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 700, color: "#333", lineHeight: 1 }}>&ldquo;SAY&rdquo;</div>
        <div style={{ fontSize: 15, fontWeight: 400, color: "#444", lineHeight: 1.2 }}>less</div>
      </div>

      {/* ── Right body text ── */}
      <div
        style={{
          position: "absolute",
          left: 560,
          top: 170,
          width: 580,
          fontSize: 14,
          color: "#fff",
          lineHeight: 1.5,
          fontWeight: 400,
        }}
      >
        While CEOs today are speaking less about sustainability, they are busy designing and scaling{" "}
        <strong style={{ fontWeight: 700 }}>sustainability transformations</strong> that deliver{" "}
        <strong style={{ fontWeight: 700 }}>true business value</strong>
      </div>

      {/* ── Dark arrow pointing down ── */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "22px solid transparent",
          borderRight: "22px solid transparent",
          borderTop: "32px solid #1a1a1a",
        }}
      />

      {/* ── Bottom white strip ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 58,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#111",
          }}
        >
          This phenomenon is what we call the &ldquo;Do-Say gap&rdquo;
        </div>
      </div>
    </div>
  );
}

export default function SustainabilityOverview06() {

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
                                <RecreatedSlide06 />
      </div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>
        Slide 06 — CEOs Do-Say Gap &nbsp;|&nbsp; 1280 × 720
      </div>
    </div>
  );
}
