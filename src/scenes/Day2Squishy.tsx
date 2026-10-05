import { motion } from "framer-motion";
import { useState } from "react";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { giftFor, teaserFor } from "../data/days.ts";
import { useGentle } from "../hooks/useGentle.ts";
import { useCloseScene } from "./scene-context.ts";

const FRAMES = Array.from(
  { length: 12 },
  (_, index) => `stickers/jour-2/pin-squishy-${String(index + 1).padStart(2, "0")}.webp`,
);

export function Day2() {
  const close = useCloseScene();
  const { reduced } = useGentle();
  const [pressed, setPressed] = useState(false);
  const [count, setCount] = useState(0);
  const frame = FRAMES[count % FRAMES.length] ?? FRAMES[0] ?? "";

  function release() {
    if (!pressed) return;
    setPressed(false);
    setCount((value) => value + 1);
    if (!reduced && "vibrate" in navigator) navigator.vibrate(14);
  }

  return (
    <div className="open-scene">
      <p className="eyebrow">Jour 2</p>
      <h2 className="font-serif italic">Squishy</h2>
      <div className="open-stage squish-stage">
        <motion.div
          className="squish-shadow"
          animate={{ scaleX: pressed ? 1.45 : 1, opacity: pressed ? 0.28 : 0.55 }}
          transition={pressed ? { duration: 0.12 } : { type: "spring", stiffness: 90, damping: 14 }}
        />
        <motion.button
          type="button"
          className="squish"
          aria-label="Presser le squishy"
          data-pressed={pressed ? "yes" : "no"}
          onPointerDown={() => setPressed(true)}
          onPointerUp={release}
          onPointerLeave={release}
          onPointerCancel={release}
          animate={{
            scaleX: pressed ? 1.3 : 1,
            scaleY: pressed ? 0.58 : 1,
            y: pressed ? 18 : 0,
          }}
          transition={
            pressed || reduced
              ? { duration: reduced ? 0 : 0.14, ease: [0.2, 0.8, 0.2, 1] }
              : { type: "spring", stiffness: 120, damping: 11, mass: 1.05 }
          }
          style={{ touchAction: "none" }}
        >
          <GiftPhoto src={frame} alt="Squishy" className="h-full w-full object-contain" />
        </motion.button>
      </div>
      <p className="open-caption">
        {pressed ? "Ça cède sous le doigt." : count === 0 ? teaserFor(2) : "Relâche. Ça remonte tout seul."}
      </p>
      <p className="open-kicker">
        {count === 0 ? "Maintiens pour écraser." : `${count} ${count > 1 ? "pressions douces" : "pression douce"}`}
      </p>
      {count >= 6 ? <p className="open-caption">Voilà. C’est exactement ça.</p> : null}
      <p className="open-caption">{giftFor(2)}</p>
      <div className="open-actions">
        <button type="button" className="btn-ink" onClick={close}>
          Garder la main douce
        </button>
      </div>
    </div>
  );
}
