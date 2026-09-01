/**
 * data/reference-slide-content.ts
 *
 * Shared facts (names, titles, initials, questions, region rosters — every
 * hardcoded string a reference-slide recreation needs) for the four
 * reference slides that are actually reachable from pack data today
 * (`sourceSlides` 1–4 on Expert records; see data/reference-slides.ts).
 *
 * Both renderers read from here so they can never drift on facts:
 * - The on-screen recreation (components/reference-slides/SustainabilityOverviewNN.tsx,
 *   exported as RecreatedSlideNN) keeps its own bespoke pixel layout/CSS,
 *   but pulls names/titles/questions from this file instead of hardcoding
 *   them inline.
 * - The native PPTX export (lib/export/pptx/render-reference-slide.ts)
 *   draws its own plain pptxgenjs layout from the same data.
 */

export interface SlidePerson {
  initials: string;
  name: string;
  title: string;
}

// ─── Slide 1 — 9 Centers of Excellence ───────────────────────────────────────

export interface CoECardData {
  name: string;
  questions: string[];
  persons: SlidePerson[];
  logos?: string[];
}

export interface CoESubSpecialtyData {
  name: string;
  question: string;
  person: SlidePerson;
}

export const CENTERS_OF_EXCELLENCE_SLIDE = {
  title: "Over time we have built and formalized 9 Centers of Excellence",
  row1: [
    {
      name: "Measurement and Data",
      questions: [
        "How to measure and manage product level environmental footprint?",
        "How to manage carbon as you manage cost?",
      ],
      persons: [{ initials: "EM", name: "Euan Murray", title: "Expert Partner" }],
      logos: ["PERSEFONI", "TERRALYTIQ", "ARC"],
    },
    {
      name: "Sustainable operations",
      questions: ["How to reduce cost and carbon in tandem in operations?"],
      persons: [{ initials: "MB", name: "Mattia Bernardi", title: "Partner" }],
      logos: ["Schneider Electric"],
    },
    {
      name: "Sustainable procurement",
      questions: ["How to decarbonise supply chain in a value optimising way?"],
      persons: [{ initials: "AM", name: "Anna Mansson", title: "Partner" }],
      logos: ["Proxima", "ArcBlue"],
    },
    {
      name: "Climate policy",
      questions: [
        "How to leverage climate policy within strategy and productively engage policy makers?",
      ],
      persons: [{ initials: "CH", name: "Cate Hight", title: "Expert Partner" }],
    },
  ] as CoECardData[],
  row2: [
    {
      name: "Climate Transition",
      questions: [
        "How to assess impact of climate scenarios on end market demand, decarbonisation cost and assets?",
      ],
      persons: [
        { initials: "AR", name: "Alasdair Robbie", title: "Partner" },
        { initials: "JN", name: "James Nixon", title: "Expert Partner" },
      ],
      logos: ["CE", "Intersect"],
    },
    {
      name: "Voluntary carbon markets",
      questions: [
        "How to embed offsetting into decarbonisation strategy and build a carbon credits business?",
      ],
      persons: [
        { initials: "DH", name: "Dale Hardcastle", title: "Expert Partner" },
        { initials: "HH", name: "Henning Huenteler", title: "Expert Partner" },
      ],
      logos: ["Sylvera"],
    },
    {
      name: "APAC Sustainability Innovation CoE",
      questions: [
        "How to develop understanding on APAC trends in sustainability-linked disruptive techs, and develop PoVs, IPs, and products to support GTM campaigns?",
      ],
      persons: [
        { initials: "YL", name: "Yang Liu", title: "Expert Partner" },
        { initials: "TS", name: "Tiiram Sunderland", title: "Practice Senior Manager" },
      ],
    },
  ] as CoECardData[],
  globalEnergyMaterials: {
    name: "Global Energy & Materials Centre",
    question: "What are future themes and macro-level impacts to each industry?",
    persons: [
      { initials: "GD", name: "Grant Dougans", title: "Partner" },
      { initials: "PM", name: "Peter Meijer", title: "Practice VP" },
    ] as SlidePerson[],
    subSpecialties: [
      {
        name: "Hydrogen / Power-to-X",
        question: "How to capture the hydrogen and Power-to-X decarbonisation opportunity?",
        person: { initials: "PK", name: "Per Karlsson", title: "Partner" },
      },
      {
        name: "Carbon Capture, Storage and Utilisation (CCUS)",
        question: "How to leverage CCUS as a decarbonisation lever and build a CCUS business?",
        person: { initials: "JB", name: "Jean-Patrice Bellier", title: "Associate Partner" },
      },
    ] as CoESubSpecialtyData[],
  },
  water: {
    name: "Water",
    questions: [
      "How to address water scarcity and risk through end-to-end water strategy, operations, and innovation?",
    ],
    persons: [{ initials: "MM", name: "Martha Moreau", title: "Further Practice VP" }],
  } as CoECardData,
  biodiversity: {
    name: "Biodiversity",
    questions: [
      "How to assess and manage nature and biodiversity risks and embed nature into business strategy?",
    ],
    persons: [{ initials: "JD", name: "Jenny Davis-Peccoud", title: "Expert Partner" }],
  } as CoECardData,
};

// ─── Slide 2 — Sustainability leadership team ────────────────────────────────

export interface LeadershipPersonData {
  initials: string;
  name: string;
  role: string;
  roleRed?: boolean;
}

export const LEADERSHIP_TEAM_SLIDE = {
  title: "Introducing our Sustainability leadership team",
  overall: [
    { initials: "JC", name: "Jean-Charles van den Branden", role: "Global Practice Leader" },
    { initials: "JB", name: "John Blasberg", role: "Regional Practice Leader, Americas", roleRed: true },
    { initials: "HM", name: "Harry Morrison", role: "Regional Practice Leader, EMEA", roleRed: true },
    { initials: "DU", name: "Dominik Utama", role: "Regional Practice Leader, APAC", roleRed: true },
    { initials: "SM", name: "Sinead Mullen", role: "Global Practice Leader, Social Impact", roleRed: true },
    { initials: "MM", name: "Martha Moreau", role: "Executive Vice President", roleRed: true },
  ] as LeadershipPersonData[],
  solutionLeaders: [
    { initials: "JB", name: "John Blasberg", role: "Transition Strategy" },
    { initials: "MC", name: "Matteo Capellini", role: "Sustainability Value Creation" },
    { initials: "XH", name: "Xavier Houot", role: "Circular Value Creation" },
    { initials: "HM", name: "Harry Morrison", role: "Resilience & Adaptation" },
    { initials: "AD", name: "Andrea D'Arcy", role: "Social Equity" },
  ] as LeadershipPersonData[],
  industryLeaders: [
    { initials: "GD", name: "Grant Dougans", role: "Energy & Natural Resources" },
    { initials: "ML", name: "Marc Lino", role: "Private Equity" },
    { initials: "CG", name: "Christian Graf", role: "Financial Services" },
    { initials: "HM", name: "Harry Morrison", role: "Consumer Products" },
    { initials: "MC", name: "Matteo Capellini", role: "Retail" },
  ] as LeadershipPersonData[],
};

// ─── Slide 3 — We have deep expertise in four critical solutions ─────────────

export interface SolutionPersonData {
  initials: string;
  name: string;
  role: string;
}

export interface SolutionColumnData {
  title: string;
  perRow: number;
  people: SolutionPersonData[];
}

export const FOUR_SOLUTIONS_SLIDE = {
  title: "We have deep expertise in four critical solutions",
  columns: [
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
  ] as SolutionColumnData[],
};

// ─── Slide 4 — 40+ Offices ────────────────────────────────────────────────────

export interface OfficePersonData {
  initials: string;
  first: string;
  last: string;
}

export interface RegionGroupData {
  label: string;
  perRow: number;
  people: OfficePersonData[];
}

export const OFFICES_SLIDE = {
  title: "Sustainability leaders are located in more than 40 offices",
  regions: [
    {
      label: "APAC",
      perRow: 5,
      people: [
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
      ],
    },
    {
      label: "EMEA",
      perRow: 9,
      people: [
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
      ],
    },
    {
      label: "Americas",
      perRow: 5,
      people: [
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
      ],
    },
  ] as RegionGroupData[],
};
