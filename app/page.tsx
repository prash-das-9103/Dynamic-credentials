"use client";

import { AppShell } from "@/components/AppShell";
import { OverviewHero } from "@/components/overview/OverviewHero";
import { MarketContext } from "@/components/overview/MarketContext";
import { ActionFramework } from "@/components/overview/ActionFramework";
import { SolutionGateway } from "@/components/overview/SolutionGateway";
import { OverviewDifferentiators } from "@/components/overview/OverviewDifferentiators";
import { AnalystRecognition } from "@/components/overview/AnalystRecognition";
import { CredentialExamples } from "@/components/overview/CredentialExamples";
import { WEFCapability } from "@/components/overview/WEFCapability";
import { OwnOperations } from "@/components/overview/OwnOperations";
import { HelpdeskContact } from "@/components/overview/HelpdeskContact";

export default function OverviewPage() {
  return (
    <AppShell
      title="Overview"
      breadcrumb={[{ label: "Sustainability Practice" }, { label: "Overview" }]}
    >
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-14 px-6 py-8 pb-20">
          {/* 1 — Hero */}
          <OverviewHero />

          {/* 2 — Market context: Do–Say gap + CEO priority index */}
          <MarketContext />

          {/* 3 — Four Solutions gateway */}
          <SolutionGateway />

          {/* 4 — CEO action framework (3 pillars) */}
          <ActionFramework />

          {/* 5 — Differentiators */}
          <OverviewDifferentiators />

          {/* 6 — WEF AI collaboration */}
          <WEFCapability />

          {/* 7 — Selected credential examples */}
          <CredentialExamples />

          {/* 8 — Bain's own sustainability commitments */}
          <OwnOperations />

          {/* 9 — Analyst recognition */}
          <AnalystRecognition />

          {/* 10 — Helpdesk contact */}
          <HelpdeskContact />
        </div>
      </div>
    </AppShell>
  );
}
