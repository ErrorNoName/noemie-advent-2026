import { motion } from "framer-motion";
import { useState } from "react";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { useGentle } from "../hooks/useGentle.ts";
import { giftFor, teaserFor } from "../data/days.ts";
import { useCloseScene } from "./scene-context.ts";

export function Day3() {
  const close = useCloseScene();
  const { reduced, pop } = useGentle();
  const [hug, setHug] = useState(false);

  return (
    <div className="text-center">
      <p className="eyebrow">Jour 3</p>
      <h2 className="mt-1 font-serif text-4xl italic">Peluche</h2>
      <p className="mt-2 text-mute">{teaserFor(3)}</p>
      <motion.div
        className="mx-auto mt-4 w-56"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={
          hug
            ? { scale: 0.9, rotate: -3, y: 6 }
            : reduced
              ? { scale: 1, rotate: 0, y: 0 }
              : { scale: 1, rotate: 0, y: [0, -8, 0] }
        }
        transition={hug || reduced ? pop : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <GiftPhoto src="stickers/jour-3/teddy-1.webp" alt="Peluche" />
      </motion.div>
      {hug ? <p className="font-serif text-xl italic text-rose">Un câlin, reçu.</p> : null}
      <div className="mt-4 flex justify-center gap-3">
        <button
          type="button"
          className="btn-line max-w-[150px]"
          onClick={() => {
            setHug(true);
            window.setTimeout(() => setHug(false), reduced ? 0 : 800);
          }}
        >
          Un câlin
        </button>
        <button type="button" className="btn-ink" onClick={close}>
          Elle est à toi
        </button>
      </div>
      <p className="mt-4 text-sm text-mute">{giftFor(3)}</p>
    </div>
  );
}
