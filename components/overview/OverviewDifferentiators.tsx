"use client";

import { DIFFERENTIATORS } from "@/data/overview";
import { Shield, Brain, Globe, Users, Sparkles, Leaf } from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
  "diff-protect-value": Shield,
  "diff-deep-expertise": Brain,
  "diff-sector-shaping": Globe,
  "diff-global-team": Users,
  "diff-ai-expertise": Sparkles,
  "diff-own-operations": Leaf,
};

export function OverviewDifferentiators() {
  return (
    <section aria-labelledby="differentiators-heading">
      <div className="mb-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Our approach
        </p>
        <h2
          id="differentiators-heading"
          className="text-[20px] font-bold text-foreground"
        >
          A differentiated offering to our clients
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {DIFFERENTIATORS.map((d) => {
          const Icon = ICONS[d.id] ?? Shield;
          return (
            <div
              key={d.id}
              className="border border-border bg-card p-5 flex gap-3"
            >
              <div className="mt-0.5 shrink-0">
                <Icon size={16} className="text-muted-foreground" />
              </div>
              <div>
                <h3 className="mb-1.5 text-[13px] font-semibold text-foreground leading-snug">
                  {d.name}
                </h3>
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  {d.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
