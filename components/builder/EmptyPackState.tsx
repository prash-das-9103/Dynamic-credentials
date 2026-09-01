import Link from "next/link";
import { FolderOpen } from "lucide-react";

export function EmptyPackState() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-secondary">
        <FolderOpen className="h-7 w-7 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-foreground">Your credential pack is empty.</h2>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          Add credentials, experts, partners, publications, or analytics from across the application.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { label: "Browse credentials", href: "/credentials" },
          { label: "Browse experts", href: "/experts" },
          { label: "Browse ecosystem", href: "/ecosystem" },
          { label: "Browse publications", href: "/publications" },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="rounded border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
