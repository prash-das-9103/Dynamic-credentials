"use client";

const BAIN_RED = "#CC0000";
const SLIDE_W = 1280;
const SLIDE_H = 720;

// ── Small circular avatar for dense grid ───────────────────────────────────────
function Avatar({ initials, size = 52 }: { initials: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg,#b0aca8 0%,#888 100%)",
        border: "1.5px solid #666",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.27,
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

// ── Person: avatar + two-line white name ────────────────────────────────────────
function Person({
  initials,
  first,
  last,
  size = 52,
  itemW = 70,
}: {
  initials: string;
  first: string;
  last: string;
  size?: number;
  itemW?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        width: itemW,
        flexShrink: 0,
      }}
    >
      <Avatar initials={initials} size={size} />
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: 8,
          fontWeight: 400,
          color: "#e8e8e8",
          textAlign: "center",
          lineHeight: 1.25,
          width: "100%",
        }}
      >
        {first}
        <br />
        {last}
      </div>
    </div>
  );
}

// ── One region column ───────────────────────────────────────────────────────────
function RegionColumn({
  label,
  people,
  left,
  width,
  perRow,
}: {
  label: string;
  people: { initials: string; first: string; last: string }[];
  left: number;
  width: number;
  perRow: number;
}) {
  const HEADER_H = 44;
  const AVATAR_SIZE = 50;
  const ITEM_W = Math.floor((width - 16) / perRow);

  const rows: { initials: string; first: string; last: string }[][] = [];
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
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Column header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: HEADER_H,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          paddingLeft: 14,
          paddingBottom: 10,
          boxSizing: "border-box",
          gap: 0,
        }}
      >
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.1,
          }}
        >
          {label}
        </div>
        <div style={{ marginTop: 4, width: 28, height: 2, background: BAIN_RED }} />
      </div>

      {/* Person grid */}
      <div
        style={{
          position: "absolute",
          top: HEADER_H + 12,
          left: 8,
          right: 8,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {rows.map((row, ri) => (
          <div key={ri} style={{ display: "flex", gap: 6, flexWrap: "nowrap" }}>
            {row.map((p, pi) => (
              <Person
                key={pi}
                initials={p.initials}
                first={p.first}
                last={p.last}
                size={AVATAR_SIZE}
                itemW={ITEM_W}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Recreated slide ─────────────────────────────────────────────────────────────
export function RecreatedSlide04() {
  // Layout:
  // Title area: top=0, h=78 (near-black bg, white title)
  // Region area: top=78, h=586 (near-black bg, 3 columns + thin white separators)
  // Footer bar: top=664, h=56

  const TITLE_H = 44;
  const FOOTER_H = 56;
  const REGION_H = SLIDE_H - TITLE_H - FOOTER_H; // 620

  // Three columns: APAC=5-wide, EMEA=9-wide, Americas=5-wide
  // APAC: left=0, w=~300
  // Thin separator at ~300
  // EMEA: left=~302, w=~678
  // Thin separator at ~980
  // Americas: left=~982, w=~298

  const APAC_W = 296;
  const SEP = 2;
  const EMEA_W = 682;
  const AMERICAS_W = SLIDE_W - APAC_W - SEP - EMEA_W - SEP; // 298

  const apac = [
    { initials: "KS", first: "Karan", last: "Singh" },
    { initials: "BM", first: "Brian", last: "Murphy" },
    { initials: "DH", first: "Dale", last: "Hardcastle" },
    { initials: "YL", first: "Yang", last: "Liu" },
    { initials: "LC", first: "Liam", last: "Connolly" },
    { initials: "JI", first: "Junya", last: "Ishikawa" },
    { initials: "YT", first: "Yukiko", last: "Tsukamoto" },
    { initials: "SK", first: "Sachin", last: "Kotak" },
    { initials: "KJ", first: "Kyoungjun", last: "Jang" },
    { initials: "SZ", first: "Sophia", last: "Zou" },
    { initials: "GM", first: "Gerry", last: "Mattios" },
    { initials: "KC", first: "Katrina", last: "Cuthell" },
    { initials: "RL", first: "Rafael", last: "Lam" },
    { initials: "TL", first: "Thomas", last: "Luedi" },
    { initials: "AK", first: "Are", last: "Kaspersen" },
    { initials: "BH", first: "Benjamin", last: "Hughes" },
    { initials: "FC", first: "Francesco", last: "Cigala" },
    { initials: "PM", first: "Paolo", last: "Misurale" },
    { initials: "KP", first: "Kaoru", last: "Perkins" },
    { initials: "AN", first: "Avishek", last: "Nandy" },
    { initials: "PD", first: "Priscilla", last: "Dell'Orto" },
    { initials: "AB", first: "Aadarsh", last: "Baijal" },
  ];

  const emea = [
    { initials: "JC", first: "Jean-Charles", last: "van den Branden" },
    { initials: "FF", first: "Francois", last: "Faelli" },
    { initials: "JD", first: "Jenny", last: "Davis-Peccoud" },
    { initials: "CG", first: "Christian", last: "Graf" },
    { initials: "ML", first: "Marc", last: "Lino" },
    { initials: "AA", first: "Akram", last: "Alami" },
    { initials: "PM", first: "Peter", last: "Meijer" },
    { initials: "NP", first: "Nitesh", last: "Prakash" },
    { initials: "MK", first: "Mattias-C", last: "Karlsson" },
    { initials: "GN", first: "Giulio", last: "Naso" },
    { initials: "AS", first: "Axel", last: "Seemann" },
    { initials: "HH", first: "Henning", last: "Huenteler" },
    { initials: "MD2", first: "Magali", last: "Deryckere" },
    { initials: "HM", first: "Harry", last: "Morrison" },
    { initials: "MP", first: "Mark", last: "Porter" },
    { initials: "YA", first: "Yelena", last: "Ageyeva-Furman" },
    { initials: "JDh", first: "Jelle", last: "Dhaen" },
    { initials: "MC2", first: "Matteo", last: "Capellini" },
    { initials: "ML2", first: "Maria", last: "Liby-Troein" },
    { initials: "KS2", first: "Karl", last: "Strempel" },
    { initials: "AG", first: "Armando", last: "Guastella" },
    { initials: "AS2", first: "Aude", last: "Schonbachler" },
    { initials: "CG2", first: "Camille", last: "Goosens" },
    { initials: "CF", first: "Carlo", last: "Farina" },
    { initials: "OM", first: "Olga", last: "Muscat" },
    { initials: "EN", first: "Erik", last: "Nordboe" },
    { initials: "MS", first: "Manuel de", last: "Soto" },
    { initials: "RD", first: "Romain", last: "Deleforge" },
    { initials: "ES", first: "Eske", last: "Scavenius" },
    { initials: "FM", first: "Francois", last: "Montaville" },
    { initials: "PK", first: "Per", last: "Karlsson" },
    { initials: "LJ", first: "Leah", last: "Johns" },
    { initials: "HMo", first: "Hannah", last: "Morrill" },
    { initials: "MH", first: "Mario", last: "Haeuptli" },
    { initials: "ZL", first: "Zara", last: "Lightowler" },
    { initials: "AR", first: "Alasdair", last: "Robbie" },
    { initials: "NK", first: "Niels", last: "Koggersbol" },
    { initials: "WY", first: "Wissam", last: "Yassine" },
    { initials: "KK", first: "Katherine", last: "Kajzer-Hughes" },
    { initials: "MK2", first: "Mattias-F", last: "Karlsson" },
    { initials: "ALX", first: "Alexander", last: "Schmitz" },
    { initials: "XH", first: "Xavier", last: "Houot" },
    { initials: "DD", first: "Deike", last: "Diers" },
    { initials: "CL", first: "Christian", last: "Langel" },
  ];

  const americas = [
    { initials: "JB", first: "John", last: "Blasberg" },
    { initials: "SD", first: "Sasha", last: "Duchnowski" },
    { initials: "CH", first: "Cate", last: "Hight" },
    { initials: "SH", first: "Scott", last: "Hogan" },
    { initials: "CV", first: "Christophe", last: "de Vusser" },
    { initials: "GE", first: "Graham", last: "Eckert" },
    { initials: "BB", first: "Bob", last: "Brinkman" },
    { initials: "JH", first: "Josh", last: "Hinkel" },
    { initials: "PG", first: "Phil", last: "Gray" },
    { initials: "DH2", first: "David", last: "Hoverman" },
    { initials: "MB", first: "Marie", last: "BoonFalleur" },
    { initials: "AP", first: "Abhijit", last: "Prabhu" },
    { initials: "EE", first: "Emily", last: "Emmett" },
    { initials: "JG", first: "Jayant", last: "Gotpagar" },
    { initials: "AK2", first: "Andrew", last: "Keech" },
    { initials: "JC2", first: "Jeffrey", last: "Crane" },
    { initials: "APa", first: "Adam", last: "Papania" },
    { initials: "EK", first: "Emily", last: "Kasavana" },
    { initials: "HM2", first: "Hugh", last: "MacArthur" },
    { initials: "DL", first: "Dan", last: "LeClerc" },
    { initials: "SM2", first: "Silvio", last: "Marote" },
    { initials: "MSt", first: "Matt", last: "Stolper" },
    { initials: "NI", first: "Nafi", last: "Israel" },
    { initials: "DC", first: "Daniela", last: "Carbinato" },
    { initials: "MK3", first: "Michael", last: "Kochan" },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: SLIDE_W,
        height: SLIDE_H,
        background: "#1a1a1a",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
        colorScheme: "dark",
      }}
    >
      {/* ── Title bar ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: TITLE_H,
          background: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          paddingLeft: 36,
          paddingRight: 36,
        }}
      >
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 13,
            fontWeight: 400,
            color: "#fff",
            lineHeight: 1.2,
          }}
        >
          Sustainability leaders are located in more than 40 offices
        </div>
      </div>

      {/* ── Thin white rule under title ── */}
      <div
        style={{
          position: "absolute",
          top: TITLE_H,
          left: 0,
          right: 0,
          height: 1,
          background: "#444",
        }}
      />

      {/* ── Three region columns ── */}
      <div
        style={{
          position: "absolute",
          top: TITLE_H + 1,
          left: 0,
          right: 0,
          height: REGION_H,
          background: "#1a1a1a",
        }}
      >
        {/* APAC */}
        <RegionColumn
          label="APAC"
          people={apac}
          left={0}
          width={APAC_W}
          perRow={5}
        />

        {/* Vertical separator APAC | EMEA */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: APAC_W,
            width: SEP,
            height: "100%",
            background: "#444",
          }}
        />

        {/* EMEA */}
        <RegionColumn
          label="EMEA"
          people={emea}
          left={APAC_W + SEP}
          width={EMEA_W}
          perRow={9}
        />

        {/* Vertical separator EMEA | Americas */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: APAC_W + SEP + EMEA_W,
            width: SEP,
            height: "100%",
            background: "#444",
          }}
        />

        {/* Americas */}
        <RegionColumn
          label="Americas"
          people={americas}
          left={APAC_W + SEP + EMEA_W + SEP}
          width={AMERICAS_W}
          perRow={5}
        />
      </div>

      {/* ── "Not exhaustive" footer bar ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: FOOTER_H,
          background: "#0d0d0d",
          borderTop: "1px solid #333",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
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
export default function SustainabilityOverview04() {

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        padding: 24,
        background: "#111",
        minHeight: "100vh",
      }}
    >
      
      <div style={{ position: "relative", width: SLIDE_W, height: SLIDE_H, flexShrink: 0 }}>
                                <RecreatedSlide04 />
      </div>
      <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>
        Slide 4 — 40+ Offices &nbsp;|&nbsp; 1280 × 720
      </div>
    </div>
  );
}
