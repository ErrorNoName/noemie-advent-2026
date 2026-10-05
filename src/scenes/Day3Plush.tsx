import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
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
  { x: -36, delay: 0 },
  { x: 8, delay: 0.08 },
  { x: 40, delay: 0.16 },
];

export function Day3() {
  const close = useCloseScene();
  const { reduced, pop } = useGentle();
  const [pull, setPull] = useState(0);
  const [free, setFree] = useState(false);
  const [hug, setHug] = useState(false);
  const origin = useRef<number | null>(null);

  function untie() {
    if (free) return;
    setFree(true);
    setPull(120);
    if (!reduced && "vibrate" in navigator) navigator.vibrate(16);
  }

  return (
    <div className="open-scene">
      <p className="eyebrow">Jour 3</p>
      <h2 className="font-serif italic">Peluche</h2>
      <div className="open-stage plush-stage" data-untied={free ? "yes" : "no"}>
        <AnimatePresence mode="wait">
          {free ? (
            <motion.button
              key="teddy"
              type="button"
              className="plush-btn"
              aria-label="Faire un câlin"
              initial={{ y: -36, rotate: -18, opacity: 0, scale: 0.8 }}
              animate={
                hug
                  ? { y: 8, rotate: -4, scaleX: 1.08, scaleY: 0.9, opacity: 1 }
                  : { y: 0, rotate: 0, scaleX: 1, scaleY: 1, opacity: 1 }
              }
              transition={hug || reduced ? pop : { type: "spring", stiffness: 180, damping: 13 }}
              onClick={() => {
                setHug(true);
                if (!reduced && "vibrate" in navigator) navigator.vibrate(12);
                window.setTimeout(() => setHug(false), reduced ? 0 : 700);
              }}
            >
              <GiftPhoto src="stickers/jour-3/teddy-1.webp" alt="Peluche" className="plush-photo" />
            </motion.button>
          ) : (
            <motion.div
              key="wrap"
              className="ribbon-wrap"
              exit={{ x: 90, y: -30, opacity: 0, rotate: 18 }}
              transition={reduced ? { duration: 0 } : { duration: 0.45 }}
            >
              <GiftPhoto src="stickers/jour-3/teddy-1.webp" alt="" className="plush-photo is-waiting" />
              <motion.button
                type="button"
                className="ribbon-pull"
                aria-label="Tirer le ruban"
                style={{ touchAction: "none", y: pull }}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  origin.current = event.clientY;
                }}
                onPointerMove={(event) => {
                  if (origin.current == null) return;
                  setPull(Math.max(0, Math.min(130, event.clientY - origin.current)));
                }}
                onPointerUp={() => {
                  if (pull > 68) untie();
                  else setPull(0);
                  origin.current = null;
                }}
                onPointerCancel={() => {
                  setPull(0);
                  origin.current = null;
                }}
              >
                <svg viewBox="0 0 120 160" className="ribbon-svg" aria-hidden>
                  <path d="M52 8h16v148H52z" fill="#e56b8a" />
                  <path d="M28 28c18 10 22 10 32 0 10 10 16 10 32 0-8 16-14 20-32 16-18 4-24 0-32-16z" fill="#f2a0b6" />
                  <circle cx="60" cy="40" r="7" fill="#fff8f2" />
                </svg>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {hug
            ? HEARTS.map((heart) => (
                <motion.span
                  key={heart.x}
                  className="hug-heart"
                  style={{ left: `calc(50% + ${heart.x}px)` }}
                  initial={{ y: 20, opacity: 0, scale: 0.4 }}
                  animate={{ y: -70, opacity: [0, 1, 0], scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.7, delay: heart.delay }}
                >
                  <Heart />
                </motion.span>
              ))
            : null}
        </AnimatePresence>
      </div>
      <p className="open-caption">
        {free ? (hug ? "Un câlin, reçu." : "Elle est sortie. Un tapotement, et elle se love.") : teaserFor(3)}
      </p>
      <p className="open-caption">{giftFor(3)}</p>
      <div className="open-actions">
        {free ? null : (
          <button type="button" className="btn-line" onClick={untie}>
            Dénouer
          </button>
        )}
        <button type="button" className="btn-ink" onClick={close}>
          Elle est à toi
        </button>
      </div>
    </div>
  );
}
