import { createContext, useContext } from "react";

export const SceneCloseContext = createContext<() => void>(() => {});

export function useCloseScene(): () => void {
  return useContext(SceneCloseContext);
}
