import { Mail } from "lucide-react";

const HELPDESK_EMAIL = "GlobalSustainabilityHelpdesk@bain.com";

export function HelpdeskContact() {
  return (
    <section
      aria-labelledby="helpdesk-heading"
      className="border-t border-border pt-10"
    >
      <div className="flex flex-col items-start gap-4 border border-border bg-card px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="helpdesk-heading"
            className="text-[15px] font-bold leading-snug text-foreground"
          >
            Need more detail on Sustainability credentials?
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
            For detailed information on Sustainability credentials, reach out to the Global
            Sustainability Helpdesk.
          </p>
        </div>

        <a
          href={`mailto:${HELPDESK_EMAIL}`}
          className="inline-flex shrink-0 items-center gap-2 border border-primary bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          {HELPDESK_EMAIL}
        </a>
      </div>
    </section>
  );
}
