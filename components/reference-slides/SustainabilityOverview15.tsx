"use client";

const BAIN_RED = "#CC0000";
const TEAL = "#2d6b50";
const TEAL_DARK = "#1e4a38";
const TEAL_MED = "#3d7a5a";
const GRAY_LIGHT = "#e8ebe8";
const GRAY_MED = "#c0c8c0";
const SLIDE_W = 1280;
const SLIDE_H = 720;

function Cell({
  text,
  bg = "#fff",
  color = "#111",
  bold = false,
  fontSize = 10,
  padding = "4px 6px",
  border = "1px solid #c8ccc8",
  italic = false,
}: {
  text: string;
  bg?: string;
  color?: string;
  bold?: boolean;
  fontSize?: number;
  padding?: string;
  border?: string;
  italic?: boolean;
}) {
  return (
    <div
      style={{
        background: bg,
        color,
        fontWeight: bold ? 700 : 400,
        fontStyle: italic ? "italic" : "normal",
        fontSize,
        fontFamily: "Arial, sans-serif",
        padding,
        border,
        textAlign: "center",
        lineHeight: 1.25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      {text}
    </div>
  );
}

export function RecreatedSlide15() {
  return (
    <div
      style={{
        width: SLIDE_W,
        height: SLIDE_H,
        position: "relative",
        background: "#f5f5f2",
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
          lineHeight: 1.28,
        }}
      >
        We offer four Sustainability solutions, and have developed the frameworks for each solution
      </div>

      {/* ── Red rule ── */}
      <div style={{ position: "absolute", top: 78, left: 36, right: 36, height: 1.5, background: BAIN_RED }} />

      {/* ══════ QUADRANT 1: Transition Strategy (top-left) ══════ */}
      <div
        style={{
          position: "absolute",
          top: 88,
          left: 36,
          width: 596,
          height: 290,
          background: "#fff",
          border: "1px solid #ddd",
          padding: "8px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div style={{ fontSize: 9, fontWeight: 700, color: BAIN_RED, marginBottom: 4 }}>Transition Strategy</div>

        {/* Framework table */}
        <div style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 2 }}>
          {/* Row 1: Starting Point */}
          <Cell text="Starting Point" bg={TEAL} color="#fff" bold fontSize={8} />
          <Cell text="Future-back point of view" bg={GRAY_LIGHT} bold fontSize={8} />

          {/* Row 2: Key Products */}
          <Cell text={"Key\nProducts"} bg={TEAL} color="#fff" bold fontSize={9} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 2,
            }}
          >
            <Cell text="Embed in Long-term Strategy" bg={TEAL_MED} color="#fff" bold fontSize={9} />
            <Cell text="Sustainable Business Building" bg={TEAL_DARK} color="#fff" bold fontSize={9} />
            <Cell text="Sustainability Strategy" bg={TEAL} color="#fff" bold fontSize={9} />
          </div>

          {/* Row 3: Go-to-market */}
          <Cell text={"Go-to-\nmarket"} bg={TEAL} color="#fff" bold fontSize={9} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 2 }}>
            {["Industry-specific", "Embedded in strategy", "Industry-specific", "", "Industry-specific"].map(
              (t, i) => (
                <Cell key={i} text={t} bg={GRAY_LIGHT} fontSize={8} />
              )
            )}
          </div>

          {/* Row 4: Embed across Bain */}
          <Cell text={"Embed\nacross\nBain"} bg={TEAL} color="#fff" bold fontSize={9} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
            <div style={{ display: "grid", gap: 1 }}>
              {["Strategy", "Sustainability"].map((t) => (
                <Cell key={t} text={t} bg={GRAY_LIGHT} fontSize={8} />
              ))}
            </div>
            <div style={{ display: "grid", gap: 1 }}>
              {["Commercial Excellence", "Operations", "Capital Projects", "Sust. Value Creation"].map((t) => (
                <Cell key={t} text={t} bg={GRAY_LIGHT} fontSize={8} />
              ))}
            </div>
            <div style={{ display: "grid", gap: 1 }}>
              {["Strategy", "Sust. Value Creation", "Circular Value Creation", "Resilience & Adaptation"].map(
                (t) => <Cell key={t} text={t} bg={GRAY_LIGHT} fontSize={8} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══════ QUADRANT 2: Sustainability Value Creation (top-right) ══════ */}
      <div
        style={{
          position: "absolute",
          top: 88,
          left: 640,
          width: 604,
          height: 290,
          background: "#fff",
          border: "1px solid #ddd",
          padding: "8px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div style={{ fontSize: 9, fontWeight: 700, color: BAIN_RED, marginBottom: 4 }}>
          Sustainability Value Creation
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 2 }}>
          <Cell text="Client needs" bg={TEAL} color="#fff" bold fontSize={9} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
            <Cell text="Capture value from carbon commitments" bg={GRAY_MED} bold fontSize={9} />
            <Cell text="Achieve full comm. value from sust. offers" bg={GRAY_MED} bold fontSize={9} />
            <Cell text="Reduce cost & carbon in supply chain" bg={GRAY_MED} bold fontSize={9} />
          </div>
          <Cell text={"Our\nProducts"} bg={TEAL} color="#fff" bold fontSize={9} />
          <div style={{ display: "grid", gap: 2 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
              <Cell text="Carbon X-Ray" bg={TEAL_MED} color="#fff" bold fontSize={9} />
              <Cell text="Sustainability B2B ComEx" bg={TEAL_MED} color="#fff" bold fontSize={9} />
              <Cell text="Sust. Procurement / Supply Chain Decarb" bg={TEAL_MED} color="#fff" bold fontSize={9} />
            </div>
            <Cell text="Carbon/ Sustainability VCP" bg={TEAL_DARK} color="#fff" bold fontSize={9} padding="6px" />
          </div>
          <Cell text={"Embed\nacross\nBain"} bg={TEAL} color="#fff" bold fontSize={9} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
            <div style={{ display: "grid", gap: 1 }}>
              {["Strategy", "APT (PI)", "PE-backed VCP", "PE DD"].map((t) => (
                <Cell key={t} text={t} bg={GRAY_LIGHT} fontSize={8} />
              ))}
            </div>
            <div style={{ display: "grid", gap: 1 }}>
              <Cell text="Sales Play System (CE)" bg={GRAY_LIGHT} fontSize={8} />
            </div>
            <div style={{ display: "grid", gap: 1 }}>
              <Cell text="Procurement (PI)" bg={GRAY_LIGHT} fontSize={8} />
            </div>
          </div>
        </div>
      </div>

      {/* ══════ QUADRANT 3: Circular Value Creation (bottom-left) ══════ */}
      <div
        style={{
          position: "absolute",
          top: 386,
          left: 36,
          width: 596,
          height: 298,
          background: "#fff",
          border: "1px solid #ddd",
          padding: "8px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div style={{ fontSize: 9, fontWeight: 700, color: BAIN_RED, marginBottom: 4 }}>
          Circular Value Creation
        </div>

        {/* Staircase diagram */}
        <div style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: 2 }}>
          {[
            { row: "Diagnose", products: ["Circular Opportunities"] },
            { row: "Design", products: ["Circular", "Circular Actions"] },
            {
              row: "Deliver",
              products: ["Full Potential", "Circular Offer Strategy", "Circular Services Boost", "Circular Resources Strategy"],
            },
            { row: "Embed across Bain", products: ["Circular Scaling"] },
          ].map(({ row, products }) => (
            <div key={row} style={{ display: "contents" }}>
              <Cell text={row} bg={TEAL_DARK} color="#fff" bold fontSize={9} />
              <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {products.map((p, pi) => (
                  <Cell
                    key={pi}
                    text={p}
                    bg={pi === 0 && row === "Deliver" ? TEAL_DARK : pi < 1 ? TEAL_MED : GRAY_LIGHT}
                    color={pi < 2 && row !== "Deliver" ? "#fff" : pi < 1 ? "#fff" : "#111"}
                    bold={pi < 2}
                    fontSize={9}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 9, color: "#888", fontStyle: "italic", marginTop: 6 }}>
          Embedded through broader Bain toolkit
        </div>
      </div>

      {/* ══════ QUADRANT 4: Resilience & Adaptation (bottom-right) ══════ */}
      <div
        style={{
          position: "absolute",
          top: 386,
          left: 640,
          width: 604,
          height: 298,
          background: "#fff",
          border: "1px solid #ddd",
          padding: "8px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div style={{ fontSize: 9, fontWeight: 700, color: BAIN_RED, marginBottom: 4 }}>
          Resilience &amp; Adaptation
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: 2 }}>
          <Cell text={"Key\nproducts"} bg={TEAL} color="#fff" bold fontSize={9} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 2 }}>
            {[
              "Protect & grow asset values",
              "Build resilient supply chain",
              "Secure & future-proof resource strategy",
              "Invest in climate adaptation technologies",
            ].map((t) => (
              <Cell key={t} text={t} bg={TEAL_MED} color="#fff" bold fontSize={8} />
            ))}
          </div>

          {[
            { row: "Sense", content: "Risk Exposure & Opportunity Heat Map" },
            {
              row: "Choose",
              content2: ["Limit the Downside", "Capture Opportunities"],
            },
            {
              row: "Deliver",
              content2: [
                "Embedded through broader Bain toolkit (Governance, Op Model, etc.)",
                "Capabilities & Enablers",
              ],
            },
          ].map(({ row, content, content2 }) => (
            <div key={row} style={{ display: "contents" }}>
              <Cell text={row} bg={TEAL_DARK} color="#fff" bold fontSize={9} />
              {content ? (
                <Cell text={content} bg={GRAY_LIGHT} fontSize={9} />
              ) : (
                <div style={{ display: "grid", gap: 2 }}>
                  {(content2 ?? []).map((c, ci) => (
                    <Cell key={ci} text={c} bg={ci === 0 ? GRAY_MED : GRAY_LIGHT} fontSize={9} italic={ci === 0} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SustainabilityOverview15() {

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
                                <RecreatedSlide15 />
      </div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>
        Slide 15 — Four Solutions Frameworks (2×2 Grid) &nbsp;|&nbsp; 1280 × 720
      </div>
    </div>
  );
}
