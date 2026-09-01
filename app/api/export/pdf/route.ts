/**
 * app/api/export/pdf/route.ts
 *
 * POST /api/export/pdf
 *
 * Returns a print-optimised HTML page that, when opened in a browser,
 * can be saved as PDF via File > Print > Save as PDF.
 *
 * We do not use a headless browser (Puppeteer) because it is not available
 * in this deployment environment. The returned HTML includes:
 *   - Print-media CSS with page breaks
 *   - All slide content inlined as styled HTML
 *   - A visible "Print this page" banner so the user knows what to do
 *
 * Body: same shape as /api/export/pptx
 */

import { NextRequest, NextResponse } from "next/server";
import type { PackState } from "@/types/credentials";
import type { AnalyticsSnapshot } from "@/lib/export/types";
import { validatePackForExport } from "@/lib/export/pptx/validate-presentation";
import { CREDENTIALS } from "@/data/credentials";
import { EXPERTS } from "@/data/experts";
import { PARTNERS } from "@/data/partners";
import { PUBLICATIONS } from "@/data/publications";
import { DEFAULT_SECTION_FOR_TYPE } from "@/lib/pack-constants";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 20;

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (req.signal?.aborted) {
    return NextResponse.json({ error: "Request aborted." }, { status: 499 });
  }

  let pack: PackState;
  let analyticsSnapshot: AnalyticsSnapshot | undefined;

  try {
    const body = await req.json();
    pack = JSON.parse(body.packJson ?? "{}") as PackState;
    if (body.analyticsJson) {
      analyticsSnapshot = JSON.parse(body.analyticsJson) as AnalyticsSnapshot;
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validation = validatePackForExport(pack);
  if (!validation.ok) {
    const blocking = validation.warnings.filter((w) => w.blocking).map((w) => w.message);
    return NextResponse.json({ error: `Export blocked: ${blocking.join("; ")}` }, { status: 422 });
  }

  const html = buildPrintHtml(pack, analyticsSnapshot);
  const title = (pack.metadata.packTitle || "credentials-pack")
    .replace(/[^a-zA-Z0-9_\- ]/g, "").trim().replace(/\s+/g, "_").toLowerCase();
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const filename = `${title}_${dateStr}.html`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

// ─── HTML builder ─────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildPrintHtml(pack: PackState, analytics?: AnalyticsSnapshot): string {
  const meta = pack.metadata;
  const exportable = pack.items.filter((i) => !i.exportRestricted);

  const slides: string[] = [];

  // Cover
  slides.push(`
    <div class="slide cover">
      <div class="red-bar"></div>
      <div class="cover-inner">
        <div class="cover-bain">BAIN &amp; COMPANY</div>
        <h1 class="cover-title">${esc(meta.packTitle || "Credential Pack")}</h1>
        <div class="cover-rule"></div>
        ${meta.clientSituation ? `<p class="cover-subtitle">${esc(meta.clientSituation)}</p>` : ""}
        <div class="cover-meta">
          ${meta.clientAlias ? `<span>Prepared for: ${esc(meta.clientAlias)}</span>` : ""}
          ${meta.preparedBy ? `<span>Prepared by: ${esc(meta.preparedBy)}</span>` : ""}
          ${meta.date ? `<span>${esc(meta.date)}</span>` : ""}
        </div>
      </div>
      <div class="conf-label">Internal — not for external distribution</div>
    </div>
  `);

  // Content slides grouped by section
  for (const section of pack.sections) {
    const items = exportable.filter(
      (i) => (i.section ?? DEFAULT_SECTION_FOR_TYPE[i.itemType]) === section.id
    );
    if (items.length === 0) continue;

    // Section divider
    slides.push(`
      <div class="slide divider">
        <div class="red-bar"></div>
        <h2 class="divider-title">${esc(section.label)}</h2>
        <div class="divider-rule"></div>
      </div>
    `);

    for (const item of items) {
      if (item.itemType === "credential") {
        const cred = CREDENTIALS.find((c) => c.id === item.id);
        if (!cred || cred.confidentiality === "restricted") continue;
        slides.push(`
          <div class="slide content">
            <div class="title-bar">
              <h2 class="slide-title">${esc(cred.title)}</h2>
              <div class="slide-rule"></div>
              <div class="slide-meta">${[cred.clientAlias, cred.year, cred.type].filter(Boolean).join(" · ")}</div>
            </div>
            <div class="two-col">
              <div class="col-left">
                ${cred.challenge ? `<div class="section-label">CHALLENGE</div><p>${esc(cred.challenge)}</p>` : ""}
                <div class="section-label">OUR APPROACH</div>
                <ul>${cred.actions.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
              </div>
              <div class="col-right">
                ${cred.results.length > 0 ? `
                  <div class="section-label">RESULTS</div>
                  ${cred.results.slice(0, 3).map((r) => `
                    <div class="metric">
                      <div class="metric-value">${esc(r.displayValue ?? String(r.value) + (r.unit ?? ""))}</div>
                      <div class="metric-label">${esc(r.label)}</div>
                    </div>
                  `).join("")}
                ` : ""}
                <div class="section-label">SUMMARY</div>
                <p class="summary-text">${esc(cred.summary)}</p>
              </div>
            </div>
            <div class="footer">${cred.sourceSlides.length > 0 ? `Source slides: ${cred.sourceSlides.join(", ")}` : "Curated credential"}</div>
          </div>
        `);
      } else if (item.itemType === "expert") {
        const expert = EXPERTS.find((e) => e.id === item.id);
        if (!expert) continue;
        slides.push(`
          <div class="slide content">
            <div class="title-bar">
              <h2 class="slide-title">Expert Profile</h2>
              <div class="slide-rule"></div>
            </div>
            <div class="two-col">
              <div class="col-left expert-panel">
                <h3 class="expert-name">${esc(expert.name)}</h3>
                <div class="expert-title">${esc(expert.title || "")}</div>
                <div class="expert-rule"></div>
                ${expert.leadership.map((l) => `<div class="expert-lead">${esc(l.label)}</div>`).join("")}
                <div class="expert-tags">${expert.expertise.slice(0, 4).map((e) => esc(e)).join(" · ")}</div>
              </div>
              <div class="col-right">
                ${expert.bio ? `<div class="section-label">BIOGRAPHY</div><p>${esc(expert.bio)}</p>` : ""}
                ${expert.expertise.length > 0 ? `<div class="section-label">EXPERTISE</div><p>${expert.expertise.join(" · ")}</p>` : ""}
              </div>
            </div>
            <div class="footer">${expert.sourceSlides.length > 0 ? `Source slides: ${expert.sourceSlides.join(", ")}` : "Curated profile"}</div>
          </div>
        `);
      } else if (item.itemType === "partner") {
        const partner = PARTNERS.find((p) => p.id === item.id);
        if (!partner) continue;
        slides.push(`
          <div class="slide content">
            <div class="title-bar"><h2 class="slide-title">Ecosystem Partner</h2><div class="slide-rule"></div></div>
            <h3 class="partner-name">${esc(partner.name)}</h3>
            <div class="partner-cat">${esc(partner.category)}</div>
            <p class="body-text">${esc(partner.description)}</p>
            ${partner.useCases.length > 0 ? `<div class="section-label">USE CASES</div><ul>${partner.useCases.slice(0, 6).map((u) => `<li>${esc(u)}</li>`).join("")}</ul>` : ""}
            <div class="footer">${partner.sourceSlides.length > 0 ? `Source slides: ${partner.sourceSlides.join(", ")}` : "Curated record"}</div>
          </div>
        `);
      } else if (item.itemType === "publication") {
        const pub = PUBLICATIONS.find((p) => p.id === item.id);
        if (!pub) continue;
        slides.push(`
          <div class="slide content">
            <div class="title-bar"><h2 class="slide-title">Thought Leadership</h2><div class="slide-rule"></div></div>
            <div class="pub-type">${esc(pub.publicationType)} ${pub.year ? `· ${pub.year}` : ""}</div>
            <h3 class="pub-title">${esc(pub.title)}</h3>
            <p class="body-text">${esc(pub.abstract)}</p>
            ${pub.authors.length > 0 ? `<div class="section-label">AUTHORS</div><p>${pub.authors.join(", ")}</p>` : ""}
            <div class="footer">${pub.sourceSlides.length > 0 ? `Source slides: ${pub.sourceSlides.join(", ")}` : "Curated record"}</div>
          </div>
        `);
      } else if (item.itemType === "chart" && analytics) {
        slides.push(`
          <div class="slide content">
            <div class="title-bar"><h2 class="slide-title">Case Analytics — ${esc(analytics.period)}</h2><div class="slide-rule"></div></div>
            <div class="kpi-row">
              <div class="kpi"><div class="kpi-val">${analytics.kpis.total}</div><div class="kpi-lbl">Total cases</div></div>
              <div class="kpi"><div class="kpi-val red">${analytics.kpis.emea}</div><div class="kpi-lbl">EMEA</div></div>
              <div class="kpi"><div class="kpi-val red">${analytics.kpis.americas}</div><div class="kpi-lbl">Americas</div></div>
              <div class="kpi"><div class="kpi-val red">${analytics.kpis.apac}</div><div class="kpi-lbl">APAC</div></div>
              <div class="kpi"><div class="kpi-val red">${analytics.kpis.fst}</div><div class="kpi-lbl">Food Systems</div></div>
            </div>
            <div class="section-label">CASES BY SOLUTION (COL Q)</div>
            ${analytics.solutionRows.map((r) => `<div class="bar-row"><span class="bar-label">${esc(r.label)}</span><span class="bar-count">${r.count}</span></div>`).join("")}
            <div class="footer">SustainabilityCases.xlsx · imported ${esc(analytics.workbookImportDate)}</div>
          </div>
        `);
      }
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${esc(meta.packTitle || "Credential Pack")} — Print Preview</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; color: #111; background: #e5e5e5; }
    .print-banner { background: #222; color: #fff; text-align: center; padding: 12px 16px; font-size: 13px; }
    .print-banner a { color: #FF6666; cursor: pointer; text-decoration: underline; }
    .slide { background: #fff; width: 270mm; min-height: 152mm; margin: 12mm auto; padding: 14mm 16mm 10mm; position: relative; page-break-after: always; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
    .red-bar { position: absolute; left: 0; top: 0; width: 4px; height: 100%; background: #CC0000; }
    /* Cover */
    .cover { background: #fff; }
    .cover-inner { padding-left: 8mm; }
    .cover-bain { font-size: 8pt; font-weight: bold; letter-spacing: 3px; color: #111; margin-bottom: 18mm; }
    .cover-title { font-size: 24pt; font-weight: 400; color: #111; line-height: 1.2; margin-bottom: 4mm; }
    .cover-rule { width: 20mm; height: 2px; background: #CC0000; margin-bottom: 5mm; }
    .cover-subtitle { font-size: 12pt; color: #555; margin-bottom: 8mm; }
    .cover-meta { font-size: 9pt; color: #666; display: flex; gap: 12px; flex-wrap: wrap; }
    .conf-label { position: absolute; bottom: 8mm; right: 16mm; font-size: 7pt; color: #999; }
    /* Section divider */
    .divider { background: #111; min-height: 100mm; display: flex; align-items: center; }
    .divider .red-bar { background: #CC0000; }
    .divider-title { font-size: 22pt; font-weight: 400; color: #fff; padding-left: 8mm; }
    .divider-rule { width: 18mm; height: 2px; background: #CC0000; margin-left: 8mm; margin-top: 4mm; }
    /* Content */
    .title-bar { margin-bottom: 6mm; }
    .slide-title { font-size: 14pt; font-weight: 400; color: #111; margin-bottom: 2mm; }
    .slide-rule { width: 100%; height: 1.5px; background: #CC0000; }
    .slide-meta { font-size: 8pt; color: #666; margin-top: 2mm; }
    .section-label { font-size: 7pt; font-weight: bold; color: #888; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 4mm; margin-bottom: 1.5mm; padding-bottom: 1mm; border-bottom: 0.5px solid #ddd; }
    .two-col { display: grid; grid-template-columns: 54% 44%; gap: 5mm; }
    .col-left, .col-right { font-size: 9.5pt; }
    ul { padding-left: 4mm; margin-top: 2mm; }
    li { margin-bottom: 1.5mm; font-size: 9.5pt; }
    li::marker { color: #CC0000; }
    p { font-size: 9.5pt; line-height: 1.45; margin-top: 2mm; color: #333; }
    .metric { margin-bottom: 4mm; }
    .metric-value { font-size: 18pt; font-weight: bold; color: #CC0000; line-height: 1; }
    .metric-label { font-size: 7.5pt; color: #666; }
    .summary-text { font-size: 8.5pt; color: #444; }
    .expert-panel { background: #f5f5f5; padding: 5mm; border: 0.5px solid #ddd; }
    .expert-name { font-size: 13pt; font-weight: bold; color: #111; margin-bottom: 2mm; }
    .expert-title { font-size: 8.5pt; color: #555; margin-bottom: 3mm; }
    .expert-rule { width: 18mm; height: 1.5px; background: #CC0000; margin-bottom: 3mm; }
    .expert-lead { font-size: 8pt; font-weight: bold; color: #111; margin-bottom: 1.5mm; }
    .expert-tags { font-size: 7.5pt; color: #666; margin-top: 4mm; }
    .partner-name { font-size: 16pt; font-weight: bold; color: #111; margin: 3mm 0 1.5mm; }
    .partner-cat { font-size: 8.5pt; font-weight: bold; color: #666; margin-bottom: 3mm; }
    .pub-type { font-size: 8pt; font-weight: bold; color: #888; margin-bottom: 2mm; text-transform: uppercase; letter-spacing: 1px; }
    .pub-title { font-size: 14pt; color: #111; margin-bottom: 3mm; font-weight: 400; }
    .body-text { font-size: 9.5pt; color: #333; line-height: 1.45; }
    .kpi-row { display: flex; gap: 4mm; margin: 4mm 0 6mm; }
    .kpi { background: #f5f5f5; border: 0.5px solid #ddd; padding: 3mm 5mm; flex: 1; }
    .kpi-val { font-size: 18pt; font-weight: bold; color: #111; }
    .kpi-val.red { color: #CC0000; }
    .kpi-lbl { font-size: 7.5pt; color: #777; }
    .bar-row { display: flex; align-items: center; gap: 4mm; margin-bottom: 2mm; font-size: 8.5pt; }
    .bar-label { flex: 1; color: #333; }
    .bar-count { font-weight: bold; color: #111; width: 20px; text-align: right; }
    .footer { position: absolute; bottom: 6mm; left: 16mm; right: 16mm; font-size: 7pt; color: #999; border-top: 0.5px solid #ddd; padding-top: 2mm; }
    @media print {
      body { background: white; }
      .print-banner { display: none; }
      .slide { box-shadow: none; margin: 0; width: 100%; page-break-after: always; }
    }
  </style>
</head>
<body>
  <div class="print-banner">
    Print-ready preview &mdash; open File &gt; Print and choose <strong>Save as PDF</strong>.
    &nbsp;<a onclick="window.print()">Print now</a>
  </div>
  ${slides.join("\n")}
</body>
</html>`;
}
