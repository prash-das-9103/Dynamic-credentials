"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe, Factory, TrendingUp, Shuffle, BookOpen, Users } from "lucide-react";
import type { PracticeArea } from "@/data/practice-areas";
import { EXPERTS } from "@/data/experts";

interface Props {
  practiceArea: PracticeArea;
}

const CAPABILITY_ICONS = {
  globe: Globe,
  factory: Factory,
  "trending-up": TrendingUp,
  shuffle: Shuffle,
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function PracticeAreaSection({ practiceArea: p }: Props) {
  const expertHref = `/experts?expertise=${encodeURIComponent(p.name)}`;

  return (
    <div className="overflow-hidden rounded border border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-foreground text-[13px] font-bold text-background"
          aria-hidden="true"
        >
          X
        </div>
        <h3 className="text-[16px] font-semibold text-foreground">{p.name}</h3>
        <span className="rounded border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Transition Strategy
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-[180px_1fr_1fr]">
        {/* Hero image */}
        <div className="relative hidden aspect-[3/4] overflow-hidden rounded lg:block">
          <Image src={p.heroImageSrc} alt={p.heroImageAlt} fill sizes="180px" className="object-cover" />
        </div>

        {/* Partnerships + IP */}
        <div className="space-y-6">
          <section>
            <h4 className="text-[13px] font-semibold italic text-[#CC0000]">
              Strong eco-system partnerships
            </h4>

            {p.processSteps && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {p.processSteps.map((step, i) => (
                  <div key={step} className="flex items-center gap-1.5">
                    <span className="rounded border border-border bg-secondary/40 px-2 py-1 text-[10px] font-medium leading-tight text-foreground">
                      {step}
                    </span>
                    {i < p.processSteps!.length - 1 && (
                      <ArrowRight size={10} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {p.capabilities && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                {p.capabilities.map((cap) => {
                  const Icon = CAPABILITY_ICONS[cap.icon];
                  return (
                    <div key={cap.label} className="flex flex-col items-center gap-1.5 text-center">
                      <Icon size={18} className="text-[#CC0000]" aria-hidden="true" />
                      <span className="text-[10px] font-medium leading-tight text-foreground">
                        {cap.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-3 space-y-2.5 border-t border-border pt-3">
              {p.tools.map((tool) => (
                <div key={tool.name}>
                  {tool.partnerId ? (
                    <Link
                      href={`/ecosystem?partner=${tool.partnerId}`}
                      className="text-[12px] font-semibold text-foreground hover:underline"
                    >
                      {tool.name}
                    </Link>
                  ) : (
                    <p className="text-[12px] font-semibold text-foreground">{tool.name}</p>
                  )}
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-[13px] font-semibold italic text-[#CC0000]">
              Cutting-edge IP and coalitions
            </h4>
            <ul className="mt-2 space-y-1.5">
              {p.ipItems.map((ip) => (
                <li key={ip.title} className="flex items-start gap-1.5 text-[11px] leading-snug text-foreground">
                  <BookOpen size={11} className="mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  {ip.title}
                </li>
              ))}
            </ul>

            {p.coalitions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.coalitions.map((c) => (
                  <span
                    key={c}
                    className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}

            {p.specialCallout && (
              <div className="mt-3 flex items-center gap-2 rounded border border-border bg-secondary/40 px-2.5 py-2">
                <span className="rounded bg-foreground px-1.5 py-0.5 text-[9px] font-bold uppercase text-background">
                  {p.specialCallout.badge}
                </span>
                <span className="text-[11px] leading-snug text-foreground">{p.specialCallout.description}</span>
              </div>
            )}
          </section>
        </div>

        {/* Leading experts */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-[13px] font-semibold italic text-[#CC0000]">Leading experts</h4>
            <Link
              href={expertHref}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
            >
              <Users size={11} aria-hidden="true" />
              View all {p.experts.length}
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {p.experts.map((e) => {
              const record = EXPERTS.find((x) => x.id === e.expertId);
              return (
                <Link
                  key={e.expertId}
                  href={expertHref}
                  className="group flex items-start gap-2.5 rounded border border-border bg-card p-2.5 transition-colors hover:border-foreground/30"
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background"
                    aria-hidden="true"
                  >
                    {getInitials(e.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold leading-tight text-foreground truncate">
                      {e.name}
                    </p>
                    <p className="text-[10px] leading-tight text-muted-foreground truncate">
                      {record?.title || e.title}
                    </p>
                    <p className="mt-1 text-[10px] leading-snug text-[#CC0000] line-clamp-2">
                      {e.caption}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
