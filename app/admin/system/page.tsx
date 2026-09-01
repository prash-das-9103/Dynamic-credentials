"use client";

import { Settings, Database, Key, Globe, ShieldCheck, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnvCheck {
  label: string;
  key: string;
  description: string;
  required: boolean;
  present: boolean;
}

// These are intentionally checked client-side via NEXT_PUBLIC_ prefix only.
// Secret env vars are never exposed to the browser — their presence is confirmed server-side.
const ENV_CHECKS: Omit<EnvCheck, "present">[] = [
  {
    label: "Session secret",
    key: "DSC_SESSION_SECRET",
    description: "HMAC signing secret for session cookies. Must be set in production.",
    required: true,
  },
  {
    label: "Admin seed email",
    key: "DSC_ADMIN_SEED_EMAIL",
    description: "Email for the seed administrator account. Defaults to admin@example.com if unset.",
    required: false,
  },
  {
    label: "Admin seed password",
    key: "DSC_ADMIN_SEED_PASSWORD",
    description: "Password for the seed administrator. Must be changed before production use.",
    required: false,
  },
];

const STORAGE_SECTIONS = [
  {
    label: "Users",
    file: ".data/users.json",
    description: "Platform accounts and hashed credentials.",
  },
  {
    label: "Content workflow",
    file: ".data/content-workflow.json",
    description: "Status of all tracked content items.",
  },
  {
    label: "Workbook versions",
    file: ".data/workbook-versions.json",
    description: "Analytical dataset upload history.",
  },
  {
    label: "Audit log",
    file: ".data/audit.ndjson",
    description: "Append-only event log (newline-delimited JSON).",
  },
];

export default function AdminSystemPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground">System</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform configuration, storage status, and environment health.
        </p>
      </div>

      {/* Storage mode */}
      <section className="space-y-3">
        <h2 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
          Storage
        </h2>
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-500" />
            <div>
              <div className="text-[13px] font-semibold text-amber-800 dark:text-amber-400">
                File-backed storage (development mode)
              </div>
              <div className="mt-0.5 text-[12px] text-amber-700 dark:text-amber-500">
                All data is persisted to local <code className="font-mono">.data/</code> files.
                This is suitable for internal previews and development. Connect a Neon database to
                switch to persistent cloud storage — the store seam in each <code className="font-mono">lib/stores/*.ts</code> file
                requires no UI changes.
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Data set</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">File</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {STORAGE_SECTIONS.map((s) => (
                <tr key={s.file} className="hover:bg-muted/20">
                  <td className="px-4 py-2.5 font-medium text-foreground">{s.label}</td>
                  <td className="px-4 py-2.5 font-mono text-muted-foreground">{s.file}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{s.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Environment variables */}
      <section className="space-y-3">
        <h2 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
          Environment variables
        </h2>
        <p className="text-[12px] text-muted-foreground">
          Secret environment variables cannot be read from the browser.
          Set them in your Vercel project settings or <code className="font-mono">.env.local</code>.
        </p>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Variable</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Required</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ENV_CHECKS.map((e) => (
                <tr key={e.key} className="hover:bg-muted/20">
                  <td className="px-4 py-2.5 font-mono text-foreground">{e.key}</td>
                  <td className="px-4 py-2.5">
                    {e.required ? (
                      <span className="text-red-600 dark:text-red-400 font-medium">Required</span>
                    ) : (
                      <span className="text-muted-foreground">Optional</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{e.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Permission matrix */}
      <section className="space-y-3">
        <h2 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
          Role permission matrix
        </h2>
        <div className="rounded-lg border border-border bg-muted/20 p-4 text-[12px] space-y-2">
          {[
            { role: "viewer", label: "Viewer", permissions: ["content:view", "export:create"] },
            { role: "contributor", label: "Contributor", permissions: ["content:view", "content:create", "content:edit", "export:create"] },
            { role: "reviewer", label: "Reviewer", permissions: ["content:view", "content:create", "content:edit", "content:review", "content:publish", "reference-slide:approve", "export:create"] },
            { role: "data-steward", label: "Data Steward", permissions: ["…reviewer +", "workbook:*", "taxonomy:edit", "audit:view"] },
            { role: "administrator", label: "Administrator", permissions: ["…data-steward +", "users:manage", "system:manage"] },
          ].map((row) => (
            <div key={row.role} className="flex items-start gap-3">
              <span className="w-28 shrink-0 rounded-full bg-muted px-2 py-0.5 text-center text-[11px] font-medium text-muted-foreground">
                {row.label}
              </span>
              <div className="flex flex-wrap gap-1">
                {row.permissions.map((p) => (
                  <code key={p} className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-foreground/80">
                    {p}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
