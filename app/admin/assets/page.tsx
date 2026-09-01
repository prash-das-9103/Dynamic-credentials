"use client";

import { ImageIcon } from "lucide-react";

export default function AdminAssetsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Assets</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Logos, images, and binary files used across the platform.
        </p>
      </div>

      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <ImageIcon size={28} className="mx-auto mb-4 text-muted-foreground/40" />
        <p className="text-sm font-medium text-foreground">Asset management — coming soon</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Upload, organise, and de-duplicate logos and images. Requires Vercel Blob storage access
          (currently role-gated). Asset metadata will be indexed and searchable once storage is connected.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-muted/20 px-4 py-3 text-[12px] text-muted-foreground space-y-1">
        <div className="font-semibold text-foreground">Planned capabilities</div>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>Upload partner and expert logos (PNG, SVG — max 2 MB)</li>
          <li>De-duplication by checksum before storage</li>
          <li>Dimensions and format validation</li>
          <li>Soft-delete with 30-day retention</li>
          <li>CDN URL generation for reference-slide covers</li>
        </ul>
      </div>
    </div>
  );
}
