import { useEffect, useState } from "react";
import { PixelHeart } from "../components/illustrations.tsx";
import { useGentle } from "../hooks/useGentle.ts";
import { dayByNumber, giftFor, teaserFor } from "../data/days.ts";
import { useCloseScene } from "./scene-context.ts";

const FRAMES = ["love", "name", "date", "soft"] as const;
type Frame = (typeof FRAMES)[number];

function Screen({ frame }: { frame: Frame }) {
  switch (frame) {
    case "love":
      return (
        <span className="flex items-center gap-2">
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
  const lcdMessage = clip.day === 5 ? clip.lcdDefaultMessage : "I ❤ U";

  return (
    <div className="text-center">
      <p className="eyebrow">Jour 5</p>
      <h2 className="mt-1 font-serif text-4xl italic">Barrette écran</h2>
      <p className="mt-2 text-mute">{teaserFor(5)}</p>
      <div className="lcd-clip mt-8">
        <svg className="hair" viewBox="0 0 260 200" aria-hidden>
          <path d="M40 10 C 90 80, 20 120, 70 200" stroke="#3a2a32" strokeWidth="26" fill="none" strokeLinecap="round" />
          <path d="M90 0 C 140 70, 70 130, 120 200" stroke="#5a4038" strokeWidth="22" fill="none" strokeLinecap="round" />
          <path d="M150 8 C 190 80, 130 140, 180 200" stroke="#2a2428" strokeWidth="18" fill="none" strokeLinecap="round" />
        </svg>
        <div className="lcd">
          <div className={`lcd-screen ${reduced ? "" : "is-glitch"}`}>
            <Screen frame={frame} />
            <span className="sr-only">{lcdMessage}</span>
          </div>
          <p className="mt-2 text-center font-pixel text-[9px] tracking-[0.2em] text-mute">LCD</p>
        </div>
      </div>
      <p className="mt-6 font-serif text-2xl italic">{lcdMessage}, en tout petit.</p>
      <p className="mt-2 text-sm text-mute">{giftFor(5)}</p>
      <button type="button" className="btn-ink mt-6" onClick={close}>
        La garder dans les cheveux
      </button>
    </div>
  );
}
