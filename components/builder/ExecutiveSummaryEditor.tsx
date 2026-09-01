"use client";

import { RefreshCw, RotateCcw, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PackState } from "@/types/credentials";
import { generatePackSummary } from "@/lib/pack-summary";

interface ExecutiveSummaryEditorProps {
  pack: PackState;
  onSetSummary: (text: string, edited: boolean) => void;
}

export function ExecutiveSummaryEditor({ pack, onSetSummary }: ExecutiveSummaryEditorProps) {
  const generated = generatePackSummary(pack);
  const isEmpty = pack.items.length === 0;

  function handleUseGenerated() {
    onSetSummary(generated, false);
  }

  function handleRegenerate() {
    onSetSummary(generated, false);
  }

  function handleReset() {
    onSetSummary(generated, false);
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Executive Summary
        </h2>
        <div className="flex items-center gap-1">
          {pack.summaryEdited && (
            <button
              onClick={handleReset}
              title="Reset to generated summary"
              className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
          <button
            onClick={handleRegenerate}
            disabled={isEmpty}
            title="Regenerate summary"
            className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Regenerate
          </button>
        </div>
      </div>

      {isEmpty ? (
        <p className="text-xs text-muted-foreground/60 italic">
          Add items to the pack to generate an executive summary.
        </p>
      ) : (
        <>
          {!pack.executiveSummary && (
            <div className="mb-3 rounded bg-secondary/60 border border-border p-3">
              <p className="text-xs text-muted-foreground leading-relaxed">{generated}</p>
              <button
                onClick={handleUseGenerated}
                className="mt-2 flex items-center gap-1.5 rounded border border-[#CC0000]/40 bg-[#CC0000]/5 px-2.5 py-1 text-[11px] font-medium text-[#CC0000] hover:bg-[#CC0000]/10 transition-colors"
              >
                <Pencil className="h-3 w-3" />
                Use this summary
              </button>
            </div>
          )}

          <div>
            <textarea
              value={pack.executiveSummary || (pack.summaryEdited ? "" : generated)}
              onChange={(e) => onSetSummary(e.target.value, true)}
              rows={6}
              placeholder={generated || "Write your executive summary here..."}
              className="w-full resize-none rounded border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-[#CC0000]/40 leading-relaxed"
            />
            {pack.summaryEdited && (
              <p className="mt-1 text-[10px] text-muted-foreground/60">Manually edited — click Reset to restore generated text.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
