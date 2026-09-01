"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  BarChart2,
  Users,
  Globe,
  BookOpen,
  Package,
  X,
  Sparkles,
  Film,
  Bookmark,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePackContext } from "@/lib/pack-context";
import { SOLUTION_ORDER, SOLUTION_CONFIGS } from "@/data/solution-config";

const NAV_ITEMS_TOP = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/experts", label: "Experts", icon: Users },
  { href: "/credentials", label: "Case Examples", icon: Search },
  { href: "/ecosystem", label: "Ecosystem", icon: Globe },
];

const SOLUTIONS_NAV_ITEMS = SOLUTION_ORDER.map((id) => ({
  href: `/solutions/${id}`,
  label: SOLUTION_CONFIGS[id].name,
}));

const NAV_ITEMS_BOTTOM = [
  { href: "/publications", label: "Publications", icon: BookOpen },
  { href: "/saved-searches", label: "Saved Searches", icon: Bookmark },
  { href: "/builder", label: "Pack Builder", icon: Package },
  { href: "/assistant", label: "AI Assistant", icon: Sparkles },
  { href: "/reference-slides", label: "Reference Slides", icon: Film },
];

interface AppSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const { itemCount } = usePackContext();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r border-border bg-sidebar transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Application navigation"
      >
        {/* Logo / Title */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[#CC0000]">
              Sustainability
            </div>
            <div className="text-[13px] font-semibold leading-tight text-foreground">
              Credentials
            </div>
          </div>
          <button
            className="rounded p-1 text-muted-foreground hover:text-foreground lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
          {NAV_ITEMS_TOP.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={15} />
                <span>{label}</span>
              </Link>
            );
          })}

          {/* Solutions group */}
          <div className="mb-0.5 mt-3 flex items-center gap-2.5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            <Layers size={15} className="text-muted-foreground/70" />
            <span>Solutions</span>
          </div>
          {SOLUTIONS_NAV_ITEMS.map(({ href, label }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "ml-2.5 flex items-center gap-2 rounded px-2.5 py-1.5 text-[12.5px] font-medium leading-snug transition-colors",
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={cn(
                    "h-1 w-1 shrink-0 rounded-full",
                    isActive ? "bg-background" : "bg-muted-foreground/50"
                  )}
                  aria-hidden="true"
                />
                <span>{label}</span>
              </Link>
            );
          })}

          {NAV_ITEMS_BOTTOM.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <span key={href}>
                {(label === "AI Assistant" || label === "Reference Slides") && (
                  <span className="block my-1.5 border-t border-border" role="separator" />
                )}
                <Link
                  href={href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] font-medium transition-colors",
                    label === "Publications" && "mt-2",
                    isActive
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon size={15} />
                  <span>{label}</span>
                  {label === "Pack Builder" && itemCount > 0 && (
                    <span className="ml-auto rounded bg-[#CC0000] px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {itemCount}
                    </span>
                  )}
                  {label === "AI Assistant" && !isActive && (
                    <span className="ml-auto rounded bg-[#CC0000]/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#CC0000]">
                      Beta
                    </span>
                  )}
                </Link>
              </span>
            );
          })}
        </nav>

        {/* Footer metadata */}
        <div className="border-t border-border p-4 text-[11px] text-muted-foreground">
          <div className="mb-1 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span className="font-medium text-foreground">Demo data</span>
          </div>
          <div className="mb-0.5 font-medium text-foreground/70">
            Sustainability Practice
          </div>
          <div className="text-[10px]">Updated January 2026</div>
        </div>
      </aside>
    </>
  );
}
