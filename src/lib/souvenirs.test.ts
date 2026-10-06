import { describe, expect, it } from "vitest";
import { days } from "../data/days.ts";
import {
  allMemories,
  cameraKind,
  memoriesForDay,
  splitCounts,
  stampText,
  unlockedSouvenirDays,
} from "./souvenirs.ts";

describe("souvenirs", () => {
  it("spreads the thirty photos across days 2, 4, 6 and 8", () => {
    expect(splitCounts(30, 4)).toEqual([8, 8, 7, 7]);
    const photos = allMemories();
    expect(photos).toHaveLength(30);
    expect(photos.every((photo) => Math.max(photo.width, photo.height) <= 1600)).toBe(true);
    expect(memoriesForDay(2)).toHaveLength(8);
    expect(memoriesForDay(4)).toHaveLength(8);
    expect(memoriesForDay(6)).toHaveLength(7);
    expect(memoriesForDay(8)).toHaveLength(7);
    expect(cameraKind(2)).toBe("polaroid");
    expect(cameraKind(4)).toBe("disposable");
    expect(cameraKind(6)).toBe("digital");
    expect(cameraKind(8)).toBe("film");
    expect(photos[0]?.order).toBe(1);
    expect(photos[29]?.order).toBe(30);
  });

  it("unlocks a roll only with its day, and all of them in test mode", () => {
    const day2 = days.find((day) => day.day === 2);
    const day4 = days.find((day) => day.day === 4);
    expect(day2 && day4).toBeTruthy();
    expect(unlockedSouvenirDays({ today: "2026-10-06", opened: {}, dev: false, test: false })).toEqual([]);
    expect(
      unlockedSouvenirDays({ today: day2?.date ?? "", opened: {}, dev: false, test: false }),
    ).toEqual([2]);
    expect(
      unlockedSouvenirDays({ today: day4?.date ?? "", opened: {}, dev: false, test: false }),
    ).toEqual([2, 4]);
    expect(unlockedSouvenirDays({ today: "2026-10-06", opened: {}, dev: false, test: true })).toEqual([
      2, 4, 6, 8,
    ]);
  });

  it("stamps only the disposable and digital frames", () => {
    expect(stampText("2026-10-15", "disposable")).toBe("15 10 '26");
    expect(stampText("2026-10-17", "digital")).toBe("17.10.26");
    expect(stampText("2026-10-15", "polaroid")).toBeNull();
    expect(stampText("2026-10-21", "film")).toBeNull();
  });
});
