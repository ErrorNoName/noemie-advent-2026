import { useEffect, useState } from "react";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { PACK } from "../data/art.ts";
import { useGentle } from "../hooks/useGentle.ts";
import { dayByNumber, giftFor, teaserFor } from "../data/days.ts";
import { useCloseScene } from "./scene-context.ts";

const FRAMES = ["love", "name", "date", "soft"] as const;
type Frame = (typeof FRAMES)[number];

function PixelHeart() {
  return (
    <svg viewBox="0 0 7 6" className="pixel-heart" aria-hidden>
      <path
        fill="currentColor"
        d="M1 0h2v1H1zM4 0h2v1H4zM0 1h7v2H0zM1 3h5v1H1zM2 4h3v1H2zM3 5h1v1H3z"
      />
    </svg>
  );
}

function hasHeart(text: string): boolean {
  return /\u2764|\u2665|\u2661/.test(text);
}

function Screen({ frame }: { frame: Frame }) {
  switch (frame) {
    case "love":
      return (
        <span className="inline-flex items-center gap-1">
          I <PixelHeart /> U
        </span>
      );
    case "name":
      return <span>NOEMIE</span>;
    case "date":
      return <span>21.10</span>;
    case "soft":
      return <span>POUR TOI</span>;
    default: {
      const unexpected: never = frame;
      return unexpected;
    }
  }
}

export function Day5() {
  const close = useCloseScene();
  const { reduced } = useGentle();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setIndex((value) => (value + 1) % FRAMES.length);
    }, 1400);
    return () => window.clearInterval(id);
  }, [reduced]);

  const frame = FRAMES[index] ?? "love";
  const clip = dayByNumber(5);
  const rawMessage = clip.day === 5 ? clip.lcdDefaultMessage : "I love U";
  const spoken = hasHeart(rawMessage) ? "I love U" : rawMessage;

  return (
    <div className="text-center">
      <p className="eyebrow">Jour 5</p>
      <h2 className="mt-1 font-serif text-4xl italic">Barrette écran</h2>
      <p className="mt-2 text-mute">{teaserFor(5)}</p>
      <GiftPhoto src={PACK.journal} alt="" className="diecut mx-auto mt-4 h-28 w-40" />
      <GiftPhoto src="stickers/jour-5/bow-hairpin.webp" alt="Barrette" className="gift-hero mt-2" />
      <div className="lcd-clip mt-2">
        <div className="lcd">
          <div className={`lcd-screen ${reduced ? "" : "is-glitch"}`}>
            <Screen frame={frame} />
            <span className="sr-only">{spoken}</span>
          </div>
          <p className="mt-2 text-center font-pixel text-[9px] tracking-[0.2em] text-mute">LCD</p>
        </div>
      </div>
      <div className="mt-3 flex justify-center gap-2">
        <GiftPhoto src="stickers/jour-5/barrette-purple.webp" alt="" className="h-14 w-14 object-contain" />
        <GiftPhoto src="stickers/jour-5/hair-clips.webp" alt="" className="h-14 w-14 object-contain" />
      </div>
      <p className="mt-4 font-serif text-2xl italic">
        {hasHeart(rawMessage) ? (
          <span className="inline-flex items-center gap-1">
            I <PixelHeart /> U
          </span>
        ) : (
          spoken
        )}
        , en tout petit.
      </p>
      <p className="mt-2 text-sm text-mute">{giftFor(5)}</p>
      <button type="button" className="btn-ink mt-6" onClick={close}>
        La garder dans les cheveux
      </button>
    </div>
  );
}
