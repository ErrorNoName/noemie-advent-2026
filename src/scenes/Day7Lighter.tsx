import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CollageText } from "../components/CollageText.tsx";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { PeelStickers } from "../components/PeelStickers.tsx";
import { teaserFor } from "../data/days.ts";
import { useGentle } from "../hooks/useGentle.ts";
import { playSpark } from "../lib/touchSound.ts";
import { useCloseScene } from "./scene-context.ts";

export function Day7() {
  const close = useCloseScene();
  const { reduced } = useGentle();
  const [lit, setLit] = useState(false);
  const [lidOpen, setLidOpen] = useState(false);
  const [held, setHeld] = useState(false);
  const [spin, setSpin] = useState(0);
  const [sparks, setSparks] = useState(0);
  const [tilt, setTilt] = useState(0);
  const start = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(0);
  const timer = useRef<number | null>(null);
  const opening = useRef(false);

  useEffect(() => {
    const onTilt = (event: DeviceOrientationEvent) => {
      const gamma = event.gamma ?? 0;
      setTilt(Math.max(-14, Math.min(14, gamma * 0.35)));
    };
    window.addEventListener("deviceorientation", onTilt);
    return () => window.removeEventListener("deviceorientation", onTilt);
  }, []);

  useEffect(() => {
    const pending = timer;
    return () => {
      if (pending.current !== null) window.clearTimeout(pending.current);
    };
  }, []);

  function spark() {
    setSparks((value) => value + 1);
    if (!reduced) {
      playSpark();
      if ("vibrate" in navigator) navigator.vibrate(18);
    }
  }

  function light() {
    if (lit || opening.current) return;
    spark();
    if (!lidOpen) {
      setLidOpen(true);
      if (reduced) {
        setLit(true);
        return;
      }
      opening.current = true;
      timer.current = window.setTimeout(() => {
        opening.current = false;
        timer.current = null;
        setLit(true);
      }, 520);
      return;
    }
    setLit(true);
  }

  function blow() {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
    opening.current = false;
    setLit(false);
  }

  return (
    <div className="open-scene">
      <CollageText as="p" text="Jour 7" size="kicker" />
      <CollageText as="h2" text="Briquet" size="title" />
      <div
        className={`lighter-live ${lidOpen ? "is-open" : ""} ${lit ? "is-lit" : ""}`}
        data-lid={lidOpen ? "open" : "shut"}
        data-lit={lit ? "yes" : "no"}
      >
        <div className="zippo">
          <GiftPhoto src="stickers/jour-7/zippo-silver.webp" alt="" className="zippo-plate zippo-body" />
          <div className={`zippo-lid ${lidOpen ? "is-open" : ""}`}>
            <GiftPhoto src="stickers/jour-7/zippo-silver.webp" alt="Briquet" className="zippo-plate" />
          </div>
          {lidOpen ? (
            <span className="zippo-chimney" aria-hidden>
              <span className="zippo-wick" />
            </span>
          ) : null}
          {lit ? (
            <span
              className={`flame-anchor ${held ? "is-held" : ""}`}
              style={{ "--flame-tilt": `${tilt}deg` } as CSSProperties}
              aria-hidden
            >
              <svg viewBox="0 0 40 64" className="flame-svg">
                <path className="flame-outer" d="M20 2c8 12 14 16 14 30a14 14 0 0 1-28 0c0-8 4-14 8-20 2 6 4 8 6 8 0-8 0-12 0-18z" />
                <path className="flame-inner" d="M20 24c4 6 6 8 6 14a6 6 0 0 1-12 0c0-4 2-6 4-10 1 3 1 4 2 4 0-4 0-6 0-8z" />
              </svg>
            </span>
          ) : null}
          <button
            type="button"
            className="flint-wheel"
            aria-label="Frotter la molette"
            style={{ touchAction: "none" }}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              start.current = { x: event.clientX, y: event.clientY };
              moved.current = 0;
              setHeld(true);
            }}
            onPointerMove={(event) => {
              if (!start.current) return;
              const dy = start.current.y - event.clientY;
              const dx = event.clientX - start.current.x;
              const travel = Math.abs(dy) + Math.abs(dx);
              if (travel - moved.current > 18) {
                moved.current = travel;
                setSpin((value) => value + (dy >= 0 ? 50 : -50));
                setSparks((value) => value + 1);
                if (!reduced) playSpark();
              }
              if (travel > 36) light();
            }}
            onPointerUp={() => {
              start.current = null;
              setHeld(false);
            }}
            onPointerCancel={() => {
              start.current = null;
              setHeld(false);
            }}
          >
            <span className="flint-face" style={{ transform: `rotate(${spin}deg)` }} />
            {sparks > 0 ? (
              <span key={sparks} className="flint-sparks" aria-hidden>
                <i />
                <i />
                <i />
              </span>
            ) : null}
          </button>
        </div>
      </div>
      <PeelStickers day={7} revealed={lit} />
      <p className="open-caption">{lit ? "La flamme tient, et elle penche avec le téléphone." : teaserFor(7)}</p>
      <p className="open-caption">{lit ? "Maintiens la molette pour la garder vive." : "Frotte la molette."}</p>
      <div className="open-actions">
        {lit ? (
          <button type="button" className="btn-line" onClick={blow}>
            Souffler
          </button>
        ) : (
          <button type="button" className="btn-line" onClick={light}>
            Frotter
          </button>
        )}
        <button type="button" className="btn-ink" onClick={close}>
          La ranger
        </button>
      </div>
    </div>
  );
}
