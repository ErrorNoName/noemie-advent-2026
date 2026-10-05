import { motion } from "framer-motion";
import { useState } from "react";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { useGentle } from "../hooks/useGentle.ts";
import { giftFor, teaserFor } from "../data/days.ts";
import { useCloseScene } from "./scene-context.ts";

const FRAMES = Array.from(
  { length: 12 },
  (_, index) => `stickers/jour-2/pin-squishy-${String(index + 1).padStart(2, "0")}.webp`,
);

export function Day2() {
  const close = useCloseScene();
  const { reduced, pop } = useGentle();
  const [pressed, setPressed] = useState(false);
  const [count, setCount] = useState(0);
  const frame = FRAMES[count % FRAMES.length] ?? FRAMES[0] ?? "";

  function release() {
    if (!pressed) return;
    setPressed(false);
    setCount((value) => value + 1);
    if (!reduced && "vibrate" in navigator) navigator.vibrate(12);
  }

  return (
    <div>
      <p className="eyebrow text-center">Jour 2</p>
      <h2 className="mt-1 text-center font-serif text-4xl italic">Squishy</h2>
      <p className="mt-2 text-center text-mute">{teaserFor(2)} Relâche. Encore.</p>
      <motion.div
        className="squish-shadow"
        animate={{ scaleX: pressed ? 1.35 : 1, opacity: pressed ? 0.35 : 0.7 }}
        transition={pop}
      />
      <motion.button
        type="button"
        className="squish mt-2"
        aria-label="Presser le squishy"
        onPointerDown={() => setPressed(true)}
        onPointerUp={release}
        onPointerLeave={release}
        onPointerCancel={release}
        animate={{
          scaleX: pressed ? 1.22 : 1,
          scaleY: pressed ? 0.72 : 1,
        }}
        transition={pressed || reduced ? { duration: reduced ? 0 : 0.08 } : pop}
        style={{ touchAction: "none" }}
      >
        <GiftPhoto src={frame} alt="" className="h-full w-full object-contain" />
      </motion.button>
      <p className="mt-4 text-center font-serif text-2xl italic">
        {count === 0 ? "Quelque chose de satisfaisant." : `${count} ${count > 1 ? "pressions douces" : "pression douce"}`}
      </p>
      {count >= 6 ? <p className="text-center text-mute">Voilà. C’est exactement ça.</p> : null}
      <p className="mt-2 text-center text-sm text-mute">{giftFor(2)}</p>
      <div className="mt-6 text-center">
        <button type="button" className="btn-ink" onClick={close}>
          Garder la main douce
        </button>
      </div>
    </div>
  );
}
