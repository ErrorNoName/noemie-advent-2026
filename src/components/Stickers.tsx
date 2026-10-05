import { SCENE_CUTS } from "../data/art.ts";
import { DECOR } from "../data/decorList.ts";
import { publicUrl } from "../lib/publicUrl.ts";

const SPOTS = [
  { left: "-2%", top: "6%", rot: -11, size: 72 },
  { left: "76%", top: "1%", rot: 8, size: 64 },
  { left: "80%", top: "42%", rot: 12, size: 58 },
  { left: "-4%", top: "48%", rot: -7, size: 78 },
  { left: "68%", top: "74%", rot: 5, size: 54 },
];

export function DayStickers({ day }: { day: number }) {
  const gifts = SCENE_CUTS[day] ?? [];
  const decorStart = ((day - 1) * 3) % DECOR.length;
  const decor = [0, 1].map((offset) => DECOR[(decorStart + offset) % DECOR.length]).filter((src) => src !== undefined);
  const files = [...gifts, ...decor].slice(0, SPOTS.length);

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
