"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Check, AlertTriangle, Info, ExternalLink } from "lucide-react";
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
import { ConfidentialityBadge } from "@/components/ConfidentialityBadge";
import { usePackContext } from "@/lib/pack-context";

function lookup(arr: { id: string; label: string }[], id: string) {
  return arr.find((a) => a.id === id)?.label ?? id;
}

interface CredentialDetailDrawerProps {
  credential: Credential | null;
  onClose: () => void;
  /** Called when a taxonomy label is clicked — applies a filter and closes drawer */
  onApplyFilter?: (
    key: "product" | "industry" | "region" | "capability" | "clientNeed",
    value: string
  ) => void;
}

export function CredentialDetailDrawer({
  credential,
  onClose,
  onApplyFilter,
}: CredentialDetailDrawerProps) {
  const { addItem, removeItem, hasItem } = usePackContext();
  const router = useRouter();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

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
          "fixed inset-0 z-40 bg-black/30 transition-opacity duration-200",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-[580px] flex-col border-l border-border bg-background shadow-xl transition-transform duration-200",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {credential && (
          <>
            {/* Drawer header */}
            <div className="flex items-start justify-between gap-3 border-b border-border p-5 shrink-0">
              <div className="min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <ConfidentialityBadge value={credential.confidentiality} />
                  <span className="text-[11px] text-muted-foreground capitalize">
                    {credential.type.replace(/-/g, " ")}
                  </span>
                  {credential.year && (
                    <span className="text-[11px] text-muted-foreground">
                      {credential.year}
                    </span>
                  )}
                </div>
                <h2
                  id="drawer-title"
                  className="text-[16px] font-semibold text-foreground leading-snug"
                >
                  {credential.title}
                </h2>
                {credential.clientAlias && (
                  <p className="mt-0.5 text-[13px] text-muted-foreground">
                    {credential.clientAlias}
                  </p>
                )}
                {credential.sourceSlides.length > 0 && (
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Source: Sustainability Credentials, slide
                    {credential.sourceSlides.length > 1 ? "s" : ""}{" "}
                    {credential.sourceSlides.join(" and ")}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="mt-0.5 shrink-0 rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
                aria-label="Close details"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            {/* Confidentiality notices */}
            {credential.confidentiality === "anonymized-client-example" && (
              <div className="flex items-start gap-2 border-b border-border bg-secondary/60 px-5 py-3 shrink-0">
                <Info size={13} className="mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <p className="text-[12px] text-muted-foreground">
                  Anonymized client example. Do not infer or disclose the client identity.
                </p>
              </div>
            )}
            {credential.confidentiality === "restricted" && (
              <div className="flex items-start gap-2 border-b border-border bg-destructive/10 px-5 py-3 shrink-0">
                <AlertTriangle size={13} className="mt-0.5 shrink-0 text-destructive" aria-hidden="true" />
                <p className="text-[12px] text-destructive">
                  <strong>Restricted material.</strong> This credential is restricted and must not be included in an export-ready pack.
                </p>
              </div>
            )}

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">

              {/* Executive Summary */}
              <section aria-label="Executive summary">
                <SectionLabel>Executive Summary</SectionLabel>
                <p className="text-[13px] leading-relaxed text-foreground">
                  {credential.summary}
                </p>
              </section>

              {/* Client Challenge */}
              {credential.challenge && (
                <section aria-label="Client challenge">
                  <SectionLabel>Client Challenge</SectionLabel>
                  <p className="text-[13px] leading-relaxed text-foreground bg-secondary/50 rounded p-3 border-l-2 border-[#CC0000]">
                    {credential.challenge}
                  </p>
                </section>
              )}

              {/* What We Did */}
              {credential.actions.length > 0 && (
                <section aria-label="What we did">
                  <SectionLabel>What We Did</SectionLabel>
                  <ol className="space-y-1.5 list-none pl-0">
                    {credential.actions.map((a, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[13px] text-foreground">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-[10px] font-bold text-foreground tabular-nums">
                          {i + 1}
                        </span>
                        {a}
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {/* Results */}
              <section aria-label="Results">
                <SectionLabel>Results</SectionLabel>
                {credential.results.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {credential.results.map((r, i) => (
                      <div
                        key={i}
                        className="rounded border border-border bg-secondary p-3"
                      >
                        <div className="text-[22px] font-bold tabular-nums text-foreground leading-none mb-1">
                          {r.displayValue ?? r.value}
                        </div>
                        <div className="text-[11px] text-muted-foreground leading-snug">
                          {r.label}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-muted-foreground italic">
                    Quantified results are not available in the prototype dataset.
                  </p>
                )}
              </section>

              {/* Classification */}
              <section aria-label="Classification">
                <SectionLabel>Classification</SectionLabel>
                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                  <TaxList
                    label="Products"
                    ids={credential.productIds}
                    source={PRODUCTS}
                    filterKey="product"
                    onApplyFilter={onApplyFilter}
                  />
                  <TaxList
                    label="Industries"
                    ids={credential.industryIds}
                    source={INDUSTRIES}
                    filterKey="industry"
                    onApplyFilter={onApplyFilter}
                  />
                  <TaxList
                    label="Regions"
                    ids={credential.regionIds}
                    source={REGIONS}
                    filterKey="region"
                    onApplyFilter={onApplyFilter}
                  />
                  <TaxList
                    label="Capabilities"
                    ids={credential.capabilityIds}
                    source={CAPABILITIES}
                    filterKey="capability"
                    onApplyFilter={onApplyFilter}
                  />
                  <TaxList
                    label="Client Needs"
                    ids={credential.clientNeedIds}
                    source={CLIENT_NEEDS}
                    filterKey="clientNeed"
                    onApplyFilter={onApplyFilter}
                  />
                </div>
                {/* Keywords */}
                {credential.keywords.length > 0 && (
                  <div className="mt-3">
                    <SubLabel>Keywords</SubLabel>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {credential.keywords.map((k) => (
                        <span
                          key={k}
                          className="rounded border border-border bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Related Experts */}
              {credential.expertIds.length > 0 && (
                <section aria-label="Related experts">
                  <SectionLabel>Related Experts</SectionLabel>
                  <div className="space-y-2">
                    {credential.expertIds.map((eid) => {
                      const expert = EXPERTS.find((e) => e.id === eid);
                      if (!expert) return null;
                      const initials = expert.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();
                      return (
                        <button
                          key={eid}
                          onClick={() => {
                            onClose();
                            router.push(`/experts?expert=${eid}`);
                          }}
                          className="flex w-full items-center gap-3 rounded border border-border bg-secondary p-3 text-left hover:border-foreground/30 hover:bg-secondary/80 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground group"
                          aria-label={`View expert profile for ${expert.name}`}
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background">
                            {initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13px] font-medium text-foreground group-hover:underline">
                                {expert.name}
                              </span>
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {expert.title}{expert.role ? ` · ${expert.role}` : ""}
                            </div>
                            {expert.expertise.length > 0 && (
                              <div className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
                                {expert.expertise.slice(0, 3).join(", ")}
                              </div>
                            )}
                          </div>
                          <ExternalLink size={12} className="shrink-0 text-muted-foreground group-hover:text-foreground" aria-hidden="true" />
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Related Partners */}
              {credential.partnerIds.length > 0 && (
                <section aria-label="Related partners">
                  <SectionLabel>Related Partners</SectionLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {credential.partnerIds.map((pid) => {
                      const partner = PARTNERS.find((p) => p.id === pid);
                      if (!partner) return null;
                      return (
                        <button
                          key={pid}
                          onClick={() => {
                            onClose();
                            router.push(`/ecosystem?partner=${pid}`);
                          }}
                          className="rounded border border-border bg-secondary px-2.5 py-1 text-[12px] text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
                          aria-label={`View ${partner.name} in ecosystem`}
                        >
                          {partner.name}
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-border p-4">
              <button
                onClick={handlePackToggle}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded py-2.5 text-[13px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground",
                  inPack
                    ? "bg-[#CC0000] text-white hover:opacity-85"
                    : "bg-foreground text-background hover:opacity-85"
                )}
              >
                {inPack ? (
                  <><Check size={14} aria-hidden="true" /> Added to pack</>
                ) : (
                  <><Plus size={14} aria-hidden="true" /> Add to pack</>
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </h3>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </h4>
  );
}

function TaxList({
  label,
  ids,
  source,
  filterKey,
  onApplyFilter,
}: {
  label: string;
  ids: string[];
  source: { id: string; label: string }[];
  filterKey: "product" | "industry" | "region" | "capability" | "clientNeed";
  onApplyFilter?: (
    key: "product" | "industry" | "region" | "capability" | "clientNeed",
    value: string
  ) => void;
}) {
  if (ids.length === 0) return null;
  return (
    <div>
      <SubLabel>{label}</SubLabel>
      <ul className="mt-1 space-y-1">
        {ids.map((id) => {
          const text = lookup(source, id);
          if (onApplyFilter) {
            return (
              <li key={id}>
                <button
                  onClick={() => onApplyFilter(filterKey, id)}
                  className="text-left text-[12px] text-foreground hover:text-[#CC0000] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground rounded-sm transition-colors"
                  title={`Filter by ${text}`}
                >
                  {text}
                </button>
              </li>
            );
          }
          return (
            <li key={id} className="text-[12px] text-foreground">
              {text}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
