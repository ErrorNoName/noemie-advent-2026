import { createContext, useContext, type ReactNode } from "react";

export interface ShotStoreValue {
  shots: Record<string, number>;
  setShotCount: (day: number, count: number) => void;
}

const ShotContext = createContext<ShotStoreValue | null>(null);

export function ShotProvider({ value, children }: { value: ShotStoreValue; children: ReactNode }) {
  return <ShotContext.Provider value={value}>{children}</ShotContext.Provider>;
}

export function useShots(): ShotStoreValue {
  return useContext(ShotContext) ?? { shots: {}, setShotCount: () => undefined };
}
