"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SOLUTION_CONFIGS } from "@/data/solution-config";
import { CaseExamplesStrip } from "@/components/solutions/CaseExamplesStrip";
import { getCaseExamplesForSolutions } from "@/data/case-examples";

const SOLUTION_ID = "sustainability-value-creation" as const;
const CASE_EXAMPLES_BASE_PATH = "/solutions/sustainability-value-creation/case-examples";

const config = SOLUTION_CONFIGS[SOLUTION_ID];
const allCaseExamples = getCaseExamplesForSolutions([SOLUTION_ID]);

export default function SustainabilityValueCreationCaseExamplesPage() {
  return (
    <AppShell
      title="Case examples"
      breadcrumb={[
        { label: "Overview", href: "/" },
        { label: "Solutions" },
        { label: config.name, href: "/solutions/sustainability-value-creation" },
        { label: "Case examples" },
      ]}
    >
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
          <div>
            <Link
              href="/solutions/sustainability-value-creation"
              className="mb-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={13} aria-hidden="true" />
              Back to {config.name}
            </Link>
            <h1 className="text-[20px] font-semibold text-foreground">Case examples</h1>
            <p className="mt-1 text-[13px] text-muted-foreground">
              All {allCaseExamples.length} case examples tagged to {config.name}.
            </p>
          </div>

          <CaseExamplesStrip examples={allCaseExamples} basePath={CASE_EXAMPLES_BASE_PATH} />
        </div>
      </div>
    </AppShell>
  );
}
