"use client";

import useSWR from "swr";
import { RefreshCw, BarChart2, TrendingUp, Search, Package, Download } from "lucide-react";

const FETCHER = (url: string) =>
  fetch(url, { credentials: "include" }).then((r) => r.json());

interface UsageSummary {
  totalEvents: number;
  uniqueSessions: number;
  topFeatures: { feature: string; count: number }[];
  topEntities: { entityType: string; entityId: string; count: number }[];
  dailyCounts: { date: string; count: number }[];
  eventTypeCounts: { eventType: string; count: number }[];
}

function StatBlock({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3 rounded border border-border bg-background p-4">
      <span className="rounded bg-secondary p-2 text-muted-foreground">
        <Icon size={16} aria-hidden />
      </span>
      <div>
        <div className="text-[20px] font-semibold tabular-nums text-foreground">{value}</div>
        <div className="text-[12px] text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { data, isLoading, mutate } = useSWR<UsageSummary>(
    "/api/admin/analytics/usage",
    FETCHER
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-foreground">Usage Analytics</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Pseudonymised usage events — no personal data stored.
          </p>
        </div>
        <button
          onClick={() => mutate()}
          className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
          aria-label="Refresh analytics"
        >
          <RefreshCw size={13} aria-hidden />
          Refresh
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 py-12 text-[13px] text-muted-foreground">
          <RefreshCw size={14} className="animate-spin" aria-hidden />
          Loading usage data…
        </div>
      )}

      {data && (
        <>
          {/* KPI strip */}
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <StatBlock label="Total events" value={data.totalEvents.toLocaleString()} icon={BarChart2} />
            <StatBlock label="Unique sessions" value={data.uniqueSessions.toLocaleString()} icon={TrendingUp} />
            <StatBlock
              label="Search events"
              value={
                data.eventTypeCounts.find((e) => e.eventType === "search")?.count.toLocaleString() ?? 0
              }
              icon={Search}
            />
            <StatBlock
              label="Pack exports"
              value={
                data.eventTypeCounts.find((e) => e.eventType === "pack.export")?.count.toLocaleString() ?? 0
              }
              icon={Package}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {/* Event type breakdown */}
            <div className="rounded border border-border bg-background p-4">
              <h2 className="mb-3 text-[13px] font-semibold text-foreground">Event types</h2>
              {data.eventTypeCounts.length === 0 ? (
                <p className="text-[12px] text-muted-foreground">No events recorded yet.</p>
              ) : (
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-2 text-left font-medium text-muted-foreground">Event</th>
                      <th className="pb-2 text-right font-medium text-muted-foreground">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.eventTypeCounts.map((e) => (
                      <tr key={e.eventType} className="border-b border-border last:border-0">
                        <td className="py-1.5 font-mono text-foreground">{e.eventType}</td>
                        <td className="py-1.5 text-right tabular-nums text-muted-foreground">
                          {e.count.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Top features */}
            <div className="rounded border border-border bg-background p-4">
              <h2 className="mb-3 text-[13px] font-semibold text-foreground">Top features</h2>
              {data.topFeatures.length === 0 ? (
                <p className="text-[12px] text-muted-foreground">No feature data yet.</p>
              ) : (
                <div className="space-y-2">
                  {data.topFeatures.slice(0, 10).map((f, i) => {
                    const max = data.topFeatures[0]?.count ?? 1;
                    return (
                      <div key={f.feature} className="flex items-center gap-2">
                        <span className="w-4 text-[10px] tabular-nums text-muted-foreground text-right">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <div className="mb-0.5 flex items-center justify-between">
                            <span className="text-[12px] text-foreground">{f.feature}</span>
                            <span className="text-[11px] tabular-nums text-muted-foreground">
                              {f.count.toLocaleString()}
                            </span>
                          </div>
                          <div className="h-1 w-full rounded bg-secondary">
                            <div
                              className="h-1 rounded bg-[#CC0000]"
                              style={{ width: `${(f.count / max) * 100}%` }}
                              aria-hidden
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Daily counts */}
          {data.dailyCounts.length > 0 && (
            <div className="rounded border border-border bg-background p-4">
              <div className="mb-3 flex items-center gap-2">
                <BarChart2 size={14} className="text-muted-foreground" aria-hidden />
                <h2 className="text-[13px] font-semibold text-foreground">Events per day (last 30 days)</h2>
              </div>
              <div className="flex items-end gap-1 h-16">
                {data.dailyCounts.slice(-30).map((d) => {
                  const max = Math.max(...data.dailyCounts.map((x) => x.count), 1);
                  return (
                    <div
                      key={d.date}
                      className="flex-1 rounded-t bg-[#CC0000]/60 hover:bg-[#CC0000] transition-colors"
                      style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count > 0 ? "3px" : "0" }}
                      title={`${d.date}: ${d.count} events`}
                      aria-label={`${d.date}: ${d.count} events`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Export */}
          <div className="flex justify-end">
            <a
              href="/api/admin/analytics/export"
              className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
              aria-label="Export usage data as JSON"
            >
              <Download size={13} aria-hidden />
              Export JSON
            </a>
          </div>
        </>
      )}
    </div>
  );
}
