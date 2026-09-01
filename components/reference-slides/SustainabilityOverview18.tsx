"use client";
const SLIDE_W = 1280;
const SLIDE_H = 720;
const RED = "#CC0000";

const LEFT_CASES = [
  {
    title: "Sustainability Strategy",
    city: "Zurich",
    body: "Refreshed the sustainability strategy for a global industrial leader, benchmarking against peers and defining future-ready differentiation across climate strategy, AI-enabled sustainability, and sustainable services.",
    photo: "#7a8870",
  },
  {
    title: "Sustainable Business Models",
    city: "Chicago",
    body: "Defined the biofuels growth strategy for a leading ag cooperative, sizing multi-billion-dollar opportunities and shaping a scalable model to enable low-carbon feedstock supply.",
    photo: "#5a6878",
  },
  {
    title: "Circular Full Potential Transformation",
    city: "Zurich",
    body: "Supported Auto Supplier Co in transforming fragmented circular initiatives into a scalable, value-driven roadmap through a detailed assessment, opportunity prioritization, and pilot design",
    photo: "#8a7060",
  },
  {
    title: "Circular Value Creation",
    city: "Madrid",
    body: "Supported Recycling Co in increasing packaging waste collection through AI-driven analytics, marketing optimization, and fraud detection models to boost recycling, improve infrastructure planning, and optimize marketing spend",
    photo: "#c04020",
  },
];

const RIGHT_CASES = [
  {
    title: "Sustainability Value Creation Plan",
    city: "Denver",
    body: "Supported Investment Co embed sustainability in real estate investment lifecycle by defining asset-level plans, delivering higher property values, lower insurance for high-risk assets, lower energy use, and higher rents",
    photo: "#3a5040",
  },
  {
    title: "Sustainability Commercial Excellence",
    city: "Chicago",
    body: "Supported Chemicals Co drive commercial excellence by launching sustainable-offer sales plays, embedding in growth goals, kickstarting projects, and training plans.",
    photo: "#485860",
  },
  {
    title: "Climate Asset Resilience",
    city: "Milan",
    body: "Supported Energy Co to develop an Integrated Planning model and embed Climate Asset Resilience toolkit into it to tackle aging assets and climate risks",
    photo: "#704030",
  },
  {
    title: "Social Equity",
    city: "Milan",
    body: "Supported design and facilitation of webinar series to strengthen inclusion and cross-culture collaboration. Provided practical playbook & tools to navigate challenges",
    photo: "#607878",
  },
];

function CaseRow({ title, city, body, photo }: { title: string; city: string; body: string; photo: string }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 138, height: 88, background: photo, flexShrink: 0, borderRadius: 2 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: RED, marginBottom: 1 }}>{title}</div>
        <div style={{ fontSize: 12, fontStyle: "italic", fontWeight: 400, color: "#111", marginBottom: 3 }}>{city}</div>
        <div style={{ fontSize: 11, color: "#222", lineHeight: 1.38 }}>{body}</div>
      </div>
    </div>
  );
}

export function RecreatedSlide18() {
  return (
    <div style={{ width: SLIDE_W, height: SLIDE_H, background: "#fff", position: "relative", fontFamily: "Arial, sans-serif", overflow: "hidden" }}>
      {/* Title */}
      <div style={{ position: "absolute", top: 18, left: 36, right: 36, fontSize: 26, fontWeight: 400, color: "#111" }}>
        Some examples of our positive impact…
      </div>
      <div style={{ position: "absolute", top: 60, left: 36, right: 36, height: 1.5, background: "#e0e0e0" }} />

      {/* Two columns */}
      <div style={{ position: "absolute", top: 76, left: 36, width: 600, bottom: 20 }}>
        {LEFT_CASES.map((c) => <CaseRow key={c.title} {...c} />)}
      </div>

      {/* Divider */}
      <div style={{ position: "absolute", top: 76, left: 644, width: 1, bottom: 20, background: "#e0e0e0" }} />
      <div style={{ position: "absolute", top: 76, left: 656, right: 28, bottom: 20 }}>
        {RIGHT_CASES.map((c) => <CaseRow key={c.title} {...c} />)}
      </div>
    </div>
  );
}

export default function SustainabilityOverview18() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: 24, background: "#1a1a1a", minHeight: "100vh" }}>
            <div style={{ position: "relative", width: SLIDE_W, height: SLIDE_H, flexShrink: 0 }}>
                                <RecreatedSlide18 />
      </div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>Slide 18 — Positive Impact Examples &nbsp;|&nbsp; 1280 × 720</div>
    </div>
  );
}
