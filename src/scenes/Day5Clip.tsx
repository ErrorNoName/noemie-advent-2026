import { useState } from "react";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { dayByNumber, giftFor, teaserFor } from "../data/days.ts";
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
  const [on, setOn] = useState(false);
  const clip = dayByNumber(5);
  const spoken = clip.day === 5 ? clip.lcdDefaultMessage : "I love U";

  return (
    <div className="open-scene">
      <p className="eyebrow">Jour 5</p>
      <h2 className="font-serif italic">Barrette écran</h2>
      <div className="open-stage">
        <div className="lcd-clip" data-powered={on ? "yes" : "no"}>
          <GiftPhoto src="stickers/jour-5/bow-hairpin.webp" alt="Barrette" className="clip-photo" />
          <div className="lcd">
            <button
              type="button"
              className={`lcd-screen ${on ? "is-on" : "is-off"}`}
              aria-pressed={on}
              onClick={() => setOn(true)}
            >
              {on ? (
                <span className="lcd-marquee">
                  <span className="lcd-run">
                    <span>NOÉMIE</span>
                    <PixelHeart />
                    <span>NOÉMIE</span>
                    <PixelHeart />
                    <span>NOÉMIE</span>
                    <PixelHeart />
                  </span>
                </span>
              ) : (
                <span className="lcd-idle">tapoter</span>
              )}
              <span className="sr-only">{on ? `NOÉMIE. ${spoken}` : "Écran éteint"}</span>
            </button>
            <p className="mt-2 text-center font-pixel text-[9px] tracking-[0.2em] text-mute">LCD</p>
          </div>
        </div>
      </div>
      <p className="open-caption">{on ? "Le prénom défile, tout petit." : teaserFor(5)}</p>
      <p className="open-caption">{giftFor(5)}</p>
      <div className="open-actions">
        <button type="button" className="btn-ink" onClick={close}>
          La garder dans les cheveux
        </button>
      </div>
    </div>
  );
}
