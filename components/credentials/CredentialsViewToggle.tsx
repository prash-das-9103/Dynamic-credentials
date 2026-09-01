"use client";

import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface CredentialsViewToggleProps {
  value: "card" | "list";
  onChange: (v: "card" | "list") => void;
}

export function CredentialsViewToggle({ value, onChange }: CredentialsViewToggleProps) {
  return (
    <div className="flex rounded border border-border overflow-hidden" role="group" aria-label="View mode">
      <button
        onClick={() => onChange("card")}
        className={cn(
          "px-2 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground",
          value === "card"
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="Card view"
        aria-pressed={value === "card"}
      >
        <LayoutGrid size={14} />
      </button>
      <button
        onClick={() => onChange("list")}
        className={cn(
          "border-l border-border px-2 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground",
          value === "list"
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="List view"
        aria-pressed={value === "list"}
      >
        <List size={14} />
      </button>
    </div>
  );
}
