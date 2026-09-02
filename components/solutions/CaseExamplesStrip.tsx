"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseExample } from "@/data/case-examples";

interface Props {
  examples: CaseExample[];
  basePath: string;
}

function stripBold(text: string) {
  return text.replace(/\*\*/g, "");
}

export function CaseExamplesStrip({ examples, basePath }: Props) {
  if (examples.length === 0) {
    return (
      <div className="rounded border border-dashed border-border py-8 text-center text-[13px] text-muted-foreground">
        No case examples tagged to this solution yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {examples.map((example) => (
        <Link
          key={example.id}
          href={`${basePath}/${example.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/30"
        >
          <div className="mb-2 flex items-center gap-1.5">
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {example.industry}
            </span>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {example.year}
            </span>
          </div>
          <h4 className="mb-1 text-[13px] font-semibold leading-snug text-foreground">
            <span className="text-[#cc0000]">{example.titleAccent}</span>
            <span className="text-foreground"> — {example.titleRest}</span>
          </h4>
          <p className="mb-3 line-clamp-2 flex-1 text-[12px] leading-relaxed text-muted-foreground">
            {stripBold(example.situation[0]?.text ?? "")}
          </p>
          <span className="mt-auto inline-flex items-center gap-1 text-[11px] font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
            View full slide
            <ArrowUpRight size={11} aria-hidden="true" />
          </span>
        </Link>
      ))}
    </div>
  );
}
