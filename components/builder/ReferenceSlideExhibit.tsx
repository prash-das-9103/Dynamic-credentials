"use client";

/**
 * components/builder/ReferenceSlideExhibit.tsx
 *
 * When a pack item cites a registered reference slide (data/reference-slides.ts),
 * the Pack Preview renders the actual reference slide here instead of a plain
 * bullet summary — the real content the item came from, not a paraphrase of it.
 *
 * Live-scales the pixel-accurate React recreation (1280x720, the same fixed
 * size used by every components/reference-slides/SustainabilityOverviewNN.tsx)
 * down to fit whatever width the pack deck's slide-page column happens to be,
 * via ResizeObserver + a CSS transform — so it stays pixel-identical to the
 * standalone /reference-slides view by construction, it's just the same
 * component rendered smaller.
 */

import { useEffect, useRef, useState } from "react";
import { getReferenceSlide } from "@/data/reference-slides";

// Fixed authoring size of every RecreatedSlideNN component — matches the
// local SLIDE_W/SLIDE_H constants inside components/reference-slides/*.tsx.
const NATIVE_W = 1280;
const NATIVE_H = 720;

export function ReferenceSlideExhibit({ slideNumber }: { slideNumber: number }) {
  const entry = getReferenceSlide(slideNumber);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setScale(width / NATIVE_W);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!entry) return null;
  const { Component } = entry;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-white"
      style={{ aspectRatio: `${NATIVE_W} / ${NATIVE_H}` }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: NATIVE_W,
          height: NATIVE_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <Component />
      </div>
    </div>
  );
}
