"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SOLUTION_CONFIGS } from "@/data/solution-config";
import {
  getPartnersForSolutions,
  getPublicationsForSolutions,
  getExpertsForSolutions,
} from "@/data/solution-config";
import { SOLUTION_NEED_COLUMNS } from "@/data/solution-page-content";
import { SolutionHero } from "@/components/solutions/SolutionHero";
import { ProductsOverview } from "@/components/solutions/ProductsOverview";
import { CaseAnalyticsPreview } from "@/components/solutions/CaseAnalyticsPreview";
import { CaseExamplesStrip } from "@/components/solutions/CaseExamplesStrip";
import { EcosystemPreview } from "@/components/solutions/EcosystemPreview";
import { getCaseExamplesForSolutions, getFeaturedCaseExamples } from "@/data/case-examples";

const SOLUTION_ID = "sustainability-value-creation" as const;
const CASE_EXAMPLES_BASE_PATH = "/solutions/sustainability-value-creation/case-examples";
const FEATURED_CASE_EXAMPLE_LIMIT = 15;

const config = SOLUTION_CONFIGS[SOLUTION_ID];
const needColumns = SOLUTION_NEED_COLUMNS[SOLUTION_ID] ?? [];

const partners = getPartnersForSolutions([SOLUTION_ID]);
const publications = getPublicationsForSolutions([SOLUTION_ID]);
const experts = getExpertsForSolutions([SOLUTION_ID]);
const allCaseExamples = getCaseExamplesForSolutions([SOLUTION_ID]);
const caseExamples = getFeaturedCaseExamples(allCaseExamples, FEATURED_CASE_EXAMPLE_LIMIT);

export default function SustainabilityValueCreationPage() {
  return (
    <AppShell
      title={config.name}
      breadcrumb={[
        { label: "Overview", href: "/" },
        { label: "Solutions" },
        { label: config.name },
      ]}
    >
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-8 px-6 py-6">
          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <SolutionHero config={config} />

          {/* ── Client needs & products ─────────────────────────────────── */}
          {needColumns.length > 0 && (
            <section>
              <h3 className="mb-3 text-[16px] font-semibold text-foreground">
                Client needs &amp; products
              </h3>
              <ProductsOverview columns={needColumns} accentColor={config.accentColor} />
            </section>
          )}

          {/* ── Case analytics ──────────────────────────────────────────── */}
          <section>
            <h3 className="mb-3 text-[16px] font-semibold text-foreground">
              Recent sustainability cases
            </h3>
            <CaseAnalyticsPreview caseSolutionLabel="Sustainability Value Creation" />
          </section>

          {/* ── Case examples ────────────────────────────────────────────── */}
          {caseExamples.length > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-[16px] font-semibold text-foreground">Case examples</h3>
                {allCaseExamples.length > caseExamples.length && (
                  <Link
                    href={`${CASE_EXAMPLES_BASE_PATH}`}
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground"
                  >
                    View all {allCaseExamples.length}
                    <ArrowRight size={11} aria-hidden="true" />
                  </Link>
                )}
              </div>
              <CaseExamplesStrip
                examples={caseExamples}
                basePath="/solutions/sustainability-value-creation/case-examples"
              />
            </section>
          )}

          {/* ── Ecosystem, IP & experts ─────────────────────────────────── */}
          <section>
            <h3 className="mb-3 text-[16px] font-semibold text-foreground">
              Ecosystem, IP &amp; experts
            </h3>
            <EcosystemPreview
              solutionId={SOLUTION_ID}
              partners={partners}
              publications={publications}
              experts={experts}
            />
          </section>
        </div>
      </div>
    </AppShell>
  );
}
