"use client";

const BAIN_RED = "#CC0000";
const SLIDE_W = 1280;
const SLIDE_H = 720;

const SECTIONS = [
  {
    label: "Sustainability Value Creation:",
    links: [
      "Sustainability x Commercial Excellence Selling Guide",
      "How Sustainability Is Creating B2B Growth",
      "Decarbonization That Works: Five Key Actions in Private Equity POV",
    ],
  },
  {
    label: "Circular Value Creation:",
    links: [
      "Unlocking Economic Value from Circularity",
      "Circular Value Creation in Automotive, Machinery, MedTech and Technology Sectors POV",
    ],
  },
  {
    label: "Resilience and Adaptation:",
    links: [
      "The CEO Playbook for Climate Resilience",
      "Climate Resilience & Adaptation for Private Equity",
      "Nature and Biodiversity POV (Long Version)",
    ],
  },
  {
    label: "Transition Strategy:",
    links: [
      "Embracing the Do-Say Gap",
      "AI and Sustainability: Shaping What\u2019s Next",
      "Sustainable Development \u2013 Business Breakthrough Barometer POV 2026",
      "Winning in the Energy Transition \u2013 Executive Materials (2024)",
      "Transition Finance POV",
      "\u2018S\u2019 in ESG \u2013 Overall POV (Long Version)",
    ],
  },
];

export function RecreatedSlide12() {
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
      {/* ── Title area ── */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 36,
          right: 460,
          fontSize: 16,
          fontWeight: 400,
          color: "#111",
          lineHeight: 1.3,
        }}
      >
        To learn more about sustainability, visit our pages on Iris where we have growing collection of contents
      </div>

      {/* ── Top-right contact box ── */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 438,
          border: "1px solid #ccc",
          padding: "8px 12px",
          fontSize: 11,
          color: "#333",
          lineHeight: 1.4,
        }}
      >
        Please contact our sustainability knowledge team if you need further help in finding content{" "}
        <span style={{ color: BAIN_RED, textDecoration: "underline" }}>
          GlobalSustainabilityHelpdesk@bain.com
        </span>
      </div>

      {/* ── Red rule ── */}
      <div style={{ position: "absolute", top: 72, left: 36, right: 36, height: 1, background: "#ddd" }} />

      {/* ── Internal label ── */}
      <div
        style={{
          position: "absolute",
          top: 80,
          right: 36,
          fontSize: 10,
          color: "#888",
          letterSpacing: "0.18em",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 16,
            height: 1,
            background: "#999",
            verticalAlign: "middle",
          }}
        />
        INTERNAL AND NON-EXHAUSTIVE
      </div>

      {/* ── Left: content list ── */}
      <div style={{ position: "absolute", top: 96, left: 36, width: 780 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 8 }}>
          Starter pack of Bain Sustainability POVs
        </div>
        <div style={{ width: "100%", height: 1, background: "#ccc", marginBottom: 10 }} />

        {SECTIONS.map((sec) => (
          <div key={sec.label} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 14, color: "#555", marginTop: 1 }}>•</span>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: BAIN_RED }}>{sec.label}</span>
                {sec.links.map((link) => (
                  <div key={link} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 3 }}>
                    <span style={{ fontSize: 13, color: "#888", marginLeft: 8 }}>–</span>
                    <span style={{ fontSize: 12, color: BAIN_RED, textDecoration: "underline", lineHeight: 1.35 }}>
                      {link}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Right: photo + practice page box ── */}
      <div
        style={{
          position: "absolute",
          top: 96,
          right: 0,
          width: 400,
          bottom: 36,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Photo */}
        <div
          style={{
            flex: 1,
            background: "linear-gradient(180deg, #8a6050 0%, #6a3828 30%, #1a1412 60%, #2a2830 80%, #353040 100%)",
            display: "flex",
            alignItems: "flex-end",
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: "#fff",
              fontWeight: 400,
              lineHeight: 1.4,
            }}
          >
            Visit our practice pages on Iris for more POVs, selling guides, proposals, case examples...
          </div>
        </div>
        {/* Practice page CTA */}
        <div
          style={{
            background: "#fff",
            border: "2px solid #ccc",
            borderRadius: 2,
            padding: "14px 16px",
            margin: "8px 0",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "2px solid #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth={2}>
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#111",
                letterSpacing: "0.06em",
              }}
            >
              SUSTAINABILITY
              <br />
              PRACTICE PAGE
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: 36,
          right: 420,
          fontSize: 8,
          color: "#888",
        }}
      >
        This information is confidential and was prepared by Bain & Company solely for the use of our client; it is not to be relied on by any 3rd party without Bain&apos;s prior written consent
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 22,
          left: 36,
          right: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 7, color: "#888" }}>
          This information is confidential and was prepared by Bain &amp; Company solely for the use of our client
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#111", letterSpacing: "0.05em" }}>
            BAIN &amp; COMPANY
          </span>
          <span style={{ fontSize: 11, color: BAIN_RED }}>&#9711;</span>
          <span style={{ fontSize: 9, color: "#555" }}>9</span>
        </div>
      </div>
    </div>
  );
}

export default function SustainabilityOverview12() {

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
                                <RecreatedSlide12 />
      </div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>
        Slide 12 — Iris Sustainability Links &nbsp;|&nbsp; 1280 × 720
      </div>
    </div>
  );
}
