import type { CenterOfExcellence } from "@/types/credentials";

// 9 Centers of Excellence as confirmed.
// H2/Power-to-X and CCUS are sub-areas (parentId: "global-energy-materials") of the
// Global Energy & Materials Centre — they count together as CoE #8.
// expertIds reference the IDs assigned in data/experts.ts.
// proposedPartnerNames are verbatim from Slide 1; no Partner records exist yet.
// sourceImages point to the public blob URLs provided with the slides.

export const CENTERS_OF_EXCELLENCE: CenterOfExcellence[] = [
  {
    id: "measurement-and-data",
    name: "Measurement and Data",
    expertiseQuestions: [
      "How to measure and manage product level environmental footprint?",
      "How to manage carbon as you manage cost?",
    ],
    expertIds: ["expert-euan-murray"],
    proposedPartnerNames: ["Persefoni", "Terralytiq", "ARC by Bain & Company"],
    sourceImages: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Slide1.PNG-dCjoo1qLALqoTRdYVzJ4eQWMIIPTJZ.png",
    ],
    reviewStatus: "needs-review",
  },
  {
    id: "sustainable-operations",
    name: "Sustainable Operations",
    expertiseQuestions: [
      "How to reduce cost and carbon in tandem in operations?",
    ],
    expertIds: ["expert-mattia-bernardi"],
    proposedPartnerNames: ["Schneider Electric"],
    sourceImages: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Slide1.PNG-dCjoo1qLALqoTRdYVzJ4eQWMIIPTJZ.png",
    ],
    reviewStatus: "needs-review",
  },
  {
    id: "sustainable-procurement",
    name: "Sustainable Procurement",
    expertiseQuestions: [
      "How to decarbonise supply chain in a value optimising way?",
    ],
    expertIds: ["expert-anna-mansson"],
    proposedPartnerNames: ["Proxima", "ArcBlue"],
    sourceImages: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Slide1.PNG-dCjoo1qLALqoTRdYVzJ4eQWMIIPTJZ.png",
    ],
    reviewStatus: "needs-review",
  },
  {
    id: "climate-policy",
    name: "Climate Policy",
    expertiseQuestions: [
      "How to leverage climate policy within strategy and productively engage policy makers?",
    ],
    expertIds: ["expert-cate-hight"],
    proposedPartnerNames: [],
    sourceImages: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Slide1.PNG-dCjoo1qLALqoTRdYVzJ4eQWMIIPTJZ.png",
    ],
    reviewStatus: "needs-review",
  },
  {
    id: "climate-transition",
    name: "Climate Transition",
    expertiseQuestions: [
      "How to assess impact of climate scenarios on end market demand, decarbonisation cost and assets?",
    ],
    expertIds: ["expert-alasdair-robbie", "expert-james-nixon"],
    proposedPartnerNames: ["Copenhagen Economics", "Intersect"],
    sourceImages: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Slide1.PNG-dCjoo1qLALqoTRdYVzJ4eQWMIIPTJZ.png",
    ],
    reviewStatus: "needs-review",
  },
  {
    id: "voluntary-carbon-markets",
    name: "Voluntary Carbon Markets",
    expertiseQuestions: [
      "How to embed offsetting into decarbonisation strategy and build a carbon credits business?",
    ],
    expertIds: ["expert-dale-hardcastle", "expert-henning-huenteler"],
    proposedPartnerNames: ["Sylvera"],
    sourceImages: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Slide1.PNG-dCjoo1qLALqoTRdYVzJ4eQWMIIPTJZ.png",
    ],
    reviewStatus: "needs-review",
  },
  {
    id: "apac-sustainability-innovation",
    name: "APAC Sustainability Innovation CoE",
    expertiseQuestions: [
      "How to develop understanding on APAC trends in sustainability-linked disruptive techs, and develop PoVs, IPs, and products to support GTM campaigns?",
    ],
    expertIds: ["expert-yang-liu", "expert-tiiram-sunderland"],
    proposedPartnerNames: [],
    sourceImages: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Slide1.PNG-dCjoo1qLALqoTRdYVzJ4eQWMIIPTJZ.png",
    ],
    reviewStatus: "needs-review",
  },
  {
    // Parent CoE — Global Energy & Materials Centre (CoE #8)
    id: "global-energy-materials",
    name: "Global Energy & Materials Centre",
    expertiseQuestions: [
      "What are future themes and macro-level impacts to each industry?",
    ],
    expertIds: ["expert-grant-dougans", "expert-peter-meijer"],
    proposedPartnerNames: [],
    sourceImages: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Slide1.PNG-dCjoo1qLALqoTRdYVzJ4eQWMIIPTJZ.png",
    ],
    reviewStatus: "needs-review",
  },
  {
    // Sub-area of global-energy-materials
    id: "hydrogen-power-to-x",
    name: "Hydrogen / Power-to-X",
    parentId: "global-energy-materials",
    expertiseQuestions: [
      "How to capture the hydrogen and Power-to-X decarbonisation opportunity?",
    ],
    expertIds: ["expert-per-karlsson"],
    proposedPartnerNames: [],
    sourceImages: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Slide1.PNG-dCjoo1qLALqoTRdYVzJ4eQWMIIPTJZ.png",
    ],
    reviewStatus: "needs-review",
  },
  {
    // Sub-area of global-energy-materials
    id: "ccus",
    name: "Carbon Capture, Storage and Utilisation (CCUS)",
    parentId: "global-energy-materials",
    expertiseQuestions: [
      "How to leverage CCUS as a decarbonisation lever and build a CCUS business?",
    ],
    expertIds: ["expert-jean-patrice-bellier"],
    proposedPartnerNames: [],
    sourceImages: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Slide1.PNG-dCjoo1qLALqoTRdYVzJ4eQWMIIPTJZ.png",
    ],
    reviewStatus: "needs-review",
  },
  {
    id: "water",
    name: "Water",
    expertiseQuestions: [
      "How to address water scarcity and risk through end-to-end water strategy, operations, and innovation?",
    ],
    expertIds: ["expert-martha-moreau"],
    proposedPartnerNames: [],
    sourceImages: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Slide1.PNG-dCjoo1qLALqoTRdYVzJ4eQWMIIPTJZ.png",
    ],
    reviewStatus: "needs-review",
  },
  {
    id: "biodiversity",
    name: "Biodiversity",
    expertiseQuestions: [
      "How to assess and manage nature and biodiversity risks and embed nature into business strategy?",
    ],
    expertIds: ["expert-jenny-davis-peccoud"],
    proposedPartnerNames: [],
    sourceImages: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Slide1.PNG-dCjoo1qLALqoTRdYVzJ4eQWMIIPTJZ.png",
    ],
    reviewStatus: "needs-review",
  },
];
