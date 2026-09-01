"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ACTION_PILLARS } from "@/data/overview";

export function ActionFramework() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section aria-labelledby="framework-heading">
      <div className="mb-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Strategic framework
        </p>
        <h2
          id="framework-heading"
          className="text-[20px] font-bold text-foreground"
        >
          With 2030 targets on the horizon, CEOs must take action
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-0 sm:grid-cols-3">
        {ACTION_PILLARS.map((pillar, idx) => {
          const isLast = idx === ACTION_PILLARS.length - 1;
          const isOpen = expanded === pillar.id;

          return (
            <div
              key={pillar.id}
              className={`border-t border-border sm:border-t-0 sm:border-l first:sm:border-l-0 ${
                !isLast ? "border-b sm:border-b-0 sm:border-r-0" : ""
              } flex flex-col`}
            >
              {/* Header band */}
              <div className="border-b border-border bg-foreground px-5 py-4">
                <div className="text-[36px] font-bold leading-none text-background/30">
                  {pillar.number}
                </div>
                <div className="mt-1 text-[15px] font-bold leading-snug text-background">
                  <span className="font-extrabold">
                    {pillar.heading.split(" ")[0]}
                  </span>{" "}
                  {pillar.heading.split(" ").slice(1).join(" ")}
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {pillar.summary}
                </p>

                {/* Expandable sub-steps */}
                <button
                  onClick={() =>
                    setExpanded(isOpen ? null : pillar.id)
                  }
                  className="mt-4 flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors self-start"
                  aria-expanded={isOpen}
                >
                  {isOpen ? (
                    <>
                      <ChevronUp size={12} aria-hidden="true" /> Hide sub-steps
                    </>
                  ) : (
                    <>
                      <ChevronDown size={12} aria-hidden="true" /> Show sub-steps
                    </>
                  )}
                </button>

                {isOpen && (
                  <ul className="mt-3 space-y-2">
                    {pillar.subSteps.map((step) => (
                      <li
                        key={step}
                        className="flex items-start gap-2 text-[12px] text-muted-foreground"
                      >
                        <span
                          className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#CC0000]"
                          aria-hidden="true"
                        />
                        {step}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
