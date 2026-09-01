"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { Users, Plus, Check, X, AlertTriangle, RefreshCw, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/auth/types";
import type { StoredUser } from "@/lib/stores/user-store";

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then((r) => r.json());

const ROLE_LABELS: Record<UserRole, string> = {
  viewer: "Viewer",
  contributor: "Contributor",
  reviewer: "Reviewer",
  "data-steward": "Data Steward",
  administrator: "Administrator",
};

const ROLE_COLORS: Record<UserRole, string> = {
  viewer: "text-muted-foreground bg-muted",
  contributor: "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40",
  reviewer: "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40",
  "data-steward": "text-purple-700 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/40",
  administrator: "text-[#CC0000] bg-red-50 dark:bg-red-950/30",
};

const ALL_ROLES: UserRole[] = ["viewer", "contributor", "reviewer", "data-steward", "administrator"];

interface NewUserForm {
  email: string;
  name: string;
  role: UserRole;
  password: string;
}

export default function AdminUsersPage() {
  const { data, isLoading, error } = useSWR<{ users: StoredUser[] }>("/api/admin/users", fetcher);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<NewUserForm>({ email: "", name: "", role: "contributor", password: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const users = data?.users ?? [];

  async function createUser() {
    if (!form.email || !form.name || !form.password) {
      setFormError("Email, name, and password are all required.");
      return;
    }
    if (form.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    setFormLoading(true);
    setFormError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to create user.");
      setCreating(false);
      setForm({ email: "", name: "", role: "contributor", password: "" });
      mutate("/api/admin/users");
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "Unknown error.");
    } finally {
      setFormLoading(false);
    }
  }

  async function toggleActive(user: StoredUser) {
    setActionLoading(user.id);
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !user.active }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to update user.");
      mutate("/api/admin/users");
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : "Unknown error.");
    } finally {
      setActionLoading(null);
    }
  }

  async function changeRole(user: StoredUser, role: UserRole) {
    setActionLoading(user.id + "-role");
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to update role.");
      mutate("/api/admin/users");
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : "Unknown error.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage platform accounts and role assignments.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => mutate("/api/admin/users")}
            className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 rounded border border-[#CC0000]/40 bg-[#CC0000]/5 px-3 py-1.5 text-xs font-medium text-[#CC0000] hover:bg-[#CC0000]/10 transition-colors"
          >
            <Plus size={12} />
            Add user
          </button>
        </div>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 text-center">
        {ALL_ROLES.map((role) => {
          const count = users.filter((u) => u.role === role && u.active).length;
          return (
            <div key={role} className="rounded-lg border border-border p-3">
              <div className="text-xl font-semibold text-foreground">{count}</div>
              <div className="text-[11px] text-muted-foreground">{ROLE_LABELS[role]}</div>
            </div>
          );
        })}
      </div>

      {actionError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-[12px] text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          {actionError}
        </div>
      )}

      {/* Create user form */}
      {creating && (
        <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-foreground">New user</h3>
            <button onClick={() => { setCreating(false); setFormError(null); }} className="text-muted-foreground hover:text-foreground">
              <X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded border border-border bg-background px-3 py-1.5 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full rounded border border-border bg-background px-3 py-1.5 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as UserRole }))}
                className="w-full rounded border border-border bg-background px-3 py-1.5 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
              >
                {ALL_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Initial password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full rounded border border-border bg-background px-3 py-1.5 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                placeholder="Min. 8 characters"
              />
            </div>
          </div>
          {formError && (
            <div className="text-[12px] text-red-600 dark:text-red-400">{formError}</div>
          )}
          <div className="flex gap-2">
            <button
              onClick={createUser}
              disabled={formLoading}
              className="flex items-center gap-1.5 rounded bg-foreground px-3 py-1.5 text-[12px] font-medium text-background hover:bg-foreground/80 disabled:opacity-50 transition-colors"
            >
              {formLoading ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
              ) : (
                <Check size={12} />
              )}
              Create user
            </button>
            <button
              onClick={() => { setCreating(false); setFormError(null); }}
              className="rounded border border-border px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-8">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
          Loading users…
        </div>
      )}

      {!isLoading && !error && (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-44">Role</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-32">Created</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className={cn("hover:bg-muted/20 transition-colors", !user.active && "opacity-50")}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-[11px] text-muted-foreground">{user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user, e.target.value as UserRole)}
                      disabled={actionLoading === user.id + "-role"}
                      className={cn(
                        "rounded border border-border bg-background px-2 py-1 text-[12px] focus:outline-none focus:ring-1 focus:ring-foreground/30",
                        ROLE_COLORS[user.role]
                      )}
                    >
                      {ALL_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
                      user.active
                        ? "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/40"
                        : "text-muted-foreground bg-muted"
                    )}>
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(user)}
                      disabled={actionLoading === user.id}
                      className="text-[12px] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    >
                      {actionLoading === user.id
                        ? <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-border border-t-foreground" />
                        : user.active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
