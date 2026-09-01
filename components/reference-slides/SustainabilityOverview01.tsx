"use client";

const BAIN_RED = "#CC0000";
const SLIDE_W = 1280;
const SLIDE_H = 720;

// ── Avatar (circular headshot placeholder) ─────────────────────────────────────
function Avatar({
  initials,
  size = 68,
}: {
  initials: string;
  size?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#c8c4be",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.28,
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {initials}
    </div>
  );
}

// ── Person block — avatar + name + title ───────────────────────────────────────
function Person({
  initials,
  name,
  title,
  size = 68,
  align = "center",
}: {
  initials: string;
  name: string;
  title: string;
  size?: number;
  align?: "center" | "left";
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: 3,
        flexShrink: 0,
      }}
    >
      <Avatar initials={initials} size={size} />
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: 9,
          fontWeight: 700,
          color: "#111",
          textAlign: align,
          lineHeight: 1.2,
          maxWidth: size + 10,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: 8.5,
          color: "#444",
          textAlign: align,
          lineHeight: 1.2,
          maxWidth: size + 10,
        }}
      >
        {title}
      </div>
    </div>
  );
}

// ── Logo image pill — renders actual partner firm logo images ──────────────────
const LOGO_SRCS: Record<string, string> = {
  // We use a fallback text badge since actual logos aren't available; styled to match
  Persefoni: "",
  TerralytiQ: "",
  ARC: "",
  "Schneider Electric": "",
  Proxima: "",
  ArcBlue: "",
  "Copenhagen Economics": "",
  Intersect: "",
  Sylvera: "",
};

function LogoBadge({ label }: { label: string }) {
  // Render styled text badges that approximate the logo look
  const isShort = label.length <= 8;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 22,
        padding: isShort ? "0 8px" : "0 6px",
        border: "1px solid #bbb",
        borderRadius: 2,
        fontSize: 8,
        fontWeight: 600,
        color: "#222",
        background: "#fff",
        fontFamily: "Arial, sans-serif",
        whiteSpace: "nowrap",
        letterSpacing: "0.01em",
      }}
    >
      {label}
    </div>
  );
}

// ── Standard CoE card — text LEFT, avatar(s) RIGHT ────────────────────────────
interface CoECardProps {
  name: string;
  questions: string[];
  persons: { initials: string; name: string; title: string }[];
  logos?: string[];
  style?: React.CSSProperties;
  avatarSize?: number;
}

function CoECard({
  name,
  questions,
  persons,
  logos,
  style,
  avatarSize = 68,
}: CoECardProps) {
  return (
    <div
      style={{
        background: "#fff",
        boxSizing: "border-box",
        padding: "8px 8px 8px 10px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Upper area: text left, avatar(s) right */}
      <div style={{ display: "flex", gap: 8, flex: 1, alignItems: "flex-start" }}>
        {/* Text column */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
          {/* CoE name */}
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 11.5,
              fontWeight: 700,
              color: BAIN_RED,
              marginBottom: 6,
              lineHeight: 1.2,
            }}
          >
            {name}
          </div>
          {/* Questions */}
          {questions.map((q, i) => (
            <div
              key={i}
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: 9.5,
                color: "#1a1a1a",
                lineHeight: 1.38,
                marginBottom: i < questions.length - 1 ? 5 : 0,
              }}
            >
              {q}
            </div>
          ))}
          {/* Logos */}
          {logos && logos.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
                marginTop: "auto",
                paddingTop: 8,
              }}
            >
              {logos.map((l) => (
                <LogoBadge key={l} label={l} />
              ))}
            </div>
          )}
        </div>
        {/* Avatar(s) column */}
        <div
          style={{
            display: "flex",
            gap: 6,
            alignItems: "flex-start",
            paddingTop: 2,
          }}
        >
          {persons.map((p) => (
            <Person key={p.name} {...p} size={avatarSize} align="center" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main slide export ──────────────────────────────────────────────────────────
export default function SustainabilityOverview01() {

  return (
    <div
      style={{
        colorScheme: "light",
        fontFamily: "Arial, sans-serif",
        background: "#e8e8e8",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 24px",
        gap: 14,
      }}
    >

      {/* Canvas */}
      <div
        style={{
          width: SLIDE_W,
          height: SLIDE_H,
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
          boxShadow: "0 4px 20px rgba(0,0,0,0.22)",
        }}
      >
        <RecreatedSlide01 />
      </div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 12, color: "#666" }}>
        Slide 01 — 9 Centers of Excellence &nbsp;|&nbsp; 1280 × 720
      </div>
    </div>
  );
}

// ── RecreatedSlide01 ─────────────────────────────────────────────────────────────
export function RecreatedSlide01() {
  // Reference measurements (1280×720 original):
  // Photo header: top=0, height=228px (aerial forest/river, title at y≈42)
  // Grid area: top=228, height=492px
  // Outer grid padding: 10px all sides
  // Gap between card rows: 2px
  // Usable height: 492-20-4=468px
  //   R1=140px, R2=148px, R3=180px (sum=468)

  const HEADER_H = 228;
  const OUTER_PAD = 10;
  const GAP = 2;

  const GRID_H = SLIDE_H - HEADER_H; // 492
  const USABLE_H = GRID_H - OUTER_PAD * 2 - GAP * 2; // 468
  const R1_H = 140;
  const R2_H = 148;
  const R3_H = USABLE_H - R1_H - R2_H; // 180

  // Row 1 — 4 equal columns
  const USABLE_W = SLIDE_W - OUTER_PAD * 2 - GAP * 3;
  const COL4 = Math.floor(USABLE_W / 4);
  const COL4_LAST = USABLE_W - COL4 * 3; // absorb rounding

  // Row 2 — 3 equal columns
  const COL3 = Math.floor((SLIDE_W - OUTER_PAD * 2 - GAP * 2) / 3);
  const COL3_LAST = (SLIDE_W - OUTER_PAD * 2 - GAP * 2) - COL3 * 2;

  // Row 3 — GE (~53%) + Water (~23.5%) + Bio (~23.5%)
  const R3_TOTAL_W = SLIDE_W - OUTER_PAD * 2 - GAP * 2;
  const GE_W = Math.round(R3_TOTAL_W * 0.531);
  const WB_W = Math.floor((R3_TOTAL_W - GE_W) / 2);
  const BIO_W = R3_TOTAL_W - GE_W - WB_W;

  // Top offsets for each row
  const R1_TOP = HEADER_H + OUTER_PAD;
  const R2_TOP = R1_TOP + R1_H + GAP;
  const R3_TOP = R2_TOP + R2_H + GAP;

  // Column left offsets — row 1
  const c4 = (i: number) => OUTER_PAD + i * (COL4 + GAP);
  // Column left offsets — row 2
  const c3 = (i: number) => OUTER_PAD + i * (COL3 + GAP);

  const AVATAR_SIZE_R1 = 62;
  const AVATAR_SIZE_R2 = 60;

  return (
    <div
      style={{
        width: SLIDE_W,
        height: SLIDE_H,
        position: "relative",
        background: "#f0ede8",
        colorScheme: "light",
        overflow: "hidden",
      }}
    >
      {/* ── Photo header — aerial forest/river aerial view ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: SLIDE_W,
          height: HEADER_H,
          overflow: "hidden",
          // Aerial forest: deep greens, teal river, dark canopy
          background:
            "linear-gradient(175deg, #1a2e1a 0%, #2a4a25 18%, #3a6030 35%, #4a7a3a 48%, #2a5020 60%, #1e3a18 75%, #172e15 100%)",
        }}
      >
        {/* River/water element suggestion */}
        <div
          style={{
            position: "absolute",
            top: "28%",
            left: "15%",
            width: "45%",
            height: "30%",
            background:
              "linear-gradient(135deg, rgba(60,100,120,0.55) 0%, rgba(40,80,100,0.45) 40%, rgba(50,90,110,0.35) 100%)",
            borderRadius: "40% 60% 50% 70% / 30% 40% 60% 70%",
            transform: "rotate(-8deg)",
          }}
        />
        {/* Lighter canopy patches */}
        <div
          style={{
            position: "absolute",
            top: "0%",
            right: "0%",
            width: "50%",
            height: "60%",
            background:
              "radial-gradient(ellipse at 70% 30%, rgba(80,130,60,0.4) 0%, transparent 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "5%",
            width: "40%",
            height: "50%",
            background:
              "radial-gradient(ellipse at 40% 60%, rgba(60,110,45,0.35) 0%, transparent 60%)",
          }}
        />
        {/* Title — reference: single line ~29px, top≈55, weight 400 */}
        <div
          style={{
            position: "absolute",
            top: 52,
            left: 36,
            right: 36,
            fontFamily: "Arial, sans-serif",
            fontSize: 29,
            fontWeight: 400,
            color: "#ffffff",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}
        >
          Over time we have built and formalized 9 Centers of Excellence
        </div>
      </div>

      {/* ── Outer grid border ── */}
      <div
        style={{
          position: "absolute",
          top: HEADER_H,
          left: 0,
          width: SLIDE_W,
          height: GRID_H,
          background: "#e8e4de",
          boxSizing: "border-box",
        }}
      />

      {/* Inner white border around all cards */}
      <div
        style={{
          position: "absolute",
          top: HEADER_H + OUTER_PAD - 1,
          left: OUTER_PAD - 1,
          width: SLIDE_W - OUTER_PAD * 2 + 2,
          height: GRID_H - OUTER_PAD * 2 + 2,
          border: "1px solid #c0bbb5",
          boxSizing: "border-box",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* ══ ROW 1 — 4 columns ══════════════════════════════════════════════════ */}

      {/* 1. Measurement and Data */}
      <CoECard
        name="Measurement and Data"
        questions={[
          "How to measure and manage product level environmental footprint?",
          "How to manage carbon as you manage cost?",
        ]}
        persons={[{ initials: "EM", name: "Euan Murray", title: "Expert Partner" }]}
        logos={["PERSEFONI", "TERRALYTIQ", "ARC"]}
        avatarSize={AVATAR_SIZE_R1}
        style={{
          position: "absolute",
          left: c4(0),
          top: R1_TOP,
          width: COL4,
          height: R1_H,
          borderRight: "1px solid #ddd",
        }}
      />

      {/* 2. Sustainable operations */}
      <CoECard
        name="Sustainable operations"
        questions={["How to reduce cost and carbon in tandem in operations?"]}
        persons={[{ initials: "MB", name: "Mattia Bernardi", title: "Partner" }]}
        logos={["Schneider Electric"]}
        avatarSize={AVATAR_SIZE_R1}
        style={{
          position: "absolute",
          left: c4(1),
          top: R1_TOP,
          width: COL4,
          height: R1_H,
          borderRight: "1px solid #ddd",
        }}
      />

      {/* 3. Sustainable procurement */}
      <CoECard
        name="Sustainable procurement"
        questions={["How to decarbonise supply chain in a value optimising way?"]}
        persons={[{ initials: "AM", name: "Anna Mansson", title: "Partner" }]}
        logos={["Proxima", "ArcBlue"]}
        avatarSize={AVATAR_SIZE_R1}
        style={{
          position: "absolute",
          left: c4(2),
          top: R1_TOP,
          width: COL4,
          height: R1_H,
          borderRight: "1px solid #ddd",
        }}
      />

      {/* 4. Climate policy */}
      <CoECard
        name="Climate policy"
        questions={[
          "How to leverage climate policy within strategy and productively engage policy makers?",
        ]}
        persons={[{ initials: "CH", name: "Cate Hight", title: "Expert Partner" }]}
        avatarSize={AVATAR_SIZE_R1}
        style={{
          position: "absolute",
          left: c4(3),
          top: R1_TOP,
          width: COL4_LAST,
          height: R1_H,
        }}
      />

      {/* Row 1 bottom border */}
      <div
        style={{
          position: "absolute",
          left: OUTER_PAD,
          top: R1_TOP + R1_H,
          width: SLIDE_W - OUTER_PAD * 2,
          height: GAP,
          background: "#e8e4de",
        }}
      />

      {/* ══ ROW 2 — 3 columns ══════════════════════════════════════════════════ */}

      {/* 5. Climate Transition */}
      <CoECard
        name="Climate Transition"
        questions={[
          "How to assess impact of climate scenarios on end market demand, decarbonisation cost and assets?",
        ]}
        persons={[
          { initials: "AR", name: "Alasdair Robbie", title: "Partner" },
          { initials: "JN", name: "James Nixon", title: "Expert Partner" },
        ]}
        logos={["CE", "Intersect"]}
        avatarSize={AVATAR_SIZE_R2}
        style={{
          position: "absolute",
          left: c3(0),
          top: R2_TOP,
          width: COL3,
          height: R2_H,
          borderRight: "1px solid #ddd",
        }}
      />

      {/* 6. Voluntary carbon markets */}
      <CoECard
        name="Voluntary carbon markets"
        questions={[
          "How to embed offsetting into decarbonisation strategy and build a carbon credits business?",
        ]}
        persons={[
          { initials: "DH", name: "Dale Hardcastle", title: "Expert Partner" },
          { initials: "HH", name: "Henning Huenteler", title: "Expert Partner" },
        ]}
        logos={["Sylvera"]}
        avatarSize={AVATAR_SIZE_R2}
        style={{
          position: "absolute",
          left: c3(1),
          top: R2_TOP,
          width: COL3,
          height: R2_H,
          borderRight: "1px solid #ddd",
        }}
      />

      {/* 7. APAC Sustainability Innovation CoE */}
      <CoECard
        name="APAC Sustainability Innovation CoE"
        questions={[
          "How to develop understanding on APAC trends in sustainability-linked disruptive techs, and develop PoVs, IPs, and products to support GTM campaigns?",
        ]}
        persons={[
          { initials: "YL", name: "Yang Liu", title: "Expert Partner" },
          { initials: "TS", name: "Tiiram Sunderland", title: "Practice Senior Manager" },
        ]}
        avatarSize={AVATAR_SIZE_R2}
        style={{
          position: "absolute",
          left: c3(2),
          top: R2_TOP,
          width: COL3_LAST,
          height: R2_H,
        }}
      />

      {/* Row 2 bottom border */}
      <div
        style={{
          position: "absolute",
          left: OUTER_PAD,
          top: R2_TOP + R2_H,
          width: SLIDE_W - OUTER_PAD * 2,
          height: GAP,
          background: "#e8e4de",
        }}
      />

      {/* ══ ROW 3 ═════════════════════════════════════════════════════════════ */}

      {/* 8. Global Energy & Materials Centre */}
      <div
        style={{
          position: "absolute",
          left: OUTER_PAD,
          top: R3_TOP,
          width: GE_W,
          height: R3_H,
          background: "#fff",
          boxSizing: "border-box",
          padding: "8px 8px 8px 10px",
          borderRight: "2px solid #e8e4de",
          display: "flex",
          flexDirection: "column",
          gap: 0,
          overflow: "hidden",
        }}
      >
        {/* Header row: title+question LEFT, two avatars TOP-RIGHT */}
        <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: BAIN_RED,
                marginBottom: 4,
                lineHeight: 1.2,
              }}
            >
              Global Energy &amp; Materials Centre
            </div>
            <div
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: 9,
                color: "#1a1a1a",
                lineHeight: 1.35,
              }}
            >
              What are future themes and macro-level impacts to each industry?
            </div>
          </div>
          <div style={{ display: "flex", gap: 5, flexShrink: 0, alignItems: "flex-start" }}>
            <Person initials="GD" name="Grant Dougans" title="Partner" size={56} />
            <Person initials="PM" name="Peter Meijer" title="Practice VP" size={56} />
          </div>
        </div>

        {/* Horizontal divider */}
        <div
          style={{
            height: 1,
            background: "#ddd",
            margin: "6px 0",
          }}
        />

        {/* Sub-specialties row */}
        <div style={{ display: "flex", gap: 0, flex: 1 }}>
          {/* H2 / Power-to-X */}
          <div
            style={{
              flex: 1,
              paddingRight: 10,
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  color: BAIN_RED,
                  marginBottom: 4,
                  lineHeight: 1.2,
                }}
              >
                Hydrogen /{" "}
                <br />
                Power-to-X
              </div>
              <div
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: 9,
                  color: "#1a1a1a",
                  lineHeight: 1.38,
                }}
              >
                How to capture the hydrogen and Power-to-X decarbonisation opportunity?
              </div>
            </div>
            <Person initials="PK" name="Per Karlsson" title="Partner" size={52} />
          </div>

          {/* Vertical divider */}
          <div style={{ width: 2, background: "#e8e4de", flexShrink: 0 }} />

          {/* CCUS */}
          <div
            style={{
              flex: 1,
              paddingLeft: 10,
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  color: BAIN_RED,
                  marginBottom: 4,
                  lineHeight: 1.2,
                }}
              >
                Carbon Capture, Storage
                <br />
                and Utilisation (CCUS)
              </div>
              <div
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: 9,
                  color: "#1a1a1a",
                  lineHeight: 1.38,
                }}
              >
                How to leverage CCUS as a decarbonisation lever and build a CCUS business?
              </div>
            </div>
            <Person
              initials="JB"
              name="Jean-Patrice Bellier"
              title="Associate Partner"
              size={52}
            />
          </div>
        </div>
      </div>

      {/* Vertical gap between GE and Water */}
      <div
        style={{
          position: "absolute",
          left: OUTER_PAD + GE_W,
          top: R3_TOP,
          width: GAP,
          height: R3_H,
          background: "#e8e4de",
        }}
      />

      {/* 9. Water */}
      <div
        style={{
          position: "absolute",
          left: OUTER_PAD + GE_W + GAP,
          top: R3_TOP,
          width: WB_W,
          height: R3_H,
          background: "#fff",
          boxSizing: "border-box",
          padding: "8px 8px 8px 10px",
          borderRight: "2px solid #e8e4de",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 11.5,
            fontWeight: 700,
            color: BAIN_RED,
            marginBottom: 6,
          }}
        >
          Water
        </div>
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 9.5,
            color: "#1a1a1a",
            lineHeight: 1.38,
            flex: 1,
          }}
        >
          How to address water scarcity and risk through end-to-end water strategy, operations, and
          innovation?
        </div>
        <div style={{ display: "flex", justifyContent: "flex-start", paddingTop: 6 }}>
          <Person initials="MM" name="Martha Moreau" title="Further Practice VP" size={58} />
        </div>
      </div>

      {/* Vertical gap between Water and Bio */}
      <div
        style={{
          position: "absolute",
          left: OUTER_PAD + GE_W + GAP + WB_W,
          top: R3_TOP,
          width: GAP,
          height: R3_H,
          background: "#e8e4de",
        }}
      />

      {/* 10. Biodiversity */}
      <div
        style={{
          position: "absolute",
          left: OUTER_PAD + GE_W + GAP + WB_W + GAP,
          top: R3_TOP,
          width: BIO_W,
          height: R3_H,
          background: "#fff",
          boxSizing: "border-box",
          padding: "8px 8px 8px 10px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 11.5,
            fontWeight: 700,
            color: BAIN_RED,
            marginBottom: 6,
          }}
        >
          Biodiversity
        </div>
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 9.5,
            color: "#1a1a1a",
            lineHeight: 1.38,
            flex: 1,
          }}
        >
          How to assess and manage nature and biodiversity risks and embed nature into business
          strategy?
        </div>
        <div style={{ display: "flex", justifyContent: "flex-start", paddingTop: 6 }}>
          <Person initials="JD" name="Jenny Davis-Peccoud" title="Expert Partner" size={58} />
        </div>
      </div>
    </div>
  );
}
