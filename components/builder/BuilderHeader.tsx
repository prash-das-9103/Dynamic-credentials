"use client";

import { Copy, Check, FileDown, Presentation, Eye, EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { PackState } from "@/types/credentials";
import { computeConfidentialityCounts } from "@/lib/pack-validation";

interface BuilderHeaderProps {
  pack: PackState;
  onClearPack: () => void;
  onTogglePreview: () => void;
  onCopySummary: () => void;
  onOpenExport: () => void;
}

export function BuilderHeader({
  pack,
  onClearPack,
  onTogglePreview,
  onCopySummary,
  onOpenExport,
}: BuilderHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const conf = computeConfidentialityCounts(pack);
  const itemCount = pack.items.length;
  const restrictedCount = conf.restricted;

  function handleCopy() {
    onCopySummary();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleClearRequest() {
    if (itemCount === 0) { onClearPack(); return; }
    setConfirmClear(true);
  }

  return (
    <div className="border-b border-border bg-background px-6 py-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Sustainability Credentials
            <span className="mx-1.5 text-muted-foreground/50">/</span>
            Pack Builder
          </p>
          <h1 className="mt-0.5 text-xl font-semibold text-foreground">
            Credential Pack Builder
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Organize selected content into a tailored client-ready narrative.
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">{itemCount}</span> item{itemCount !== 1 ? "s" : ""} selected
            </span>
            {restrictedCount > 0 && (
              <span className="font-medium text-red-500">
                {restrictedCount} restricted
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Copy summary */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
            aria-label="Copy summary to clipboard"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy summary"}
          </button>

          {/* Preview toggle */}
          <button
            onClick={onTogglePreview}
            className="flex items-center gap-1.5 rounded border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
            aria-label={pack.previewMode ? "Return to edit mode" : "Enter preview mode"}
          >
            {pack.previewMode ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {pack.previewMode ? "Edit mode" : "Preview"}
          </button>

          {/* Export button */}
          <button
            onClick={onOpenExport}
            disabled={itemCount === 0}
            title={itemCount === 0 ? "Add items to the pack before exporting." : "Export presentation"}
            className={cn(
              "flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium transition-colors",
              itemCount > 0
                ? "border-[#CC0000]/40 bg-[#CC0000]/5 text-[#CC0000] hover:bg-[#CC0000]/10"
                : "border-border text-muted-foreground cursor-not-allowed opacity-50"
            )}
          >
            <Presentation className="h-3.5 w-3.5" />
            Export
          </button>

          {/* Clear pack */}
          <button
            onClick={handleClearRequest}
            className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-red-500 hover:border-red-500/40 transition-colors"
            aria-label="Clear all items from pack"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear pack
          </button>
        </div>
      </div>

      {/* Inline clear confirmation */}
      {confirmClear && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="clear-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div className="w-full max-w-sm rounded-lg border border-border bg-background p-6 shadow-xl">
            <h2 id="clear-dialog-title" className="text-sm font-semibold text-foreground">
              Clear pack?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This will remove all {itemCount} item{itemCount !== 1 ? "s" : ""}, notes, and metadata. This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmClear(false)}
                className="rounded border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                autoFocus
              >
                Cancel
              </button>
              <button
                onClick={() => { onClearPack(); setConfirmClear(false); }}
                className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors"
              >
                Clear pack
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
