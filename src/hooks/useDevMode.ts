import { useState } from "react";
import { devQueryParam } from "../data/days.ts";

export function useDevMode(): boolean {
  const [dev] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get(devQueryParam) === "1" || params.get("preview") === "all";
  });
  return dev;
}
