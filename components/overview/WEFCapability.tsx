"use client";

import {
  CAPABILITY_PROOF_POINTS,
  WEF_MISSION_PILLARS,
  FIRM_AI_STATS,
  FIRM_AI_TEAM,
  AI_ECOSYSTEM_PARTNERS,
  AI_ACQUISITIONS,
} from "@/data/overview";
import { TimeSensitiveBanner } from "./SectionReviewBanner";
import { Recycle, PenTool, Users, Search, type LucideIcon } from "lucide-react";

const PILLAR_ICONS: Record<string, LucideIcon> = {
  "pillar-resource-use": Recycle,
  "pillar-product-design": PenTool,
  "pillar-employee-wellbeing": Users,
  "pillar-supply-chain": Search,
};

export function WEFCapability() {
  // Only the sustainability-AI WEF collaboration is shown on this page
  const wef = CAPABILITY_PROOF_POINTS.find((c) => c.id === "cpp-wef-collaboration");
  if (!wef) return null;

  return (
    <section aria-labelledby="wef-heading">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left label block */}
        <div className="lg:col-span-2">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            AI &amp; sustainability
          </p>
          <h2
            id="wef-heading"
            className="mb-3 text-[20px] font-bold text-foreground leading-snug"
          >
            AI for Sustainable Future
          </h2>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Collaboration with the World Economic Forum on building AI-powered
            tools for Sustainability.
          </p>
        </div>

        {/* Right content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Mission & pillars */}
          <div className="border border-border bg-card p-6">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Mission
            </p>
            <p className="mb-4 text-[13px] leading-relaxed text-foreground">
              The project aims to identify, shortlist, prototype and codify
              tangible AI and technology-based solutions to accelerate
              sustainability across key sectors.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {WEF_MISSION_PILLARS.map((pillar) => {
                const Icon = PILLAR_ICONS[pillar.id] ?? Recycle;
                return (
                  <div
                    key={pillar.id}
                    className="flex items-center gap-2.5 border border-border bg-muted/40 px-3 py-2.5"
                  >
                    <Icon size={15} className="shrink-0 text-muted-foreground" />
                    <span className="text-[11.5px] font-medium leading-snug text-foreground">
                      {pillar.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Platforms stat card */}
          <div className="border border-border bg-card p-6 space-y-4">
            {/* Stat */}
            <div className="flex items-baseline gap-2">
              <span className="text-[36px] font-bold leading-none text-foreground">
                {wef.value}
              </span>
              <span className="text-[13px] text-muted-foreground">
                AI-powered sustainability platforms co-created
              </span>
            </div>

            {/* Description */}
            <p className="text-[13px] leading-relaxed text-muted-foreground border-t border-border pt-4">
              {wef.description}
            </p>

            {/* Warnings */}
            <div className="space-y-2 pt-2">
              <TimeSensitiveBanner asOfDate={wef.asOfDate} />
            </div>
          </div>
        </div>
      </div>

      {/* Firm-wide AI scale backing this work */}
      <div className="mt-4 border border-border bg-card p-6">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-[13px] font-semibold text-foreground">
            Backed by firm-wide AI scale
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Firm-wide AI capability, not sustainability-exclusive &mdash; shown here as context for this
            work.
          </p>
        </div>

        {/* Headline stats */}
        <div className="grid grid-cols-1 gap-4 border-b border-border pb-5 sm:grid-cols-3">
          {FIRM_AI_STATS.map((stat) => (
            <div key={stat.id}>
              <div className="text-[26px] font-bold leading-none text-foreground">
                {stat.value}
              </div>
              <div className="mt-1 text-[11.5px] leading-snug text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Ecosystem partnerships */}
        <div className="mt-5 border-b border-border pb-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Strong ecosystem of strategic alliances &amp; partnerships
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {AI_ECOSYSTEM_PARTNERS.map((partner) => (
              <div key={partner.id} className="border border-border bg-muted/40 p-3">
                <div className="text-[12px] font-semibold text-foreground">{partner.name}</div>
                <div className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                  {partner.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team scale + acquisitions */}
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Integrated multi-disciplinary teams
            </p>
            <div className="grid grid-cols-3 gap-3">
              {FIRM_AI_TEAM.map((stat) => (
                <div key={stat.id}>
                  <div className="text-[20px] font-bold leading-none text-foreground">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[10.5px] leading-snug text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Recent acquisitions to enhance AI capabilities
            </p>
            <div className="space-y-2">
              {AI_ACQUISITIONS.map((acq) => (
                <div key={acq.id} className="flex gap-2">
                  <span className="shrink-0 text-[12px] font-semibold text-foreground">
                    {acq.name}:
                  </span>
                  <span className="text-[11px] leading-snug text-muted-foreground">
                    {acq.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
