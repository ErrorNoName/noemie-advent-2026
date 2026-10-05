import { motion } from "framer-motion";
import { useState } from "react";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { dayByNumber, teaserFor } from "../data/days.ts";
import { useGentle } from "../hooks/useGentle.ts";
import { playTick } from "../lib/touchSound.ts";
import { useCloseScene } from "./scene-context.ts";

function PixelHeart() {
  return (
    <svg viewBox="0 0 7 6" className="pixel-heart" aria-hidden>
      <path fill="currentColor" d="M1 0h2v1H1zM4 0h2v1H4zM0 1h7v2H0zM1 3h5v1H1zM2 4h3v1H2zM3 5h1v1H3z" />
    </svg>
  );
}

export function Day5() {
  const close = useCloseScene();
  const { reduced } = useGentle();
  const [pressed, setPressed] = useState(false);
  const [on, setOn] = useState(false);
  const [flicker, setFlicker] = useState(false);
  const clip = dayByNumber(5);
  const spoken = clip.day === 5 ? clip.lcdDefaultMessage : "I love U";

  function power() {
    if (on || flicker) return;
    setPressed(false);
    setFlicker(true);
    if (!reduced) {
      playTick();
      if ("vibrate" in navigator) navigator.vibrate(10);
    }
    window.setTimeout(() => {
      setFlicker(false);
      setOn(true);
    }, reduced ? 0 : 280);
  }

  return (
    <div className="open-scene">
      <p className="eyebrow">Jour 5</p>
      <h2 className="font-serif italic">Barrette écran</h2>
      <div className="collage clip-collage" data-powered={on ? "yes" : "no"}>
        <GiftPhoto src="stickers/jour-5/butterfly-clip.webp" alt="" className="cut side-l" />
        <GiftPhoto src="stickers/jour-5/hairpin-flower.webp" alt="" className="cut side-r" />
        <motion.button
          type="button"
          className="cut hero-still clip-press"
          aria-label="Allumer l’écran de la barrette"
          animate={{ scale: pressed ? 0.92 : 1, rotate: pressed ? -3 : 0 }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 16 }}
          onPointerDown={() => setPressed(true)}
          onPointerUp={power}
          onPointerCancel={() => setPressed(false)}
        >
          <GiftPhoto src="stickers/jour-5/bow-hairpin.webp" alt="Barrette" className="fill-cut" />
        </motion.button>
        <button
          type="button"
          className={`lcd-chip ${on ? "is-on" : "is-off"} ${flicker ? "is-flicker" : ""}`}
          aria-pressed={on}
          onClick={power}
        >
          {on ? (
            <span className="lcd-marquee">
              <span className="lcd-run">
                <span>NOÉMIE</span>
                <PixelHeart />
                <span>NOÉMIE</span>
                <PixelHeart />
              </span>
            </span>
          ) : (
            <span>{flicker ? "···" : "éteint"}</span>
          )}
          <span className="sr-only">{on ? `NOÉMIE. ${spoken}` : "Écran éteint"}</span>
        </button>
      </div>
      <p className="open-caption">{on ? "Le prénom défile, tout petit." : teaserFor(5)}</p>
      <p className="open-caption">Appuie sur la barrette. L’écran s’allume.</p>
      <div className="open-actions">
        <button type="button" className="btn-ink" onClick={close}>
          La garder dans les cheveux
        </button>
      </div>
    </div>
  );
}
