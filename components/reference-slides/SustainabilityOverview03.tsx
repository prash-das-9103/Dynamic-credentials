"use client";

const BAIN_RED = "#CC0000";
const SLIDE_W = 1280;
const SLIDE_H = 720;

// ── Circular avatar ─────────────────────────────────────────────────────────────
function Avatar({ initials, size = 70 }: { initials: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg,#c8c4be 0%,#a0a0a0 100%)",
        border: "1.5px solid #ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.26,
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {initials}
    </div>
  );
}

// ── Person: avatar + bold name + gray title ──────────────────────────────────────
function Person({
  initials,
  name,
  title,
  size = 70,
  colW,
}: {
  initials: string;
  name: string;
  title: string;
  size?: number;
  colW?: number;
}) {
  const w = colW ?? size + 16;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        width: w,
        flexShrink: 0,
      }}
    >
      <Avatar initials={initials} size={size} />
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: 9.5,
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
          fontSize: 9,
          fontWeight: 400,
          color: "#555",
          textAlign: "center",
          lineHeight: 1.2,
          width: "100%",
        }}
      >
        {title}
      </div>
    </div>
  );
}

// ── Column: dark header + avatar grid ──────────────────────────────────────────
function Column({
  title,
  people,
  left,
  width,
  perRow = 2,
}: {
  title: string;
  people: { initials: string; name: string; role: string }[];
  left: number;
  width: number;
  perRow?: number;
}) {
  const HEADER_H = 82;
  const GRID_TOP = 82 + 16; // header + small gap from top of column
  const AVATAR_SIZE = 66;
  const COL_ITEM_W = Math.floor((width - 16) / perRow);

  // Split people into rows of perRow
  const rows: { initials: string; name: string; role: string }[][] = [];
  for (let i = 0; i < people.length; i += perRow) {
    rows.push(people.slice(i, i + perRow));
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left,
        width,
        bottom: 0,
        boxSizing: "border-box",
      }}
    >
      {/* Dark header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: HEADER_H,
          background: "#141414",
          boxSizing: "border-box",
          paddingLeft: 14,
          paddingTop: 18,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: 0,
        }}
      >
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 19,
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        {/* Red underline bar */}
        <div
          style={{
            marginTop: 8,
            width: 36,
            height: 3,
            background: BAIN_RED,
          }}
        />
      </div>

      {/* White content area */}
      <div
        style={{
          position: "absolute",
          top: HEADER_H,
          left: 0,
          width: "100%",
          bottom: 60, // above the "Not exhaustive" footer bar
          background: "#fff",
          overflowY: "hidden",
          paddingTop: 16,
          paddingLeft: 8,
          paddingRight: 8,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {rows.map((row, ri) => (
          <div
            key={ri}
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-start",
              flexWrap: "nowrap",
            }}
          >
            {row.map((p) => (
              <Person
                key={p.initials + p.name}
                initials={p.initials}
                name={p.name}
                title={p.role}
                size={AVATAR_SIZE}
                colW={COL_ITEM_W}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Recreated slide ─────────────────────────────────────────────────────────────
export function RecreatedSlide03() {
  // Layout from reference:
  // Title area: top=0, height=84 (white bg)
  // Title text: y=24, fontSize=27px
  // Red rule: y=66
  // Four equal columns fill remaining 636px height
  // Column width: (1280-36-36) / 4 = ~302px, with 2px gaps between
  // "Not exhaustive" black footer bar: height=54

  const TITLE_H = 68;
  const FOOTER_H = 54;
  const COL_AREA_TOP = TITLE_H;
  const COL_AREA_H = SLIDE_H - TITLE_H;
  const CONTENT_H = COL_AREA_H - FOOTER_H;
  const TOTAL_GAP = 3; // 3 gaps × 1px
  const COL_W = Math.floor((SLIDE_W - TOTAL_GAP) / 4); // ~319px

  const cols = [
    {
      title: "Transition\nStrategy",
      perRow: 2,
      people: [
        { initials: "JB", name: "John Blasberg", role: "Partner" },
        { initials: "JD", name: "Jelle Dhaen", role: "Partner" },
        { initials: "JC", name: "Jean-Charles Van\nden Branden", role: "Partner" },
        { initials: "DU", name: "Dominik Utama", role: "Partner" },
        { initials: "CH", name: "Cate Hight", role: "Expert Partner" },
        { initials: "YL", name: "Yang Liu", role: "Expert Partner" },
        { initials: "MC", name: "Matteo Capellini", role: "Partner" },
        { initials: "XH", name: "Xavier Houot", role: "Partner" },
        { initials: "CG", name: "Christian Graf", role: "Partner" },
        { initials: "HM", name: "Harry Morrison", role: "Partner" },
        { initials: "JN", name: "James Nixon", role: "Expert Partner" },
        { initials: "GD", name: "Grant Dougans", role: "Partner" },
      ],
    },
    {
      title: "Sustainability\nValue Creation",
      perRow: 3,
      people: [
        { initials: "MC", name: "Matteo Capellini", role: "Partner" },
        { initials: "HM", name: "Harry Morrison", role: "Partner" },
        { initials: "EM", name: "Euan Murray", role: "Expert Partner" },
        { initials: "CG", name: "Christian Graf", role: "Partner" },
        { initials: "XH", name: "Xavier Houot", role: "Expert Partner" },
        { initials: "DH", name: "Dale Hardcastle", role: "Expert Partner" },
        { initials: "HH", name: "Henning Huenteler", role: "Expert Partner" },
        { initials: "DD", name: "Deike Diers", role: "Partner" },
        { initials: "ML", name: "Marc Lino", role: "Partner" },
        { initials: "MK", name: "Mattias-C Karlsson", role: "Partner" },
        { initials: "EK", name: "Emily Kasavana", role: "Partner" },
      ],
    },
    {
      title: "Circular Value\nCreation",
      perRow: 2,
      people: [
        { initials: "HS", name: "Hernan Saenz", role: "Partner" },
        { initials: "XH", name: "Xavier Houot", role: "Expert Partner" },
        { initials: "YA", name: "Yelena Ageyeva-Furman", role: "Partner" },
        { initials: "JG", name: "Jayant Gotpagar", role: "Partner" },
        { initials: "AP", name: "Abhijit Prabhu", role: "Partner" },
        { initials: "HM", name: "Harry Morrison", role: "Partner" },
        { initials: "JH", name: "Josh Hinkel", role: "Partner" },
      ],
    },
    {
      title: "Resilience &\nAdaptation",
      perRow: 3,
      people: [
        { initials: "HM", name: "Harry Morrison", role: "Partner" },
        { initials: "MM", name: "Martha Moreau", role: "Executive VP" },
        { initials: "AM", name: "Anna Mansson", role: "Partner" },
        { initials: "YA", name: "Yelena Ageyeva-Furman", role: "Partner" },
        { initials: "WY", name: "Wissam Yassine", role: "Partner" },
        { initials: "MD", name: "Magali Deryckere", role: "Partner" },
        { initials: "DH", name: "Dale Hardcastle", role: "Expert Partner" },
        { initials: "DD", name: "Deike Diers", role: "Partner" },
      ],
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: SLIDE_W,
        height: SLIDE_H,
        background: "#fff",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
        colorScheme: "light",
      }}
    >
      {/* ── Title area ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: TITLE_H,
          background: "#fff",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 36,
            right: 36,
            fontFamily: "Arial, sans-serif",
            fontSize: 24,
            fontWeight: 400,
            color: "#111",
            lineHeight: 1.2,
          }}
        >
          We have deep expertise in four critical solutions
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            background: "#ccc",
          }}
        />
      </div>

      {/* ── Four columns ── */}
      {cols.map((col, ci) => {
        const left = ci * (COL_W + 1);
        return (
          <div
            key={ci}
            style={{
              position: "absolute",
              top: COL_AREA_TOP,
              left,
              width: COL_W,
              height: COL_AREA_H,
              overflow: "hidden",
            }}
          >
            {/* Dark header */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 90,
                background: "#141414",
                boxSizing: "border-box",
                padding: "16px 14px 0 14px",
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              <div
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.2,
                  whiteSpace: "pre-line",
                }}
              >
                {col.title}
              </div>
              <div style={{ marginTop: 8, width: 36, height: 3, background: BAIN_RED }} />
            </div>

            {/* Content area */}
            <div
              style={{
                position: "absolute",
                top: 90,
                left: 0,
                right: 0,
                bottom: FOOTER_H,
                background: "#fff",
                overflowY: "hidden",
                padding: "14px 8px 8px 8px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {(() => {
                const perRow = col.perRow;
                const rows: typeof col.people[] = [];
                for (let i = 0; i < col.people.length; i += perRow) {
                  rows.push(col.people.slice(i, i + perRow));
                }
                const itemW = Math.floor((COL_W - 16) / perRow);
                return rows.map((row, ri) => (
                  <div key={ri} style={{ display: "flex", gap: 6, flexWrap: "nowrap" }}>
                    {row.map((p, pi) => (
                      <div
                        key={pi}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 3,
                          width: itemW,
                          flexShrink: 0,
                        }}
                      >
                        <Avatar initials={p.initials} size={ci === 0 ? 58 : ci === 2 ? 66 : 62} />
                        <div
                          style={{
                            fontFamily: "Arial, sans-serif",
                            fontSize: 9,
                            fontWeight: 700,
                            color: "#111",
                            textAlign: "center",
                            lineHeight: 1.2,
                            width: "100%",
                          }}
                        >
                          {p.name}
                        </div>
                        <div
                          style={{
                            fontFamily: "Arial, sans-serif",
                            fontSize: 8.5,
                            color: "#555",
                            textAlign: "center",
                            lineHeight: 1.2,
                            width: "100%",
                          }}
                        >
                          {p.role}
                        </div>
                      </div>
                    ))}
                  </div>
                ));
              })()}
            </div>

            {/* Vertical right-edge separator */}
            {ci < cols.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 1,
                  height: "100%",
                  background: "#d0ccc8",
                }}
              />
            )}
          </div>
        );
      })}

      {/* ── "Not exhaustive" footer bar ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: FOOTER_H,
          background: "#111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        {/* Left dotted line */}
        <div
          style={{
            flex: 1,
            marginLeft: 40,
            height: 0,
            borderBottom: "2px dotted #555",
          }}
        />
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 15,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "0.04em",
            flexShrink: 0,
          }}
        >
          Not exhaustive
        </div>
        {/* Right dotted line */}
        <div
          style={{
            flex: 1,
            marginRight: 40,
            height: 0,
            borderBottom: "2px dotted #555",
          }}
        />
      </div>
    </div>
  );
}

// ── Comparison shell ────────────────────────────────────────────────────────────
export default function SustainabilityOverview03() {

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
                                <RecreatedSlide03 />
      </div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>
        Slide 3 — Four Critical Solutions &nbsp;|&nbsp; 1280 × 720
      </div>
    </div>
  );
}
