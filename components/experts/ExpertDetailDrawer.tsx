"use client";

import { useEffect } from "react";
import { X, Plus, Check, ExternalLink, BookOpen, Award, Star, IdCard } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Expert, Credential } from "@/types/credentials";
import { PRODUCTS, INDUSTRIES, REGIONS, SOLUTIONS } from "@/data/solutions";
import { CENTERS_OF_EXCELLENCE } from "@/data/centers-of-excellence";
import { getIrisProfileUrl } from "@/data/iris-links";
import { usePackContext } from "@/lib/pack-context";
import { RelatedCredentialRow } from "./RelatedCredentialRow";
import { cn } from "@/lib/utils";

interface Props {
  expert: Expert | null;
  relatedCredentials: Credential[];
  onClose: () => void;
}

function lookup(arr: { id: string; label: string }[], id: string) {
  return arr.find((a) => a.id === id)?.label ?? id;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ExpertDetailDrawer({ expert, relatedCredentials, onClose }: Props) {
  const router = useRouter();
  const { addItem, removeItem, hasItem } = usePackContext();

  // Close on Escape
  useEffect(() => {
    if (!expert) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expert, onClose]);

  if (!expert) return null;

  const inPack = hasItem(expert.id);
  const irisUrl = getIrisProfileUrl(expert.id);

  function togglePack() {
    if (!expert) return;
    if (inPack) {
      removeItem(expert.id);
    } else {
      addItem({
        id: expert.id,
        itemType: "expert",
        title: expert.name,
        subtitle: expert.title,
        exportRestricted: false,
        section: "experts",
      });
    }
  }

  function handleProductClick(productId: string) {
    onClose();
    router.push(`/credentials?product=${productId}`);
  }

  function handleIndustryClick(industryId: string) {
    onClose();
    router.push(`/credentials?industry=${industryId}`);
  }

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
        aria-label={`${expert.name} profile`}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-2xl border-l border-border"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
          aria-label="Close details"
        >
          <X size={16} aria-hidden="true" />
        </button>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="border-b border-border p-5 pr-10">
            <div className="flex items-start gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-foreground text-[16px] font-bold text-background"
                aria-hidden="true"
              >
                {getInitials(expert.name)}
              </div>
              <div className="min-w-0">
                <h2 className="text-[16px] font-bold text-foreground leading-tight">{expert.name}</h2>
                <p className="text-[13px] text-muted-foreground leading-tight">{expert.title}</p>
                {expert.role && (
                  <p className="text-[12px] text-muted-foreground leading-tight mt-0.5">{expert.role}</p>
                )}
              </div>
            </div>
          </div>

          {/* Biography */}
          <section className="border-b border-border p-5 space-y-1.5">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Biography
            </h3>
            <p className="text-[13px] text-foreground leading-relaxed">{expert.bio}</p>
          </section>

          {/* Expertise tags */}
          {expert.expertise.length > 0 && (
            <section className="border-b border-border p-5 space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Expertise
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {expert.expertise.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-border px-2 py-1 text-[11px] text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Leadership roles */}
          {expert.leadership.length > 0 && (
            <section className="border-b border-border p-5 space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <Star size={11} aria-hidden="true" />
                Practice leadership
              </h3>
              <ul className="space-y-1">
                {expert.leadership.map((l, i) => (
                  <li key={i} className="text-[12px] text-foreground leading-snug">
                    {l.label}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Centers of Excellence */}
          {expert.centerOfExcellenceIds.length > 0 && (
            <section className="border-b border-border p-5 space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <Award size={11} aria-hidden="true" />
                Centers of Excellence
              </h3>
              <div className="space-y-2">
                {expert.centerOfExcellenceIds.map((id) => {
                  const coe = CENTERS_OF_EXCELLENCE.find((c) => c.id === id);
                  if (!coe) return null;
                  return (
                    <div key={id} className="rounded border border-border px-3 py-2.5 space-y-1">
                      <p className="text-[12px] font-medium text-foreground leading-snug">{coe.name}</p>
                      {coe.expertiseQuestions.length > 0 && (
                        <p className="text-[11px] text-muted-foreground leading-snug">
                          {coe.expertiseQuestions[0]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Practice solutions */}
          {expert.solutionIds.length > 0 && (
            <section className="border-b border-border p-5 space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Solutions
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {expert.solutionIds.map((sid) => {
                  const label = SOLUTIONS.find((s) => s.id === sid)?.label ?? sid;
                  return (
                    <span
                      key={sid}
                      className="rounded border border-border px-2 py-1 text-[11px] text-foreground"
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            </section>
          )}

          {/* Product expertise */}
          {expert.productIds.length > 0 && (
            <section className="border-b border-border p-5 space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Product expertise
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {expert.productIds.map((pid) => (
                  <button
                    key={pid}
                    onClick={() => handleProductClick(pid)}
                    className="rounded border border-border px-2 py-1 text-[11px] text-foreground hover:border-foreground hover:bg-secondary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
                    title={`Filter credentials by ${lookup(PRODUCTS, pid)}`}
                  >
                    {lookup(PRODUCTS, pid)}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Industry expertise */}
          {expert.industryIds.length > 0 && (
            <section className="border-b border-border p-5 space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Industry expertise
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {expert.industryIds.map((iid) => (
                  <button
                    key={iid}
                    onClick={() => handleIndustryClick(iid)}
                    className="rounded border border-border px-2 py-1 text-[11px] text-foreground hover:border-foreground hover:bg-secondary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
                    title={`Filter credentials by ${lookup(INDUSTRIES, iid)}`}
                  >
                    {lookup(INDUSTRIES, iid)}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Region */}
          {expert.regionIds.length > 0 && (
            <section className="border-b border-border p-5 space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Region
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {expert.regionIds.map((rid) => (
                  <span
                    key={rid}
                    className="rounded border border-border px-2 py-1 text-[11px] text-foreground"
                  >
                    {lookup(REGIONS, rid)}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Related credentials */}
          <section className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Related credentials ({relatedCredentials.length})
              </h3>
              {relatedCredentials.length > 0 && (
                <a
                  href={`/credentials?expert=${expert.id}`}
                  onClick={onClose}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground rounded"
                >
                  <BookOpen size={11} aria-hidden="true" />
                  View all
                </a>
              )}
            </div>
            {relatedCredentials.length > 0 ? (
              <div className="rounded border border-border overflow-hidden">
                {relatedCredentials.map((c) => (
                  <RelatedCredentialRow key={c.id} credential={c} />
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-muted-foreground">No related credentials found.</p>
            )}
          </section>

          {/* Source slides */}
          {expert.sourceSlides.length > 0 && (
            <section className="border-t border-border px-5 py-3">
              <p className="text-[10px] text-muted-foreground">
                Source:{" "}
                {expert.sourceSlides.map((s, i) => (
                  <span key={s}>
                    {i > 0 && ", "}slide {s}
                  </span>
                ))}
              </p>
            </section>
          )}
        </div>

        {/* Footer actions */}
        <div className="border-t border-border p-4 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={togglePack}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded py-2.5 text-[13px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground",
                inPack
                  ? "bg-[#CC0000] text-white hover:opacity-85"
                  : "bg-foreground text-background hover:opacity-85"
              )}
              aria-pressed={inPack}
            >
              {inPack ? (
                <>
                  <Check size={15} aria-hidden="true" />
                  In pack
                </>
              ) : (
                <>
                  <Plus size={15} aria-hidden="true" />
                  Add to pack
                </>
              )}
            </button>
            <a
              href={`/credentials?expert=${expert.id}`}
              onClick={onClose}
              className="flex items-center gap-1.5 rounded border border-border px-4 py-2.5 text-[13px] font-medium text-foreground hover:bg-secondary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
            >
              <ExternalLink size={13} aria-hidden="true" />
              View credentials
            </a>
          </div>
          {irisUrl && (
            <a
              href={irisUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-1.5 rounded border border-border px-4 py-2.5 text-[13px] font-medium text-foreground hover:bg-secondary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
            >
              <IdCard size={13} aria-hidden="true" />
              View IRIS profile
            </a>
          )}
        </div>
      </aside>
    </>
  );
}
