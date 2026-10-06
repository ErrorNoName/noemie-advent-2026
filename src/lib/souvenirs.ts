import raw from "../data/souvenirs.json" with { type: "json" };
import { days } from "../data/days.ts";
import { doorStatus } from "./doors.ts";

export const CAMERA_DAYS = [2, 4, 6, 8] as const;

export type SouvenirDay = (typeof CAMERA_DAYS)[number];

export type CameraKind = "polaroid" | "disposable" | "digital" | "film";

export interface MemoryPhoto {
  id: string;
  src: string;
  width: number;
  height: number;
  order: number;
  day: SouvenirDay;
  kind: CameraKind;
  date: string;
  indexOnDay: number;
  totalOnDay: number;
}

export function cameraKind(day: SouvenirDay): CameraKind {
  switch (day) {
    case 2:
      return "polaroid";
    case 4:
      return "disposable";
    case 6:
      return "digital";
    case 8:
      return "film";
    default: {
      const unexpected: never = day;
      return unexpected;
    }
  }
}

export function isSouvenirDay(day: number): day is SouvenirDay {
  return day === 2 || day === 4 || day === 6 || day === 8;
}

export function splitCounts(total: number, buckets: number): number[] {
  if (buckets <= 0) return [];
  const base = Math.floor(total / buckets);
  const extra = total % buckets;
  return Array.from({ length: buckets }, (_, index) => base + (index < extra ? 1 : 0));
}

export function cameraLabel(kind: CameraKind): string {
  switch (kind) {
    case "polaroid":
      return "Polaroid";
    case "disposable":
      return "Jetable";
    case "digital":
      return "Compact";
    case "film":
      return "Argentique";
    default: {
      const unexpected: never = kind;
      return unexpected;
    }
  }
}

export function stampText(date: string, kind: CameraKind): string | null {
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return null;
  const yy = year.slice(-2);
  switch (kind) {
    case "disposable":
      return `${day} ${month} '${yy}`;
    case "digital":
      return `${day}.${month}.${yy}`;
    case "polaroid":
    case "film":
      return null;
    default: {
      const unexpected: never = kind;
      return unexpected;
    }
  }
}

function dateFor(day: SouvenirDay): string {
  const found = days.find((item) => item.day === day);
  if (!found) throw new Error(`Jour ${day} introuvable`);
  return found.date;
}

function buildMemories(): MemoryPhoto[] {
  const ordered = [...raw.photos].sort((a, b) => a.order - b.order);
  const counts = splitCounts(ordered.length, CAMERA_DAYS.length);
  const out: MemoryPhoto[] = [];
  let cursor = 0;
  for (let bucket = 0; bucket < CAMERA_DAYS.length; bucket += 1) {
    const day = CAMERA_DAYS[bucket];
    if (day === undefined) continue;
    const count = counts[bucket] ?? 0;
    const slice = ordered.slice(cursor, cursor + count);
    cursor += count;
    const kind = cameraKind(day);
    const date = dateFor(day);
    slice.forEach((photo, index) => {
      out.push({
        id: photo.file,
        src: photo.file,
        width: photo.width,
        height: photo.height,
        order: photo.order,
        day,
        kind,
        date,
        indexOnDay: index,
        totalOnDay: slice.length,
      });
    });
  }
  return out;
}

const MEMORIES = buildMemories();

export function allMemories(): MemoryPhoto[] {
  return MEMORIES;
}

export function memoriesForDay(day: SouvenirDay): MemoryPhoto[] {
  return MEMORIES.filter((photo) => photo.day === day);
}

export function unlockedSouvenirDays(input: {
  today: string;
  opened: Record<string, boolean>;
  dev: boolean;
  test: boolean;
}): SouvenirDay[] {
  const open: SouvenirDay[] = [];
  for (const day of days) {
    if (!isSouvenirDay(day.day)) continue;
    const status = doorStatus({
      date: day.date,
      today: input.today,
      opened: input.opened[day.date] === true,
      dev: input.dev,
      test: input.test,
    });
    if (status !== "locked") open.push(day.day);
  }
  return open;
}
