import { describe, expect, it } from "vitest";
import { isTestRequest } from "./testMode.ts";

const base = "/noemie-advent-2026/";

describe("mode test", () => {
  it("reconnaît /test sous la base GitHub Pages", () => {
    expect(isTestRequest("/noemie-advent-2026/test", "", "", base)).toBe(true);
    expect(isTestRequest("/noemie-advent-2026/test/", "", "", base)).toBe(true);
  });

  it("reconnaît ?test=1 et le hash", () => {
    expect(isTestRequest("/noemie-advent-2026/", "?test=1", "", base)).toBe(true);
    expect(isTestRequest("/noemie-advent-2026/", "", "#/test", base)).toBe(true);
  });

  it("laisse le calendrier normal fermé", () => {
    expect(isTestRequest("/noemie-advent-2026/", "", "", base)).toBe(false);
    expect(isTestRequest("/noemie-advent-2026/", "?dev=1", "", base)).toBe(false);
  });
});