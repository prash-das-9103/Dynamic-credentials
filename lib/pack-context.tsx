"use client";

import React, { createContext, useContext } from "react";
import { usePack } from "./pack-store";

type PackContextType = ReturnType<typeof usePack>;

const PackContext = createContext<PackContextType | null>(null);

export function PackProvider({ children }: { children: React.ReactNode }) {
  const pack = usePack();
  return <PackContext.Provider value={pack}>{children}</PackContext.Provider>;
}

export function usePackContext() {
  const ctx = useContext(PackContext);
  if (!ctx) throw new Error("usePackContext must be used within PackProvider");
  return ctx;
}
