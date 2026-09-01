"use client";

/**
 * components/builder/CoverSlide.tsx
 *
 * On-screen mirror of lib/export/pptx/render-cover-slide.ts: white
 * background, left-edge red accent bar, large black title, subtitle, and
 * metadata line. Geometry + type sizes come straight from
 * presentation-theme.ts, matching SlideFrame's cqw-scaling approach.
 */

import {
  SLIDE_W,
  SLIDE_H,
  MARGIN_L,
  COVER,
  FOOTER_Y,
  COLOR,
} from "@/lib/export/pptx/presentation-theme";
import { pctX, pctY, pctW, ptToCqw, hex, ARIAL } from "@/components/builder/SlideFrame";

export interface CoverSlideProps {
  title: string;
  subtitle?: string;
  clientAlias?: string;
  preparedBy?: string;
  date?: string;
  confidentiality?: string;
}

export function CoverSlide({ title, subtitle, clientAlias, preparedBy, date, confidentiality }: CoverSlideProps) {
  const metaParts: string[] = [];
  if (clientAlias) metaParts.push(`Prepared for: ${clientAlias}`);
  if (preparedBy) metaParts.push(`Prepared by: ${preparedBy}`);
  if (date) metaParts.push(date);

  return (
    <div
      className="@container relative w-full overflow-hidden bg-white"
      style={{ aspectRatio: `${SLIDE_W} / ${SLIDE_H}` }}
    >
      {/* Left-edge red accent bar */}
      <div className="absolute inset-y-0 left-0" style={{ width: `${pctW(COVER.ACCENT_W)}%`, backgroundColor: hex(COLOR.RED) }} />

      {/* Bain wordmark, top-left */}
      <div
        className="absolute font-bold tracking-widest"
        style={{
          left: `${pctX(MARGIN_L + 0.2)}%`,
          top: `${pctY(0.32)}%`,
          fontSize: `${ptToCqw(9)}cqw`,
          color: hex("111111"),
          fontFamily: ARIAL,
        }}
      >
        BAIN &amp; COMPANY
      </div>

      {/* Title */}
      <div
        className="absolute"
        style={{ left: `${pctX(COVER.TITLE_X)}%`, top: `${pctY(COVER.TITLE_Y)}%`, width: `${pctW(COVER.TITLE_W)}%` }}
      >
        <p style={{ fontSize: `${ptToCqw(COVER.TITLE_SIZE)}cqw`, color: hex("111111"), fontFamily: ARIAL, lineHeight: 1.15 }}>
          {title}
        </p>
      </div>

      {/* Red rule under title */}
      <div
        className="absolute"
        style={{
          left: `${pctX(COVER.TITLE_X)}%`,
          top: `${pctY(COVER.TITLE_Y + 0.82)}%`,
          width: `${pctW(COVER.TITLE_W * 0.18)}%`,
          height: "max(2px, 0.26cqw)",
          backgroundColor: hex(COLOR.RED),
        }}
      />

      {/* Subtitle */}
      {subtitle && (
        <div
          className="absolute"
          style={{ left: `${pctX(COVER.SUBTITLE_X)}%`, top: `${pctY(COVER.SUBTITLE_Y)}%`, width: `${pctW(COVER.SUBTITLE_W)}%` }}
        >
          <p style={{ fontSize: `${ptToCqw(COVER.SUBTITLE_SIZE)}cqw`, color: "#555555", fontFamily: ARIAL, lineHeight: 1.3 }}>
            {subtitle}
          </p>
        </div>
      )}

      {/* Meta line */}
      {metaParts.length > 0 && (
        <div
          className="absolute"
          style={{ left: `${pctX(COVER.META_X)}%`, top: `${pctY(COVER.META_Y)}%`, width: `${pctW(COVER.TITLE_W)}%` }}
        >
          <p style={{ fontSize: `${ptToCqw(COVER.META_SIZE)}cqw`, color: hex(COVER.META_COLOR), fontFamily: ARIAL }}>
            {metaParts.join("  |  ")}
          </p>
        </div>
      )}

      {/* Confidentiality label, bottom-right */}
      {confidentiality && (
        <div
          className="absolute text-right uppercase"
          style={{
            left: `${pctX(SLIDE_W - 2.5)}%`,
            top: `${pctY(FOOTER_Y)}%`,
            width: `${pctW(2.3)}%`,
            fontSize: `${ptToCqw(7)}cqw`,
            color: "#999999",
            fontFamily: ARIAL,
          }}
        >
          {confidentiality}
        </div>
      )}
    </div>
  );
}
