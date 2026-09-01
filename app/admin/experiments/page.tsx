"use client";

import { useState } from "react";
import useSWR from "swr";
import { RefreshCw, FlaskConical, Plus, Play, Pause, StopCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Experiment } from "@/lib/stores/experiment-store";

const FETCHER = (url: string) =>
  fetch(url, { credentials: "include" }).then((r) => r.json());

const STATUS_CONFIG: Record<
  Experiment["status"],
  { label: string; color: string }
> = {
  draft: { label: "Draft", color: "bg-secondary text-muted-foreground" },
  active: { label: "Active", color: "bg-green-500/10 text-green-500" },
  paused: { label: "Paused", color: "bg-amber-500/10 text-amber-500" },
  completed: { label: "Completed", color: "bg-secondary text-muted-foreground" },
};

function relDate(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "1d ago";
  return `${d}d ago`;
}

interface ExperimentsResponse {
  experiments: Experiment[];
}

export default function AdminExperimentsPage() {
  const { data, isLoading, mutate } = useSWR<ExperimentsResponse>(
    "/api/admin/experiments",
    FETCHER
  );

  const [updating, setUpdating] = useState<string | null>(null);

  const experiments = data?.experiments ?? [];
  const active = experiments.filter((e) => e.status === "active").length;

  async function updateStatus(id: string, status: Experiment["status"]) {
    setUpdating(id);
    try {
      await fetch(`/api/admin/experiments/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      mutate();
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-foreground">Experiments</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {experiments.length} registered · {active} active
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => mutate()}
            className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
            aria-label="Refresh experiments"
          >
            <RefreshCw size={13} aria-hidden />
            Refresh
          </button>
        </div>
      </div>

      {/* Guidance */}
      <div className="rounded border border-border bg-secondary/30 px-4 py-3 text-[12px] text-muted-foreground">
        Experiments are registered in code via{" "}
        <code className="font-mono text-foreground">lib/stores/experiment-store.ts</code>. Status changes here
        take effect immediately without a deploy.
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 py-8 text-[13px] text-muted-foreground">
          <RefreshCw size={14} className="animate-spin" aria-hidden />
          Loading experiments…
        </div>
      )}

      {!isLoading && experiments.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <FlaskConical size={28} className="text-muted-foreground/30" aria-hidden />
          <p className="text-[14px] font-medium text-foreground">No experiments registered</p>
          <p className="max-w-xs text-[13px] text-muted-foreground">
            Add experiments to{" "}
            <code className="font-mono text-[12px]">lib/stores/experiment-store.ts</code> and they
            will appear here.
          </p>
        </div>
      )}

      {experiments.length > 0 && (
        <div className="overflow-hidden rounded border border-border">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Variants</th>
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Traffic</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Owner</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiments.map((exp) => {
                const sc = STATUS_CONFIG[exp.status];
                return (
                  <tr
                    key={exp.id}
                    className="border-b border-border last:border-b-0 hover:bg-secondary/20"
                  >
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium text-foreground">{exp.name}</div>
                      <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {exp.id}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", sc.color)}
                      >
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-wrap gap-1">
                        {exp.variants.map((v) => (
                          <span
                            key={v}
                            className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top text-right tabular-nums text-muted-foreground">
                      {exp.allocationPercentage}%
                    </td>
                    <td className="px-4 py-3 align-top text-muted-foreground">{exp.owner}</td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-1">
                        {exp.status === "draft" && (
                          <button
                            onClick={() => updateStatus(exp.id, "active")}
                            disabled={updating === exp.id}
                            className="flex items-center gap-1 rounded border border-green-500/30 px-2 py-1 text-[11px] text-green-500 hover:bg-green-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
                            aria-label="Activate experiment"
                          >
                            <Play size={10} aria-hidden />
                            Activate
                          </button>
                        )}
                        {exp.status === "active" && (
                          <button
                            onClick={() => updateStatus(exp.id, "paused")}
                            disabled={updating === exp.id}
                            className="flex items-center gap-1 rounded border border-amber-500/30 px-2 py-1 text-[11px] text-amber-500 hover:bg-amber-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
                            aria-label="Pause experiment"
                          >
                            <Pause size={10} aria-hidden />
                            Pause
                          </button>
                        )}
                        {exp.status === "paused" && (
                          <button
                            onClick={() => updateStatus(exp.id, "active")}
                            disabled={updating === exp.id}
                            className="flex items-center gap-1 rounded border border-green-500/30 px-2 py-1 text-[11px] text-green-500 hover:bg-green-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
                            aria-label="Resume experiment"
                          >
                            <Play size={10} aria-hidden />
                            Resume
                          </button>
                        )}
                        {exp.status !== "completed" && (
                          <button
                            onClick={() => updateStatus(exp.id, "completed")}
                            disabled={updating === exp.id}
                            className="flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] text-muted-foreground hover:border-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
                            aria-label="Complete experiment"
                          >
                            <StopCircle size={10} aria-hidden />
                            Complete
                          </button>
                        )}
                        {updating === exp.id && (
                          <RefreshCw size={11} className="animate-spin text-muted-foreground" aria-hidden />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
