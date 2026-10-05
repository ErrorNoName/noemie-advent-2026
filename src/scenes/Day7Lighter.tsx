import { useRef, useState } from "react";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { giftFor, teaserFor } from "../data/days.ts";
import { useGentle } from "../hooks/useGentle.ts";
import { useCloseScene } from "./scene-context.ts";

export function Day7() {
  const close = useCloseScene();
  const { reduced } = useGentle();
  const [lit, setLit] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);

  function light() {
    setLit(true);
    if (!reduced && "vibrate" in navigator) navigator.vibrate(16);
  }

  return (
    <div className="open-scene">
      <p className="eyebrow">Jour 7</p>
      <h2 className="font-serif italic">Briquet aesthetic</h2>
      <div className={`collage light-collage ${lit ? "is-lit" : ""}`} data-lit={lit ? "yes" : "no"}>
        {lit ? (
          <svg viewBox="0 0 40 64" className="flame-svg flame-over" aria-hidden>
            <path className="flame-outer" d="M20 2c8 12 14 16 14 30a14 14 0 0 1-28 0c0-8 4-14 8-20 2 6 4 8 6 8 0-8 0-12 0-18z" />
            <path className="flame-inner" d="M20 24c4 6 6 8 6 14a6 6 0 0 1-12 0c0-4 2-6 4-10 1 3 1 4 2 4 0-4 0-6 0-8z" />
          </svg>
        ) : null}
        <GiftPhoto src="stickers/jour-7/lighter-orange.webp" alt="" className="cut side-l" />
        <button
          type="button"
          className="cut hero-hit"
          aria-label="Frotter le briquet"
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
            if (dy > 18 || dx > 28) light();
          }}
          onClick={light}
          onPointerCancel={() => {
            start.current = null;
          }}
        >
          <GiftPhoto src="stickers/jour-7/zippo-silver.webp" alt="Briquet" className="fill-cut" />
        </button>
      </div>
      <p className="open-caption">{lit ? "Une petite flamme, et une lueur chaude." : teaserFor(7)}</p>
      <p className="open-caption">{giftFor(7)}</p>
      <div className="open-actions">
        {lit ? (
          <button type="button" className="btn-line" onClick={() => setLit(false)}>
            Souffler
          </button>
        ) : null}
        <button type="button" className="btn-ink" onClick={close}>
          La ranger
        </button>
      </div>
    </div>
  );
}
