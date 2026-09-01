import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actions,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-8 py-16 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded border border-border bg-secondary text-muted-foreground">
          {icon}
        </div>
      )}
      <p className="text-[14px] font-semibold text-foreground">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">
          {description}
        </p>
      )}
      {actions && <div className="mt-4 flex gap-2">{actions}</div>}
    </div>
  );
}
