import { describe, expect, it } from "vitest";
import { days } from "../data/days.ts";
import { isGateCode } from "./code.ts";
import { doorStatus } from "./doors.ts";
import {
  caseNumberForToday,
  getCountdownTarget,
  parisDateKey,
  parisMidnight,
  splitRemaining,
} from "./time.ts";

describe("minuit de Paris", () => {
  it("place le 14 octobre 2026 à 22:00 UTC la veille", () => {
    expect(parisMidnight("2026-10-14").toISOString()).toBe("2026-10-13T22:00:00.000Z");
  });

  it("reconnaît ce minuit comme le 14", () => {
    expect(parisDateKey(new Date("2026-10-13T22:00:00.000Z"))).toBe("2026-10-14");
  });

  it("laisse la seconde d’avant au 13", () => {
    expect(parisDateKey(new Date("2026-10-13T21:59:59.000Z"))).toBe("2026-10-13");
  });
});

describe("compte à rebours", () => {
  it("avant le début, vise le premier matin", () => {
    const target = getCountdownTarget(new Date("2026-10-05T10:00:00.000Z"));
    expect(target.kind).toBe("start");
    expect(target.caseNumber).toBe(1);
    expect(target.at.toISOString()).toBe("2026-10-13T22:00:00.000Z");
    expect(caseNumberForToday("2026-10-05")).toBe(1);
  });

  it("le 16 au soir, vise le minuit de la case 4", () => {
    const target = getCountdownTarget(new Date("2026-10-16T13:00:00.000Z"));
    expect(target.kind).toBe("next");
    expect(target.caseNumber).toBe(4);
    expect(target.at.toISOString()).toBe("2026-10-16T22:00:00.000Z");
    expect(caseNumberForToday("2026-10-16")).toBe(3);
  });

  it("le jour de l’anniversaire, s’arrête", () => {
    const target = getCountdownTarget(new Date("2026-10-21T06:00:00.000Z"));
    expect(target.kind).toBe("done");
    expect(target.caseNumber).toBe(8);
    expect(caseNumberForToday("2026-10-21")).toBe(8);
  });

  it("découpe un reste de 9 jours", () => {
    expect(splitRemaining(9 * 86_400 * 1000)).toEqual({
      days: 9,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
    expect(splitRemaining(-20)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});

describe("portes", () => {
  it("garde une case ouverte même dans le futur", () => {
    expect(doorStatus({ date: "2026-10-21", today: "2026-10-05", opened: true, dev: false })).toBe(
      "opened",
    );
  });

  it("verrouille le futur hors preview", () => {
    expect(doorStatus({ date: "2026-10-18", today: "2026-10-14", opened: false, dev: false })).toBe(
      "locked",
    );
  });

  it("ouvre le jour même et le passé non vu", () => {
    expect(doorStatus({ date: "2026-10-14", today: "2026-10-16", opened: false, dev: false })).toBe(
      "available",
    );
  });

  it("débloque tout avec dev", () => {
    expect(doorStatus({ date: "2026-10-21", today: "2026-10-05", opened: false, dev: true })).toBe(
      "available",
    );
  });
});

describe("calendrier", () => {
  it("aligne 8 jours du 14 au 21 octobre 2026", () => {
    expect(days.map((day) => day.date)).toEqual([
      "2026-10-14",
      "2026-10-15",
      "2026-10-16",
      "2026-10-17",
      "2026-10-18",
      "2026-10-19",
      "2026-10-20",
      "2026-10-21",
    ]);
    const birthday = days[7];
    expect(birthday?.day).toBe(8);
    if (birthday?.day === 8) {
      expect(birthday.breakfast).toContain("pêche blanche");
      expect(birthday.breakfast).toContain("religieuses");
      expect(birthday.extras).toContain("post-it je t'aime");
    }
  });
});

describe("code", () => {
  it("accepte le prénom, avec ou sans accent", () => {
    expect(isGateCode("Noémie", "Noémie")).toBe(true);
    expect(isGateCode("  noemie ", "Noémie")).toBe(true);
    expect(isGateCode("NOÉMIE", "Noémie")).toBe(true);
    expect(isGateCode("bonjour", "Noémie")).toBe(false);
    expect(isGateCode("   ", "Noémie")).toBe(false);
  });
});
