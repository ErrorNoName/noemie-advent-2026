import { PACK } from "../data/art.ts";
import { publicUrl } from "../lib/publicUrl.ts";

const ORBIT = [
  { src: PACK.pouch, rot: -10, className: "orbit-a" },
  { src: PACK.peach, rot: 8, className: "orbit-b" },
  { src: PACK.tissue, rot: -6, className: "orbit-c desk-only" },
  { src: PACK.fruit, rot: 11, className: "orbit-d desk-only" },
  { src: PACK.journal, rot: -8, className: "orbit-e desk-only" },
  { src: PACK.star, rot: 6, className: "orbit-f" },
];

export function BoardOrbit() {
  return (
    <div className="orbit-layer" aria-hidden>
      {ORBIT.map((item) => (
        <img
          key={item.src}
          src={publicUrl(item.src)}
          alt=""
          className={`orbit ${item.className}`}
          style={{ transform: `rotate(${item.rot}deg)` }}
          draggable={false}
        />
      ))}
    </div>
  );
}
