export function OverviewHero() {
  return (
    <section className="border-b border-border pb-10">
      {/* Eyebrow */}
      <div className="mb-3 flex items-center gap-2">
        <div className="h-3 w-3 rounded-sm bg-[#CC0000]" aria-hidden="true" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#CC0000]">
          Bain &amp; Company
        </span>
      </div>

      {/* Heading */}
      <h1 className="mb-3 max-w-3xl text-[32px] font-bold leading-tight tracking-tight text-foreground text-balance">
        Sustainability Practice
      </h1>
      <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
        Helping clients translate sustainability ambition into measurable business
        value, resilience, and long-term competitive advantage — across four
        interconnected solutions.
      </p>
    </section>
  );
}
