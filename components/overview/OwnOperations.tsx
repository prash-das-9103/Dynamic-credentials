"use client";

import {
  OWN_OPERATIONS_METRICS,
  OWN_OPERATIONS_CONTEXT,
} from "@/data/overview";
import { TimeSensitiveBanner } from "./SectionReviewBanner";

export function OwnOperations() {
  return (
    <section aria-labelledby="own-ops-heading" className="border-t border-border pt-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left — narrative */}
        <div className="lg:col-span-1">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Bain&apos;s own commitment
          </p>
          <h2
            id="own-ops-heading"
            className="mb-3 text-[20px] font-bold leading-snug text-foreground"
          >
            {OWN_OPERATIONS_CONTEXT.heading}
          </h2>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {OWN_OPERATIONS_CONTEXT.subCopy}
          </p>
          <p className="mt-3 text-[11px] text-muted-foreground/60">
            Last updated: {OWN_OPERATIONS_CONTEXT.lastUpdated}
          </p>
        </div>

        {/* Right — metrics grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {OWN_OPERATIONS_METRICS.map((m) => (
              <div
                key={m.id}
                className="border border-border bg-card p-4"
              >
                <div className="mb-0.5 flex items-start justify-between gap-1">
                  <span className="text-[22px] font-bold leading-none text-foreground">
                    {m.value}
                  </span>
                  {m.timeSensitive && (
                    <span className="mt-0.5 shrink-0 rounded bg-sky-500/10 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
                      Live
                    </span>
                  )}
                </div>
                {m.unit && (
                  <div className="text-[11px] text-muted-foreground">{m.unit}</div>
                )}
                <div className="mt-1 text-[11px] font-medium text-foreground/80 leading-snug">
                  {m.label}
                </div>
                {m.year && (
                  <div className="text-[10px] text-muted-foreground">{m.year}</div>
                )}
                {m.note && (
                  <p className="mt-1.5 text-[10px] leading-snug text-muted-foreground/70">
                    {m.note}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            <TimeSensitiveBanner asOfDate={OWN_OPERATIONS_CONTEXT.lastUpdated} />
          </div>
        </div>
      </div>
    </section>
  );
}
