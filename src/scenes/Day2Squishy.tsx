import { motion } from "framer-motion";
import { useState } from "react";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { giftFor, teaserFor } from "../data/days.ts";
import { useGentle } from "../hooks/useGentle.ts";
import { useCloseScene } from "./scene-context.ts";

const HEROES = [
  "stickers/jour-2/pin-squishy-01.webp",
  "stickers/jour-2/squishy-cakepop.webp",
  "stickers/jour-2/stress-ball.webp",
  "stickers/jour-2/pin-squishy-06.webp",
];

export function Day2() {
  const close = useCloseScene();
  const { reduced } = useGentle();
  const [pressed, setPressed] = useState(false);
  const [count, setCount] = useState(0);
  const hero = HEROES[count % HEROES.length] ?? HEROES[0] ?? "";

  function release() {
    if (!pressed) return;
    setPressed(false);
    setCount((value) => value + 1);
    if (!reduced && "vibrate" in navigator) navigator.vibrate(12);
  }

  return (
    <div className="open-scene">
      <p className="eyebrow">Jour 2</p>
      <h2 className="font-serif italic">Squishy</h2>
      <div className="collage squish-collage">
        <GiftPhoto src="stickers/jour-2/stress-ball-blue.webp" alt="" className="cut side-l" />
        <GiftPhoto src="stickers/jour-2/pin-squishy-09.webp" alt="" className="cut side-r" />
        <motion.button
          type="button"
          className="cut hero-hit"
          aria-label="Presser le squishy"
          data-pressed={pressed ? "yes" : "no"}
          onPointerDown={() => setPressed(true)}
          onPointerUp={release}
          onPointerLeave={release}
          onPointerCancel={release}
          animate={{
            scaleX: pressed ? 1.22 : 1,
            scaleY: pressed ? 0.72 : 1,
            y: pressed ? 10 : 0,
          }}
          transition={
            pressed || reduced
              ? { duration: reduced ? 0 : 0.14, ease: [0.2, 0.8, 0.2, 1] }
              : { type: "spring", stiffness: 120, damping: 12, mass: 1.05 }
          }
          style={{ touchAction: "none" }}
        >
          <GiftPhoto src={hero} alt="Squishy" className="fill-cut" />
        </motion.button>
      </div>
      <p className="open-caption">
        {pressed ? "Ça cède sous le doigt." : count === 0 ? teaserFor(2) : "Relâche. Ça remonte tout seul."}
      </p>
      <p className="open-kicker">{count === 0 ? "Maintiens pour écraser." : giftFor(2)}</p>
      <div className="open-actions">
        <button type="button" className="btn-ink" onClick={close}>
          Garder la main douce
        </button>
      </div>
    </div>
  );
}
