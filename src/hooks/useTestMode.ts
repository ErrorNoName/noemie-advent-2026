import { useState } from "react";
import { isTestRequest } from "../lib/testMode.ts";

export function useTestMode(): boolean {
  const [test] = useState(() =>
    isTestRequest(window.location.pathname, window.location.search, window.location.hash, import.meta.env.BASE_URL),
  );
  return test;
}
