"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ExternalLink } from "lucide-react";

const SLIDES = [
  { id: "05", label: "Sustainability Hype Line Chart", href: "/reference-slides/sustainability-overview/05" },
  { id: "06", label: "Do-Say Gap", href: "/reference-slides/sustainability-overview/06" },
  { id: "07", label: "Do Is Accelerating", href: "/reference-slides/sustainability-overview/07" },
  { id: "08", label: "Say Is Evolving", href: "/reference-slides/sustainability-overview/08" },
  { id: "09", label: "Challenges Persist", href: "/reference-slides/sustainability-overview/09" },
  { id: "10", label: "CEOs Must Act V1", href: "/reference-slides/sustainability-overview/10" },
  { id: "11", label: "CEOs Must Act V2", href: "/reference-slides/sustainability-overview/11" },
  { id: "13", label: "Differentiated Offering", href: "/reference-slides/sustainability-overview/13" },
  { id: "14", label: "Frontrunners Competitive Advantage", href: "/reference-slides/sustainability-overview/14" },
  { id: "15", label: "Four Solutions Frameworks", href: "/reference-slides/sustainability-overview/15" },
  { id: "16", label: "3,750+ Projects", href: "/reference-slides/sustainability-overview/16" },
  { id: "17", label: "Global Experience Chart", href: "/reference-slides/sustainability-overview/17" },
  { id: "18", label: "Positive Impact Examples", href: "/reference-slides/sustainability-overview/18" },
  { id: "19", label: "Proven Success Stories", href: "/reference-slides/sustainability-overview/19" },
  { id: "12", label: "Iris Links", href: "/reference-slides/sustainability-overview/12" },
  { id: "20", label: "WEF Collaboration", href: "/reference-slides/sustainability-overview/20" },
  { id: "21", label: "AI Pioneers", href: "/reference-slides/sustainability-overview/21" },
  { id: "22", label: "Analyst Recognition", href: "/reference-slides/sustainability-overview/22" },
  { id: "23", label: "Carbon Emissions & Sustainability Commitments", href: "/reference-slides/sustainability-overview/23" },
  { id: "01", label: "Centers of Excellence", href: "/reference-slides/sustainability-overview/01" },
  { id: "02", label: "Leadership Team", href: "/reference-slides/sustainability-overview/02" },
  { id: "03", label: "Four Critical Solutions", href: "/reference-slides/sustainability-overview/03" },
  { id: "04", label: "40+ Offices", href: "/reference-slides/sustainability-overview/04" },
];

export default function ReferenceSlidesIndex() {
  return (
    <AppShell
      title="Reference Slides"
      breadcrumb={[
        { label: "Sustainability Practice" },
        { label: "Reference Slides" },
      ]}
    >
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8 pb-20">
          <p className="mb-8 text-sm text-muted-foreground">
            Pixel-accurate recreations of the source slide deck.
          </p>

          <div className="grid gap-8">
            {SLIDES.map((slide) => (
              <div key={slide.id} className="space-y-2">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">
                    Slide {slide.id} — {slide.label}
                  </h2>
                  <Link
                    href={slide.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded border border-border px-2.5 py-1 text-[12px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    <ExternalLink size={12} />
                    Open full screen
                  </Link>
                </div>

                {/* Iframe preview — 16:9 aspect ratio matching 1280×720 */}
                <div
                  className="w-full overflow-hidden rounded border border-border bg-muted"
                  style={{ aspectRatio: "16 / 9" }}
                >
                  <iframe
                    src={slide.href}
                    title={`Slide ${slide.id} — ${slide.label}`}
                    className="h-full w-full"
                    style={{ border: "none" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
