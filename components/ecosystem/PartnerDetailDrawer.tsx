"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Check, Plus, ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@/data/solutions";
import { CREDENTIALS } from "@/data/credentials";
import { PUBLICATIONS } from "@/data/publications";
import { getSolutionConfig } from "@/data/solution-config";
import { PartnerUseCases } from "./PartnerUseCases";
import { usePackContext } from "@/lib/pack-context";
import type { Partner } from "@/types/credentials";

interface Props {
  partner: Partner;
  onClose: () => void;
}

function lookup(arr: { id: string; label: string }[], id: string) {
  return arr.find((a) => a.id === id)?.label ?? id;
}

export function PartnerDetailDrawer({ partner, onClose }: Props) {
  const router = useRouter();
  const { addItem, removeItem, hasItem } = usePackContext();
  const inPack = hasItem(partner.id);

  const relatedCredentials = CREDENTIALS.filter((c) =>
    partner.credentialIds.includes(c.id)
  );
  const relatedPublications = PUBLICATIONS.filter((p) =>
    partner.publicationIds.includes(p.id)
  );

  // Escape key closes
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handlePackToggle() {
    if (inPack) {
      removeItem(partner.id);
    } else {
      addItem({
        id: partner.id,
        itemType: "partner",
        title: partner.name,
        subtitle: partner.category,
        exportRestricted: false,
        section: "ecosystem",
      });
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${partner.name} profile`}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[520px] flex-col overflow-hidden border-l border-border bg-background shadow-2xl"
      >
        {/* Header */}
        <div className="shrink-0 border-b border-border px-6 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-semibold text-foreground">{partner.name}</h2>
              <p className="mt-0.5 text-[12px] text-muted-foreground">{partner.category}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close details"
              className="shrink-0 rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          {/* Product tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {partner.productIds.map((id) => (
              <button
                key={id}
                onClick={() => {
                  onClose();
                  router.push(`/credentials?product=${id}`);
                }}
                className="rounded bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground hover:bg-secondary/80 focus-visible:outline-none transition-colors"
              >
                {lookup(PRODUCTS, id)}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Overview */}
          <section>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Overview</h3>
            <p className="text-[13px] text-foreground leading-relaxed">{partner.description}</p>
          </section>

          {/* Bain lead / who to contact */}
          {(partner.bainLead || partner.whoToContact) && (
            <section className="grid grid-cols-2 gap-4">
              {partner.bainLead && (
                <div>
                  <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Bain Lead</h3>
                  <p className="text-[13px] text-foreground">{partner.bainLead}</p>
                </div>
              )}
              {partner.whoToContact && (
                <div>
                  <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Who to Contact</h3>
                  <p className="text-[13px] text-foreground">{partner.whoToContact}</p>
                </div>
              )}
            </section>
          )}

          {/* Use cases */}
          {partner.useCases.length > 0 && (
            <section>
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Supported Use Cases</h3>
              <PartnerUseCases useCases={partner.useCases} maxVisible={partner.useCases.length} />
            </section>
          )}

          {/* Related credentials */}
          {relatedCredentials.length > 0 && (
            <section>
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Related Credentials ({relatedCredentials.length})
              </h3>
              <div className="space-y-1">
                {relatedCredentials.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => router.push(`/credentials?credential=${c.id}`)}
                    className="group flex w-full items-center justify-between rounded border border-border px-3 py-2 text-left hover:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-medium text-foreground">{c.title}</p>
                      {c.clientAlias && (
                        <p className="text-[11px] text-muted-foreground">{c.clientAlias}</p>
                      )}
                    </div>
                    <ChevronRight size={12} className="shrink-0 text-muted-foreground group-hover:text-foreground" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Related publications */}
          {relatedPublications.length > 0 && (
            <section>
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Related Publications ({relatedPublications.length})
              </h3>
              <div className="space-y-1">
                {relatedPublications.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => router.push(`/publications?publication=${p.id}`)}
                    className="group flex w-full items-center justify-between rounded border border-border px-3 py-2 text-left hover:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-medium text-foreground">{p.title}</p>
                      <p className="text-[11px] text-muted-foreground">{p.publicationType} · {p.year}</p>
                    </div>
                    <ChevronRight size={12} className="shrink-0 text-muted-foreground group-hover:text-foreground" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Source traceability */}
          {partner.sourceSlides.length > 0 && (
            <section>
              <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Source References</h3>
              <p className="text-[12px] text-muted-foreground">
                Slide{partner.sourceSlides.length !== 1 ? "s" : ""}{" "}
                {partner.sourceSlides.join(", ")} of the{" "}
                {partner.solutionIds.map((id) => getSolutionConfig(id)?.name ?? id).join(" / ")} deck.
              </p>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border px-6 py-4 space-y-2">
          <button
            onClick={handlePackToggle}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded py-2.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-foreground",
              inPack
                ? "bg-[#CC0000] text-white hover:opacity-85"
                : "bg-foreground text-background hover:opacity-85"
            )}
          >
            {inPack ? (
              <><Check size={14} aria-hidden="true" /> Remove from pack</>
            ) : (
              <><Plus size={14} aria-hidden="true" /> Add to pack</>
            )}
          </button>
          {relatedCredentials.length > 0 && (
            <button
              onClick={() => {
                onClose();
                router.push(`/credentials?partner=${partner.id}`);
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded border border-border py-2 text-[12px] font-medium text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground transition-colors"
            >
              View all related credentials
              <ChevronRight size={12} aria-hidden="true" />
            </button>
          )}
          {partner.irisUrl && (
            <a
              href={partner.irisUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-1.5 rounded border border-border py-2 text-[12px] font-medium text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground transition-colors"
              aria-label={`More details on ${partner.name} — IRIS partnership page (opens in a new tab)`}
            >
              More details
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </>
  );
}
