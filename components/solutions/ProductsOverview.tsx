import type { SolutionNeedColumn } from "@/data/solution-page-content";

interface Props {
  columns: SolutionNeedColumn[];
  accentColor: string;
}

export function ProductsOverview({ columns, accentColor }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {columns.map((col) => (
        <div key={col.productLabel} className="flex flex-col rounded border border-border bg-card">
          <div
            className="border-b border-border px-4 py-3"
            style={{ borderTopColor: accentColor, borderTopWidth: 3 }}
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Product</p>
            <h3 className="mt-0.5 text-[14px] font-semibold text-foreground leading-snug">
              {col.productLabel}
            </h3>
          </div>
          <ul className="flex-1 space-y-2.5 px-4 py-3.5">
            {col.needs.map((need, i) => (
              <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-muted-foreground">
                <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                {need}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
