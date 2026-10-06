import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { CollageText } from "../components/CollageText.tsx";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { MemoryCamera } from "../components/MemoryCamera.tsx";
import { teaserFor } from "../data/days.ts";
import { useGentle } from "../hooks/useGentle.ts";
import { playTick } from "../lib/touchSound.ts";
import { useCloseScene } from "./scene-context.ts";

const BITS = [
  { key: "bonbons", src: "stickers/jour-6/candy-basket.webp", title: "Bonbons", place: "bit-a" },
  { key: "boisson", src: "stickers/jour-6/bubble-tea-1.webp", title: "Boisson", place: "bit-b" },
  { key: "peluche", src: "stickers/jour-6/keychain-teddy.webp", title: "Mini peluche", place: "bit-c" },
] as const;

export function Day6() {
  const close = useCloseScene();
  const { reduced, pop } = useGentle();
  const [open, setOpen] = useState(false);
  const [lift, setLift] = useState(0);
  const [nudge, setNudge] = useState<string | null>(null);
  const origin = useRef<number | null>(null);

  function reveal() {
    if (open) return;
    setOpen(true);
    setLift(0);
    if (!reduced) {
      playTick();
      if ("vibrate" in navigator) navigator.vibrate(12);
    }
  }

  return (
    <div className="open-scene">
      <CollageText as="p" text="Jour 6" size="kicker" />
      <CollageText as="h2" text="Panier gourmand" size="title" />
      <div className="collage basket-collage" data-open={open ? "yes" : "no"}>
        {open ? (
          BITS.map((bit, index) => (
            <motion.button
              key={bit.key}
              type="button"
              className={`cut ${bit.place}`}
              initial={{ opacity: 0, y: 36, scale: 0.86 }}
              animate={nudge === bit.key ? { opacity: 1, y: -6, scale: 1.06 } : { opacity: 1, y: 0, scale: 1 }}
              transition={reduced ? { duration: 0 } : { ...pop, delay: nudge ? 0 : 0.12 + index * 0.2 }}
              onClick={() => {
                setNudge(bit.key);
                if (!reduced && "vibrate" in navigator) navigator.vibrate(8);
                window.setTimeout(() => setNudge(null), reduced ? 0 : 280);
              }}
            >
              <GiftPhoto src={bit.src} alt={bit.title} className="fill-cut" />
              <p>{bit.title}</p>
            </motion.button>
          ))
        ) : (
          <motion.button
            type="button"
            className="cut hero-hit"
            aria-label="Soulever le panier"
            style={{ touchAction: "none" }}
            animate={{ y: -lift }}
            transition={lift === 0 && !reduced ? { type: "spring", stiffness: 180, damping: 16 } : { duration: 0 }}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              origin.current = event.clientY;
            }}
            onPointerMove={(event) => {
              if (origin.current == null) return;
              setLift(Math.max(0, Math.min(110, origin.current - event.clientY)));
            }}
            onPointerUp={() => {
              if (lift > 48) reveal();
              else setLift(0);
              origin.current = null;
            }}
            onPointerCancel={() => {
              setLift(0);
              origin.current = null;
            }}
          >
            <GiftPhoto src="stickers/jour-6/gift-basket.webp" alt="Panier" className="fill-cut" />
          </motion.button>
        )}
      </div>
      <p className="open-caption">{open ? "Un à un, ils se posent." : teaserFor(6)}</p>
      <p className="open-caption">{open ? "Bonbons, boisson, mini peluche." : "Tire le panier vers le haut."}</p>
      <MemoryCamera day={6} revealed={open} />
      <div className="open-actions">
        {open ? null : (
          <button type="button" className="btn-line" onClick={reveal}>
            Soulever
          </button>
        )}
        <button type="button" className="btn-ink" onClick={close}>
          Revenir aux cases
        </button>
      </div>
    </div>
  );
}
