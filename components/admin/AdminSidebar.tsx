"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Database,
  Tags,
  Image,
  Layers,
  ClipboardCheck,
  Package,
  Download,
  Clock,
  ScrollText,
  Users,
  Settings,
  X,
  ChevronRight,
  ArrowLeft,
  MessageSquare,
  BarChart2,
  Plug,
  FlaskConical,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  permission?: "audit:view" | "users:manage" | "system:manage" | "workbook:review" | "content:review";
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/content", label: "Content", icon: FileText, permission: "content:review" },
  { href: "/admin/workbooks", label: "Workbooks", icon: Database, permission: "workbook:review" },
  { href: "/admin/taxonomy", label: "Taxonomy", icon: Tags, permission: "content:review" },
  { href: "/admin/assets", label: "Assets", icon: Image, permission: "content:review" },
  { href: "/admin/reference-slides", label: "Reference Slides", icon: Layers, permission: "content:review" },
  { href: "/admin/reviews", label: "Reviews", icon: ClipboardCheck, permission: "content:review" },
  { href: "/admin/packs", label: "Packs", icon: Package },
  { href: "/admin/exports", label: "Exports", icon: Download },
  { href: "/admin/freshness", label: "Freshness", icon: Clock },
  { href: "/admin/feedback", label: "Feedback", icon: MessageSquare, permission: "content:review" },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/admin/integrations", label: "Integrations", icon: Plug, permission: "system:manage" },
  { href: "/admin/experiments", label: "Experiments", icon: FlaskConical, permission: "system:manage" },
  { href: "/admin/audit", label: "Audit", icon: ScrollText, permission: "audit:view" },
  { href: "/admin/users", label: "Users", icon: Users, permission: "users:manage" },
  { href: "/admin/system", label: "System", icon: Settings, permission: "system:manage" },
];

interface AdminSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, can } = useAuth();

  const visibleItems = NAV_ITEMS.filter((item) =>
    !item.permission || can(item.permission)
  );

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-52 flex-col border-r border-border bg-sidebar transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Administration navigation"
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[#CC0000]">
              Administration
            </div>
            <div className="text-[13px] font-semibold leading-tight text-foreground">
              Sustainability
            </div>
          </div>
          <button
            className="rounded p-1 text-muted-foreground hover:text-foreground lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={15} />
          </button>
        </div>

        {/* Back to app */}
        <div className="border-b border-border px-3 py-2">
          <Link
            href="/"
            className="flex items-center gap-2 rounded px-2 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft size={13} />
            Back to application
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
          {visibleItems.map(({ href, label, icon: Icon }) => {
            const isActive = href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
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
                <Icon size={14} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={12} className="opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* User badge */}
        {user && (
          <div className="border-t border-border px-4 py-3">
            <div className="text-[12px] font-medium text-foreground truncate">{user.name}</div>
            <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
            <div className="mt-1 inline-flex rounded-full bg-[#CC0000]/10 px-2 py-0.5 text-[10px] font-semibold text-[#CC0000]">
              {user.role}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
