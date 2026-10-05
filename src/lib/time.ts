import { days } from "../data/days.ts";

/**
 * Compte à rebours — Europe/Paris.
 *
 * - Avant le 14 oct 2026, 00:00 (Paris) : on compte jusqu'au premier matin
 *   (déblocage de la case 1).
 * - À partir du 14, et tant qu'un jour du calendrier est encore dans le futur :
 *   on compte jusqu'au minuit Paris du prochain jour non encore débloqué
 *   (la première date strictement après aujourd'hui).
 * - Le 21 oct 2026, dès 00:00, et après : plus de déblocage à venir.
 *   Le chrono s'arrête sur « Joyeux anniversaire ».
 *
 * Octobre 2026 est encore à l'heure d'été (UTC+2) jusqu'au 25. Le décalage
 * est calculé via Intl, pas figé, pour rester juste aux frontières.
 */

export const TIMEZONE = "Europe/Paris";

export interface ClockParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export type CountdownKind = "start" | "next" | "done";

export interface CountdownTarget {
  at: Date;
  kind: CountdownKind;
  caseNumber: number;
  caption: string;
}

export function parisDateKey(instant: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

function offsetMinutes(instant: Date): number {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const bag: Record<string, string> = {};
  for (const part of fmt.formatToParts(instant)) {
    if (part.type !== "literal") bag[part.type] = part.value;
  }
  let hour = Number(bag.hour);
  let day = Number(bag.day);
  let month = Number(bag.month);
  let year = Number(bag.year);
  if (hour === 24) {
    hour = 0;
    const rolled = new Date(Date.UTC(year, month - 1, day));
    rolled.setUTCDate(rolled.getUTCDate() + 1);
    year = rolled.getUTCFullYear();
    month = rolled.getUTCMonth() + 1;
    day = rolled.getUTCDate();
  }
  const asUtc = Date.UTC(year, month - 1, day, hour, Number(bag.minute), Number(bag.second));
  return Math.round((asUtc - instant.getTime()) / 60_000);
}

/** Minuit pile en Europe/Paris pour une date YYYY-MM-DD. */
export function parisMidnight(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  if (!year || !month || !day) {
    throw new Error(`Date invalide : ${dateKey}`);
  }
  let utc = Date.UTC(year, month - 1, day, 0, 0, 0);
  for (let pass = 0; pass < 3; pass += 1) {
    const offset = offsetMinutes(new Date(utc));
    utc = Date.UTC(year, month - 1, day, 0, 0, 0) - offset * 60_000;
  }
  return new Date(utc);
}

export function getCountdownTarget(now: Date): CountdownTarget {
  const first = days[0];
  const last = days[days.length - 1];
  if (!first || !last) {
    throw new Error("Calendrier vide");
  }
  const start = parisMidnight(first.date);
  if (now.getTime() < start.getTime()) {
    return {
      at: start,
      kind: "start",
      caseNumber: 1,
      caption: "Avant le premier matin",
    };
  }
  const today = parisDateKey(now);
  const next = days.find((day) => day.date > today);
  if (next) {
    return {
      at: parisMidnight(next.date),
      kind: "next",
      caseNumber: next.day,
      caption: `Avant la case ${next.day}`,
    };
  }
  return {
    at: parisMidnight(last.date),
    kind: "done",
    caseNumber: last.day,
    caption: "Joyeux anniversaire",
  };
}

/** Case du jour calendaire : 1 avant le début, 8 le jour J et après. */
export function caseNumberForToday(today: string): number {
  let current = 1;
  for (const day of days) {
    if (day.date <= today) current = day.day;
  }
  return current;
}

export function splitRemaining(ms: number): ClockParts {
  const total = Math.max(0, Math.floor(ms / 1000));
  const daysPart = Math.floor(total / 86_400);
  const hours = Math.floor((total % 86_400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { days: daysPart, hours, minutes, seconds };
}

export function formatParisLong(instant: Date): string {
  const label = new Intl.DateTimeFormat("fr-FR", {
    timeZone: TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(instant);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatDateKey(dateKey: string): string {
  const noon = new Date(parisMidnight(dateKey).getTime() + 12 * 60 * 60 * 1000);
  return formatParisLong(noon);
}

export function formatShort(dateKey: string): string {
  const noon = new Date(parisMidnight(dateKey).getTime() + 12 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: TIMEZONE,
    day: "numeric",
    month: "short",
  }).format(noon);
}

export function ariaRemaining(parts: ClockParts, caption: string): string {
  const bits = [
    parts.days > 0 ? `${parts.days} ${parts.days > 1 ? "jours" : "jour"}` : null,
    `${parts.hours} ${parts.hours > 1 ? "heures" : "heure"}`,
    `${parts.minutes} ${parts.minutes > 1 ? "minutes" : "minute"}`,
    `${parts.seconds} ${parts.seconds > 1 ? "secondes" : "seconde"}`,
  ].filter((bit): bit is string => bit !== null);
  return `${caption}. ${bits.join(", ")}.`;
}
