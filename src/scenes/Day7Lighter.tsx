import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { giftFor, teaserFor } from "../data/days.ts";
import { useGentle } from "../hooks/useGentle.ts";
import { useCloseScene } from "./scene-context.ts";

export function Day7() {
  const close = useCloseScene();
  const { reduced } = useGentle();
  const [lit, setLit] = useState(false);
  const [spin, setSpin] = useState(0);
  const start = useRef<{ x: number; y: number } | null>(null);

  function light() {
    setSpin((value) => value + 1);
    setLit(true);
    if (!reduced && "vibrate" in navigator) navigator.vibrate(20);
  }

  return (
    <div className="open-scene">
      <p className="eyebrow">Jour 7</p>
      <h2 className="font-serif italic">Briquet aesthetic</h2>
      <div className={`open-stage lighter-stage ${lit ? "is-lit" : ""}`} data-lit={lit ? "yes" : "no"}>
        <div className="flame-slot" aria-hidden>
          {lit ? (
            <svg viewBox="0 0 40 64" className="flame-svg">
              <path className="flame-outer" d="M20 2c8 12 14 16 14 30a14 14 0 0 1-28 0c0-8 4-14 8-20 2 6 4 8 6 8 0-8 0-12 0-18z" />
              <path className="flame-inner" d="M20 24c4 6 6 8 6 14a6 6 0 0 1-12 0c0-4 2-6 4-10 1 3 1 4 2 4 0-4 0-6 0-8z" />
            </svg>
          ) : null}
        </div>
        <div className="lighter-body">
          <GiftPhoto src="stickers/jour-7/zippo-silver.webp" alt="Briquet" className="lighter-photo" />
          <button
            type="button"
            className="flint-wheel"
            aria-label="Frotter la molette"
            style={{ touchAction: "none" }}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              start.current = { x: event.clientX, y: event.clientY };
            }}
            onPointerUp={(event) => {
              if (!start.current) return;
              const dy = start.current.y - event.clientY;
              const dx = Math.abs(event.clientX - start.current.x);
              start.current = null;
              if (dy > 26 || dx > 36) light();
            }}
            onPointerCancel={() => {
              start.current = null;
            }}
          >
            <motion.span
              className="flint-face"
              animate={{ rotate: spin * 160 }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 18 }}
            />
          </button>
        </div>
      </div>
      <p className="open-caption">{lit ? "Une flamme dessinée, et une lueur chaude." : teaserFor(7)}</p>
      <p className="open-caption">{giftFor(7)}. La flamme à l’écran reste un dessin.</p>
      <div className="open-actions">
        {lit ? (
          <button
            type="button"
            className="btn-line"
            onClick={() => setLit(false)}
            aria-pressed="true"
          >
            Souffler
          </button>
        ) : (
          <button type="button" className="btn-line" onClick={light}>
            Frotter
          </button>
        )}
        <button type="button" className="btn-ghost" onClick={close}>
          Revenir
        </button>
      </div>
    </div>
  );
}
