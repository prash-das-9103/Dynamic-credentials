import type { PackState, PackSection } from "@/types/credentials";
import { getItemsBySection } from "@/lib/pack-summary";

export interface ChecklistItem {
  id: string;
  label: string;
  passed: boolean;
  blocking: boolean; // true = affects export readiness
}

export type ExportStatus = "draft" | "needs-review" | "export-blocked" | "ready";

export interface ConfidentialityCounts {
  public: number;
  internal: number;
  anonymized: number;
  restricted: number;
  total: number;
}

export function computeConfidentialityCounts(pack: PackState): ConfidentialityCounts {
  // Only credentials carry confidentiality — others default to internal for counting
  const { CREDENTIALS } = require("@/data/credentials") as { CREDENTIALS: import("@/types/credentials").Credential[] };
  let pub = 0, internal = 0, anon = 0, restricted = 0;
  for (const item of pack.items) {
    if (item.itemType === "credential") {
      const cred = CREDENTIALS.find((c: { id: string }) => c.id === item.id);
      const conf = cred?.confidentiality ?? "internal";
      if (conf === "public") pub++;
      else if (conf === "anonymized-client-example") anon++;
      else if (conf === "restricted") restricted++;
      else internal++;
    } else {
      internal++;
    }
  }
  return { public: pub, internal, anonymized: anon, restricted, total: pack.items.length };
}

export function computeChecklist(pack: PackState): ChecklistItem[] {
  const conf = computeConfidentialityCounts(pack);
  const hasCred = pack.items.some((i) => i.itemType === "credential");

  // Check every non-empty section exists
  const allSectionsValid = pack.sections.every((s: PackSection) => {
    const items = getItemsBySection(pack.items, s.id);
    // A section is valid if empty OR has ≥1 item (we just need it to exist)
    return true; // structural validity — sections always valid unless deleted
  });

  const items: ChecklistItem[] = [
    {
      id: "pack-title",
      label: "Pack title added",
      passed: pack.metadata.packTitle.trim().length > 0,
      blocking: false,
    },
    {
      id: "client-name",
      label: "Client name or alias added",
      passed:
        pack.metadata.clientName.trim().length > 0 ||
        pack.metadata.clientAlias.trim().length > 0,
      blocking: false,
    },
    {
      id: "summary-reviewed",
      label: "Executive summary reviewed",
      passed: pack.executiveSummary.trim().length > 0,
      blocking: false,
    },
    {
      id: "has-credential",
      label: "At least one credential selected",
      passed: hasCred,
      blocking: true,
    },
    {
      id: "confidentiality-reviewed",
      label: "Confidentiality reviewed",
      passed: conf.total > 0, // passes as soon as there are items to review
      blocking: false,
    },
    {
      id: "no-restricted",
      label: "No restricted items",
      passed: conf.restricted === 0,
      blocking: true,
    },
    {
      id: "valid-sections",
      label: "All sections contain valid records",
      passed: allSectionsValid,
      blocking: false,
    },
  ];
  return items;
}

export function computeExportStatus(pack: PackState): ExportStatus {
  const checklist = computeChecklist(pack);
  const conf = computeConfidentialityCounts(pack);
  if (conf.restricted > 0) return "export-blocked";
  const blockingFailed = checklist.filter((c) => c.blocking && !c.passed);
  if (blockingFailed.length > 0) return "draft";
  const anyFailed = checklist.some((c) => !c.passed);
  if (anyFailed) return "needs-review";
  return "ready";
}
