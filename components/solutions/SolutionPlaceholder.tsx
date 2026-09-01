import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SolutionConfig } from "@/data/solution-config";
import {
  getPartnersForSolutions,
  getPublicationsForSolutions,
  getExpertsForSolutions,
  getCredentialsForSolutions,
} from "@/data/solution-config";

interface Props {
  config: SolutionConfig;
}

export function SolutionPlaceholder({ config }: Props) {
  const solutionParam = `solution=${encodeURIComponent(config.id)}`;
  const partnerCount = getPartnersForSolutions([config.id]).length;
  const publicationCount = getPublicationsForSolutions([config.id]).length;
  const expertCount = getExpertsForSolutions([config.id]).length;
  const credentialCount = getCredentialsForSolutions([config.id]).length;

  const links = [
    { label: `${partnerCount} ecosystem partners`, href: `/ecosystem?${solutionParam}` },
    { label: `${publicationCount} publications`, href: `/publications?${solutionParam}` },
    { label: `${expertCount} experts`, href: `/experts?${solutionParam}` },
    { label: `${credentialCount} credentials`, href: `/credentials?${solutionParam}` },
    { label: "Analytics", href: `/analytics?cs=${encodeURIComponent(config.name)}` },
  ];

  return (
    <div className="rounded border border-dashed border-border px-6 py-10 text-center">
      <p className="text-[13px] text-muted-foreground">
        A full narrative deep-dive for this solution hasn&apos;t been built yet. In the meantime, jump
        straight into the filtered views below.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-secondary transition-colors"
          >
            {l.label}
            <ArrowRight size={11} aria-hidden="true" />
          </Link>
        ))}
      </div>
    </div>
  );
}
