"use client";

/**
 * components/solutions/CaseExampleSlide.tsx
 *
 * Pixel-faithful recreation of Bain's "case example" credential slide
 * template (Situation / What We Did / Results, three columns under a
 * tag row). Built on the same SlideFrame chrome (header / red rule /
 * confidentiality footer / BAIN & COMPANY wordmark) used by the Pack
 * Builder preview, so the geometry constants never drift between this
 * exhibit and the rest of the slide system — see
 * lib/export/pptx/presentation-theme.ts.
 */

import { CheckCircle2, Flag } from "lucide-react";
import type { CaseExample, ChartSpec, RichBullet } from "@/data/case-examples";
import { SlideFrame } from "@/components/builder/SlideFrame";
import { COLOR } from "@/lib/export/pptx/presentation-theme";

const RED = `#${COLOR.RED}`;

/** Renders `**bold**` spans within a plain string as <strong>. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} style={{ fontWeight: 700 }}>
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function BulletBlock({ bullets, size = 1 }: { bullets: RichBullet[]; size?: number }) {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {bullets.map((b, i) => (
        <li key={i} style={{ position: "relative", paddingLeft: `${0.9 * size}cqw`, marginBottom: `${0.55 * size}cqw` }}>
          <span style={{ position: "absolute", left: 0, top: "0.1em" }}>•</span>
          <RichText text={b.text} />
          {b.subBullets && b.subBullets.length > 0 && (
            <ul style={{ listStyle: "none", margin: `${0.2 * size}cqw 0 0`, paddingLeft: `${1.1 * size}cqw` }}>
              {b.subBullets.map((sub, si) => (
                <li key={si} style={{ position: "relative", paddingLeft: `${0.85 * size}cqw`, marginBottom: `${0.25 * size}cqw` }}>
                  <span style={{ position: "absolute", left: 0, top: "0.15em" }}>–</span>
                  <RichText text={sub} />
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Small illustrative bar charts — no axis values, matching the schematic source slide. */
function DualBarChart({ chart }: { chart: Extract<ChartSpec, { kind: "dual-bar" }> }) {
  return (
    <div style={{ display: "flex", gap: "3cqw", marginTop: "0.5cqw" }}>
      {chart.charts.map((c) => (
        <div key={c.title} style={{ flex: 1 }}>
          <div style={{ textAlign: "center", fontSize: "0.85cqw", fontWeight: 700, color: "#333" }}>
            <span aria-hidden="true">──── </span>
            {c.title}
            <span aria-hidden="true"> ────</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.4cqw", height: "3.6cqw", marginTop: "0.3cqw" }}>
            {c.values.map((v, i) => (
              <div key={i} style={{ flex: 1, height: `${Math.max(v, 0.08) * 100}%`, background: "#333" }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.4cqw", marginTop: "0.15cqw" }}>
            {c.years.map((y) => (
              <div key={y} style={{ flex: 1, textAlign: "center", fontSize: "0.72cqw", color: "#666" }}>
                {y}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Schematic bridge / waterfall chart matching the source's up-down merit-order lever bars. */
function BridgeChart({ chart }: { chart: Extract<ChartSpec, { kind: "bridge" }> }) {
  const cols = [
    { label: chart.startLabel, delta: 0, kind: "anchor" as const },
    ...chart.steps.map((s) => ({ ...s, kind: "lever" as const })),
    { label: chart.endLabel, delta: 0, kind: "anchor" as const },
  ];
  // Running level: start at 1 (full inertial bar), apply each lever's delta, end near a low target.
  let level = 1;
  const levels: number[] = [level];
  for (const step of cols.slice(1, -1)) {
    level += (step as { delta: number }).delta;
    levels.push(level);
  }
  levels.push(Math.max(level, 0.08));

  // Normalize against the highest point the running level actually reaches — an
  // uplift lever (e.g. a positive delta before the net reduction) can push the
  // level above the starting bar's height of 1, which would otherwise overflow
  // the fixed-height chart area.
  const maxLevel = Math.max(...levels, 0.01);

  const chartH = 3.4; // cqw
  return (
    <div style={{ marginTop: "0.5cqw" }}>
      <div style={{ display: "flex", alignItems: "flex-end", height: `${chartH}cqw`, gap: "0.35cqw" }}>
        {cols.map((col, i) => {
          const isAnchor = col.kind === "anchor";
          const barBottom = isAnchor ? 0 : Math.min(levels[i], levels[i - 1]);
          const barHeight = isAnchor ? levels[i] : Math.abs(levels[i] - levels[i - 1]);
          const color = isAnchor ? "#444444" : (col as { delta: number }).delta < 0 ? RED : "#444444";
          return (
            <div key={i} style={{ flex: 1, position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: `${(barBottom / maxLevel) * 100}%`,
                  height: `${Math.max((barHeight / maxLevel) * 100, 5)}%`,
                  background: color,
                }}
              />
              {i > 0 && i < cols.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: "-0.18cqw",
                    right: "50%",
                    borderTop: "1px dashed #bbb",
                    top: `${100 - (levels[i - 1] / maxLevel) * 100}%`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: "0.35cqw", marginTop: "0.25cqw" }}>
        {cols.map((col, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: "0.68cqw",
              fontWeight: col.kind === "anchor" ? 700 : 400,
              color: col.kind === "anchor" ? "#111" : "#555",
              whiteSpace: "pre-line",
              lineHeight: 1.15,
            }}
          >
            {col.label.replace(/\\n/g, "\n")}
          </div>
        ))}
      </div>
    </div>
  );
}

function WhatWeDidColumn({ example }: { example: CaseExample }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.1cqw" }}>
      <SectionHeading text={example.whatWeDidHeading} />
      {example.whatWeDid.map((block, i) => (
        <div key={i}>
          {block.heading && (
            <div style={{ fontSize: "1.05cqw", fontWeight: 700, color: "#111", marginBottom: "0.3cqw" }}>
              {block.heading}
            </div>
          )}
          {block.body && (
            <p style={{ margin: 0, fontSize: "0.95cqw", lineHeight: 1.4, color: "#333" }}>
              <RichText text={block.body} />
            </p>
          )}
          {block.bullets && block.bullets.length > 0 && (
            <div style={{ fontSize: "0.95cqw", lineHeight: 1.4, color: "#333" }}>
              <BulletBlock bullets={block.bullets} />
            </div>
          )}
          {block.chart?.kind === "dual-bar" && <DualBarChart chart={block.chart} />}
          {block.chart?.kind === "bridge" && <BridgeChart chart={block.chart} />}
        </div>
      ))}
    </div>
  );
}

function SectionHeading({ text }: { text: string }) {
  return (
    <div>
      <div style={{ fontSize: "1.2cqw", fontWeight: 700, color: "#111", letterSpacing: "0.02em" }}>{text}</div>
      <div style={{ height: "0.35cqw", width: "2.4cqw", background: "#999", marginTop: "0.35cqw" }} />
    </div>
  );
}

function ResultIcon({ item }: { item: CaseExample["results"][number] }) {
  if (item.icon === "badge") {
    return (
      <div
        style={{
          flexShrink: 0,
          minWidth: "3.6cqw",
          height: "2.4cqw",
          padding: "0 0.3cqw",
          background: RED,
          color: "#fff",
          fontSize: "1.15cqw",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {item.badgeValue}
      </div>
    );
  }
  if (item.icon === "flag") {
    return (
      <div style={{ flexShrink: 0, width: "1.6cqw", display: "flex", justifyContent: "center", paddingTop: "0.15cqw" }}>
        <Flag color={RED} strokeWidth={2.2} style={{ width: "1.4cqw", height: "1.4cqw" }} />
      </div>
    );
  }
  return (
    <div style={{ flexShrink: 0, width: "1.6cqw", display: "flex", justifyContent: "center", paddingTop: "0.15cqw" }}>
      <CheckCircle2 color={RED} strokeWidth={2} style={{ width: "1.4cqw", height: "1.4cqw" }} />
    </div>
  );
}

function ResultsColumn({ example }: { example: CaseExample }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.4cqw" }}>
      <div>
        <div style={{ height: "0.5cqw", width: "1.9cqw", background: RED, marginBottom: "0.5cqw" }} />
        <div style={{ fontSize: "1.2cqw", fontWeight: 700, color: "#111", letterSpacing: "0.02em" }}>RESULTS</div>
      </div>
      {example.results.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: "0.6cqw", alignItems: "flex-start" }}>
          <ResultIcon item={item} />
          <div style={{ fontSize: "0.95cqw", lineHeight: 1.35, color: "#222" }}>
            <RichText text={item.text} />
            {item.subBullets && item.subBullets.length > 0 && (
              <ul style={{ listStyle: "none", margin: "0.25cqw 0 0", padding: 0 }}>
                {item.subBullets.map((sub, si) => (
                  <li key={si} style={{ position: "relative", paddingLeft: "0.9cqw", marginBottom: "0.2cqw" }}>
                    <span style={{ position: "absolute", left: 0, top: "0.1em" }}>–</span>
                    <RichText text={sub} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CaseExampleSlide({ example }: { example: CaseExample }) {
  const header = (
    <>
      <strong style={{ color: RED, fontWeight: 700 }}>{example.titleAccent}</strong>
      <span style={{ color: "#111" }}> – {example.titleRest}</span>
    </>
  );

  return (
    <SlideFrame header={header} pageNumber={example.pageNumber}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "0.9cqw" }}>
        {/* Tag row */}
        <div style={{ display: "flex", gap: "0.5cqw", flexShrink: 0 }}>
          {[
            { label: "Year", value: example.year },
            { label: "Industry", value: example.industry },
            { label: "Product", value: example.product },
          ].map((tag) => (
            <div
              key={tag.label}
              style={{
                background: "#555555",
                color: "#fff",
                fontSize: "0.85cqw",
                fontWeight: 700,
                padding: "0.35cqw 0.7cqw",
                whiteSpace: "nowrap",
              }}
            >
              {tag.label}: {tag.value}
            </div>
          ))}
        </div>

        {/* Three-column body */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2.2cqw", flex: 1, minHeight: 0 }}>
          {/* Situation — grey panel */}
          <div style={{ background: "#eeeeee", padding: "1cqw", display: "flex", flexDirection: "column", gap: "1.1cqw" }}>
            <SectionHeading text="SITUATION" />
            <div style={{ fontSize: "0.95cqw", lineHeight: 1.4, color: "#333" }}>
              <BulletBlock bullets={example.situation} />
            </div>
          </div>

          {/* What we did */}
          <div>
            <WhatWeDidColumn example={example} />
          </div>

          {/* Results */}
          <div>
            <ResultsColumn example={example} />
          </div>
        </div>

        {example.footnote && (
          <div style={{ fontSize: "0.75cqw", color: "#666", flexShrink: 0 }}>{example.footnote}</div>
        )}
      </div>
    </SlideFrame>
  );
}
