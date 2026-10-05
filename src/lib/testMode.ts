/** /test, #/test, or ?test=1 — ignores the Paris date. */
export function isTestRequest(pathname: string, search: string, hash: string, base: string): boolean {
  const query = search.startsWith("?") ? search.slice(1) : search;
  const params = new URLSearchParams(query);
  if (params.get("test") === "1") return true;

  const path = pathname.replace(/\/+$/, "") || "/";
  const root = base.replace(/\/+$/, "");
  if (path === `${root}/test`) return true;

  const cleanHash = hash.replace(/^#/, "").split("?")[0]?.replace(/\/+$/, "") ?? "";
  return cleanHash === "/test" || cleanHash === "test";
}
