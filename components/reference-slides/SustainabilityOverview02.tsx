"use client";

const BAIN_RED = "#CC0000";
const SLIDE_W = 1280;
const SLIDE_H = 720;

// ── Circular avatar placeholder ────────────────────────────────────────────────
function Avatar({ initials, size = 82 }: { initials: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg,#c8c4be 0%,#a8a4a0 100%)",
        border: "1.5px solid #d0ccc8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.26,
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
        fontFamily: "Arial, sans-serif",
        letterSpacing: "0.02em",
      }}
    >
      {initials}
    </div>
  );
}

// ── Person block: avatar centred + name + role ──────────────────────────────────
function Person({
  initials,
  name,
  role,
  roleRed = false,
  size = 82,
  maxW,
}: {
  initials: string;
  name: string;
  role: string;
  roleRed?: boolean;
  size?: number;
  maxW?: number;
}) {
  const w = maxW ?? size + 14;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        width: w,
        flexShrink: 0,
      }}
    >
      <Avatar initials={initials} size={size} />
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: 10.5,
          fontWeight: 700,
          color: "#111",
          textAlign: "center",
          lineHeight: 1.25,
          width: "100%",
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: 10,
          fontWeight: roleRed ? 700 : 400,
          color: roleRed ? BAIN_RED : "#444",
          textAlign: "center",
          lineHeight: 1.25,
          width: "100%",
        }}
      >
        {role}
      </div>
    </div>
  );
}

// ── Labeled section box ─────────────────────────────────────────────────────────
function SectionBox({
  label,
  top,
  height,
  children,
}: {
  label: string;
  top: number;
  height: number;
  children: React.ReactNode;
}) {
  const LEFT = 28;
  const RIGHT = 28;
  return (
    <>
      {/* Thin border rectangle */}
      <div
        style={{
          position: "absolute",
          top,
          left: LEFT,
          right: RIGHT,
          height,
          border: "1px solid #b0aca8",
          borderRadius: 4,
          boxSizing: "border-box",
        }}
      />
      {/* Section label tab — sits on the top border */}
      <div
        style={{
          position: "absolute",
          top: top - 10,
          left: LEFT + 16,
          background: "#f0efed",
          paddingLeft: 6,
          paddingRight: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 0,
        }}
      >
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 12,
            fontWeight: 700,
            color: BAIN_RED,
            textDecoration: "underline",
            textUnderlineOffset: 3,
            lineHeight: 1.3,
          }}
        >
          {label}
        </div>
      </div>
      {/* Content */}
      <div
        style={{
          position: "absolute",
          top: top + 16,
          left: LEFT + 12,
          right: RIGHT + 12,
          height: height - 24,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-around",
        }}
      >
        {children}
      </div>
    </>
  );
}

// ── Recreated slide ─────────────────────────────────────────────────────────────
export function RecreatedSlide02() {
  // Layout constants from reference image:
  // Top margin: 24px
  // Title: y=24, fontSize 27px
  // Red rule: y=66, height 1px
  // Section "Overall": y=84, h=186
  // Section "Solution Leaders": y=290, h=175
  // Section "Industry Leaders": y=484, h=190
  // Footer: y=692, h=28

  return (
    <div
      style={{
        position: "relative",
        width: SLIDE_W,
        height: SLIDE_H,
        background: "#f0efed",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
        colorScheme: "light",
      }}
    >
      {/* ── Title ── */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 36,
          right: 200,
          fontFamily: "Arial, sans-serif",
          fontSize: 25,
          fontWeight: 400,
          color: "#111",
          lineHeight: 1.2,
        }}
      >
        Introducing our Sustainability leadership team
      </div>

      {/* ── Red rule ── */}
      <div
        style={{
          position: "absolute",
          top: 58,
          left: 36,
          right: 36,
          height: 1.5,
          background: BAIN_RED,
        }}
      />

      {/* ── SECTION 1: Overall ── */}
      <SectionBox label="Overall" top={74} height={194}>
        <Person
          initials="JC"
          name="Jean-Charles van den Branden"
          role="Global Practice Leader"
          size={82}
          maxW={118}
        />
        <Person
          initials="JB"
          name="John Blasberg"
          role="Regional Practice Leader, Americas"
          roleRed
          size={82}
          maxW={112}
        />
        <Person
          initials="HM"
          name="Harry Morrison"
          role="Regional Practice Leader, EMEA"
          roleRed
          size={82}
          maxW={112}
        />
        <Person
          initials="DU"
          name="Dominik Utama"
          role="Regional Practice Leader, APAC"
          roleRed
          size={82}
          maxW={112}
        />
        <Person
          initials="SM"
          name="Sinead Mullen"
          role="Global Practice Leader, Social Impact"
          roleRed
          size={82}
          maxW={118}
        />
        <Person
          initials="MM"
          name="Martha Moreau"
          role="Executive Vice President"
          roleRed
          size={82}
          maxW={112}
        />
      </SectionBox>

      {/* ── SECTION 2: Solution Leaders ── */}
      <SectionBox label="Solution Leaders" top={282} height={174}>
        <Person initials="JB" name="John Blasberg" role="Transition Strategy" size={80} maxW={130} />
        <Person
          initials="MC"
          name="Matteo Capellini"
          role="Sustainability Value Creation"
          size={80}
          maxW={130}
        />
        <Person
          initials="XH"
          name="Xavier Houot"
          role="Circular Value Creation"
          size={80}
          maxW={130}
        />
        <Person
          initials="HM"
          name="Harry Morrison"
          role="Resilience &amp; Adaptation"
          size={80}
          maxW={130}
        />
        <Person initials="AD" name="Andrea D'Arcy" role="Social Equity" size={80} maxW={130} />
      </SectionBox>

      {/* ── SECTION 3: Industry Leaders ── */}
      <SectionBox label="Industry Leaders" top={468} height={198}>
        <Person
          initials="GD"
          name="Grant Dougans"
          role="Energy &amp; Natural Resources"
          size={76}
          maxW={124}
        />
        <Person initials="ML" name="Marc Lino" role="Private Equity" size={76} maxW={124} />
        <Person
          initials="CG"
          name="Christian Graf"
          role="Financial Services"
          size={76}
          maxW={124}
        />
        <Person
          initials="HM"
          name="Harry Morrison"
          role="Consumer Products"
          size={76}
          maxW={124}
        />
        <Person initials="MC" name="Matteo Capellini" role="Retail" size={76} maxW={124} />
      </SectionBox>

      {/* ── Footer ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 28,
          background: "#e8e6e2",
          borderTop: "1px solid #ccc",
          display: "flex",
          alignItems: "center",
          paddingLeft: 36,
          paddingRight: 36,
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 6.5,
            color: "#555",
            lineHeight: 1.3,
            maxWidth: 820,
          }}
        >
          This information is confidential and was prepared by Bain &amp; Company solely for the use
          of our client; it is not to be relied on by any 3rd party without Bain&apos;s prior
          written consent
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              color: "#111",
              letterSpacing: "0.08em",
            }}
          >
            BAIN &amp; COMPANY
          </div>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              border: "1.5px solid " + BAIN_RED,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 8,
              fontWeight: 700,
              color: BAIN_RED,
              fontFamily: "Arial, sans-serif",
            }}
          >
            ®
          </div>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 12,
              color: "#555",
              marginLeft: 4,
            }}
          >
            2
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Comparison shell ────────────────────────────────────────────────────────────
export default function SustainabilityOverview02() {

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

      {/* Canvas */}
      <div style={{ position: "relative", width: SLIDE_W, height: SLIDE_H, flexShrink: 0 }}>
        <RecreatedSlide02 />
      </div>
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: 11,
          color: "#666",
          marginTop: 4,
        }}
      >
        Slide 2 — Sustainability Leadership Team &nbsp;|&nbsp; 1280 × 720
      </div>
    </div>
  );
}
