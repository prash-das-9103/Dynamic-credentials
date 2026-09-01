import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  tone?: "default" | "amber" | "green" | "red";
  href?: string;
}

export function AdminStatCard({
  label,
  value,
  sub,
  icon: Icon,
  tone = "default",
  href,
}: AdminStatCardProps) {
  const toneClasses = {
    default: "text-foreground",
    amber: "text-amber-500",
    green: "text-green-600",
    red: "text-[#CC0000]",
  };

  const Tag = href ? "a" : "div";

  return (
    <Tag
      {...(href ? { href } : {})}
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-card p-5",
        href && "transition-colors hover:border-foreground/20 hover:bg-accent"
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
        <Icon size={15} className={cn("mt-0.5", toneClasses[tone])} />
      </div>
      <div>
        <div className={cn("text-2xl font-bold tabular-nums", toneClasses[tone])}>
          {value}
        </div>
        {sub && (
          <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>
        )}
      </div>
    </Tag>
  );
}
