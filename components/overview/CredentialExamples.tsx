"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { CREDENTIAL_EXAMPLES, OVERVIEW_SOLUTIONS } from "@/data/overview";

const SOLUTION_COLOR: Record<string, string> = {
  "transition-strategy": "#1a5276",
  "sustainability-value-creation": "#1e6b3e",
  "circular-value-creation": "#CC0000",
  "resilience-adaptation": "#6b3a2a",
};

export function CredentialExamples() {
  return (
    <section aria-labelledby="examples-heading">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Selected engagements
          </p>
          <h2
            id="examples-heading"
            className="text-[20px] font-bold text-foreground"
          >
            Examples of our impact
          </h2>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Anonymised. Client identities are not disclosed in this view.
          </p>
        </div>
        <Link
          href="/credentials"
          className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
        >
          All credentials <ArrowRight size={11} aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {CREDENTIAL_EXAMPLES.map((cred) => {
          const sol = OVERVIEW_SOLUTIONS.find((s) => s.id === cred.solutionId);
          const accent = cred.solutionId
            ? (SOLUTION_COLOR[cred.solutionId] ?? "#CC0000")
            : "#CC0000";

          return (
            <div
              key={cred.id}
              className="border border-border bg-card flex flex-col"
            >
              {/* Top accent bar */}
              <div
                className="h-0.5 w-full"
                style={{ backgroundColor: accent }}
                aria-hidden="true"
              />

              <div className="flex flex-col flex-1 p-4">
                {/* Solution tag */}
                {sol && (
                  <p
                    className="mb-1 text-[10px] font-semibold uppercase tracking-wide"
                    style={{ color: accent }}
                  >
                    {sol.label}
                  </p>
                )}

                {/* Title */}
                <h3 className="mb-1 text-[13px] font-semibold text-foreground leading-snug">
                  {cred.title}
                </h3>

                {/* City */}
                <div className="mb-3 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MapPin size={10} aria-hidden="true" />
                  {cred.city}
                </div>

                {/* Description */}
                <p className="flex-1 text-[12px] leading-relaxed text-muted-foreground">
                  {cred.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
