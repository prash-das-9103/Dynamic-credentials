"use client";

import { Download } from "lucide-react";

export default function AdminExportsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Exports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage and monitor data exports created by platform users.
        </p>
      </div>

      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <Download size={28} className="mx-auto mb-4 text-muted-foreground/40" />
        <p className="text-sm font-medium text-foreground">Export history — coming in a future milestone</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Every data export (PowerPoint, PDF, CSV) will be logged here with the requesting user,
          timestamp, and the filters applied. Exports will be available to re-download for 7 days.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-muted/20 px-4 py-3 text-[12px] text-muted-foreground space-y-1">
        <div className="font-semibold text-foreground">Governance</div>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>All exports require the <code className="font-mono">export:create</code> permission</li>
          <li>Exports are immutable — re-running the same search may produce a different result if the workbook has been updated</li>
          <li>Export records are appended to the audit log</li>
          <li>Exports containing personally identifiable information require data-steward approval</li>
        </ul>
      </div>
    </div>
  );
}
