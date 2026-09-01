"use client";
import Image from "next/image";
const SLIDE_W = 1280;
const SLIDE_H = 720;
const RED = "#CC0000";
const DARK_TEAL = "#1e3a4a";

const PARTNERS = [
  { name: "OpenAI", desc: "Unique alliance for 2.5+ years with strong momentum", bg: "#2a3540", logo: "OpenAI" },
  { name: "AI Aspire", desc: "Strategic partnership with Andrew Ng to accelerate AI transformation", bg: "#1a2830", logo: "AI\nAspire" },
  { name: "INCEPTION", desc: "Strategic collaboration to bring productized, enterprise-grade AI solutions to clients worldwide", bg: "#2a3540", logo: "INCEPTION" },
  { name: "Palantir / aws / Microsoft / Google", desc: "", bg: "#1a2830", logo: "Palantir\naws\nMicrosoft Google" },
];

const ACQUISITIONS = [
  { name: "MaxKelsen", desc: "Enhance operationalization of machine learning and AI enabled use cases" },
  { name: "Umbrage", desc: "Deep technical expertise in Product Management, UI/ UX, full stack dev, DevOps, QA and Web3" },
];

export function RecreatedSlide21() {
  return (
    <div style={{ width: SLIDE_W, height: SLIDE_H, background: "#fff", position: "relative", fontFamily: "Arial, sans-serif", overflow: "hidden" }}>
      {/* Title */}
      <div style={{ position: "absolute", top: 14, left: 36, right: 36, fontSize: 24, fontWeight: 400, color: "#111", lineHeight: 1.3 }}>
        We are pioneers in the field of applying AI, Gen AI and Agentic at business scale
      </div>
      <div style={{ position: "absolute", top: 80, left: 36, right: 36, height: 1.5, background: "#e0e0e0" }} />

      {/* Left column */}
      <div style={{ position: "absolute", top: 92, left: 36, width: 530, bottom: 28 }}>
        {/* Sub-heading */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 4 }}>Cutting edge AI work with leading corporations and investors</div>
        <div style={{ height: 2, background: RED, width: 56, marginBottom: 10 }} />

        {/* Big stat */}
        <div style={{ fontSize: 13, color: "#111", marginBottom: 12, lineHeight: 1.4 }}>
          <span style={{ color: RED, fontWeight: 700, fontSize: 16 }}>3,000+ AI, Insights & Solutions</span>{" "}clients engagements globally
        </div>

        {/* Two KPI columns */}
        <div style={{ display: "flex", gap: 32, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: RED }}>420+</div>
            <div style={{ fontSize: 11, color: "#333", lineHeight: 1.4 }}>GenAI / Agentic AI use cases and solutions delivered worldwide</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: RED }}>350+</div>
            <div style={{ fontSize: 11, color: "#333" }}>active projects</div>
          </div>
        </div>

        {/* Event photo placeholder */}
        <div style={{ fontSize: 11, fontStyle: "italic", color: "#555", marginBottom: 4 }}>Open AI CEO, Sam Altman, talking about Bain at the Open AI DevDay 2025:</div>
        <div style={{ width: "100%", height: 230, background: "#1a1a2a", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          {/* Screen overlay */}
          <div style={{ position: "absolute", top: 20, left: 20, right: 20, height: 100, background: "#2a2a3a", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "#fff", borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: RED }}>BAIN</span><span style={{ color: "#555", fontSize: 10 }}>⊙</span>
              <span style={{ color: "#333" }}>Code modernization agent</span>
            </div>
          </div>
          {/* Person silhouette */}
          <div style={{ position: "absolute", bottom: 0, left: "30%", width: 80, height: 120, background: "#333", borderRadius: "4px 4px 0 0" }} />
        </div>
      </div>

      {/* Vertical divider */}
      <div style={{ position: "absolute", top: 92, left: 574, width: 1, bottom: 28, background: "#e0e0e0" }} />

      {/* Right column */}
      <div style={{ position: "absolute", top: 92, left: 590, right: 36, bottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 4 }}>Strong ecosystem of strategic alliances &amp; partnerships¹</div>
        {/* 2×2 partner grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14 }}>
          {PARTNERS.map((p) => (
            <div key={p.name} style={{ background: DARK_TEAL, borderRadius: 2, padding: "10px 12px", minHeight: 68, display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.12)", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 9, color: "#fff", whiteSpace: "pre-line", textAlign: "center", lineHeight: 1.3, fontWeight: 700 }}>{p.logo}</span>
              </div>
              {p.desc && <div style={{ fontSize: 10.5, color: "#ccc", lineHeight: 1.35 }}>{p.desc}</div>}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 4, lineHeight: 1.3 }}>Integrated multi-disciplinary teams to solve the most complex digital, analytics, and AI challenges</div>
        <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
          {[["20+", "senior practitioners, ex-CDO, CAO, data science professors"], ["900+", "deep analytics experts and practitioners"], ["1,500+", "analytics and software engineers via our partner network"]].map(([n, label]) => (
            <div key={n} style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: RED }}>{n}</div>
              <div style={{ fontSize: 10.5, color: "#333", lineHeight: 1.35 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Acquisitions box */}
        <div style={{ border: "1px solid #ccc", borderRadius: 2, padding: "8px 10px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#111", marginBottom: 6 }}>Recent acquisitions by Bain to enhance AI capabilities</div>
          <div style={{ display: "flex", gap: 12 }}>
            {ACQUISITIONS.map((a) => (
              <div key={a.name} style={{ flex: 1, display: "flex", gap: 6, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, background: "#e8e0f0", borderRadius: 2, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#4a3060" }}>{a.name[0]}</span>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#111" }}>{a.name}</div>
                  <div style={{ fontSize: 10, color: "#333", lineHeight: 1.35 }}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 6, fontSize: 9, color: "#666" }}>Note: (1) These alliances do not generate any type of conflict of interest to Bain&apos;s work throughout the engagement</div>
      </div>

      {/* Footer */}
      <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, height: 20, background: "#f8f8f8", borderTop: "1px solid #e8e8e8", display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: 36 }}>
        <div style={{ fontSize: 8.5, color: "#666" }}>This information is confidential and was prepared by Bain &amp; Company solely for the use of our client; it is not to be relied on by any 3rd party without Bain&apos;s prior written consent</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: RED }}>BAIN &amp; COMPANY</span>
          <div style={{ width: 13, height: 13, borderRadius: "50%", background: RED, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: 7, fontWeight: 700 }}>+</span></div>
          <span style={{ fontSize: 10, color: "#555" }}>23</span>
        </div>
      </div>
    </div>
  );
}

export default function SustainabilityOverview21() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40, padding: 24, background: "#1a1a1a", minHeight: "100vh" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative", width: SLIDE_W, height: SLIDE_H, flexShrink: 0 }}>
          <RecreatedSlide21 />
        </div>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>Slide 21 — AI Pioneers (Recreated) &nbsp;|&nbsp; 1280 × 720</div>
      </div>

      {/* Original scanned slide, preserved for reference */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative", width: SLIDE_W, height: SLIDE_H, flexShrink: 0 }}>
          <Image
            src="/images/ai-pioneers-scale.png"
            alt="Original scanned Slide 21 — We are pioneers in the field of applying AI, Gen AI and Agentic at business scale"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>Slide 21 — AI Pioneers (Original) &nbsp;|&nbsp; 1280 × 720</div>
      </div>
    </div>
  );
}
