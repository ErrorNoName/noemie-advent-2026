import catalog from "../data/experience.json" with { type: "json" };

export type PeelPlay = "drag" | "tap" | "still";

export interface PeelSticker {
  src: string;
  play: PeelPlay;
}

const WASH = ["#F7D7E2", "#FFF8F2", "#F3DDB4", "#F6E7C8", "#E7F0F4", "#F8D5E0"] as const;

export interface StickerRecipe {
  id: string;
  cutout: string;
  word: string;
  wash: string;
}

function commonFile(part: string): string {
  const found = catalog.common.find((item) => item.file.includes(part));
  if (!found) throw new Error(`Décor manquant : ${part}`);
  return found.file;
}

function dayFile(day: number, part: string): string {
  const list = catalog.days[String(day) as keyof typeof catalog.days];
  const found = list?.find((item) => item.file.includes(part));
  if (!found) throw new Error(`Sticker jour ${day} manquant : ${part}`);
  return found.file;
}

const RAIL_POOL = catalog.common
  .map((item) => item.file)
  .filter((file) => !file.includes("polaroid-frame") && !file.includes("/ticket-"));

/** Side-rail decor only. Frames and tickets stay out of the 42px columns. */
export function railStickers(day: number): readonly string[] {
  const start = ((day - 1) * 4) % RAIL_POOL.length;
  return [0, 1, 2, 3].map((offset) => {
    const file = RAIL_POOL[(start + offset) % RAIL_POOL.length];
    if (!file) throw new Error("Rail vide");
    return file;
  });
}

function row(sources: string[]): PeelSticker[] {
  return sources.map((src, index) => {
    let play: PeelPlay = "still";
    if (index === 0) play = "drag";
    else if (index === 1) play = "tap";
    return { src, play };
  });
}

/**
 * Stickers that peel in under the gift, in the flow, never on top of it.
 * Day 7 stays with bows and stars: the scene already has its one lighter.
 */
export function peelStickers(day: number): PeelSticker[] {
  switch (day) {
    case 1:
      return row([
        dayFile(1, "kraft-pink-bow"),
        dayFile(1, "polka-pouch-button"),
        dayFile(1, "labubu-bunny"),
        commonFile("star-142234aa31"),
      ]);
    case 2:
      return row([
        dayFile(2, "pin-squishy-01"),
        dayFile(2, "pin-squishy-04"),
        commonFile("bow-43731c1e79"),
      ]);
    case 3:
      return row([
        dayFile(3, "teddy-2"),
        dayFile(3, "teddy-heart"),
        commonFile("bow-52f84cb8bc"),
      ]);
    case 4:
      return row([
        dayFile(4, "gashapon-capsule"),
        dayFile(4, "ic-09347"),
        commonFile("star-4be0d18012"),
      ]);
    case 5:
      return row([
        dayFile(5, "barrette-purple"),
        dayFile(5, "bow-hairpin"),
        dayFile(5, "hair-clips"),
      ]);
    case 6:
      return row([
        dayFile(6, "bubble-tea-2"),
        commonFile("washi-112dcd66fb"),
        commonFile("bow-b87bbab29b"),
      ]);
    case 7:
      return row([
        commonFile("star-142234aa31"),
        commonFile("washi-77a18f74c3"),
        commonFile("bow-43731c1e79"),
      ]);
    case 8:
      return row([
        dayFile(8, "cake-2"),
        commonFile("bow-52f84cb8bc"),
        commonFile("washi-63e038e043"),
      ]);
    default:
      return [];
  }
}

export const STICKER_RECIPES: readonly StickerRecipe[] = [
  { id: "toi", cutout: commonFile("bow-43731c1e79"), word: "TOI", wash: WASH[0] },
  { id: "star", cutout: commonFile("star-142234aa31"), word: "", wash: WASH[1] },
  { id: "oui", cutout: commonFile("bow-52f84cb8bc"), word: "OUI", wash: WASH[2] },
  { id: "washi", cutout: commonFile("washi-112dcd66fb"), word: "", wash: WASH[4] },
  { id: "jour", cutout: commonFile("star-4be0d18012"), word: "JOUR", wash: WASH[5] },
  { id: "pin", cutout: commonFile("pin-decor-02"), word: "", wash: WASH[1] },
  { id: "doux", cutout: commonFile("bow-b87bbab29b"), word: "DOUX", wash: WASH[3] },
  { id: "non", cutout: commonFile("pin-decor-08"), word: "NON", wash: WASH[0] },
];

export function recipeFor(order: number): StickerRecipe {
  const recipe = STICKER_RECIPES[(Math.max(1, order) - 1) % STICKER_RECIPES.length];
  if (!recipe) throw new Error("Recette vide");
  return recipe;
}

export function experienceCounts(): { common: number; days: Record<string, number> } {
  const days: Record<string, number> = {};
  for (const [day, items] of Object.entries(catalog.days)) days[day] = items.length;
  return { common: catalog.common.length, days };
}
