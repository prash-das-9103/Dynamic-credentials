"use client";

import useSWR from "swr";
import {
  RefreshCw,
  Mail,
  MessageSquare,
  Hash,
  Globe,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FETCHER = (url: string) =>
  fetch(url, { credentials: "include" }).then((r) => r.json());

interface IntegrationStatus {
  id: string;
  name: string;
  description: string;
  configured: boolean;
  envVarRequired: string;
  lastTestedAt?: string;
  testStatus?: "ok" | "error" | "untested";
  testMessage?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  email: Mail,
  teams: MessageSquare,
  slack: Hash,
  webhooks: Globe,
  calendar: Calendar,
};

const STATUS_CONFIG = {
  ok: { label: "Connected", icon: CheckCircle, color: "text-green-500" },
  error: { label: "Error", icon: XCircle, color: "text-red-500" },
  untested: { label: "Not tested", icon: AlertCircle, color: "text-muted-foreground" },
};

function IntegrationCard({ integration }: { integration: IntegrationStatus }) {
  const Icon = ICON_MAP[integration.id] ?? Globe;
  const status = STATUS_CONFIG[integration.testStatus ?? "untested"];
  const StatusIcon = status.icon;

  return (
    <div className="flex items-start gap-4 rounded border border-border bg-background p-4">
      <span className="mt-0.5 rounded bg-secondary p-2 text-muted-foreground">
        <Icon size={16} aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[14px] font-semibold text-foreground">{integration.name}</div>
            <div className="mt-0.5 text-[12px] text-muted-foreground">{integration.description}</div>
          </div>
          <span
            className={cn(
              "flex items-center gap-1 whitespace-nowrap text-[11px] font-medium",
              status.color
            )}
          >
            <StatusIcon size={12} aria-hidden />
            {status.label}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          {/* Configured indicator */}
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-medium",
              integration.configured
                ? "bg-green-500/10 text-green-500"
                : "bg-secondary text-muted-foreground"
            )}
          >
            {integration.configured ? "Env var set" : "Not configured"}
          </span>

          {/* Required env var */}
          <span className="font-mono text-[10px] text-muted-foreground">
            {integration.envVarRequired}
          </span>

          {integration.testMessage && (
            <span className="text-[11px] text-muted-foreground">{integration.testMessage}</span>
          )}
        </div>
      </div>
    </div>
  );
}

interface IntegrationsResponse {
  integrations: IntegrationStatus[];
}

export default function AdminIntegrationsPage() {
  const { data, isLoading, mutate } = useSWR<IntegrationsResponse>(
    "/api/admin/integrations",
    FETCHER
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-foreground">Integrations</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Configure email, Teams, Slack, webhooks, and calendar providers.
          </p>
        </div>
        <button
          onClick={() => mutate()}
          className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
          aria-label="Refresh integrations"
        >
          <RefreshCw size={13} aria-hidden />
          Refresh
        </button>
      </div>

      {/* Configuration guidance */}
      <div className="rounded border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-[12px] text-amber-600 dark:text-amber-400">
        Integrations are activated by setting the required environment variables on your deployment.
        No third-party credentials are stored in the application database.
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 py-8 text-[13px] text-muted-foreground">
          <RefreshCw size={14} className="animate-spin" aria-hidden />
          Loading…
        </div>
      )}

      {data && (
        <div className="space-y-3">
          {data.integrations.map((i) => (
            <IntegrationCard key={i.id} integration={i} />
          ))}
        </div>
      )}
    </div>
  );
}
