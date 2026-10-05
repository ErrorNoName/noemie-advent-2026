import { storageKey } from "../data/days.ts";

const KEY = storageKey;

export interface AdventMemory {
  opened: Record<string, boolean>;
  lastVisit: string;
  codeOk?: boolean;
}

function emptyMemory(): AdventMemory {
  return { opened: {}, lastVisit: new Date().toISOString() };
}

export function loadMemory(): AdventMemory {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyMemory();
    const parsed = JSON.parse(raw) as Partial<AdventMemory>;
    const opened: Record<string, boolean> = {};
    if (parsed.opened && typeof parsed.opened === "object") {
      for (const [date, value] of Object.entries(parsed.opened)) {
        if (value === true && /^\d{4}-\d{2}-\d{2}$/.test(date)) opened[date] = true;
      }
    }
    return {
      opened,
      lastVisit: typeof parsed.lastVisit === "string" ? parsed.lastVisit : new Date().toISOString(),
      codeOk: parsed.codeOk === true ? true : undefined,
    };
  } catch {
    return emptyMemory();
  }
}

export function saveMemory(memory: AdventMemory): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(memory));
  } catch {
    /* mode privé : on garde la session en mémoire */
  }
}
