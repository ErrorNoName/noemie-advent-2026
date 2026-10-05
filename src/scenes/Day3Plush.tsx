import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { giftFor, teaserFor } from "../data/days.ts";
import { useGentle } from "../hooks/useGentle.ts";
import { useCloseScene } from "./scene-context.ts";

function Heart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 22" className={className} aria-hidden>
      <path
        fill="#e56b8a"
        d="M12 20.2C8.6 17.4 2 13.2 2 8.2 2 5.4 4.2 3.4 6.8 3.4c1.7 0 3 .8 4.2 2.2C12.2 4.2 13.5 3.4 15.2 3.4 17.8 3.4 20 5.4 20 8.2c0 5-6.6 9.2-10 12z"
      />
    </svg>
  );
}

const HEARTS = [
  { left: "22%", delay: 0 },
  { left: "48%", delay: 0.08 },
  { left: "68%", delay: 0.14 },
];

export function Day3() {
  const close = useCloseScene();
  const { reduced, pop } = useGentle();
  const [hug, setHug] = useState(false);

  return (
    <div className="open-scene">
      <p className="eyebrow">Jour 3</p>
      <h2 className="font-serif italic">Peluche</h2>
      <div className="collage plush-collage">
        <GiftPhoto src="stickers/jour-3/teddy-blue.webp" alt="" className="cut side-l" />
        <GiftPhoto src="stickers/jour-3/teddy-heart.webp" alt="" className="cut side-r" />
        <motion.button
          type="button"
          className="cut hero-hit"
          aria-label="Faire un câlin"
          animate={hug ? { scaleX: 1.06, scaleY: 0.9 } : { scaleX: 1, scaleY: 1 }}
          transition={reduced ? { duration: 0 } : pop}
          onClick={() => {
            setHug(true);
            if (!reduced && "vibrate" in navigator) navigator.vibrate(12);
            window.setTimeout(() => setHug(false), reduced ? 0 : 700);
          }}
        >
          <GiftPhoto src="stickers/jour-3/teddy-1.webp" alt="Peluche" className="fill-cut" />
        </motion.button>
        <AnimatePresence>
          {hug
            ? HEARTS.map((heart) => (
                <motion.span
                  key={heart.left}
                  className="hug-heart"
                  style={{ left: heart.left }}
                  initial={{ y: 8, opacity: 0, scale: 0.4 }}
                  animate={{ y: -36, opacity: [0, 1, 0], scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.7, delay: heart.delay }}
                >
                  <Heart />
                </motion.span>
              ))
            : null}
        </AnimatePresence>
      </div>
      <p className="open-caption">{hug ? "Un câlin, reçu." : teaserFor(3)}</p>
      <p className="open-caption">{giftFor(3)}</p>
      <div className="open-actions">
        <button type="button" className="btn-ink" onClick={close}>
          Elle est à toi
        </button>
      </div>
    </div>
  );
}
