"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Credential } from "@/types/credentials";
import { PRODUCTS, INDUSTRIES } from "@/data/solutions";
import { ConfidentialityBadge } from "@/components/ConfidentialityBadge";

interface Props {
  credential: Credential;
}

function lookup(arr: { id: string; label: string }[], id: string) {
  return arr.find((a) => a.id === id)?.label ?? id;
}

export function RelatedCredentialRow({ credential }: Props) {
  const primaryProduct = credential.productIds[0]
    ? lookup(PRODUCTS, credential.productIds[0])
    : null;
  const primaryIndustry = credential.industryIds[0]
    ? lookup(INDUSTRIES, credential.industryIds[0])
    : null;

  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-0 hover:bg-secondary/50 transition-colors">
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-[13px] font-medium text-foreground truncate leading-tight">
          {credential.title}
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          {credential.clientAlias && (
            <span className="text-[11px] text-muted-foreground">{credential.clientAlias}</span>
          )}
          {primaryProduct && (
            <span className="text-[11px] text-muted-foreground">· {primaryProduct}</span>
          )}
          {primaryIndustry && (
            <span className="text-[11px] text-muted-foreground">· {primaryIndustry}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <ConfidentialityBadge value={credential.confidentiality} />
        <Link
          href={`/credentials?credential=${credential.id}`}
          className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground rounded"
          aria-label={`View credential: ${credential.title}`}
        >
          View
          <ArrowRight size={12} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
