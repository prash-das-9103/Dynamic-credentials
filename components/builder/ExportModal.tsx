"use client";

/**
 * components/builder/ExportModal.tsx
 *
 * Export modal: shows the pre-flight checklist, warns about confidentiality,
 * offers PPTX download and PDF print-preview, and handles errors.
 */

import { useState, useCallback } from "react";
import {
  X, FileDown, Presentation, AlertTriangle, CheckCircle,
  Info, Loader2, ExternalLink,
} from "lucide-react";
import type { PackState } from "@/types/credentials";
import { computeExportStatus } from "@/lib/pack-validation";
import { validatePackForExport } from "@/lib/export/pptx/validate-presentation";
import { buildAnalyticsSnapshot } from "@/lib/export/build-analytics-snapshot";

interface ExportModalProps {
  pack: PackState;
  onClose: () => void;
}

type ExportState = "idle" | "generating" | "done" | "error";

const CONF_WARNING = `This pack contains internal or anonymized items.
Confirm that a client alias is in use throughout and that no
client-identifying information appears before distributing externally.`;

export function ExportModal({ pack, onClose }: ExportModalProps) {
  const [pptxState, setPptxState] = useState<ExportState>("idle");
  const [pdfState, setPdfState] = useState<ExportState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const status = computeExportStatus(pack);
  const validation = validatePackForExport(pack);
  const blocked = !validation.ok;

  const hasChartItem = pack.items.some((i) => i.itemType === "chart");
  const hasInternalItems = pack.items.some((i) => !i.exportRestricted);

  // Build the analytics snapshot only if needed
  const getAnalyticsJson = useCallback(() => {
    if (!hasChartItem) return undefined;
    try {
      const snap = buildAnalyticsSnapshot();
      return JSON.stringify(snap);
    } catch {
      return undefined;
    }
  }, [hasChartItem]);

  // ── PPTX export ────────────────────────────────────────────────────────────
  async function handlePptxExport() {
    if (blocked || pptxState === "generating") return;
    setErrorMsg(null);
    setPptxState("generating");

    try {
      const body: Record<string, string> = { packJson: JSON.stringify(pack) };
      const analyticsJson = getAnalyticsJson();
      if (analyticsJson) body.analyticsJson = analyticsJson;

      const res = await fetch("/api/export/pptx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Export failed." }));
        throw new Error(err.error ?? "Export failed.");
      }

      // Parse non-blocking warnings from header
      try {
        const warnHeader = res.headers.get("X-Export-Warnings");
        if (warnHeader) setWarnings(JSON.parse(warnHeader) as string[]);
      } catch {
        // ignore
      }

      const blob = await res.blob();
      const cd = res.headers.get("Content-Disposition") ?? "";
      const filenameMatch = cd.match(/filename="([^"]+)"/);
      const filename = filenameMatch?.[1] ?? "credentials-pack.pptx";

      // Trigger browser download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setPptxState("done");
      setTimeout(() => setPptxState("idle"), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Export failed.";
      setErrorMsg(msg);
      setPptxState("error");
      setTimeout(() => setPptxState("idle"), 4000);
    }
  }

  // ── PDF export ─────────────────────────────────────────────────────────────
  async function handlePdfExport() {
    if (blocked || pdfState === "generating") return;
    setErrorMsg(null);
    setPdfState("generating");

    try {
      const body: Record<string, string> = { packJson: JSON.stringify(pack) };
      const analyticsJson = getAnalyticsJson();
      if (analyticsJson) body.analyticsJson = analyticsJson;

      const res = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Export failed." }));
        throw new Error(err.error ?? "Export failed.");
      }

      const html = await res.text();
      // Open in new tab so the user can print or save as PDF
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      URL.revokeObjectURL(url);

      setPdfState("done");
      setTimeout(() => setPdfState("idle"), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Export failed.";
      setErrorMsg(msg);
      setPdfState("error");
      setTimeout(() => setPdfState("idle"), 4000);
    }
  }

  // ── Render helpers ─────────────────────────────────────────────────────────
  function stateIcon(state: ExportState) {
    if (state === "generating") return <Loader2 className="h-4 w-4 animate-spin" />;
    if (state === "done") return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (state === "error") return <AlertTriangle className="h-4 w-4 text-red-500" />;
    return null;
  }

  const itemCount = pack.items.filter((i) => !i.exportRestricted).length;
  const restrictedCount = pack.items.filter((i) => i.exportRestricted).length;
  const blockingWarnings = validation.warnings.filter((w) => w.blocking);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg rounded-lg border border-border bg-background shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 id="export-modal-title" className="text-sm font-semibold text-foreground">
              Export Presentation
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {itemCount} exportable item{itemCount !== 1 ? "s" : ""}
              {restrictedCount > 0 && (
                <span className="ml-1.5 text-red-500">· {restrictedCount} restricted (excluded)</span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Close export dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Blocking warnings */}
          {blockingWarnings.length > 0 && (
            <div className="rounded border border-red-500/40 bg-red-500/5 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-red-600">Export blocked</p>
                  <ul className="mt-1 space-y-0.5">
                    {blockingWarnings.map((w, i) => (
                      <li key={i} className="text-xs text-red-600">{w.message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Confidentiality reminder (when not blocked) */}
          {!blocked && hasInternalItems && (
            <div className="rounded border border-amber-500/30 bg-amber-500/5 p-3">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-400 whitespace-pre-line">
                  {CONF_WARNING}
                </p>
              </div>
            </div>
          )}

          {/* Non-blocking warnings from previous export */}
          {warnings.length > 0 && (
            <div className="rounded border border-border bg-secondary/40 p-3">
              <p className="text-xs font-medium text-foreground mb-1">Export notes</p>
              <ul className="space-y-0.5">
                {warnings.map((w, i) => (
                  <li key={i} className="text-xs text-muted-foreground">{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Pack summary */}
          <div className="rounded border border-border bg-secondary/30 p-3">
            <p className="text-xs font-medium text-foreground mb-2">Pack contents</p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {(["credential", "expert", "partner", "publication", "chart"] as const).map((t) => {
                const count = pack.items.filter((i) => i.itemType === t && !i.exportRestricted).length;
                if (count === 0) return null;
                const labels: Record<string, string> = {
                  credential: "credentials",
                  expert: "experts",
                  partner: "partners",
                  publication: "publications",
                  chart: "charts",
                };
                return (
                  <span key={t} className="inline-flex items-center gap-0.5 rounded border border-border px-1.5 py-0.5">
                    <span className="font-semibold text-foreground">{count}</span> {labels[t]}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Error display */}
          {errorMsg && (
            <div className="rounded border border-red-500/40 bg-red-500/5 p-2.5 text-xs text-red-600">
              {errorMsg}
            </div>
          )}

          {/* Export format buttons */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-foreground">Choose export format</p>

            {/* PPTX */}
            <button
              onClick={handlePptxExport}
              disabled={blocked || pptxState === "generating"}
              className="flex items-center justify-between rounded border border-border px-4 py-3 text-left transition-colors hover:bg-secondary/60 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex items-start gap-3">
                <Presentation className="h-5 w-5 text-[#CC0000] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Editable PowerPoint (.pptx)</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Consulting-style slides with editable text, shapes, and charts.
                  </p>
                </div>
              </div>
              <div className="shrink-0 ml-3">
                {stateIcon(pptxState) ?? (
                  <span className="text-xs text-muted-foreground">Download</span>
                )}
              </div>
            </button>

            {/* PDF */}
            <button
              onClick={handlePdfExport}
              disabled={blocked || pdfState === "generating"}
              className="flex items-center justify-between rounded border border-border px-4 py-3 text-left transition-colors hover:bg-secondary/60 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex items-start gap-3">
                <FileDown className="h-5 w-5 text-[#CC0000] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Print-ready PDF</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Opens a print-preview tab — use File &gt; Print &gt; Save as PDF.
                  </p>
                </div>
              </div>
              <div className="shrink-0 ml-3 flex items-center gap-1">
                {stateIcon(pdfState) ?? (
                  <>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Opens tab</span>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Source note */}
          <p className="text-[10px] text-muted-foreground/70 border-t border-border pt-3">
            Analytical values are sourced from the deterministic workbook import
            (SustainabilityCases.xlsx). No values are recalculated during export.
            Source records are listed in the appendix of the exported presentation.
          </p>
        </div>
      </div>
    </div>
  );
}
