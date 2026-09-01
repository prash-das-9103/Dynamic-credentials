"use client";

import { cn } from "@/lib/utils";

interface Props {
  useCases: string[];
  maxVisible?: number;
  onFilter?: (uc: string) => void;
}

export function PartnerUseCases({ useCases, maxVisible = 4, onFilter }: Props) {
  if (useCases.length === 0) return null;
  const visible = useCases.slice(0, maxVisible);
  const overflow = useCases.length - maxVisible;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((uc) => (
        <span
          key={uc}
          onClick={() => onFilter?.(uc)}
          className={cn(
            "inline-block rounded border border-border px-2 py-0.5 text-[11px] text-muted-foreground leading-none",
            onFilter && "cursor-pointer hover:border-foreground hover:text-foreground transition-colors"
          )}
        >
          {uc}
        </span>
      ))}
      {overflow > 0 && (
        <span className="inline-block rounded border border-border px-2 py-0.5 text-[11px] text-muted-foreground leading-none">
          +{overflow} more
        </span>
      )}
    </div>
  );
}
