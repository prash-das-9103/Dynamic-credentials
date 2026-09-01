"use client";

import type { PackMetadata } from "@/types/credentials";
import { cn } from "@/lib/utils";

interface PackMetadataFormProps {
  metadata: PackMetadata;
  onChange: (patch: Partial<PackMetadata>) => void;
}

function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const base =
    "w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-[#CC0000]/40 transition-colors";
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={cn(base, "resize-none")}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={base}
        />
      )}
    </div>
  );
}

export function PackMetadataForm({ metadata, onChange }: PackMetadataFormProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Pack details
      </h2>
      <div className="flex flex-col gap-3">
        <Field
          label="Pack title"
          id="meta-pack-title"
          value={metadata.packTitle}
          onChange={(v) => onChange({ packTitle: v })}
          placeholder="Sustainability Credentials Pack"
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Client name"
            id="meta-client-name"
            value={metadata.clientName}
            onChange={(v) => onChange({ clientName: v })}
            placeholder="e.g. Packaging Co"
          />
          <Field
            label="Client alias"
            id="meta-client-alias"
            value={metadata.clientAlias}
            onChange={(v) => onChange({ clientAlias: v })}
            placeholder="e.g. Packaging Co"
          />
        </div>
        <Field
          label="Client situation"
          id="meta-situation"
          value={metadata.clientSituation}
          onChange={(v) => onChange({ clientSituation: v })}
          placeholder="Describe the client situation or opportunity..."
          multiline
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Prepared by"
            id="meta-prepared-by"
            value={metadata.preparedBy}
            onChange={(v) => onChange({ preparedBy: v })}
            placeholder="Your name"
          />
          <Field
            label="Date"
            id="meta-date"
            value={metadata.date}
            onChange={(v) => onChange({ date: v })}
            placeholder="YYYY-MM-DD"
          />
        </div>
      </div>
    </div>
  );
}
