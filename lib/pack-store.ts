"use client";

import { useCallback, useEffect, useState } from "react";
import type { PackItem, PackState, PackSection, PackMetadata } from "@/types/credentials";
import { DEFAULT_SECTION_FOR_TYPE, DEFAULT_SECTIONS } from "@/lib/pack-constants";

const STORAGE_KEY = "dsc-pack-v2";
const VERSION = 2;

const DEFAULT_METADATA: PackMetadata = {
  packTitle: "Sustainability Credentials Pack",
  clientName: "",
  clientAlias: "",
  clientSituation: "",
  preparedBy: "",
  date: new Date().toISOString().slice(0, 10),
};

// Re-exported for source compatibility with existing client-side imports
// (`@/lib/pack-store`). Do NOT import these from this file in server-only
// code — this module is "use client" and Next.js will substitute a
// client-reference proxy for this re-export in a server bundle. Server-only
// code (API routes, export renderers) must import directly from
// `@/lib/pack-constants` instead. See that file's header comment for why.
export { DEFAULT_SECTION_FOR_TYPE, DEFAULT_SECTIONS };

const DEFAULT_STATE: PackState = {
  items: [],
  clientName: "",
  clientSituation: "",
  sectionHeadings: DEFAULT_SECTIONS.map((s) => ({ id: s.id, label: s.label })),
  sections: DEFAULT_SECTIONS,
  metadata: DEFAULT_METADATA,
  executiveSummary: "",
  summaryEdited: false,
  previewMode: false,
};

function loadFromStorage(): PackState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed._version !== VERSION) return DEFAULT_STATE;
    // Merge defaults for safety
    return {
      ...DEFAULT_STATE,
      ...parsed,
      metadata: { ...DEFAULT_METADATA, ...(parsed.metadata ?? {}) },
      sections: Array.isArray(parsed.sections) && parsed.sections.length > 0
        ? parsed.sections
        : DEFAULT_SECTIONS,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveToStorage(state: PackState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, _version: VERSION }));
  } catch {
    // ignore quota errors
  }
}

export function usePack() {
  const [pack, setPack] = useState<PackState>(DEFAULT_STATE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPack(loadFromStorage());
    setMounted(true);
  }, []);

  const updatePack = useCallback((updater: (prev: PackState) => PackState) => {
    setPack((prev) => {
      const next = updater(prev);
      saveToStorage(next);
      return next;
    });
  }, []);

  // ── Item operations ──────────────────────────────────────────────────────────
  const addItem = useCallback(
    (item: Omit<PackItem, "addedAt" | "type"> & { exportRestricted?: boolean }) => {
      updatePack((prev) => {
        if (prev.items.some((i) => i.id === item.id)) return prev;
        const defaultSection = DEFAULT_SECTION_FOR_TYPE[item.itemType];
        const full: PackItem = {
          ...item,
          type: item.itemType,
          exportRestricted: item.exportRestricted ?? false,
          section: item.section ?? defaultSection,
          addedAt: Date.now(),
        };
        return { ...prev, items: [...prev.items, full] };
      });
    },
    [updatePack]
  );

  const removeItem = useCallback(
    (id: string) => {
      updatePack((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.id !== id),
      }));
    },
    [updatePack]
  );

  const hasItem = useCallback(
    (id: string) => pack.items.some((i) => i.id === id),
    [pack.items]
  );

  const updateItem = useCallback(
    (id: string, patch: Partial<Pick<PackItem, "note" | "priority" | "section">>) => {
      updatePack((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
      }));
    },
    [updatePack]
  );

  const reorderItems = useCallback(
    (sectionId: string, fromIdx: number, toIdx: number) => {
      updatePack((prev) => {
        const sectionItems = prev.items.filter((i) => (i.section ?? DEFAULT_SECTION_FOR_TYPE[i.itemType]) === sectionId);
        const otherItems = prev.items.filter((i) => (i.section ?? DEFAULT_SECTION_FOR_TYPE[i.itemType]) !== sectionId);
        const moved = [...sectionItems];
        const [item] = moved.splice(fromIdx, 1);
        moved.splice(toIdx, 0, item);
        return { ...prev, items: [...otherItems, ...moved] };
      });
    },
    [updatePack]
  );

  const moveItemToSection = useCallback(
    (id: string, targetSection: string) => {
      updatePack((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i.id === id ? { ...i, section: targetSection } : i)),
      }));
    },
    [updatePack]
  );

  const clearPack = useCallback(() => {
    updatePack(() => ({ ...DEFAULT_STATE, metadata: { ...DEFAULT_METADATA } }));
  }, [updatePack]);

  // ── Section operations ───────────────────────────────────────────────────────
  const updateSection = useCallback(
    (id: string, patch: Partial<Pick<PackSection, "label" | "collapsed">>) => {
      updatePack((prev) => ({
        ...prev,
        sections: prev.sections.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        sectionHeadings: prev.sectionHeadings.map((s) =>
          s.id === id ? { ...s, ...(patch.label ? { label: patch.label } : {}) } : s
        ),
      }));
    },
    [updatePack]
  );

  const addSection = useCallback(
    (label: string) => {
      const id = `custom-${Date.now()}`;
      updatePack((prev) => ({
        ...prev,
        sections: [...prev.sections, { id, label, custom: true }],
        sectionHeadings: [...prev.sectionHeadings, { id, label }],
      }));
    },
    [updatePack]
  );

  const deleteSection = useCallback(
    (id: string) => {
      updatePack((prev) => ({
        ...prev,
        sections: prev.sections.filter((s) => s.id !== id),
        sectionHeadings: prev.sectionHeadings.filter((s) => s.id !== id),
        items: prev.items.filter(
          (i) => (i.section ?? DEFAULT_SECTION_FOR_TYPE[i.itemType]) !== id
        ),
      }));
    },
    [updatePack]
  );

  const reorderSections = useCallback(
    (fromIdx: number, toIdx: number) => {
      updatePack((prev) => {
        const sections = [...prev.sections];
        const [moved] = sections.splice(fromIdx, 1);
        sections.splice(toIdx, 0, moved);
        return { ...prev, sections };
      });
    },
    [updatePack]
  );

  // ── Metadata ─────────────────────────────────────────────────────────────────
  const updateMetadata = useCallback(
    (patch: Partial<PackMetadata>) => {
      updatePack((prev) => ({
        ...prev,
        metadata: { ...prev.metadata, ...patch },
        // mirror legacy fields
        clientName: patch.clientName ?? prev.clientName,
        clientSituation: patch.clientSituation ?? prev.clientSituation,
      }));
    },
    [updatePack]
  );

  // ── Executive summary ────────────────────────────────────────────────────────
  const setExecutiveSummary = useCallback(
    (text: string, edited: boolean) => {
      updatePack((prev) => ({ ...prev, executiveSummary: text, summaryEdited: edited }));
    },
    [updatePack]
  );

  // ── Preview mode ─────────────────────────────────����───────────────────────────
  const setPreviewMode = useCallback(
    (on: boolean) => {
      updatePack((prev) => ({ ...prev, previewMode: on }));
    },
    [updatePack]
  );

  // ── Legacy compat ─────────────────────────────────────────────────────────────
  const updateClientInfo = useCallback(
    (info: { clientName?: string; clientSituation?: string }) => {
      updateMetadata(info);
    },
    [updateMetadata]
  );

  const updateItemSection = useCallback(
    (id: string, section: string) => moveItemToSection(id, section),
    [moveItemToSection]
  );

  return {
    pack,
    mounted,
    addItem,
    removeItem,
    hasItem,
    updateItem,
    reorderItems,
    moveItemToSection,
    clearPack,
    updateSection,
    addSection,
    deleteSection,
    reorderSections,
    updateMetadata,
    setExecutiveSummary,
    setPreviewMode,
    updateClientInfo,
    updateItemSection,
    itemCount: pack.items.length,
  };
}
