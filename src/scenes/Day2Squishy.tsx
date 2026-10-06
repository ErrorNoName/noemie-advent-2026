import { motion } from "framer-motion";
import { useState } from "react";
import { CollageText } from "../components/CollageText.tsx";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { MemoryCamera } from "../components/MemoryCamera.tsx";
import { teaserFor } from "../data/days.ts";
import { useGentle } from "../hooks/useGentle.ts";
import { playTick } from "../lib/touchSound.ts";
import { useCloseScene } from "./scene-context.ts";

const HERO = "stickers/jour-2/stress-ball.webp";
const PAL = "stickers/jour-2/stress-ball-blue.webp";

export function Day2() {
  const close = useCloseScene();
  const { reduced } = useGentle();
  const [pressed, setPressed] = useState(false);
  const [count, setCount] = useState(0);

  function release() {
    if (!pressed) return;
    setPressed(false);
    setCount((value) => value + 1);
    if (!reduced) {
      playTick();
      if ("vibrate" in navigator) navigator.vibrate(14);
    }
  }

  return (
    <div className="open-scene">
      <CollageText as="p" text="Jour 2" size="kicker" />
      <CollageText as="h2" text="Squishy" size="title" />
      <div className="collage squish-collage">
        <GiftPhoto src={PAL} alt="" className="cut side-l" />
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
            scaleX: pressed ? 1.32 : 1,
            scaleY: pressed ? 0.62 : 1,
            y: pressed ? 16 : 0,
          }}
          transition={
            pressed || reduced
              ? { duration: reduced ? 0 : 0.12, ease: [0.2, 0.8, 0.2, 1] }
              : { type: "spring", stiffness: 90, damping: 9, mass: 1.15 }
          }
          style={{ touchAction: "none" }}
        >
          <GiftPhoto src={HERO} alt="Squishy" className="fill-cut" />
        </motion.button>
      </div>
      <p className="open-caption">
        {pressed ? "Ça cède sous le doigt." : count === 0 ? teaserFor(2) : "Relâche. Ça remonte tout seul."}
      </p>
      <p className="open-kicker">{count === 0 ? "Maintiens pour écraser." : "Boule anti-stress"}</p>
      <MemoryCamera day={2} revealed={count > 0} />
      <div className="open-actions">
        <button type="button" className="btn-ink" onClick={close}>
          Garder la main douce
        </button>
      </div>
    </div>
  );
}
