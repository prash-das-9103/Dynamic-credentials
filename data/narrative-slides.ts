/**
 * data/narrative-slides.ts
 *
 * Registry of narrative slides extracted verbatim from the source deck
 * (data/narrative-slides/slide-0N.json — exact positions, colors, text,
 * and chart data, not a hand-recreated approximation). These are the
 * market-narrative slides that sit ahead of the Four Solutions in the real
 * deck: why sustainability matters, the Do-Say gap, and what CEOs do next.
 *
 * Both the on-screen Overview cards and the PPTX export read this same
 * registry, so what's previewed on the dashboard is pixel-for-pixel what
 * ends up in a downloaded pack — there is exactly one copy of each slide's
 * content.
 */

import type { NarrativeSlideData, NarrativeSlideEntry } from "@/lib/narrative-slide-types";

import slide03 from "./narrative-slides/slide-03.json";
import slide04 from "./narrative-slides/slide-04.json";
import slide05 from "./narrative-slides/slide-05.json";
import slide06 from "./narrative-slides/slide-06.json";
import slide07 from "./narrative-slides/slide-07.json";
import slide08 from "./narrative-slides/slide-08.json";
import slide09 from "./narrative-slides/slide-09.json";
import slide10 from "./narrative-slides/slide-10.json";
import slide11 from "./narrative-slides/slide-011.json";
import slide12 from "./narrative-slides/slide-012.json";
import slide15 from "./narrative-slides/slide-015.json";
import slide16 from "./narrative-slides/slide-016.json";
import slide17 from "./narrative-slides/slide-017.json";
import slide18 from "./narrative-slides/slide-018.json";
import slide19 from "./narrative-slides/slide-019.json";
import slide20 from "./narrative-slides/slide-020.json";
import slide21 from "./narrative-slides/slide-021.json";
import slide22 from "./narrative-slides/slide-022.json";
import slide23 from "./narrative-slides/slide-023.json";
import slide24 from "./narrative-slides/slide-024.json";
import slide25 from "./narrative-slides/slide-025.json";
import slide30 from "./narrative-slides/slide-030.json";
import slide31 from "./narrative-slides/slide-031.json";
import slide32 from "./narrative-slides/slide-032.json";
import slide33 from "./narrative-slides/slide-033.json";
import slide34 from "./narrative-slides/slide-034.json";
import slide35 from "./narrative-slides/slide-035.json";
import slide36 from "./narrative-slides/slide-036.json";
import slide37 from "./narrative-slides/slide-037.json";
import slide38 from "./narrative-slides/slide-038.json";
import slide39 from "./narrative-slides/slide-039.json";
import slide40 from "./narrative-slides/slide-040.json";

const ENTRIES: NarrativeSlideEntry[] = [
  {
    data: slide03 as NarrativeSlideData,
    label: "We address the world's toughest questions",
    description: "The six questions clients bring to us on sustainability transformation.",
  },
  {
    data: slide04 as NarrativeSlideData,
    label: "Sustainability encompasses a broad range of topics",
    description: "The full topic landscape — water, biodiversity, air quality, emissions, land & ocean use, resource circularity.",
  },
  {
    data: slide05 as NarrativeSlideData,
    label: "Sustainability remains below peak hype levels, but the decline is bottoming out",
    description: "Hype-cycle trend, 2018–2025.",
  },
  {
    data: slide06 as NarrativeSlideData,
    label: "CEOs speak less about sustainability but continue to act",
    description: "The Do-Say gap — the core narrative framing for this market context.",
  },
  {
    data: slide07 as NarrativeSlideData,
    label: "The \u201cDo\u201d is accelerating",
    description: "Corporate targets are becoming more ambitious, and companies assign more business to sustainable suppliers.",
  },
  {
    data: slide08 as NarrativeSlideData,
    label: "The \u201cSay\u201d is evolving",
    description: "CEOs are speaking less, but linking sustainability to performance and business value.",
  },
  {
    data: slide09 as NarrativeSlideData,
    label: "Yet significant challenges persist",
    description: "Disaster losses, Scope 3 target progress, and plastic waste mismanagement.",
  },
  {
    data: slide10 as NarrativeSlideData,
    label: "With 2030 targets now on the horizon, CEOs must take action",
    description: "Three priorities: accelerate what works, anticipate what's coming, build robustness.",
  },
  {
    data: slide11 as NarrativeSlideData,
    label: "With 2030 targets now on the horizon, CEOs must take action",
    description: "The three priorities laid out in full: accelerate, anticipate, build robustness.",
  },
  {
    data: slide12 as NarrativeSlideData,
    label: "To learn more about sustainability, visit our pages on Iris",
    description: "Where to find our growing collection of POVs, selling guides, and case examples.",
  },
  {
    data: slide15 as NarrativeSlideData,
    label: "Our collective ambition: further",
    description: "Defining what \u201cfurther\u201d means for a sustainable, equitable, and inclusive world.",
  },
  {
    data: slide16 as NarrativeSlideData,
    label: "Further is our collective ambition to create a more sustainable, equitable and inclusive world",
    description: "How we live that ambition at Bain, with clients, and in the global community.",
  },
  {
    data: slide17 as NarrativeSlideData,
    label: "We bring a differentiated offering to our clients",
    description: "Deep expertise, sector-shaping influence, a global team, AI expertise, and sustainability in our own business.",
  },
  {
    data: slide18 as NarrativeSlideData,
    label: "Sustainability frontrunners drive competitive advantage",
    description: "Cost leadership, customer growth, people engagement, and valuation — the four ways it pays off.",
  },
  {
    data: slide19 as NarrativeSlideData,
    label: "We offer four sustainability solutions",
    description: "Transition Strategy, Sustainability Value Creation, Circular Value Creation, Resilience & Adaptation.",
  },
  {
    data: slide20 as NarrativeSlideData,
    label: "Over time we have built and formalized 9 Centers of Excellence",
    description: "Our expert partners and the specialist capabilities behind each Center of Excellence.",
  },
  {
    data: slide21 as NarrativeSlideData,
    label: "INTERSECT: our full ecosystem of partners",
    description: "Joint product development, joint client delivery, and partner-led transition costs modelling.",
  },
  {
    data: slide22 as NarrativeSlideData,
    label: "Bain is leading the way, with a deeply committed and inspired team",
    description: "3,750+ cases, 3,200+ insights published, and 3,200+ sustainability practitioners — the five-year view.",
  },
  {
    data: slide23 as NarrativeSlideData,
    label: "Bain is leading the way, with a deeply committed and inspired team",
    description: "1,450+ cases, 1,000+ insights published, and 2,300+ sustainability practitioners — the two-year view.",
  },
  {
    data: slide24 as NarrativeSlideData,
    label: "Bain has extensive experience in sustainability with more than 3,750 projects",
    description: "Case volume across industries and sustainability solutions.",
  },
  {
    data: slide25 as NarrativeSlideData,
    label: "Bain has global experience across all industries and sustainability solutions",
    description: "Recent sustainability cases by solution and industry.",
  },
  {
    data: slide30 as NarrativeSlideData,
    label: "We are a respected thought leader on sustainability (1/2)",
    description: "Published perspectives including Circular Transformation of Industries.",
  },
  {
    data: slide31 as NarrativeSlideData,
    label: "We are a respected thought leader on sustainability (2/2)",
    description: "Published perspectives including Decarbonization That Works: Five Imperatives.",
  },
  {
    data: slide32 as NarrativeSlideData,
    label: "Our IP and research on Diversity, Equity, and Inclusion, and the S in ESG",
    description: "Global thought leadership spanning social equity themes.",
  },
  {
    data: slide33 as NarrativeSlideData,
    label: "We have a deep relationship with GFANZ",
    description: "Accelerating the net zero transition in financial services across North America, Southeast Asia, and beyond.",
  },
  {
    data: slide34 as NarrativeSlideData,
    label: "To build on our momentum, from 2025-2035 we are committing more",
    description: "Our 2025–2035 sustainability commitments.",
  },
  {
    data: slide35 as NarrativeSlideData,
    label: "Energy & Natural Resources, Advanced Manufacturing & Services",
    description: "Sector and practice coverage underpinning our sustainability work.",
  },
  {
    data: slide36 as NarrativeSlideData,
    label: "AI for Sustainable Future — a collaboration with the World Economic Forum",
    description: "Identifying, shortlisting, prototyping, and codifying tangible AI use cases for sustainability.",
  },
  {
    data: slide37 as NarrativeSlideData,
    label: "A global ecosystem of analytics, AI, and digital talent",
    description: "20+ senior practitioners, 1,500+ deep analytics experts, and 3,000+ AI, Insights & Solutions engagements.",
  },
  {
    data: slide38 as NarrativeSlideData,
    label: "Recognized by top analyst firms for digital, innovation, and automation consulting",
    description: "Independent recognition for our consulting-in-action approach.",
  },
  {
    data: slide39 as NarrativeSlideData,
    label: "We will invest significant pro bono capacity to solve the world's toughest challenges",
    description: "Encouraging every Bainie to find their sustainability passion and make an impact.",
  },
  {
    data: slide40 as NarrativeSlideData,
    label: "Our world faces unprecedented challenges — bold action has never been more urgent",
    description: "Setting new standards of excellence.",
  },
];

/** All registered narrative slides, in source-deck order. */
export function getAllNarrativeSlides(): NarrativeSlideEntry[] {
  return ENTRIES;
}

/** Look up a single narrative slide by its original source slide number. */
export function getNarrativeSlide(slideNumber: number): NarrativeSlideEntry | undefined {
  return ENTRIES.find((e) => e.data.slideNumber === slideNumber);
}
