import { railStickers } from "../lib/experience.ts";
import { publicUrl } from "../lib/publicUrl.ts";

const ROT = [-8, 7, -5, 6];

export function DayStickers({ day }: { day: number }) {
  const picks = railStickers(day);
  const left = picks.slice(0, 2);
  const right = picks.slice(2, 4);

  return (
    <div className="scene-rails" aria-hidden>
      <div className="scene-rail">
        {left.map((src, index) => (
          <img key={src} src={publicUrl(src)} alt="" style={{ transform: `rotate(${ROT[index] ?? -6}deg)` }} />
        ))}
      </div>
      <div className="scene-rail">
        {right.map((src, index) => (
          <img key={src} src={publicUrl(src)} alt="" style={{ transform: `rotate(${ROT[index + 2] ?? 6}deg)` }} />
        ))}
      </div>
    </div>
  );
}
