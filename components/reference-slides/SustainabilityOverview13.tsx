"use client";

const SLIDE_W = 1280;
const SLIDE_H = 720;

const TEAL = "#4a7a5a";

const CARDS = [
  {
    title: "Protect & grow value",
    body: (
      <>
        We bring strong <strong>experience in protecting the business</strong>, and in{" "}
        <strong>translating sustainability into value creation</strong>, with a global thought leadership platform and
        deep ecosystem partnerships
      </>
    ),
    icon: (
      <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
        <path d="M26 6 C26 6 8 14 8 28 C8 40 17 47 26 50 C35 47 44 40 44 28 C44 14 26 6 26 6Z" stroke={TEAL} strokeWidth={2} fill="none" />
        <path d="M18 26 L24 32 L34 20" stroke={TEAL} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Deep expertise",
    body: (
      <>
        We have decades of <strong>sector and sustainability</strong> expertise across all regions and tailor our
        approach to each client situation to &ldquo;make it real&rdquo; for them
      </>
    ),
    icon: (
      <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
        <circle cx={26} cy={20} r={12} stroke={TEAL} strokeWidth={2} fill="none" />
        <path d="M16 38 C16 30 36 30 36 38" stroke={TEAL} strokeWidth={2} strokeLinecap="round" fill="none" />
        <path d="M24 20 L22 14 M28 20 L30 14 M26 20 L26 12" stroke={TEAL} strokeWidth={1.5} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Sector-shaping",
    body: (
      <>
        We support <strong>leading NGOs, coalitions and business forums</strong> at the leading edge of
        sustainability, building insights that help our commercial clients identify new opportunities and accelerate
        progress
      </>
    ),
    icon: (
      <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
        <rect x={10} y={24} width={20} height={20} stroke={TEAL} strokeWidth={2} fill="none" />
        <path d="M28 24 L28 10 L44 10 L44 40 L28 40" stroke={TEAL} strokeWidth={2} fill="none" />
        <line x1={32} y1={16} x2={40} y2={16} stroke={TEAL} strokeWidth={1.5} />
        <line x1={32} y1={22} x2={40} y2={22} stroke={TEAL} strokeWidth={1.5} />
        <line x1={32} y1={28} x2={40} y2={28} stroke={TEAL} strokeWidth={1.5} />
      </svg>
    ),
  },
  {
    title: "Global Team",
    body: (
      <>
        Our partnership model ensures that we <strong>come together in a collaborative way</strong> across regions
        and sectors to bring the right expertise to every client at the right time
      </>
    ),
    icon: (
      <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
        <circle cx={26} cy={26} r={18} stroke={TEAL} strokeWidth={2} fill="none" />
        <ellipse cx={26} cy={26} rx={8} ry={18} stroke={TEAL} strokeWidth={1.5} fill="none" />
        <line x1={8} y1={26} x2={44} y2={26} stroke={TEAL} strokeWidth={1.5} />
        <line x1={12} y1={16} x2={40} y2={16} stroke={TEAL} strokeWidth={1} />
        <line x1={12} y1={36} x2={40} y2={36} stroke={TEAL} strokeWidth={1} />
      </svg>
    ),
  },
  {
    title: "AI Expertise",
    body: (
      <>
        We are at <strong>the forefront of the AI development</strong> and are defining the next wave of innovation
        in Sustainability and are already deploying it with clients
      </>
    ),
    icon: (
      <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
        <circle cx={26} cy={22} r={14} stroke={TEAL} strokeWidth={2} fill="none" />
        <circle cx={26} cy={22} r={5} stroke={TEAL} strokeWidth={1.5} fill="none" />
        <path d="M20 30 Q18 38 14 44" stroke={TEAL} strokeWidth={1.5} strokeLinecap="round" fill="none" />
        <path d="M32 30 Q34 38 38 44" stroke={TEAL} strokeWidth={1.5} strokeLinecap="round" fill="none" />
        <line x1={26} y1={8} x2={26} y2={4} stroke={TEAL} strokeWidth={1.5} strokeLinecap="round" />
        <line x1={36} y1={13} x2={39} y2={10} stroke={TEAL} strokeWidth={1.5} strokeLinecap="round" />
        <line x1={16} y1={13} x2={13} y2={10} stroke={TEAL} strokeWidth={1.5} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Sustainability in our own business",
    body: (
      <>
        We practice what we preach and <strong>deploy Sustainability within our own business operations</strong>{" "}
        (Award-winning offset strategy, first to get VCMI claim approved, certified 100% carbon neutral)
      </>
    ),
    icon: (
      <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
        <circle cx={26} cy={24} r={14} stroke={TEAL} strokeWidth={2} fill="none" />
        <path d="M22 20 C22 16 30 16 30 22 C30 26 26 28 26 32" stroke={TEAL} strokeWidth={1.5} strokeLinecap="round" fill="none" />
        <path d="M20 10 C20 10 16 6 26 6 C36 6 32 10 32 10" stroke={TEAL} strokeWidth={1.5} strokeLinecap="round" fill="none" />
        <circle cx={26} cy={34} r={1.5} fill={TEAL} />
        <line x1={26} y1={38} x2={26} y2={46} stroke={TEAL} strokeWidth={1.5} strokeLinecap="round" />
        <line x1={20} y1={44} x2={32} y2={44} stroke={TEAL} strokeWidth={1.5} strokeLinecap="round" />
      </svg>
    ),
  },
];

export function RecreatedSlide13() {
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
      {/* ── Background photo (aerial wind farm / cliffs) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, #2a4a3a 0%, #3a6a4a 20%, #4a8058 30%, #608a60 40%, #7aaa70 50%, #90b878 60%, #a8c880 70%, #b8d090 80%, #c8d8a0 90%, #d0d8a8 100%)",
        }}
      />
      {/* Photo effect overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 30% 60%, rgba(255,255,255,0.1) 0%, transparent 60%)",
        }}
      />

      {/* ── White right panel ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 1020,
          height: SLIDE_H,
          background: "#fff",
        }}
      />

      {/* ── Title in the white panel ── */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 260,
          right: 36,
          fontSize: 26,
          fontWeight: 400,
          color: TEAL,
          lineHeight: 1.25,
        }}
      >
        We bring a differentiated offering to our clients
      </div>

      {/* ── Thin rule ── */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 260,
          right: 36,
          height: 1,
          background: "#ddd",
        }}
      />

      {/* ── 3×2 card grid ── */}
      {CARDS.map((card, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const cardW = 320;
        const cardH = 270;
        const startX = 260;
        const startY = 100;
        const gapX = 8;
        const gapY = 6;

        return (
          <div
            key={card.title}
            style={{
              position: "absolute",
              left: startX + col * (cardW + gapX),
              top: startY + row * (cardH + gapY),
              width: cardW,
              height: cardH,
              padding: "14px 18px",
              borderRight: col < 2 ? "1px solid #e8e8e8" : "none",
              borderBottom: row < 1 ? "1px solid #e8e8e8" : "none",
              boxSizing: "border-box",
              background: "#fff",
            }}
          >
            {/* Icon */}
            <div style={{ marginBottom: 10 }}>{card.icon}</div>
            {/* Title */}
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#111",
                marginBottom: 8,
                lineHeight: 1.25,
              }}
            >
              {card.title}
            </div>
            {/* Body */}
            <div style={{ fontSize: 11.5, color: "#333", lineHeight: 1.45 }}>{card.body}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function SustainabilityOverview13() {

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
                                <RecreatedSlide13 />
      </div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>
        Slide 13 — Differentiated Offering (6 Capability Icons) &nbsp;|&nbsp; 1280 × 720
      </div>
    </div>
  );
}
