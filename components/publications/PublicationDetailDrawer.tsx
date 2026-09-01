"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Check, ExternalLink, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCTS, INDUSTRIES } from "@/data/solutions";
import { PARTNERS } from "@/data/partners";
import { CREDENTIALS } from "@/data/credentials";
import { usePackContext } from "@/lib/pack-context";
import type { Publication } from "@/types/credentials";

interface Props {
  publication: Publication | null;
  onClose: () => void;
}

function lookup(arr: { id: string; label: string }[], id: string) {
  return arr.find((a) => a.id === id)?.label ?? id;
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}

export function PublicationDetailDrawer({ publication: pub, onClose }: Props) {
  const router = useRouter();
  const { addItem, removeItem, hasItem } = usePackContext();

  useEffect(() => {
    if (!pub) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pub, onClose]);

  if (!pub) return null;

  const inPack = hasItem(pub.id);

  function togglePack() {
    if (!pub) return;
    if (inPack) {
      removeItem(pub.id);
    } else {
      addItem({
        id: pub.id,
        itemType: "publication",
        title: pub.title,
        subtitle: pub.publicationType,
        exportRestricted: false,
        section: "thought-leadership",
      });
    }
  }

  const relatedPartners = PARTNERS.filter((p) => pub.partnerIds.includes(p.id));
  const relatedCredentials = CREDENTIALS.filter((c) => pub.credentialIds.includes(c.id));

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={pub.title}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[480px] flex-col border-l border-border bg-background shadow-xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {pub.publicationType}
              </span>
              {pub.year && (
                <span className="text-[11px] tabular-nums text-muted-foreground">{pub.year}</span>
              )}
            </div>
            <h2 className="mt-1.5 text-[15px] font-semibold leading-snug text-foreground">
              {pub.url ? (
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#CC0000] hover:underline transition-colors"
                >
                  {pub.title}
                </a>
              ) : (
                pub.title
              )}
            </h2>
            {pub.authors.length > 0 && (
              <p className="mt-1 text-[12px] text-muted-foreground">
                {pub.authors.join(", ")}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="mt-0.5 shrink-0 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Close publication detail"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Abstract */}
          <Section label="Abstract">
            <p className="text-[13px] leading-relaxed text-foreground">{pub.abstract}</p>
          </Section>

          {/* Products */}
          {pub.productIds.length > 0 && (
            <Section label="Products">
              <div className="flex flex-wrap gap-1.5">
                {pub.productIds.map((id) => (
                  <span
                    key={id}
                    className="rounded border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {lookup(PRODUCTS, id)}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Industries */}
          {pub.industryIds.length > 0 && (
            <Section label="Industries">
              <div className="flex flex-wrap gap-1.5">
                {pub.industryIds.map((id) => (
                  <span
                    key={id}
                    className="rounded bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {lookup(INDUSTRIES, id)}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Keywords */}
          {pub.keywords.length > 0 && (
            <Section label="Keywords">
              <div className="flex flex-wrap gap-1.5">
                {pub.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded bg-secondary/60 px-2 py-0.5 text-[11px] italic text-muted-foreground"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Related partners */}
          {relatedPartners.length > 0 && (
            <Section label="Related partners">
              <div className="flex flex-col gap-1.5">
                {relatedPartners.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => router.push(`/ecosystem?partner=${p.id}`)}
                    className="flex items-center justify-between rounded border border-border px-3 py-2 text-left text-[12px] text-foreground hover:bg-secondary transition-colors"
                  >
                    <div>
                      <span className="font-medium">{p.name}</span>
                      <span className="ml-2 text-muted-foreground">{p.category}</span>
                    </div>
                    <ChevronRight size={12} className="text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </Section>
          )}

          {/* Related credentials */}
          {relatedCredentials.length > 0 && (
            <Section label="Related credentials">
              <div className="flex flex-col gap-1.5">
                {relatedCredentials.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => router.push(`/credentials?credential=${c.id}`)}
                    className="flex items-center justify-between rounded border border-border px-3 py-2 text-left hover:bg-secondary transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-medium text-foreground">{c.title}</p>
                      {c.clientAlias && (
                        <p className="text-[11px] text-muted-foreground">{c.clientAlias}</p>
                      )}
                    </div>
                    <ChevronRight size={12} className="ml-2 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </Section>
          )}

          {/* Source references */}
          {pub.sourceSlides.length > 0 && (
            <Section label="Source references">
              <p className="text-[12px] text-muted-foreground">
                Sustainability Credentials,{" "}
                {pub.sourceSlides.length === 1
                  ? `slide ${pub.sourceSlides[0]}`
                  : `slides ${pub.sourceSlides.join(", ")}`}
              </p>
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 border-t border-border px-5 py-4">
          <button
            onClick={togglePack}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded border py-2 text-[12px] font-medium transition-colors",
              inPack
                ? "border-[#CC0000] bg-[#CC0000] text-white"
                : "border-border text-foreground hover:bg-secondary"
            )}
            aria-pressed={inPack}
          >
            {inPack ? <Check size={13} /> : <Plus size={13} />}
            {inPack ? "Remove from pack" : "Add to pack"}
          </button>
          {pub.url ? (
            <a
              href={pub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded border border-border px-3 py-2 text-[12px] font-medium text-foreground hover:bg-secondary transition-colors"
              aria-label={`Open "${pub.title}" — original article in a new tab`}
            >
              <ExternalLink size={13} />
              Open publication
            </a>
          ) : (
            <button
              disabled
              title="Link not included in the prototype dataset."
              className="flex items-center gap-1.5 rounded border border-border px-3 py-2 text-[12px] text-muted-foreground opacity-40 cursor-not-allowed"
              aria-label="Open publication — link not available in prototype"
              aria-disabled="true"
            >
              <ExternalLink size={13} />
              Open publication
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
