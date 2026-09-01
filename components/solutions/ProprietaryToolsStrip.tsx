import { Sparkles } from "lucide-react";
import type { ProprietaryTool } from "@/data/solution-page-content";

interface Props {
  tools: ProprietaryTool[];
  accentColor: string;
}

export function ProprietaryToolsStrip({ tools, accentColor }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <div
          key={tool.name}
          className="flex flex-col gap-2 rounded border border-border bg-card p-3.5"
        >
          <div className="flex items-center gap-2">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded"
              style={{ backgroundColor: `${accentColor}14`, color: accentColor }}
              aria-hidden="true"
            >
              <Sparkles size={13} />
            </span>
            <p className="text-[13px] font-semibold leading-snug text-foreground">{tool.name}</p>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">{tool.description}</p>
        </div>
      ))}
    </div>
  );
}
