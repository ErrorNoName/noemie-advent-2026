import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { dayByNumber, teaserFor } from "../data/days.ts";
import { useGentle } from "../hooks/useGentle.ts";
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
  const basket = dayByNumber(6);

  return (
    <div className="open-scene">
      <p className="eyebrow">Jour 6</p>
      <h2 className="font-serif italic">Panier gourmand</h2>
      <div className="collage basket-collage" data-open={open ? "yes" : "no"}>
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="bits" className="bit-layer" initial={false}>
              {BITS.map((bit, index) => (
                <motion.div
                  key={bit.key}
                  className={`cut ${bit.place}`}
                  initial={{ opacity: 0, y: 16, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={reduced ? { duration: 0 } : { ...pop, delay: 0.08 + index * 0.16 }}
                >
                  <GiftPhoto src={bit.src} alt={bit.title} className="fill-cut" />
                  <p>{bit.title}</p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.button
              key="basket"
              type="button"
              className="cut hero-hit"
              aria-label="Ouvrir le panier"
              exit={{ opacity: 0, scale: 0.94 }}
              transition={reduced ? { duration: 0 } : { duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              onClick={() => {
                setOpen(true);
                if (!reduced && "vibrate" in navigator) navigator.vibrate(12);
              }}
            >
              <GiftPhoto src="stickers/jour-6/gift-basket.webp" alt="Panier" className="fill-cut" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <p className="open-caption">{open ? "Bonbons, boisson, mini peluche." : teaserFor(6)}</p>
      <p className="open-caption">{basket.giftPhysical}</p>
      <div className="open-actions">
        <button type="button" className="btn-ink" onClick={close}>
          {open ? "Tout remettre dans le panier" : "Plus tard"}
        </button>
      </div>
    </div>
  );
}
