export interface AnalyticsFilters {
  solutions: string[];
  products: string[];
  industries: string[];
  regions: string[];
  capabilities: string[];
  clientNeeds: string[];
  years: string[];
  confidentiality: string[];
}

export const EMPTY_FILTERS: AnalyticsFilters = {
  solutions: [],
  products: [],
  industries: [],
  regions: [],
  capabilities: [],
  clientNeeds: [],
  years: [],
  confidentiality: [],
};

export type DisplayMode = "count" | "pct";
