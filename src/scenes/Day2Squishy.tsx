import { motion } from "framer-motion";
import { useState } from "react";
import { useGentle } from "../hooks/useGentle.ts";
import { giftFor, teaserFor } from "../data/days.ts";
import { useCloseScene } from "./scene-context.ts";

export function Day2() {
  const close = useCloseScene();
  const { reduced, pop } = useGentle();
  const [pressed, setPressed] = useState(false);
  const [count, setCount] = useState(0);

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
          scaleX: pressed ? 1.32 : 1,
          scaleY: pressed ? 0.62 : 1,
          borderRadius: pressed ? "46% 46% 42% 42% / 42% 42% 48% 48%" : "48% 52% 46% 54% / 52% 46% 54% 48%",
        }}
        transition={pressed || reduced ? { duration: reduced ? 0 : 0.08 } : pop}
        style={{ touchAction: "none" }}
      >
        <span className="flex flex-col items-center gap-1 text-ink">
          <span className="flex gap-3">
            <span className="h-2 w-2 rounded-full bg-ink" />
            <span className="h-2 w-2 rounded-full bg-ink" />
          </span>
          <span className="mt-1 h-2 w-6 rounded-full border-b-2 border-ink" />
        </span>
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
