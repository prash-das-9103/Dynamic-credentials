"use client";

import { TrendingUp } from "lucide-react";
import type { CaseTakeaway } from "@/lib/case-analytics";

interface Props {
  takeaways: CaseTakeaway[];
}

export function CaseTakeaways({ takeaways }: Props) {
  if (!takeaways.length) return null;
  return (
    <div className="rounded border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp size={13} className="text-muted-foreground" aria-hidden />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Key Observations
        </span>
      </div>
      <ul className="space-y-1.5">
        {takeaways.map((t, i) => (
          <li key={i} className="flex items-start gap-2 text-[12px] text-foreground">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#CC0000]" aria-hidden />
            {t.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
