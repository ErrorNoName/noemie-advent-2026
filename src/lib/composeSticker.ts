import catalog from "../data/glyphCatalog.json" with { type: "json" };
import { recipeFor, type StickerRecipe } from "./experience.ts";
import { publicUrl } from "./publicUrl.ts";

const cache = new Map<string, Promise<string>>();

function letterSrc(char: string): string | null {
  const native = catalog.native[char as keyof typeof catalog.native];
  if (native && native.length > 0) return native[0] ?? null;
  const paper = catalog.paper[char as keyof typeof catalog.paper];
  if (paper && paper.length > 0) return paper[0] ?? null;
  return null;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(src));
    image.src = publicUrl(src);
  });
}

function dieCut(ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, size: number) {
  const offsets = [
    [-7, 0],
    [7, 0],
    [0, -7],
    [0, 7],
    [-5, -5],
    [5, -5],
    [-5, 5],
    [5, 5],
  ];
  ctx.save();
  ctx.filter = "brightness(0) invert(1)";
  ctx.shadowColor = "rgba(58, 42, 50, 0.28)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 6;
  for (const [dx, dy] of offsets) {
    ctx.drawImage(image, x + (dx ?? 0), y + (dy ?? 0), size, size);
  }
  ctx.restore();
  ctx.drawImage(image, x, y, size, size);
}

async function drawRecipe(recipe: StickerRecipe): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.clearRect(0, 0, 320, 320);
  ctx.fillStyle = recipe.wash;
  ctx.beginPath();
  ctx.ellipse(160, 150, 118, 108, -0.08, 0, Math.PI * 2);
  ctx.fill();
  const cutout = await loadImage(recipe.cutout);
  dieCut(ctx, cutout, 78, 48, 164);
  if (recipe.word) {
    const letters = await Promise.all(
      [...recipe.word].map(async (char) => {
        const src = letterSrc(char);
        if (!src) return null;
        return loadImage(src);
      }),
    );
    const ready = letters.filter((item): item is HTMLImageElement => item !== null);
    const height = 42;
    const widths = ready.map((image) => (image.width / image.height) * height);
    const total = widths.reduce((sum, width) => sum + width, 0) + (ready.length - 1) * 2;
    let cursor = (320 - total) / 2;
    ready.forEach((image, index) => {
      const width = widths[index] ?? height;
      ctx.fillStyle = "#fff8f2";
      ctx.fillRect(cursor - 1, 248, width + 2, height + 4);
      ctx.drawImage(image, cursor, 250, width, height);
      cursor += width + 2;
    });
  }
  return canvas.toDataURL("image/png");
}

export function composedSticker(order: number): Promise<string> {
  const recipe = recipeFor(order);
  const cached = cache.get(recipe.id);
  if (cached) return cached;
  const pending = drawRecipe(recipe).catch(() => "");
  cache.set(recipe.id, pending);
  return pending;
}
