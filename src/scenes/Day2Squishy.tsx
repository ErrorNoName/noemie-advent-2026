import { motion } from "framer-motion";
import { useRef, useState, type PointerEvent } from "react";
import { CollageText } from "../components/CollageText.tsx";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { MemoryCamera } from "../components/MemoryCamera.tsx";
import { PeelStickers } from "../components/PeelStickers.tsx";
import { teaserFor } from "../data/days.ts";
import { useGentle } from "../hooks/useGentle.ts";
import { playTick } from "../lib/touchSound.ts";
import { useCloseScene } from "./scene-context.ts";

const HERO = "stickers/jour-2/squishy-cheese.webp";
const YELLOW = "stickers/jour-2/stress-ball.webp";
const BLUE = "stickers/jour-2/stress-ball-blue.webp";

type Press = { x: number; y: number };

function pressPoint(event: PointerEvent<HTMLButtonElement>): Press {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  return {
    x: Math.min(82, Math.max(18, x)),
    y: Math.min(88, Math.max(30, y)),
  };
}

export function Day2() {
  const close = useCloseScene();
  const { reduced } = useGentle();
  const [press, setPress] = useState<Press | null>(null);
  const [count, setCount] = useState(0);
  const held = useRef(false);

  function release() {
    if (!held.current) return;
    held.current = false;
    setPress(null);
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
        <span className={`squish-pad ${press ? "is-pressed" : ""}`} aria-hidden />
        <GiftPhoto src={YELLOW} alt="" className="cut side-l" />
        <GiftPhoto src={BLUE} alt="" className="cut side-r" />
        <motion.button
          type="button"
          className="cut hero-hit"
          aria-label="Presser le squishy"
          data-pressed={press ? "yes" : "no"}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            held.current = true;
            setPress(pressPoint(event));
          }}
          onPointerMove={(event) => {
            if (!held.current) return;
            setPress(pressPoint(event));
          }}
          onPointerUp={release}
          onPointerCancel={release}
          animate={{
            scaleX: press ? 1.2 + Math.abs(press.x - 50) / 220 : 1,
            scaleY: press ? 0.56 : 1,
            skewX: press ? (press.x - 50) * 0.16 : 0,
          }}
          transition={
            press || reduced
              ? { duration: reduced ? 0 : 0.16, ease: [0.2, 0.8, 0.2, 1] }
              : { duration: reduced ? 0 : 1.15, ease: [0.22, 0.12, 0.18, 1] }
          }
          style={{
            touchAction: "none",
            transformOrigin: press ? `${press.x}% ${press.y}%` : "50% 82%",
          }}
        >
          <GiftPhoto src={HERO} alt="Squishy" className="fill-cut" />
        </motion.button>
      </div>
      <PeelStickers day={2} revealed={count > 0} />
      <p className="open-caption">
        {press ? "Ça cède sous le doigt." : count === 0 ? teaserFor(2) : "Relâche. Ça remonte tout seul."}
      </p>
      <p className="open-kicker">{count === 0 ? "Maintiens pour écraser." : "Mousse à mémoire."}</p>
      <MemoryCamera day={2} revealed={count > 0} />
      <div className="open-actions">
        <button type="button" className="btn-ink" onClick={close}>
          Garder la main douce
        </button>
      </div>
    </div>
  );
}
