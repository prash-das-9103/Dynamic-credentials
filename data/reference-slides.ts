/**
 * data/reference-slides.ts
 *
 * Registry of reference slides that are reachable from real pack data
 * (i.e. a slide number that appears in some item's `sourceSlides`). This is
 * intentionally NOT a registry of all 23 recreated slides under
 * `/reference-slides` — most of those (partners, publications, most
 * credentials) cite `sourceSlides` well outside 1–4, so they never match
 * anything a user can add to the Pack Builder today.
 *
 * When a pack item's `sourceSlides` includes a slide number registered
 * here, the Pack Builder renders the ACTUAL reference slide (in-app via its
 * React recreation, in the PPTX export via the native pptxgenjs renderer)
 * instead of a plain bullet summary. See lib/pack-slide-content.ts for the
 * matching logic and lib/export/pptx/render-reference-slide.ts for the
 * PPTX rendering.
 *
 * To register a new slide once it becomes reachable (i.e. once some
 * credential/partner/publication's `sourceSlides` cites it), add an entry
 * here — no other pipeline code needs to change.
 */

import type { ComponentType } from "react";
import { RecreatedSlide01 } from "@/components/reference-slides/SustainabilityOverview01";
import { RecreatedSlide02 } from "@/components/reference-slides/SustainabilityOverview02";
import { RecreatedSlide03 } from "@/components/reference-slides/SustainabilityOverview03";
import { RecreatedSlide04 } from "@/components/reference-slides/SustainabilityOverview04";

export interface ReferenceSlideEntry {
  /** The slide number as it appears in an item's `sourceSlides` array. */
  slideNumber: number;
  /** Short label shown above the exhibit in the pack preview. */
  label: string;
  /** The pixel-accurate React recreation, used for the live in-app preview. */
  Component: ComponentType;
}

export const REFERENCE_SLIDES: ReferenceSlideEntry[] = [
  { slideNumber: 1, label: "Centers of Excellence", Component: RecreatedSlide01 },
  { slideNumber: 2, label: "Sustainability leadership team", Component: RecreatedSlide02 },
  { slideNumber: 3, label: "Four critical solutions", Component: RecreatedSlide03 },
  { slideNumber: 4, label: "Global office footprint", Component: RecreatedSlide04 },
];

const REFERENCE_SLIDES_BY_NUMBER = new Map(
  REFERENCE_SLIDES.map((entry) => [entry.slideNumber, entry]),
);

export function getReferenceSlide(slideNumber: number): ReferenceSlideEntry | undefined {
  return REFERENCE_SLIDES_BY_NUMBER.get(slideNumber);
}
