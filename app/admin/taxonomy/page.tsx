"use client";

import { Tags } from "lucide-react";

const TAXONOMY_DIMENSIONS = [
  {
    id: "solution",
    label: "Solution (Col Q)",
    description: "The primary solution category. Maps directly to column Q of the analytical workbook.",
    note: "Governed — changes require workbook review.",
  },
  {
    id: "region",
    label: "Region (Col A)",
    description: "Geographic region. Maps to column A of the workbook.",
    note: "Governed — changes require workbook review.",
  },
  {
    id: "food-systems",
    label: "Food Systems Transformation (Col T)",
    description: "Boolean flag indicating the case relates to food systems transformation.",
    note: "Governed — maps to column T of the workbook.",
  },
  {
    id: "entity-type",
    label: "Content Entity Type",
    description: "The type of content item: credential, expert, partner, publication, reference-slide.",
    note: "Fixed enum — contact an administrator to add new types.",
  },
  {
    id: "content-status",
    label: "Content Workflow Status",
    description: "draft → submitted → in-review → approved → published. Rejected returns to draft.",
    note: "Fixed workflow — do not modify.",
  },
];

export default function AdminTaxonomyPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Taxonomy</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Controlled vocabularies and classification dimensions used across the platform.
        </p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-400">
        <span className="font-semibold">Column governance:</span> Taxonomy dimensions that map to
        workbook columns (A, D, Q, T) are derived from the analytical dataset. Changes to those
        controlled vocabularies require uploading and publishing a new workbook version.
      </div>

      <div className="space-y-3">
        {TAXONOMY_DIMENSIONS.map((dim) => (
          <div key={dim.id} className="rounded-lg border border-border p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <Tags size={14} className="shrink-0 text-muted-foreground" />
                <span className="text-[13px] font-semibold text-foreground">{dim.label}</span>
              </div>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground font-mono shrink-0">
                {dim.id}
              </span>
            </div>
            <p className="mt-1.5 pl-5 text-[12px] text-muted-foreground">{dim.description}</p>
            <p className="mt-1 pl-5 text-[11px] text-amber-700 dark:text-amber-500">{dim.note}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <Tags size={24} className="mx-auto mb-3 text-muted-foreground/40" />
        <p className="text-sm font-medium text-foreground">Editable taxonomy coming in a future milestone</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Free-text tag management, synonym mapping, and hierarchy editing will be available here.
        </p>
      </div>
    </div>
  );
}
