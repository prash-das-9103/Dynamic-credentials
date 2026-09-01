"use client";

/**
 * components/builder/SlideFrame.tsx
 *
 * On-screen mirror of the Bain slide template used by the PPTX export
 * (lib/export/pptx/render-section-slide.ts + slide-helpers.ts):
 *
 *   [Header — 24pt Arial (Headings)]
 *   [Red rule]
 *   [content — 12pt Arial (Body), below the red line]
 *   [Footer — confidentiality notice (8pt Arial Body) + BAIN & COMPANY + page #]
 *
 * All positions and font sizes are derived directly from
 * lib/export/pptx/presentation-theme.ts so the preview stays in lockstep
 * with the exported deck's geometry. Font sizes are expressed in `cqw`
 * (percent of the frame's own inline size) so the whole slide scales
 * together, the way a PowerPoint slide does when zoomed.
 */

import type { ReactNode } from "react";
import {
  SLIDE_W,
  SLIDE_H,
  MARGIN_L,
  MARGIN_TOP,
  CONTENT_W,
  RULE_Y,
  SECTION_SLIDE,
  FOOTER_Y,
  FOOTER,
  TEXT,
  COLOR,
} from "@/lib/export/pptx/presentation-theme";

export const ARIAL = "Arial, Helvetica, sans-serif";
export const DEFAULT_CONFIDENTIALITY_NOTICE =
  "This information is confidential and was prepared by Bain & Company solely for the use of our client; it is not to be relied on by any 3rd party without Bain's prior written consent";

// ─── Unit conversion: inches (theme) → percent of slide (CSS position) ────────

export const pctX = (inches: number) => (inches / SLIDE_W) * 100;
export const pctY = (inches: number) => (inches / SLIDE_H) * 100;
export const pctW = (inches: number) => (inches / SLIDE_W) * 100;

/** Point size (theme) → cqw, so text scales with the frame's own width. */
export const ptToCqw = (pt: number) => (pt / 72 / SLIDE_W) * 100;

export const hex = (h: string) => `#${h}`;

export interface SlideFrameProps {
  header: ReactNode;
  subtitle?: string;
  footerText?: string;
  pageNumber?: number;
  children: ReactNode;
  className?: string;
}

/** Shared chrome — header, red rule, footer — for every content slide. */
export function SlideFrame({
  header,
  subtitle,
  footerText = DEFAULT_CONFIDENTIALITY_NOTICE,
  pageNumber,
  children,
  className,
}: SlideFrameProps) {
  return (
    <div
      className={`@container relative w-full overflow-hidden bg-white ${className ?? ""}`}
      style={{ aspectRatio: `${SLIDE_W} / ${SLIDE_H}` }}
    >
      {/* Header — 24pt Arial (Headings) */}
      <div
        className="absolute"
        style={{ left: `${pctX(MARGIN_L)}%`, top: `${pctY(MARGIN_TOP)}%`, width: `${pctW(CONTENT_W)}%` }}
      >
        <p
          className="leading-tight"
          style={{ fontSize: `${ptToCqw(TEXT.TITLE_SIZE)}cqw`, color: hex(TEXT.TITLE_COLOR), fontFamily: ARIAL }}
        >
          {header}
        </p>
      </div>

      {/* Red rule */}
      <div
        className="absolute"
        style={{
          left: `${pctX(MARGIN_L)}%`,
          top: `${pctY(RULE_Y)}%`,
          width: `${pctW(CONTENT_W)}%`,
          height: "max(1.5px, 0.16cqw)",
          backgroundColor: hex(COLOR.RED),
        }}
      />

      {/* Subtitle, just under the rule */}
      {subtitle && (
        <div
          className="absolute"
          style={{ left: `${pctX(MARGIN_L)}%`, top: `${pctY(RULE_Y) + 1.3}%`, width: `${pctW(CONTENT_W)}%` }}
        >
          <p
            className="italic leading-snug"
            style={{ fontSize: "1.1cqw", color: "#666666", fontFamily: ARIAL }}
          >
            {subtitle}
          </p>
        </div>
      )}

      {/* Content — text / images / framework below the red line, 12pt Arial (Body) */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: `${pctX(MARGIN_L)}%`,
          top: `${pctY(SECTION_SLIDE.BODY_Y)}%`,
          width: `${pctW(SECTION_SLIDE.BODY_W)}%`,
          height: `${pctY(SECTION_SLIDE.BODY_H)}%`,
          fontSize: `${ptToCqw(TEXT.BODY_SIZE)}cqw`,
          fontFamily: ARIAL,
        }}
      >
        {children}
      </div>

      {/* Footer — 8pt Arial (Body) confidentiality notice + wordmark + page # */}
      <div
        className="absolute leading-snug"
        style={{
          left: `${pctX(MARGIN_L)}%`,
          top: `${pctY(FOOTER_Y)}%`,
          width: `${pctW(FOOTER.DISCLAIMER_W)}%`,
          fontSize: `${ptToCqw(TEXT.FOOTER_SIZE)}cqw`,
          color: hex(TEXT.FOOTER_COLOR),
          fontFamily: ARIAL,
        }}
      >
        {footerText}
      </div>

      <div
        className="absolute font-bold tracking-wide text-right"
        style={{
          left: `${pctX(FOOTER.WORDMARK_X)}%`,
          top: `${pctY(FOOTER_Y) - 0.3}%`,
          width: `${pctW(FOOTER.WORDMARK_W)}%`,
          fontSize: `${ptToCqw(TEXT.FOOTER_SIZE + 1)}cqw`,
          color: hex(COLOR.RED),
          fontFamily: ARIAL,
        }}
      >
        BAIN &amp; COMPANY
      </div>

      {pageNumber !== undefined && (
        <div
          className="absolute text-right"
          style={{
            left: `${pctX(FOOTER.PAGE_NUM_X)}%`,
            top: `${pctY(FOOTER_Y)}%`,
            width: `${pctW(FOOTER.PAGE_NUM_W)}%`,
            fontSize: `${ptToCqw(TEXT.FOOTER_SIZE)}cqw`,
            color: "#555555",
            fontFamily: ARIAL,
          }}
        >
          {pageNumber}
        </div>
      )}
    </div>
  );
}
