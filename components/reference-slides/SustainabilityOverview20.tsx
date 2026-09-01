"use client";
import Image from "next/image";
const SLIDE_W = 1280;
const SLIDE_H = 720;
const RED = "#CC0000";
const DARK_GREEN = "#2d5040";

const MISSION_ITEMS = [
  { icon: "🚜", text: "Driving efficient resource use" },
  { icon: "✏", text: "Promoting eco-friendly product design" },
  { icon: "👥", text: "Supporting employee well-being and governance" },
  { icon: "🔍", text: "Enhancing supply chain transparency" },
];

export function RecreatedSlide20() {
  return (
    <div style={{ width: SLIDE_W, height: SLIDE_H, background: "#fff", position: "relative", fontFamily: "Arial, sans-serif", overflow: "hidden" }}>
      {/* Title */}
      <div style={{ position: "absolute", top: 18, left: 36, right: 220, fontSize: 22, fontWeight: 700, color: "#111", lineHeight: 1.35 }}>
        <span style={{ fontWeight: 700 }}>AI for Sustainable Future</span>
        {" – collaboration with the World Economic Forum on building AI-powered tools for Sustainability"}
      </div>

      {/* WEF logo top-right */}
      <div style={{ position: "absolute", top: 16, right: 36, width: 160, textAlign: "right" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#00529b", letterSpacing: 0.5, lineHeight: 1.4 }}>WORLD<br />ECONOMIC<br />FORUM</div>
        <div style={{ fontSize: 11, color: "#00529b" }}>⌒</div>
      </div>
      <div style={{ position: "absolute", top: 88, left: 36, right: 36, height: 1.5, background: "#e0e0e0" }} />

      {/* Left dark mission box */}
      <div style={{ position: "absolute", top: 102, left: 36, width: 354, bottom: 40, background: DARK_GREEN }}>
        <div style={{ padding: "14px 16px 8px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: 3, marginBottom: 4 }}>M I S S I O N</div>
          <div style={{ height: 2, background: RED, width: 48, marginBottom: 10 }} />
          <div style={{ fontSize: 12, color: "#ddd", lineHeight: 1.45, marginBottom: 14 }}>
            The project aims to <span style={{ fontStyle: "italic" }}>identify, shortlist, prototype and codify tangible AI</span> and technology-based solutions to accelerate sustainability across key sectors
          </div>
        </div>
        {MISSION_ITEMS.map((item) => (
          <div key={item.text} style={{ margin: "0 10px 6px", padding: "10px 12px", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{item.text}</span>
          </div>
        ))}
        <div style={{ position: "absolute", bottom: 8, left: 10, fontSize: 8, color: "#aaa" }}>LSM: Leaders for a Sustainable Middle East</div>
      </div>

      {/* Right content */}
      <div style={{ position: "absolute", top: 102, left: 406, right: 36, bottom: 40 }}>
        {/* Co-create section */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 4, lineHeight: 1.3 }}>
            Together we co-create six AI-powered sustainability platforms to deliver measurable impact
          </div>
          <div style={{ height: 2, background: RED, width: 64, marginBottom: 10 }} />
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
          {/* Screenshots stack placeholder */}
          <div style={{ width: 280, height: 180, position: "relative", flexShrink: 0 }}>
            {[4, 3, 2, 1, 0].map((i) => (
              <div key={i} style={{
                position: "absolute",
                left: i * 12,
                top: i * 8,
                width: 220,
                height: 150,
                background: "#e8ecf0",
                border: "1px solid #ccc",
                borderRadius: 3,
              }}>
                <div style={{ height: 6, background: "#1a2a3a", borderRadius: "3px 3px 0 0" }} />
                <div style={{ padding: 4 }}>
                  <div style={{ height: 3, background: "#c0c8d0", marginBottom: 2, borderRadius: 1 }} />
                  <div style={{ height: 3, background: "#d0d8e0", marginBottom: 2, borderRadius: 1, width: "80%" }} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginTop: 4 }}>
                    {[...Array(4)].map((_, j) => (
                      <div key={j} style={{ height: 24, background: j % 2 === 0 ? "#4a7060" : "#6a8878", borderRadius: 2 }} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right text */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "#222", lineHeight: 1.45, marginBottom: 10 }}>
              Tripartite partnership between the <strong>World Economic Forum, Bain and leaders across four industries</strong>, to identify and deliver AI driven sustainability value creation
            </div>
            <div style={{ fontSize: 12, color: "#222", lineHeight: 1.45 }}>
              <strong>Examples</strong> include: Sustainable Finance Market Pulse, Sustainable Investments Matchmaker, Sustainability Readiness Tool
            </div>
          </div>
        </div>

        {/* Report section */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 4 }}>Report: AI-driven sustainability solutions</div>
          <div style={{ height: 2, background: RED, width: 64, marginBottom: 8 }} />
          <div style={{ fontSize: 12, color: "#222", lineHeight: 1.45 }}>
            A report on AI-driven sustainability solutions <strong>is being previewed at Davos 2026 and will be formally released in April 2026</strong>, drawing on insights from across the 6 platforms we built
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SustainabilityOverview20() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40, padding: 24, background: "#1a1a1a", minHeight: "100vh" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative", width: SLIDE_W, height: SLIDE_H, flexShrink: 0 }}>
          <RecreatedSlide20 />
        </div>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>Slide 20 — WEF Collaboration (Recreated) &nbsp;|&nbsp; 1280 × 720</div>
      </div>

      {/* Original scanned slide, preserved for reference */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative", width: SLIDE_W, height: SLIDE_H, flexShrink: 0 }}>
          <Image
            src="/images/ai-sustainable-future-wef.png"
            alt="Original scanned Slide 20 — AI for Sustainable Future, WEF collaboration"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>Slide 20 — WEF Collaboration (Original) &nbsp;|&nbsp; 1280 × 720</div>
      </div>
    </div>
  );
}
