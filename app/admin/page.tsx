"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import {
  Database,
  FileText,
  ClipboardCheck,
  Users,
  ScrollText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Package,
} from "lucide-react";

interface OverviewData {
  workbooks: { total: number; activeVersion: string | null; pendingReview: number };
  content: { total: number; pendingReview: number; published: number };
  users: { total: number; active: number };
  audit: { recent: number };
  packs: { total: number };
}

export default function AdminOverviewPage() {
  const { can } = useAuth();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [wbRes, contentRes, usersRes, auditRes] = await Promise.all([
          can("workbook:review") ? fetch("/api/admin/workbooks", { credentials: "include" }) : null,
          can("content:review") ? fetch("/api/admin/content", { credentials: "include" }) : null,
          can("users:manage") ? fetch("/api/admin/users", { credentials: "include" }) : null,
          can("audit:view") ? fetch("/api/admin/audit?limit=50", { credentials: "include" }) : null,
        ]);

        const wb = wbRes?.ok ? await wbRes.json() : { versions: [] };
        const content = contentRes?.ok ? await contentRes.json() : { records: [] };
        const users = usersRes?.ok ? await usersRes.json() : { users: [] };
        const audit = auditRes?.ok ? await auditRes.json() : { total: 0 };

        const wbVersions: Array<{ status: string; versionNumber: number; fileName: string }> = wb.versions ?? [];
        const contentRecords: Array<{ status: string }> = content.records ?? [];
        const userList: Array<{ active: boolean }> = users.users ?? [];

        const activeWb = wbVersions.find((v) => v.status === "published");

        setData({
          workbooks: {
            total: wbVersions.length,
            activeVersion: activeWb ? `v${activeWb.versionNumber} — ${activeWb.fileName}` : null,
            pendingReview: wbVersions.filter((v) => ["needs-review", "uploaded"].includes(v.status)).length,
          },
          content: {
            total: contentRecords.length,
            pendingReview: contentRecords.filter((r) => ["submitted", "in-review"].includes(r.status)).length,
            published: contentRecords.filter((r) => r.status === "published").length,
          },
          users: {
            total: userList.length,
            active: userList.filter((u) => u.active).length,
          },
          audit: { recent: audit.total ?? 0 },
          packs: { total: 0 },
        });
      } catch {
        setError("Failed to load overview data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [can]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
        Loading overview…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Administration Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform health, pending actions, and governance status.
        </p>
      </div>

      {/* Workbook status */}
      {can("workbook:review") && data && (
        <section>
          <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
            Analytical Dataset
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <AdminStatCard
              label="Active workbook version"
              value={data.workbooks.activeVersion ? `v${data.workbooks.activeVersion.split(" — ")[0].replace("v", "")}` : "None"}
              sub={data.workbooks.activeVersion?.split(" — ")[1] ?? "No published version"}
              icon={Database}
              tone={data.workbooks.activeVersion ? "green" : "amber"}
              href="/admin/workbooks"
            />
            <AdminStatCard
              label="Total versions uploaded"
              value={data.workbooks.total}
              icon={Database}
              href="/admin/workbooks"
            />
            <AdminStatCard
              label="Pending workbook review"
              value={data.workbooks.pendingReview}
              icon={Clock}
              tone={data.workbooks.pendingReview > 0 ? "amber" : "default"}
              href="/admin/workbooks"
            />
          </div>
        </section>
      )}

      {/* Content status */}
      {can("content:review") && data && (
        <section>
          <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
            Content Workflow
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <AdminStatCard
              label="Published records"
              value={data.content.published}
              icon={CheckCircle}
              tone="green"
              href="/admin/content"
            />
            <AdminStatCard
              label="Pending review"
              value={data.content.pendingReview}
              icon={ClipboardCheck}
              tone={data.content.pendingReview > 0 ? "amber" : "default"}
              href="/admin/reviews"
            />
            <AdminStatCard
              label="Total tracked"
              value={data.content.total}
              icon={FileText}
              href="/admin/content"
            />
          </div>
        </section>
      )}

      {/* Users and audit */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {can("users:manage") && data && (
          <>
            <AdminStatCard
              label="Active users"
              value={data.users.active}
              sub={`${data.users.total} total`}
              icon={Users}
              href="/admin/users"
            />
          </>
        )}
        {can("audit:view") && data && (
          <AdminStatCard
            label="Audit events (all time)"
            value={data.audit.recent}
            icon={ScrollText}
            href="/admin/audit"
          />
        )}
        <AdminStatCard
          label="Pack builder sessions"
          value={data?.packs.total ?? 0}
          sub="Tracked packs"
          icon={Package}
          href="/admin/packs"
        />
      </div>

      {/* Environment notice — only shown to admins, never to viewers */}
      {can("system:manage") && (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-500" />
            <div>
              <div className="text-[13px] font-semibold text-amber-800 dark:text-amber-400">
                File-backed storage active
              </div>
              <div className="mt-0.5 text-[12px] text-amber-700 dark:text-amber-500">
                The platform is using a local file-backed store (.data/). This is suitable for
                development and controlled internal use. Connect a Neon database in System settings
                to switch to persistent server-side storage.
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
