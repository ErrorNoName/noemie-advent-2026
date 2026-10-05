import raw from "../../DAYS.json" with { type: "json" };

type RawDay = (typeof raw.days)[number];

interface DayFields {
  date: string;
  label: string;
  weekdayFr: string;
  giftPhysical: string;
  ux: string;
  refs: string[];
  teaserText: string;
}

export type AdventDay =
  | (DayFields & { day: 1 | 2 | 3 | 4 | 7 })
  | (DayFields & { day: 5; lcdDefaultMessage: string })
  | (DayFields & { day: 6; contents: string[] })
  | (DayFields & { day: 8; breakfast: string[]; extras: string[] });

export type DayNumber = AdventDay["day"];

function requireString(value: string | undefined, label: string): string {
  if (!value) throw new Error(`DAYS.json : ${label} manquant`);
  return value;
}

function parseDays(input: readonly RawDay[]): AdventDay[] {
  return input.map((day): AdventDay => {
    const fields: DayFields = {
      date: day.date,
      label: day.label,
      weekdayFr: day.weekdayFr,
      giftPhysical: day.giftPhysical,
      ux: day.ux,
      refs: [...day.refs],
      teaserText: day.teaserText,
    };
    switch (day.id) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 7:
        return { ...fields, day: day.id };
      case 5:
        return {
          ...fields,
          day: 5,
          lcdDefaultMessage: requireString(day.lcdDefaultMessage, "message LCD"),
        };
      case 6: {
        if (!day.contents || day.contents.length === 0) {
          throw new Error("Le jour 6 doit lister le contenu du panier");
        }
        return { ...fields, day: 6, contents: [...day.contents] };
      }
      case 8: {
        if (!day.breakfast || day.breakfast.length === 0) {
          throw new Error("Le jour 8 doit lister le petit-déjeuner");
        }
        return {
          ...fields,
          day: 8,
          breakfast: [...day.breakfast],
          extras: day.extras ? [...day.extras] : [],
        };
      }
      default:
        throw new Error(`Jour inattendu dans DAYS.json : ${String(day.id)}`);
    }
  });
}

export const recipient = raw.recipient;
export const timezone = raw.timezone;
export const birthday = raw.birthday;
export const storageKey = raw.storageKey;
export const devQueryParam = raw.devQueryParam;
export const days = parseDays(raw.days);

export function dayByNumber(day: DayNumber): AdventDay {
  const found = days.find((item) => item.day === day);
  if (!found) throw new Error(`Jour ${day} introuvable`);
  return found;
}

export function teaserFor(day: DayNumber): string {
  return dayByNumber(day).teaserText;
}

export function giftFor(day: DayNumber): string {
  return dayByNumber(day).giftPhysical;
}
