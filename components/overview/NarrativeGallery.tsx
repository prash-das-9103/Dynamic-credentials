"use client";

/**
 * components/overview/NarrativeGallery.tsx
 *
 * Replaces the old hand-built MarketContext charts with the real
 * market-narrative slides extracted from the source deck (data/narrative-
 * slides.ts — exact text, shapes, images, and chart data, not a visual
 * approximation). Each card previews the slide pixel-for-pixel via
 * NarrativeSlideCanvas and can be added to the pack individually, so what's
 * shown here is exactly what a prepared pack downloads as.
 */

import { Plus, Check } from "lucide-react";
import { getAllNarrativeSlides } from "@/data/narrative-slides";
import { NarrativeSlideCanvas } from "@/components/narrative-slide/NarrativeSlideCanvas";
import { usePackContext } from "@/lib/pack-context";
import { cn } from "@/lib/utils";

function AddSlideToPackButton({
  slideNumber,
  title,
}: {
  slideNumber: number;
  title: string;
}) {
  const { addItem, removeItem, hasItem } = usePackContext();
  const id = `ov-narrative-slide-${slideNumber}`;
  const inPack = hasItem(id);

  function toggle() {
    if (inPack) {
      removeItem(id);
    } else {
      addItem({
        id,
        itemType: "narrative-slide",
        title,
        exportRestricted: false,
        section: "overview",
        slideNumber,
      });
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={inPack}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded border px-2.5 py-1 text-[11px] font-medium transition-colors",
        inPack
          ? "border-[#CC0000]/30 bg-[#CC0000]/10 text-[#CC0000]"
          : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
      )}
    >
      {inPack ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
      {inPack ? "Added to pack" : "Add to pack"}
    </button>
  );
}

export function NarrativeGallery() {
  const entries = getAllNarrativeSlides();

  return (
    <section aria-labelledby="market-context-heading">
      <div className="mb-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Market context
        </p>
        <h2
          id="market-context-heading"
          className="text-[20px] font-bold text-foreground"
        >
          CEOs speak less about sustainability — but act more
        </h2>
        <p className="mt-1.5 max-w-2xl text-[13px] text-muted-foreground">
          The full market-narrative sequence from the source deck — why
          sustainability matters, the Do&ndash;Say gap, and what CEOs must do
          next. Select any slide, or several, to add it verbatim to a pack.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {entries.map((entry) => (
          <div
            key={entry.data.slideNumber}
            className="flex flex-col overflow-hidden rounded border border-border bg-card"
          >
            <div className="border-b border-border bg-[#F2F2F2] p-2">
              <NarrativeSlideCanvas slide={entry.data} />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Slide {entry.data.slideNumber}
              </p>
              <p className="text-[13px] font-semibold leading-snug text-foreground">
                {entry.label}
              </p>
              <p className="flex-1 text-[11px] leading-snug text-muted-foreground">
                {entry.description}
              </p>
              <div className="pt-1">
                <AddSlideToPackButton
                  slideNumber={entry.data.slideNumber}
                  title={entry.label}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
