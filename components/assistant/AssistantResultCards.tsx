"use client";

/**
 * Rich result cards rendered from the deterministic tool outputs.
 * These surface alongside the AI-generated explanation text.
 */

import { BarChart2, Users, Globe, BookOpen, Database, TrendingUp, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  CaseAnalyticsToolResult,
  ContentSearchResult,
} from "@/lib/ai-assistant/types";

// ─── Case Analytics Card ──────────────────────────────────────────────────────

interface CaseAnalyticsCardProps {
  result: CaseAnalyticsToolResult;
}

export function CaseAnalyticsCard({ result }: CaseAnalyticsCardProps) {
  const { uniqueCaseCount, request, casesByEndYear, casesByRegion, casesBySolution, casesByIndustry, methodologyNotes } = result;

  const showYearBreakdown = casesByEndYear.length > 1 && casesByEndYear.some((y) => y.count > 0);
  const showRegionBreakdown = casesByRegion.length > 0;
  const showSolutionBreakdown = casesBySolution.length > 1;
  const showIndustryBreakdown = casesByIndustry.length > 1;

  // Pick the breakdown to show based on what has variance
  const hasYearVariance = casesByEndYear.some((y) => y.count !== casesByEndYear[0]?.count);

  return (
    <div className="mt-3 rounded-lg border border-border bg-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-4 py-2.5">
        <Database size={13} className="text-[#CC0000]" aria-hidden />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Case Registry — Deterministic Result
        </span>
      </div>

      {/* Big number */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-[40px] font-bold leading-none tabular-nums text-foreground">
            {uniqueCaseCount.toLocaleString()}
          </span>
          <span className="text-[14px] text-muted-foreground">unique cases</span>
        </div>
        <div className="mt-1 text-[12px] text-muted-foreground">
          {request.startDate.slice(0, 4)} – {request.endDate.slice(0, 4)}
          {request.regions.length > 0 && (
            <> &middot; {request.regions.join(", ")}</>
          )}
          {request.isFoodSystemsTransformation && (
            <> &middot; Food Systems Transformation</>
          )}
        </div>
      </div>

      {/* Year breakdown */}
      {showYearBreakdown && (
        <div className="border-t border-border px-4 py-3">
          <div className="mb-2 flex items-center gap-1.5">
            <TrendingUp size={11} className="text-muted-foreground" aria-hidden />
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              By End Year
            </span>
          </div>
          <div className="space-y-1.5">
            {casesByEndYear.map(({ year, count }) => {
              const maxCount = Math.max(...casesByEndYear.map((y) => y.count));
              const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
              return (
                <div key={year} className="flex items-center gap-2">
                  <span className="w-12 text-right text-[12px] tabular-nums text-muted-foreground">
                    FY{String(year).slice(2)}
                  </span>
                  <div className="flex-1 overflow-hidden rounded bg-secondary/60">
                    <div
                      className="h-4 rounded bg-[#CC0000]/80 transition-all"
                      style={{ width: `${Math.max(pct, count > 0 ? 3 : 0)}%` }}
                      role="presentation"
                    />
                  </div>
                  <span className="w-8 text-right text-[12px] tabular-nums font-medium text-foreground">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Region breakdown */}
      {showRegionBreakdown && casesByRegion.length > 1 && (
        <div className="border-t border-border px-4 py-3">
          <div className="mb-2 flex items-center gap-1.5">
            <MapPin size={11} className="text-muted-foreground" aria-hidden />
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              By Region
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {casesByRegion.map(({ region, count }) => (
              <div key={region} className="rounded bg-secondary/40 px-3 py-2">
                <div className="text-[12px] tabular-nums font-semibold text-foreground">
                  {count.toLocaleString()}
                </div>
                <div className="text-[11px] text-muted-foreground">{region}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Industry breakdown */}
      {showIndustryBreakdown && (
        <div className="border-t border-border px-4 py-3">
          <div className="mb-2 flex items-center gap-1.5">
            <BarChart2 size={11} className="text-muted-foreground" aria-hidden />
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              By Industry
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {casesByIndustry.map(({ industry, count }) => (
              <div key={industry} className="rounded bg-secondary/40 px-3 py-2">
                <div className="text-[12px] tabular-nums font-semibold text-foreground">
                  {count.toLocaleString()}
                </div>
                <div className="text-[11px] text-muted-foreground">{industry}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Methodology note */}
      <div className="border-t border-border bg-secondary/20 px-4 py-2.5">
        <p className="text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground">Methodology: </span>
          {methodologyNotes[0]}
        </p>
      </div>
    </div>
  );
}

// ─── Content Search Results ───────────────────────────────────────────────────

interface ContentSearchCardProps {
  result: ContentSearchResult;
  onCredentialClick?: (id: string) => void;
  onExpertClick?: (id: string) => void;
  onPartnerClick?: (id: string) => void;
  onPublicationClick?: (id: string) => void;
}

export function ContentSearchCard({
  result,
  onCredentialClick,
  onExpertClick,
  onPartnerClick,
  onPublicationClick,
}: ContentSearchCardProps) {
  const { credentials, experts, partners, publications, totalMatches } = result;
  if (totalMatches === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      {credentials.length > 0 && (
        <ContentSection
          icon={<BarChart2 size={12} className="text-[#CC0000]" />}
          label="Case Examples"
          count={credentials.length}
        >
          {credentials.map((c) => (
            <ContentRow
              key={c.id}
              title={c.title}
              subtitle={[
                c.year ? String(c.year) : null,
                c.confidentiality !== "public" ? c.confidentiality : null,
              ]
                .filter(Boolean)
                .join(" · ")}
              onClick={onCredentialClick ? () => onCredentialClick(c.id) : undefined}
            />
          ))}
        </ContentSection>
      )}

      {experts.length > 0 && (
        <ContentSection
          icon={<Users size={12} className="text-[#CC0000]" />}
          label="Experts"
          count={experts.length}
        >
          {experts.map((e) => (
            <ContentRow
              key={e.id}
              title={e.name}
              subtitle={e.title}
              onClick={onExpertClick ? () => onExpertClick(e.id) : undefined}
            />
          ))}
        </ContentSection>
      )}

      {partners.length > 0 && (
        <ContentSection
          icon={<Globe size={12} className="text-[#CC0000]" />}
          label="Ecosystem Partners"
          count={partners.length}
        >
          {partners.map((p) => (
            <ContentRow
              key={p.id}
              title={p.name}
              subtitle={p.category}
              onClick={onPartnerClick ? () => onPartnerClick(p.id) : undefined}
            />
          ))}
        </ContentSection>
      )}

      {publications.length > 0 && (
        <ContentSection
          icon={<BookOpen size={12} className="text-[#CC0000]" />}
          label="Publications"
          count={publications.length}
        >
          {publications.map((pub) => (
            <ContentRow
              key={pub.id}
              title={pub.title}
              subtitle={[pub.publicationType, pub.year ? String(pub.year) : null]
                .filter(Boolean)
                .join(" · ")}
              onClick={onPublicationClick ? () => onPublicationClick(pub.id) : undefined}
            />
          ))}
        </ContentSection>
      )}
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function ContentSection({
  icon,
  label,
  count,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-background overflow-hidden">
      <div className="flex items-center gap-1.5 border-b border-border bg-secondary/30 px-3 py-2">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="ml-auto rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          {count}
        </span>
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

function ContentRow({
  title,
  subtitle,
  onClick,
}: {
  title: string;
  subtitle?: string;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "flex w-full flex-col items-start gap-0.5 px-3 py-2.5 text-left",
        onClick && "transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      )}
    >
      <span className="text-[12px] font-medium leading-snug text-foreground line-clamp-2">
        {title}
      </span>
      {subtitle && (
        <span className="text-[11px] text-muted-foreground">{subtitle}</span>
      )}
    </Tag>
  );
}
