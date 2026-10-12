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
];

/** All registered narrative slides, in source-deck order. */
export function getAllNarrativeSlides(): NarrativeSlideEntry[] {
  return ENTRIES;
}

/** Look up a single narrative slide by its original source slide number. */
export function getNarrativeSlide(slideNumber: number): NarrativeSlideEntry | undefined {
  return ENTRIES.find((e) => e.data.slideNumber === slideNumber);
}
