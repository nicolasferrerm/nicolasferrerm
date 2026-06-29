"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAppState } from "@/lib/storage";
import type { AppState } from "@/lib/types";

interface AppContextType {
  state: AppState;
  update: (partial: Partial<AppState>) => void;
  reset: () => void;
  loaded: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const appState = useAppState();
  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
