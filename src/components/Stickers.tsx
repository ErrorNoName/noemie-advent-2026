import { publicUrl } from "../lib/publicUrl.ts";

const DECOR = [
  "stickers/decor/sparkles.webp",
  "stickers/decor/pink-heart.webp",
  "stickers/decor/ribbon.webp",
  "stickers/decor/glowing-star.webp",
  "stickers/decor/balloon.webp",
  "stickers/decor/kiss-mark.webp",
  "stickers/decor/bouquet.webp",
  "stickers/decor/sparkling-heart.webp",
  "stickers/decor/party-popper.webp",
  "stickers/decor/blue-heart.webp",
  "stickers/decor/confetti-ball.webp",
  "stickers/decor/birthday-cake.webp",
];

const DAY_BITS: Record<number, readonly string[]> = {
  1: ["stickers/jour-1/blindbox-figure.webp", "stickers/jour-1/labubu-costume.webp"],
  2: ["stickers/jour-2/stress-ball-blue.webp", "stickers/jour-2/squishy-cakepop.webp"],
  3: ["stickers/jour-3/teddy-heart.webp", "stickers/jour-3/teddy-blue.webp"],
  4: ["stickers/jour-4/gacha-openclipart.webp", "stickers/jour-4/ic-09356.webp"],
  5: ["stickers/jour-5/butterfly-clip.webp", "stickers/jour-5/hairpin-flower.webp"],
  6: ["stickers/jour-6/keychain-unicorn.webp", "stickers/jour-6/bubble-tea-2.webp"],
  7: ["stickers/jour-7/lighter-orange.webp", "stickers/decor/candle.webp"],
  8: ["stickers/jour-8/eclair-2.webp", "stickers/jour-8/bouquet-2.webp"],
};

const SPOTS = [
  { left: "0%", top: "8%", rot: -14, size: 58 },
  { left: "78%", top: "2%", rot: 12, size: 64 },
  { left: "82%", top: "46%", rot: 16, size: 52 },
  { left: "0%", top: "52%", rot: -8, size: 70 },
  { left: "70%", top: "78%", rot: 8, size: 48 },
];

export function DayStickers({ day }: { day: number }) {
  const start = ((day - 1) * 2) % DECOR.length;
  const decor = [0, 1, 2].map((offset) => DECOR[(start + offset) % DECOR.length]).filter((src) => src !== undefined);
  const gifts = DAY_BITS[day] ?? [];
  const files = [...decor, ...gifts].slice(0, SPOTS.length);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {files.map((src, index) => {
        const spot = SPOTS[index];
        if (!spot || !src) return null;
        return (
          <img
            key={src}
            src={publicUrl(src)}
            alt=""
            className="sticker-float"
            style={{
              left: spot.left,
              top: spot.top,
              width: spot.size,
              height: spot.size,
              transform: `rotate(${spot.rot}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}
