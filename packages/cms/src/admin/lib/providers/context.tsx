import { createContext, useContext, type ReactNode } from "react";

import type { DataProvider } from "./types";

import { getProvider } from "./registry";

const ProviderContext = createContext<DataProvider | null>(null);

export function DataProviderWrapper({ children }: { children: ReactNode }) {
  const provider = getProvider();
  return <ProviderContext.Provider value={provider}>{children}</ProviderContext.Provider>;
}

export function useDataProvider(): DataProvider {
  const ctx = useContext(ProviderContext);
  if (!ctx) throw new Error("useDataProvider must be used within a DataProviderWrapper");
  return ctx;
}
