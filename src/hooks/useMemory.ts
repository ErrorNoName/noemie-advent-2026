import { useCallback, useEffect, useState } from "react";
import { loadMemory, saveMemory, type AdventMemory } from "../lib/storage.ts";

export function useMemory() {
  const [memory, setMemory] = useState<AdventMemory>(() => loadMemory());

  useEffect(() => {
    saveMemory(memory);
  }, [memory]);

  const markOpened = useCallback((date: string) => {
    setMemory((prev) => ({
      ...prev,
      opened: { ...prev.opened, [date]: true },
      lastVisit: new Date().toISOString(),
    }));
  }, []);

  const unlock = useCallback(() => {
    setMemory((prev) => ({ ...prev, codeOk: true, lastVisit: new Date().toISOString() }));
  }, []);

  const lock = useCallback(() => {
    setMemory((prev) => ({ ...prev, codeOk: undefined }));
  }, []);

  return { memory, markOpened, unlock, lock };
}
