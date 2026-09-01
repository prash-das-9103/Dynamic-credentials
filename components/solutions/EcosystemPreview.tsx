"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, BookOpen } from "lucide-react";
import type { Expert, Partner, Publication } from "@/types/credentials";

interface Props {
  solutionId: string;
  partners: Partner[];
  publications: Publication[];
  experts: Expert[];
}

const PREVIEW_COUNT = 6;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function SectionHeader({
  title,
  count,
  href,
}: {
  title: string;
  count: number;
  href: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-[14px] font-semibold text-foreground">{title}</h3>
      {count > PREVIEW_COUNT && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground"
        >
          View all {count}
          <ArrowRight size={11} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

export function EcosystemPreview({ solutionId, partners, publications, experts }: Props) {
  const solutionParam = `solution=${encodeURIComponent(solutionId)}`;

  return (
    <div className="space-y-8">
      {/* Ecosystem partners */}
      <section>
        <SectionHeader
          title="Ecosystem partners"
          count={partners.length}
          href={`/ecosystem?${solutionParam}`}
        />
        {partners.length === 0 ? (
          <p className="text-[12px] text-muted-foreground">No partners tagged to this solution yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {partners.slice(0, PREVIEW_COUNT).map((p) => (
              <Link
                key={p.id}
                href={`/ecosystem?${solutionParam}`}
                className="group rounded border border-border bg-card p-3.5 transition-colors hover:border-foreground/30"
              >
                <p className="text-[13px] font-semibold text-foreground leading-snug">{p.name}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{p.category}</p>
                <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Cutting-edge IP */}
      <section>
        <SectionHeader
          title="Cutting-edge IP"
          count={publications.length}
          href={`/publications?${solutionParam}`}
        />
        {publications.length === 0 ? (
          <p className="text-[12px] text-muted-foreground">No publications tagged to this solution yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {publications.slice(0, PREVIEW_COUNT).map((pub) => (
              <Link
                key={pub.id}
                href={`/publications?${solutionParam}`}
                className="group flex flex-col rounded border border-border bg-card p-3.5 transition-colors hover:border-foreground/30"
              >
                <div className="mb-1.5 flex items-center gap-1.5">
                  <BookOpen size={11} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {pub.publicationType}
                    {pub.year ? ` · ${pub.year}` : ""}
                  </span>
                </div>
                <p className="text-[13px] font-semibold leading-snug text-foreground">{pub.title}</p>
                <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                  {pub.abstract}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Leading experts */}
      <section>
        <SectionHeader
          title="Leading experts"
          count={experts.length}
          href={`/experts?${solutionParam}`}
        />
        {experts.length === 0 ? (
          <p className="text-[12px] text-muted-foreground">No experts tagged to this solution yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {experts.slice(0, PREVIEW_COUNT).map((e) => {
              const descriptor = e.leadership[0]?.label ?? e.expertise[0] ?? e.title;
              return (
                <Link
                  key={e.id}
                  href={`/experts?${solutionParam}`}
                  className="group flex items-start gap-3 rounded border border-border bg-card p-3.5 transition-colors hover:border-foreground/30"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-[12px] font-bold text-background"
                    aria-hidden="true"
                  >
                    {getInitials(e.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold leading-tight text-foreground truncate">
                      {e.name}
                    </p>
                    <p className="text-[11px] leading-tight text-muted-foreground truncate">{e.title}</p>
                    {descriptor && (
                      <p className="mt-1 text-[11px] leading-snug text-[#CC0000] line-clamp-2">
                        {descriptor}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <Link
        href={`/credentials?${solutionParam}`}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-foreground hover:underline"
      >
        View all credentials for this solution
        <ExternalLink size={12} aria-hidden="true" />
      </Link>
    </div>
  );
}
