"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Menu, LogOut } from "lucide-react";

interface AdminTopBarProps {
  onMenuClick: () => void;
}

export function AdminTopBar({ onMenuClick }: AdminTopBarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Derive breadcrumb from pathname
  const crumbs = pathname
    .replace(/^\/admin\/?/, "")
    .split("/")
    .filter(Boolean)
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "));

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={16} />
        </button>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px]">
          <span className="text-muted-foreground">Admin</span>
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="text-muted-foreground">/</span>
              <span className={i === crumbs.length - 1 ? "font-medium text-foreground" : "text-muted-foreground"}>
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <span className="hidden text-[12px] text-muted-foreground sm:block">
            {user.name}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded border border-border px-2.5 py-1.5 text-[12px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </header>
  );
}
