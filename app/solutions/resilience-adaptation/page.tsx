"use client";

import { AppShell } from "@/components/AppShell";
import { SOLUTION_CONFIGS } from "@/data/solution-config";
import {
  getPartnersForSolutions,
  getPublicationsForSolutions,
  getExpertsForSolutions,
} from "@/data/solution-config";
import { SOLUTION_NEED_COLUMNS, SOLUTION_PROPRIETARY_TOOLS } from "@/data/solution-page-content";
import { SolutionHero } from "@/components/solutions/SolutionHero";
import { ProductsOverview } from "@/components/solutions/ProductsOverview";
import { CaseAnalyticsPreview } from "@/components/solutions/CaseAnalyticsPreview";
import { EcosystemPreview } from "@/components/solutions/EcosystemPreview";
import { ProprietaryToolsStrip } from "@/components/solutions/ProprietaryToolsStrip";

const SOLUTION_ID = "resilience-adaptation" as const;
const config = SOLUTION_CONFIGS[SOLUTION_ID];
const needColumns = SOLUTION_NEED_COLUMNS[SOLUTION_ID] ?? [];
const proprietaryTools = SOLUTION_PROPRIETARY_TOOLS[SOLUTION_ID] ?? [];

const partners = getPartnersForSolutions([SOLUTION_ID]);
const publications = getPublicationsForSolutions([SOLUTION_ID]);
const experts = getExpertsForSolutions([SOLUTION_ID]);

export default function ResilienceAdaptationPage() {
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
            <CaseAnalyticsPreview caseSolutionLabel="Resilience & Adaptation" />
          </section>

          {/* ── Our proprietary tools ────────────────────────────────────── */}
          {proprietaryTools.length > 0 && (
            <section>
              <h3 className="mb-3 text-[16px] font-semibold text-foreground">
                Our proprietary tools
              </h3>
              <ProprietaryToolsStrip tools={proprietaryTools} accentColor={config.accentColor} />
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
