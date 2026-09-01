"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { OVERVIEW_SOLUTIONS } from "@/data/overview";

const SOLUTION_ACCENTS: Record<string, string> = {
  "transition-strategy": "#1a5276",          // deep navy
  "sustainability-value-creation": "#1e6b3e", // forest green
  "circular-value-creation": "#CC0000",       // Bain red
  "resilience-adaptation": "#6b3a2a",         // terracotta
};

export function SolutionGateway() {
  return (
    <section id="solutions" aria-labelledby="solutions-heading">
      {/* Section header */}
      <div className="mb-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Practice structure
        </p>
        <h2
          id="solutions-heading"
          className="text-[20px] font-bold text-foreground"
        >
          Four Sustainability Solutions
        </h2>
        <p className="mt-1.5 max-w-2xl text-[13px] text-muted-foreground text-pretty">
          Each solution has its own expert team, credential set, and product
          frameworks. The case counts below are historical figures derived from
          slide data (2021–2025) and are separate from live workbook analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {OVERVIEW_SOLUTIONS.map((sol) => {
          const accent = SOLUTION_ACCENTS[sol.id] ?? "#CC0000";
          return (
            <div
              key={sol.id}
              className="group flex flex-col border border-border bg-card"
            >
              {/* Top accent bar */}
              <div
                className="h-0.5 w-full"
                style={{ backgroundColor: accent }}
                aria-hidden="true"
              />

              <div className="flex flex-1 flex-col p-4">
                {/* Tagline */}
                <p
                  className="mb-1 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: accent }}
                >
                  {sol.tagline}
                </p>

                {/* Solution name */}
                <h3 className="mb-2 text-[14px] font-bold leading-snug text-foreground">
                  {sol.label}
                </h3>

                {/* Description */}
                <p className="mb-4 flex-1 text-[12px] leading-relaxed text-muted-foreground">
                  {sol.description}
                </p>

                {/* Historical case count — clearly labelled as slide-derived */}
                <div className="mb-4 border-t border-border pt-3">
                  <span
                    className="text-[22px] font-bold leading-none"
                    style={{ color: accent }}
                  >
                    {sol.historicalCaseCount}
                  </span>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    cases since 2021
                  </p>
                  <p className="mt-1 text-[10px] italic text-muted-foreground/70">
                    Slide-derived. Does not update from the live database.
                  </p>
                </div>

                {/* CTA */}
                <Link
                  href={sol.href}
                  className="flex items-center gap-1 text-[12px] font-medium transition-colors hover:underline"
                  style={{ color: accent }}
                >
                  {sol.ctaLabel ?? "View credentials"}
                  <ArrowRight size={11} aria-hidden="true" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
