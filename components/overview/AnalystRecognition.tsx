"use client";

import Image from "next/image";

export function AnalystRecognition() {
  return (
    <section aria-labelledby="analyst-recognition-heading">
      <div className="mb-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          External validation
        </p>
        <h2
          id="analyst-recognition-heading"
          className="text-[20px] font-bold text-foreground"
        >
          Recognized by leading analyst firms
        </h2>
      </div>

      <div className="border border-border bg-card p-3 sm:p-5">
        <div className="overflow-hidden rounded-sm">
          <Image
            src="/images/analyst-recognition.png"
            alt="Analyst testimonials from IDC, ALM Intelligence, HFS Horizons, and Forrester praising Bain's digital, innovation, and automation consulting"
            width={1000}
            height={563}
            className="h-auto w-full"
          />
        </div>
        <p className="mt-3 text-[11.5px] leading-relaxed text-muted-foreground">
          Firm-wide digital, innovation &amp; automation recognition — not
          sustainability-specific. Included here for context on Bain&apos;s
          broader consulting credibility with clients and analysts.
        </p>
      </div>
    </section>
  );
}
