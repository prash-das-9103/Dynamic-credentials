"use client";

import Link from "next/link";
import { Menu, Package, Search } from "lucide-react";
import { usePackContext } from "@/lib/pack-context";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface TopHeaderProps {
  title: string;
  breadcrumb?: { label: string; href?: string }[];
  onMenuClick?: () => void;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;
}

export function TopHeader({
  title,
  breadcrumb,
  onMenuClick,
  showSearch,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search…",
}: TopHeaderProps) {
  const { itemCount } = usePackContext();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        className="rounded p-1 text-muted-foreground hover:text-foreground lg:hidden"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <Menu size={18} />
      </button>

      {/* Breadcrumb + title */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 text-[11px] text-muted-foreground">
              {breadcrumb.map((crumb, i) => (
                <li key={i} className="flex items-center gap-1">
                  {i > 0 && <span>/</span>}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="truncate text-[15px] font-semibold leading-tight text-foreground">
          {title}
        </h1>
      </div>

      {/* Inline search */}
      {showSearch && onSearchChange && (
        <div className="relative hidden w-64 sm:block">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={searchValue ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-8 w-full rounded border border-border bg-secondary pl-7 pr-3 text-[13px] outline-none focus:border-foreground focus:ring-0"
            aria-label="Global search"
          />
        </div>
      )}

      {/* Notification bell */}
      <NotificationBell />

      {/* Pack indicator */}
      <Link
        href="/builder"
        className={cn(
          "flex items-center gap-1.5 rounded border px-2.5 py-1.5 text-[12px] font-medium transition-colors",
          itemCount > 0
            ? "border-[#CC0000] bg-[#CC0000] text-white"
            : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
        )}
        aria-label={`Open pack builder — ${itemCount} items`}
      >
        <Package size={13} />
        <span>Pack</span>
        {itemCount > 0 && (
          <span className="rounded bg-white/20 px-1 text-[11px] font-bold">
            {itemCount}
          </span>
        )}
      </Link>
    </header>
  );
}
