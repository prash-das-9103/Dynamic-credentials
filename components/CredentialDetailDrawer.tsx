"use client";

import { useEffect } from "react";
import { X, Plus, Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Credential } from "@/types/credentials";
import {
  PRODUCTS,
  INDUSTRIES,
  REGIONS,
  CAPABILITIES,
  CLIENT_NEEDS,
} from "@/data/solutions";
import { EXPERTS } from "@/data/experts";
import { PARTNERS } from "@/data/partners";
import { ConfidentialityBadge } from "./ConfidentialityBadge";
import { usePackContext } from "@/lib/pack-context";

function lookup(arr: { id: string; label: string }[], id: string) {
  return arr.find((a) => a.id === id)?.label ?? id;
}

interface CredentialDetailDrawerProps {
  credential: Credential | null;
  onClose: () => void;
}

export function CredentialDetailDrawer({
  credential,
  onClose,
}: CredentialDetailDrawerProps) {
  const { addItem, removeItem, hasItem } = usePackContext();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isOpen = credential !== null;
  const inPack = credential ? hasItem(credential.id) : false;

  function handlePackToggle() {
    if (!credential) return;
    if (inPack) {
      removeItem(credential.id);
    } else {
      addItem({
        id: credential.id,
        itemType: "credential",
        title: credential.title,
        subtitle: credential.clientAlias,
        exportRestricted: credential.confidentiality === "restricted",
        section: "relevant-credentials",
      });
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/25 transition-opacity duration-200",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-border bg-background shadow-xl transition-transform duration-200",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Credential details"
      >
        {credential && (
          <>
            {/* Drawer header */}
            <div className="flex items-start justify-between gap-3 border-b border-border p-5">
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <ConfidentialityBadge value={credential.confidentiality} />
                  {credential.year && (
                    <span className="text-[11px] text-muted-foreground">
                      {credential.year}
                    </span>
                  )}
                </div>
                <h2 className="text-[16px] font-semibold text-foreground">
                  {credential.title}
                </h2>
                {credential.clientAlias && (
                  <p className="mt-0.5 text-[13px] text-muted-foreground">
                    {credential.clientAlias}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="mt-1 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Close details"
              >
                <X size={16} />
              </button>
            </div>

            {/* Restricted warning */}
            {credential.confidentiality === "restricted" && (
              <div className="flex items-start gap-2 border-b border-border bg-destructive/10 px-5 py-3">
                <AlertTriangle size={14} className="mt-0.5 shrink-0 text-destructive" />
                <p className="text-[12px] text-destructive">
                  <strong>Restricted material.</strong> This credential may not
                  be used in external-facing outputs. Export restricted.
                </p>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Summary */}
              <section>
                <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Executive Summary
                </h3>
                <p className="text-[13px] leading-relaxed text-foreground">
                  {credential.summary}
                </p>
              </section>

              {/* Challenge */}
              {credential.challenge && (
                <section>
                  <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Client Challenge
                  </h3>
                  <p className="text-[13px] leading-relaxed text-foreground">
                    {credential.challenge}
                  </p>
                </section>
              )}

              {/* Actions */}
              {credential.actions.length > 0 && (
                <section>
                  <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    What We Did
                  </h3>
                  <ul className="space-y-1">
                    {credential.actions.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-foreground">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#CC0000]" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Results */}
              {credential.results.length > 0 && (
                <section>
                  <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Results
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {credential.results.map((r, i) => (
                      <div key={i} className="rounded border border-border bg-secondary p-3">
                        <div className="text-[22px] font-bold text-foreground">
                          {r.displayValue ?? r.value}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {r.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Taxonomy */}
              <section className="grid grid-cols-2 gap-4">
                <TaxList
                  label="Products"
                  ids={credential.productIds}
                  source={PRODUCTS}
                />
                <TaxList
                  label="Industries"
                  ids={credential.industryIds}
                  source={INDUSTRIES}
                />
                <TaxList
                  label="Regions"
                  ids={credential.regionIds}
                  source={REGIONS}
                />
                <TaxList
                  label="Capabilities"
                  ids={credential.capabilityIds}
                  source={CAPABILITIES}
                />
                <TaxList
                  label="Client Needs"
                  ids={credential.clientNeedIds}
                  source={CLIENT_NEEDS}
                />
              </section>

              {/* Keywords */}
              {credential.keywords.length > 0 && (
                <section>
                  <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {credential.keywords.map((k) => (
                      <span
                        key={k}
                        className="rounded border border-border bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Related experts */}
              {credential.expertIds.length > 0 && (
                <section>
                  <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Related Experts
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {credential.expertIds.map((eid) => {
                      const expert = EXPERTS.find((e) => e.id === eid);
                      if (!expert) return null;
                      return (
                        <div
                          key={eid}
                          className="flex items-center gap-2 rounded border border-border bg-secondary px-2.5 py-1.5"
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                            {expert.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-[12px] font-medium text-foreground">
                              {expert.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {expert.title}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Related partners */}
              {credential.partnerIds.length > 0 && (
                <section>
                  <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Related Partners
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {credential.partnerIds.map((pid) => {
                      const partner = PARTNERS.find((p) => p.id === pid);
                      if (!partner) return null;
                      return (
                        <span
                          key={pid}
                          className="rounded border border-border bg-secondary px-2 py-0.5 text-[12px] text-muted-foreground"
                        >
                          {partner.name}
                        </span>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Source */}
              {credential.sourceSlides.length > 0 && (
                <p className="text-[11px] text-muted-foreground">
                  Source: Sustainability Credentials, slide
                  {credential.sourceSlides.length > 1 ? "s" : ""}{" "}
                  {credential.sourceSlides.join(" and ")}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border p-4">
              <button
                onClick={handlePackToggle}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded py-2.5 text-[13px] font-semibold transition-colors",
                  inPack
                    ? "bg-[#CC0000] text-white hover:opacity-85"
                    : "bg-foreground text-background hover:opacity-85"
                )}
              >
                {inPack ? (
                  <>
                    <Check size={14} /> Added to pack
                  </>
                ) : (
                  <>
                    <Plus size={14} /> Add to pack
                  </>
                )}
              </button>
              {credential.confidentiality === "restricted" && (
                <p className="mt-2 text-center text-[10px] text-destructive">
                  Export restricted — cannot appear in final output
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function TaxList({
  label,
  ids,
  source,
}: {
  label: string;
  ids: string[];
  source: { id: string; label: string }[];
}) {
  if (ids.length === 0) return null;
  return (
    <div>
      <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </h4>
      <ul className="space-y-0.5">
        {ids.map((id) => (
          <li key={id} className="text-[12px] text-foreground">
            {lookup(source, id)}
          </li>
        ))}
      </ul>
    </div>
  );
}
