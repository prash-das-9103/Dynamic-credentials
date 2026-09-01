"use client";

import { Package } from "lucide-react";

export default function AdminPacksPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Packs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Curated slide packs and credential bundles built from search results.
        </p>
      </div>

      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <Package size={28} className="mx-auto mb-4 text-muted-foreground/40" />
        <p className="text-sm font-medium text-foreground">Pack builder — coming in a future milestone</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Users will be able to select credentials, experts, and reference slides from search
          results and assemble them into downloadable packs. Pack metadata and session history
          will be tracked here for governance and reuse.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-muted/20 px-4 py-3 text-[12px] text-muted-foreground space-y-1">
        <div className="font-semibold text-foreground">Planned capabilities</div>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>Save and name a pack from any search session</li>
          <li>Generate a PowerPoint or PDF export from a pack</li>
          <li>Share a pack link with an expiry time</li>
          <li>Admin view of all active pack sessions and download counts</li>
          <li>Flag pack items as stale when the underlying content is updated</li>
        </ul>
      </div>
    </div>
  );
}
