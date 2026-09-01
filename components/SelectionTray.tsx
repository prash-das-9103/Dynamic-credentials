"use client";

import { useState } from "react";
import { usePackContext } from "@/lib/pack-context";
import { X, Package, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { PackItem } from "@/types/credentials";

const ITEM_TYPE_LABELS: Record<PackItem["itemType"], string> = {
  credential: "Cred",
  expert: "Expert",
  partner: "Partner",
  publication: "Pub",
  chart: "Chart",
};

export function SelectionTray() {
  const { pack, mounted, removeItem, itemCount } = usePackContext();
  const [expanded, setExpanded] = useState(false);

  if (!mounted || itemCount === 0) return null;

  const recentItems = [...pack.items].reverse().slice(0, 8);

  return (
    <div
      className="fixed bottom-4 right-4 z-30 w-72 rounded border border-border bg-background shadow-md"
      role="complementary"
      aria-label="Selected items tray"
    >
      {/* Header */}
      <div
        className="flex cursor-pointer items-center justify-between border-b border-border px-3 py-2.5"
        onClick={() => setExpanded((v) => !v)}
        role="button"
        aria-expanded={expanded}
        aria-controls="selection-tray-items"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <Package size={13} className="text-[#CC0000]" />
          <span className="text-[12px] font-semibold text-foreground">
            Pack
          </span>
          <span className="rounded bg-[#CC0000] px-1.5 py-0.5 text-[10px] font-bold text-white">
            {itemCount}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/builder"
            onClick={(e) => e.stopPropagation()}
            className="rounded border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:border-foreground hover:text-foreground"
          >
            Open
          </Link>
          {expanded ? (
            <ChevronDown size={13} className="text-muted-foreground" />
          ) : (
            <ChevronUp size={13} className="text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Items */}
      {expanded && (
        <ul id="selection-tray-items" className="max-h-64 overflow-y-auto divide-y divide-border">
          {recentItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 px-3 py-2"
            >
              <span className="shrink-0 rounded border border-border px-1 py-0.5 text-[9px] font-semibold text-muted-foreground">
                {ITEM_TYPE_LABELS[item.itemType]}
              </span>
              <span className="flex-1 min-w-0 text-[11px] text-foreground truncate">
                {item.title}
              </span>
              <button
                onClick={() => removeItem(item.id)}
                className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground"
                aria-label={`Remove ${item.title} from pack`}
              >
                <X size={11} />
              </button>
            </li>
          ))}
          {pack.items.length > 8 && (
            <li className="px-3 py-2 text-[10px] text-muted-foreground">
              +{pack.items.length - 8} more items. <Link href="/builder" className="underline hover:text-foreground">View all</Link>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
