import { describe, expect, it } from "vitest";
import { experienceCounts, peelStickers, railStickers, recipeFor } from "./experience.ts";

describe("experience stickers", () => {
  it("keeps the fifty common cuts and the per-day counts", () => {
    expect(experienceCounts()).toEqual({
      common: 50,
      days: { "1": 7, "2": 4, "3": 4, "4": 4, "5": 4, "6": 4, "7": 2, "8": 4 },
    });
  });

  it("puts rail stickers in the side pool, without frames or tickets", () => {
    for (let day = 1; day <= 8; day += 1) {
      const rails = railStickers(day);
      expect(rails).toHaveLength(4);
      expect(rails.every((src) => !src.includes("polaroid-frame") && !src.includes("/ticket-"))).toBe(true);
    }
  });

  it("peels day stickers in a row and keeps a single lighter on day 7", () => {
    expect(peelStickers(1).some((item) => item.src.includes("kraft-pink-bow"))).toBe(true);
    expect(peelStickers(1).some((item) => item.src.includes("labubu-popmart"))).toBe(false);
    expect(peelStickers(4).some((item) => item.src.includes("gashapon-capsule"))).toBe(true);
    expect(peelStickers(8).some((item) => item.src.includes("cake-2"))).toBe(true);
    const day7 = peelStickers(7).map((item) => item.src).join(" ");
    expect(day7.includes("lighter")).toBe(false);
    expect(day7.includes("zippo")).toBe(false);
    expect(peelStickers(2)[0]?.play).toBe("drag");
    expect(peelStickers(2)[1]?.play).toBe("tap");
  });

  it("cycles souvenir recipes from the site palette", () => {
    expect(recipeFor(1).word).toBe("TOI");
    expect(recipeFor(9).id).toBe(recipeFor(1).id);
    expect(recipeFor(2).wash.startsWith("#")).toBe(true);
  });
});
