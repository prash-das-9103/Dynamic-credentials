import { cn } from "@/lib/utils";
import type { Confidentiality } from "@/types/credentials";

// All colours are theme-safe (CSS vars or opacity-based) so this badge renders
// correctly in both light and dark mode.
const MAP: Record<Confidentiality, { label: string; className: string }> = {
  public: {
    label: "Public",
    // Green tint using opacity layers that work on any background
    className:
      "border-[oklch(0.5_0.15_145_/_30%)] bg-[oklch(0.5_0.15_145_/_12%)] text-[oklch(0.55_0.17_145)]",
  },
  internal: {
    label: "Internal",
    className: "border-border bg-secondary text-muted-foreground",
  },
  "anonymized-client-example": {
    label: "Anonymized",
    className: "border-border bg-secondary text-muted-foreground",
  },
  restricted: {
    label: "Restricted",
    className: "border-destructive/30 bg-destructive/10 text-destructive",
  },
};

export function ConfidentialityBadge({
  value,
  className,
}: {
  value: Confidentiality;
  className?: string;
}) {
  const { label, className: base } = MAP[value];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        base,
        className
      )}
    >
      {label}
    </span>
  );
}
