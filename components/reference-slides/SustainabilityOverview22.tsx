"use client";
import Image from "next/image";
const SLIDE_W = 1280;
const SLIDE_H = 720;
const RED = "#CC0000";

const COLS = [
  {
    logo: "IDC",
    logoColor: "#0067b1",
    quote: 'Bain is best at consulting in action, when launching something or creating something from nothing. […] I would use them for stuff that has the potential to be game changing.',
    boldWords: ["consulting in", "action", "game", "changing"],
    tag: "IDC CLIENT\nTESTIMONIAL",
    tagBg: "#a0001a",
  },
  {
    logo: "ALM\nIntelligence",
    logoColor: "#333",
    quote: "Bain brings digital transformation down to the business level, and when Bain leaves, the client is left with a fully functional, stood up digital process they can run themselves.",
    boldWords: ["business level", "a fully", "functional,", "stood up", "digital process"],
    tag: "ALM\nASSESSMENT",
    tagBg: "#555",
  },
  {
    logo: "HFS\nhorizons",
    logoColor: "#e06020",
    isCircle: true,
    quote: "About 85% repeat clients. Clients consistently praise Bain for helping them drive a transformation agenda across business and technology.",
    boldWords: ["About 85%", "repeat clients."],
    tag: "HFS\nHORIZONS\nAUTOMATION\nREPORT",
    tagBg: "#a0001a",
  },
  {
    logo: "FORRESTER®",
    logoColor: "#006633",
    quote: "Organizations that seek a partner that can articulate board-level strategy, translate that into a multidimensional target picture, and oversee the execution of that roadmap […] are well suited to work with Bain",
    boldWords: ["articulate", "board-level", "strategy", "multidimensional", "target picture,", "execution of that", "roadmap"],
    tag: "FORRESTER\nDIGITAL\nTRANSFORM.\nASSESSMENT",
    tagBg: "#a0001a",
  },
  {
    logo: "IDC",
    logoColor: "#0067b1",
    quote: "Bain is a good choice for organizations looking for a tier 1 strategy and experience consultancy combining deep industry, consumer, and client knowledge with a strong pragmatic focus",
    boldWords: ["strong", "pragmatic focus"],
    tag: "IDC\nEXPERIENCE\nDESIGN\nASSESSMENT",
    tagBg: "#555",
  },
  {
    logo: "FORRESTER®",
    logoColor: "#006633",
    quote: "Clients that seek holistic innovation advisory, anchored in a C-suite-mandated innovation strategy, are well placed to work with Bain",
    boldWords: ["holistic", "innovation", "advisory"],
    tag: "FORRESTER\nINNOVATION\nREPORT",
    tagBg: "#a0001a",
  },
];

function renderQuote(text: string, boldWords: string[]) {
  // Simple: bold by wrapping matching words in <strong>
  const parts = text.split(/(\s+)/);
  return (
    <span>
      {text.split(" ").map((word, i) => {
        const clean = word.replace(/[.,]/g, "");
        const isBold = boldWords.some((bw) => text.includes(bw) && bw.includes(clean) && clean.length > 2);
        return <span key={i}>{isBold ? <strong>{word}</strong> : word}{" "}</span>;
      })}
    </span>
  );
}

export function RecreatedSlide22() {
  const COL_W = (SLIDE_W - 72) / 6;
  return (
    <div style={{ width: SLIDE_W, height: SLIDE_H, background: "#f8f8f8", position: "relative", fontFamily: "Arial, sans-serif", overflow: "hidden" }}>
      {/* Title */}
      <div style={{ position: "absolute", top: 16, left: 36, right: 36, fontSize: 22, fontWeight: 400, color: "#111", lineHeight: 1.35 }}>
        Bain has received recognition for its digital, innovation &amp; automation consulting services from top analysts&apos; firms
      </div>
      <div style={{ position: "absolute", top: 96, left: 36, right: 36, height: 1, background: "#ddd" }} />

      {/* 6 columns */}
      <div style={{ position: "absolute", top: 104, left: 36, right: 36, bottom: 20, display: "flex", gap: 0 }}>
        {COLS.map((col, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 8px", borderRight: i < 5 ? "1px solid #ccc" : "none" }}>
            {/* Logo */}
            <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "flex-start", marginBottom: 8 }}>
              {col.isCircle ? (
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#e06020", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1 }}>HFS</span>
                  <span style={{ fontSize: 9, color: "#fff", fontStyle: "italic" }}>horizons</span>
                </div>
              ) : (
                <div style={{ fontSize: col.logo.includes("\n") ? 11 : 18, fontWeight: 700, color: col.logoColor, whiteSpace: "pre-line", lineHeight: 1.2 }}>{col.logo}</div>
              )}
            </div>

            {/* Quote */}
            <div style={{ flex: 1, fontSize: 11.5, color: "#222", lineHeight: 1.45, marginBottom: 10 }}>
              {renderQuote(col.quote, col.boldWords)}
            </div>

            {/* Tag */}
            <div style={{ background: col.tagBg, padding: "8px 6px", textAlign: "center" }}>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: "#fff", letterSpacing: 0.8, whiteSpace: "pre-line", lineHeight: 1.5 }}>{col.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SustainabilityOverview22() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40, padding: 24, background: "#1a1a1a", minHeight: "100vh" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative", width: SLIDE_W, height: SLIDE_H, flexShrink: 0 }}>
          <RecreatedSlide22 />
        </div>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>Slide 22 — Analyst Recognition (Recreated) &nbsp;|&nbsp; 1280 × 720</div>
      </div>

      {/* Original scanned slide, preserved for reference */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative", width: SLIDE_W, height: SLIDE_H, flexShrink: 0 }}>
          <Image
            src="/images/analyst-recognition.png"
            alt="Original scanned Slide 22 — Analyst Recognition"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>Slide 22 — Analyst Recognition (Original) &nbsp;|&nbsp; 1280 × 720</div>
      </div>
    </div>
  );
}
