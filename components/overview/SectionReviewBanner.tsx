export function TimeSensitiveBanner({ asOfDate }: { asOfDate?: string }) {
  return (
    <div
      className="flex items-start gap-2 rounded border border-sky-500/40 bg-sky-500/5 px-3 py-2 text-[11px] text-sky-700 dark:text-sky-400"
      role="note"
      aria-label="Time-sensitive content"
    >
      <span className="mt-px shrink-0 font-bold">Time-sensitive</span>
      <span className="leading-snug">
        Data as of {asOfDate ?? "last update"}. Verify before use in client-facing materials.
      </span>
    </div>
  );
}
