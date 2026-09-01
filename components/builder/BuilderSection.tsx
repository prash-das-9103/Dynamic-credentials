"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronRight, Pencil, Check, X, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PackItem, PackSection } from "@/types/credentials";
import { BuilderItemCard } from "./BuilderItemCard";

interface BuilderSectionProps {
  section: PackSection;
  items: PackItem[];
  allSections: PackSection[];
  sectionIndex: number;
  totalSections: number;
  onRename: (label: string) => void;
  onToggleCollapse: () => void;
  onDelete: () => void;
  onMoveSectionUp: () => void;
  onMoveSectionDown: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItemNote: (id: string, note: string) => void;
  onToggleItemPriority: (id: string) => void;
  onReorderItem: (fromIdx: number, toIdx: number) => void;
  onMoveItemToSection: (id: string, sectionId: string) => void;
}

export function BuilderSection({
  section,
  items,
  allSections,
  sectionIndex,
  totalSections,
  onRename,
  onToggleCollapse,
  onDelete,
  onMoveSectionUp,
  onMoveSectionDown,
  onRemoveItem,
  onUpdateItemNote,
  onToggleItemPriority,
  onReorderItem,
  onMoveItemToSection,
}: BuilderSectionProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(section.label);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const collapsed = section.collapsed ?? false;

  function submitRename() {
    const trimmed = draft.trim();
    if (trimmed) onRename(trimmed);
    else setDraft(section.label);
    setEditing(false);
  }

  function handleDeleteRequest() {
    if (items.length === 0) { onDelete(); return; }
    setConfirmDelete(true);
  }

  return (
    <div className="rounded-xl border border-border bg-card/50">
      {/* Section header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <button
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand section" : "Collapse section"}
          aria-expanded={!collapsed}
          className="rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {editing ? (
          <div className="flex flex-1 items-center gap-1.5">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing) submitRename();
                if (e.key === "Escape") { setDraft(section.label); setEditing(false); }
              }}
              className="flex-1 rounded border border-border bg-background px-2 py-1 text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-[#CC0000]/40"
            />
            <button onClick={submitRename} aria-label="Save name" className="rounded p-1 text-green-500 hover:bg-green-500/10 transition-colors">
              <Check className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => { setDraft(section.label); setEditing(false); }} aria-label="Cancel" className="rounded p-1 text-muted-foreground hover:bg-secondary transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-1 items-center gap-2 min-w-0">
            <span className="text-sm font-semibold text-foreground truncate">{section.label}</span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Controls */}
        {!editing && (
          <div className="flex items-center gap-0.5 shrink-0">
            <button onClick={() => setEditing(true)} aria-label="Rename section" className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button onClick={onMoveSectionUp} disabled={sectionIndex === 0} aria-label="Move section up" className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <button onClick={onMoveSectionDown} disabled={sectionIndex === totalSections - 1} aria-label="Move section down" className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
            {section.custom && (
              <button onClick={handleDeleteRequest} aria-label="Delete section" className="rounded p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Items */}
      {!collapsed && (
        <div className="p-4 flex flex-col gap-3">
          {items.length === 0 ? (
            <p className="text-xs text-muted-foreground/60 italic py-2">
              No items in this section. Move items here from other sections or add from the explorer pages.
            </p>
          ) : (
            items.map((item, idx) => (
              <BuilderItemCard
                key={item.id}
                item={item}
                index={idx}
                total={items.length}
                sections={allSections}
                onRemove={() => onRemoveItem(item.id)}
                onUpdateNote={(note) => onUpdateItemNote(item.id, note)}
                onTogglePriority={() => onToggleItemPriority(item.id)}
                onMoveUp={() => onReorderItem(idx, idx - 1)}
                onMoveDown={() => onReorderItem(idx, idx + 1)}
                onMoveToSection={(sid) => onMoveItemToSection(item.id, sid)}
              />
            ))
          )}
        </div>
      )}

      {/* Delete confirmation dialog */}
      {confirmDelete && (
        <div role="alertdialog" aria-modal="true" aria-labelledby={`del-section-${section.id}`} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg border border-border bg-background p-6 shadow-xl">
            <h2 id={`del-section-${section.id}`} className="text-sm font-semibold text-foreground">
              Delete &ldquo;{section.label}&rdquo;?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This section contains {items.length} item{items.length !== 1 ? "s" : ""}. They will be permanently removed from the pack.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(false)} className="rounded border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors" autoFocus>
                Cancel
              </button>
              <button onClick={() => { onDelete(); setConfirmDelete(false); }} className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors">
                Delete section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
