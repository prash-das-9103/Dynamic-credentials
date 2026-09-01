"use client";

import { useState, useCallback } from "react";
import { Plus, CheckSquare } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { usePackContext } from "@/lib/pack-context";
import { getItemsBySection } from "@/lib/pack-summary";
import { generatePackSummary } from "@/lib/pack-summary";
import { computeConfidentialityCounts } from "@/lib/pack-validation";

import { BuilderHeader } from "@/components/builder/BuilderHeader";
import { PackMetadataForm } from "@/components/builder/PackMetadataForm";
import { BuilderSection } from "@/components/builder/BuilderSection";
import { ExecutiveSummaryEditor } from "@/components/builder/ExecutiveSummaryEditor";
import { ConfidentialityReview } from "@/components/builder/ConfidentialityReview";
import { ExportReadinessChecklist } from "@/components/builder/ExportReadinessChecklist";
import { PackPreview } from "@/components/builder/PackPreview";
import { EmptyPackState } from "@/components/builder/EmptyPackState";
import { ExportModal } from "@/components/builder/ExportModal";

export default function BuilderPage() {
  const {
    pack,
    mounted,
    clearPack,
    removeItem,
    updateItem,
    reorderItems,
    moveItemToSection,
    updateSection,
    addSection,
    deleteSection,
    reorderSections,
    updateMetadata,
    setExecutiveSummary,
    setPreviewMode,
  } = usePackContext();

  const [addSectionDraft, setAddSectionDraft] = useState("");
  const [addingSectionOpen, setAddingSectionOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  // Show toast helper
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  }, []);

  // Copy summary to clipboard
  async function handleCopySummary() {
    if (!mounted) return;
    const meta = pack.metadata;
    const summary = pack.executiveSummary || generatePackSummary(pack);
    const conf = computeConfidentialityCounts(pack);
    const lines: string[] = [];

    lines.push(meta.packTitle || "Credential Pack");
    if (meta.clientName || meta.clientAlias)
      lines.push(`Client: ${meta.clientAlias || meta.clientName}`);
    if (meta.clientSituation) lines.push(`\nClient situation: ${meta.clientSituation}`);
    if (summary) lines.push(`\nExecutive Summary:\n${summary}`);

    for (const section of pack.sections) {
      const items = getItemsBySection(pack.items, section.id);
      if (items.length === 0) continue;
      lines.push(`\n${section.label.toUpperCase()}`);
      for (const item of items) {
        lines.push(`• ${item.title}${item.subtitle ? ` — ${item.subtitle}` : ""}`);
        if (item.note) lines.push(`  Note: ${item.note}`);
      }
    }

    if (conf.restricted > 0)
      lines.push(`\n⚠ CONFIDENTIALITY WARNING: This pack contains ${conf.restricted} restricted item(s) and is not cleared for external distribution.`);
    else if (conf.anonymized > 0)
      lines.push(`\nNote: Client identities are anonymized throughout this pack.`);

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      showToast("Pack summary copied to clipboard.");
    } catch {
      showToast("Could not access clipboard.");
    }
  }

  function handleAddSection() {
    const trimmed = addSectionDraft.trim();
    if (!trimmed) return;
    addSection(trimmed);
    setAddSectionDraft("");
    setAddingSectionOpen(false);
  }

  if (!mounted) {
    return (
      <AppShell
        title="Pack Builder"
        breadcrumb={[{ label: "Overview", href: "/" }, { label: "Pack Builder" }]}
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-muted-foreground">Loading pack...</p>
        </div>
      </AppShell>
    );
  }

  // Preview mode — full-page takeover
  if (pack.previewMode) {
    return (
      <AppShell
        title="Pack Preview"
        breadcrumb={[{ label: "Overview", href: "/" }, { label: "Pack Builder" }, { label: "Preview" }]}
      >
        <div className="h-full overflow-hidden print-preview">
          <PackPreview pack={pack} onExitPreview={() => setPreviewMode(false)} />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Pack Builder"
      breadcrumb={[{ label: "Overview", href: "/" }, { label: "Pack Builder" }]}
    >
      <div className="flex h-full flex-col overflow-hidden">
        {/* Header */}
        <BuilderHeader
          pack={pack}
          onClearPack={clearPack}
          onTogglePreview={() => setPreviewMode(true)}
          onCopySummary={handleCopySummary}
          onOpenExport={() => setExportOpen(true)}
        />

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main content area */}
          <div className="flex-1 overflow-y-auto">
            {pack.items.length === 0 ? (
              <div className="px-6">
                <EmptyPackState />
              </div>
            ) : (
              <div className="flex flex-col gap-4 p-6">
                {pack.sections.map((section, idx) => {
                  const sectionItems = getItemsBySection(pack.items, section.id);
                  return (
                    <BuilderSection
                      key={section.id}
                      section={section}
                      items={sectionItems}
                      allSections={pack.sections}
                      sectionIndex={idx}
                      totalSections={pack.sections.length}
                      onRename={(label) => updateSection(section.id, { label })}
                      onToggleCollapse={() => updateSection(section.id, { collapsed: !section.collapsed })}
                      onDelete={() => deleteSection(section.id)}
                      onMoveSectionUp={() => reorderSections(idx, idx - 1)}
                      onMoveSectionDown={() => reorderSections(idx, idx + 1)}
                      onRemoveItem={removeItem}
                      onUpdateItemNote={(id, note) => updateItem(id, { note })}
                      onToggleItemPriority={(id) => {
                        const cur = pack.items.find((i) => i.id === id);
                        updateItem(id, { priority: !cur?.priority });
                      }}
                      onReorderItem={(from, to) => reorderItems(section.id, from, to)}
                      onMoveItemToSection={moveItemToSection}
                    />
                  );
                })}

                {/* Add custom section */}
                <div>
                  {addingSectionOpen ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        value={addSectionDraft}
                        onChange={(e) => setAddSectionDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.nativeEvent.isComposing) handleAddSection();
                          if (e.key === "Escape") setAddingSectionOpen(false);
                        }}
                        placeholder="Section name..."
                        className="flex-1 rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-[#CC0000]/40"
                      />
                      <button
                        onClick={handleAddSection}
                        className="rounded bg-[#CC0000] px-3 py-2 text-sm font-medium text-white hover:bg-[#aa0000] transition-colors"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setAddingSectionOpen(false)}
                        className="rounded border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingSectionOpen(true)}
                      className="flex items-center gap-2 rounded border border-dashed border-border px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors w-full justify-center"
                    >
                      <Plus className="h-4 w-4" />
                      Add custom section
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="hidden lg:flex w-80 shrink-0 flex-col gap-4 overflow-y-auto border-l border-border p-4">
            <PackMetadataForm
              metadata={pack.metadata}
              onChange={updateMetadata}
            />
            <ExecutiveSummaryEditor
              pack={pack}
              onSetSummary={setExecutiveSummary}
            />
            <ConfidentialityReview pack={pack} />
            <ExportReadinessChecklist pack={pack} />
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 shadow-lg text-sm text-foreground"
        >
          <CheckSquare className="h-4 w-4 text-green-500" />
          {toastMsg}
        </div>
      )}

      {/* Export modal */}
      {exportOpen && (
        <ExportModal pack={pack} onClose={() => setExportOpen(false)} />
      )}
    </AppShell>
  );
}
