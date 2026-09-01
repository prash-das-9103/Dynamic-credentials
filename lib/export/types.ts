/**
 * lib/export/types.ts
 *
 * Shared types for the PPTX / PDF export pipeline.
 * No PptxGenJS imports here — pure data shapes.
 */

// ─── Presentation document ────────────────────────────────────────────────────

export type ExportFormat = "pptx" | "pdf" | "preview";

export type SlideType =
  | "cover"
  | "agenda"
  | "section-divider"
  | "executive-summary"
  | "credential-detail"
  | "expert-profile"
  | "partner-detail"
  | "publication-detail"
  | "analytics"
  | "source-register"
  | "appendix";

export interface ExportSlide {
  id: string;
  order: number;
  type: SlideType;
  title: string;
  subtitle?: string;
  /** IDs of source records (credential, expert, etc.) */
  itemIds: string[];
  /** Resolved data payload for rendering */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>;
  speakerNotes?: string;
  confidentiality: "public" | "internal" | "anonymized" | "restricted";
  sourceRecords: SourceRecord[];
  warnings: ExportWarning[];
}

export interface SourceRecord {
  type: "credential" | "expert" | "partner" | "publication" | "chart" | "reference-slide";
  id: string;
  label: string;
  /** Slide numbers in the source deck */
  sourceSlides?: number[];
  workbookRef?: WorkbookRef;
}

export interface WorkbookRef {
  filename: string;
  sheet: string;
  importedAt: string;
  period: string;
  fields: { region: string; solution: string; time: string; uniqueId: string };
}

export type ExportWarningCode =
  | "restricted-item"
  | "internal-only"
  | "missing-client-alias"
  | "historical-number"
  | "no-source-slide"
  | "missing-expert-photo"
  | "long-narrative";

export interface ExportWarning {
  code: ExportWarningCode;
  message: string;
  blocking: boolean;
}

export interface PresentationDocument {
  id: string;
  title: string;
  subtitle?: string;
  clientAlias?: string;
  preparedBy?: string;
  date: string;
  themeId: "bain-consulting";
  slides: ExportSlide[];
  sourceMetadata: {
    exportSchemaVersion: "1.0";
    presentationTemplateVersion: "1.0";
    generatedAt: string;
    workbookRef?: WorkbookRef;
  };
  warnings: ExportWarning[];
}

// ─── Export request ───────────────────────────────────────────────────────────

export interface ExportRequest {
  format: ExportFormat;
  packJson: string; // JSON-serialized PackState — never send live functions to the server
  analyticsJson?: string; // JSON-serialized CaseKpiValues + aggregation rows if chart in pack
}

export interface ExportResult {
  ok: boolean;
  filename?: string;
  /** base64-encoded file content */
  base64?: string;
  error?: string;
  warnings?: ExportWarning[];
}

// ─── Analytics snapshot passed from client to server ────────────────────────

export interface AnalyticsSnapshot {
  kpis: {
    total: number;
    emea: number;
    americas: number;
    apac: number;
    fst: number;
  };
  solutionRows: { id: string; label: string; count: number }[];
  regionRows: { id: string; label: string; count: number }[];
  industryRows: { id: string; label: string; count: number }[];
  yearRows: { id: string; label: string; count: number }[];
  filters: {
    regions: string[];
    solutions: string[];
    industries: string[];
    years: string[];
    fstOnly: boolean;
  };
  period: string; // e.g. "FY2021–FY2025"
  workbookImportDate: string;
}
