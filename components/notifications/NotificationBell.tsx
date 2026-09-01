"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, X, Check, Archive, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/lib/stores/notification-store";
import { useAuth } from "@/lib/auth/auth-context";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface NotificationResponse {
  notifications: AppNotification[];
  unreadCount: number;
}

// ─── Priority helpers ─────────────────────────────────────────────────────────

function priorityDot(priority: AppNotification["priority"]) {
  if (priority === "urgent") return "bg-red-500";
  if (priority === "high") return "bg-amber-500";
  return "bg-[#CC0000]";
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NotificationBell() {
  const { user, loading: authLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<NotificationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/notifications", { credentials: "include" });
      if (res.ok) {
        const json = (await res.json()) as NotificationResponse;
        setData(json);
      }
    } catch {
      // Silent failure — notification center is non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  // Poll for unread count every 60s — only when authenticated.
  // We store the resolved auth state in a ref so the deps array stays
  // a fixed size [userId] regardless of loading state, avoiding the
  // React hooks "deps array changed size" invariant violation.
  const userId = user?.id ?? null;
  useEffect(() => {
    if (!userId) return;

    async function fetchCount() {
      try {
        const res = await fetch("/api/v1/notifications?limit=1", { credentials: "include" });
        if (res.ok) {
          const json = (await res.json()) as NotificationResponse;
          setData((prev) =>
            prev
              ? { ...prev, unreadCount: json.unreadCount }
              : { notifications: [], unreadCount: json.unreadCount }
          );
        }
      } catch {
        // ignore
      }
    }
    fetchCount();
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, [userId]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  async function markRead(id: string) {
    await fetch(`/api/v1/notifications/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "read" }),
    });
    setData((prev) =>
      prev
        ? {
            ...prev,
            unreadCount: Math.max(0, prev.unreadCount - 1),
            notifications: prev.notifications.map((n) =>
              n.id === id ? { ...n, readAt: new Date().toISOString() } : n
            ),
          }
        : prev
    );
  }

  async function archiveNotification(id: string) {
    await fetch(`/api/v1/notifications/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "archive" }),
    });
    setData((prev) =>
      prev
        ? {
            ...prev,
            notifications: prev.notifications.filter((n) => n.id !== id),
          }
        : prev
    );
  }

  async function markAllRead() {
    await fetch("/api/v1/notifications/read-all", {
      method: "POST",
      credentials: "include",
    });
    setData((prev) =>
      prev
        ? {
            ...prev,
            unreadCount: 0,
            notifications: prev.notifications.map((n) => ({
              ...n,
              readAt: n.readAt ?? new Date().toISOString(),
            })),
          }
        : prev
    );
  }

  const unread = data?.unreadCount ?? 0;

  // Don't render while auth is resolving or if not logged in.
  // authLoading prevents a flash of the bell on unauthenticated pages.
  if (authLoading || !userId) return null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((p) => !p)}
        aria-label={`Notifications${unread > 0 ? ` — ${unread} unread` : ""}`}
        aria-expanded={open}
        className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground",
          open
            ? "bg-secondary text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Bell size={16} aria-hidden />
        {unread > 0 && (
          <span
            aria-hidden
            className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#CC0000] text-[9px] font-bold leading-none text-white"
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-full z-50 mt-1 w-80 overflow-hidden rounded border border-border bg-background shadow-lg"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="text-[13px] font-semibold text-foreground">Notifications</span>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
                  aria-label="Mark all as read"
                >
                  <Check size={11} aria-hidden />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
                aria-label="Close notifications"
              >
                <X size={13} aria-hidden />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading && !data && (
              <div className="flex items-center justify-center py-8 text-[12px] text-muted-foreground">
                Loading…
              </div>
            )}

            {!loading && (!data || data.notifications.length === 0) && (
              <div className="flex items-center justify-center py-8 text-[12px] text-muted-foreground">
                No notifications
              </div>
            )}

            {data?.notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "group relative flex gap-3 border-b border-border px-3 py-2.5 last:border-b-0",
                  !n.readAt && "bg-secondary/30"
                )}
              >
                {/* Priority dot */}
                <span
                  aria-hidden
                  className={cn(
                    "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                    n.readAt ? "bg-muted-foreground/30" : priorityDot(n.priority)
                  )}
                />

                <div className="min-w-0 flex-1">
                  <p className={cn("text-[12px] leading-snug", !n.readAt && "font-medium text-foreground")}>
                    {n.title}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground line-clamp-2">
                    {n.message}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">
                      {formatRelative(n.createdAt)}
                    </span>
                    {n.link && (
                      <Link
                        href={n.link}
                        onClick={() => {
                          if (!n.readAt) markRead(n.id);
                          setOpen(false);
                        }}
                        className="flex items-center gap-0.5 text-[10px] text-[#CC0000] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
                        aria-label={`View — ${n.title}`}
                      >
                        View
                        <ExternalLink size={9} aria-hidden />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  {!n.readAt && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="rounded p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
                      aria-label="Mark as read"
                    >
                      <Check size={11} aria-hidden />
                    </button>
                  )}
                  <button
                    onClick={() => archiveNotification(n.id)}
                    className="rounded p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
                    aria-label="Archive notification"
                  >
                    <Archive size={11} aria-hidden />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
