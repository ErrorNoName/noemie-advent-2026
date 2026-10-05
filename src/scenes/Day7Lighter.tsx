import { useState } from "react";
import { ChromeBlobs } from "../components/ChromeBlobs.tsx";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { giftFor, teaserFor } from "../data/days.ts";
import { useCloseScene } from "./scene-context.ts";

export function Day7() {
  const close = useCloseScene();
  const [lit, setLit] = useState(false);

  return (
    <div className="relative text-center">
      <ChromeBlobs />
      <div className="relative">
        <p className="eyebrow">Jour 7</p>
        <h2 className="mt-1 font-serif text-4xl italic">Briquet aesthetic</h2>
        <p className="mt-2 text-mute">{teaserFor(7)} La vraie est à côté.</p>
        <div className="lighter mt-6">
          {lit ? <div className="flame" aria-hidden /> : <div className="h-[46px]" />}
          <GiftPhoto src="stickers/jour-7/zippo-silver.webp" alt="Briquet" className="gift-hero mx-auto w-28" />
        </div>
        <button type="button" className="btn-ink mt-4" onClick={() => setLit((value) => !value)} aria-pressed={lit}>
          {lit ? "Souffler" : "Allumer"}
        </button>
        <p className="mt-4 text-sm text-mute">{giftFor(7)}. La flamme à l’écran reste un dessin.</p>
        <button type="button" className="btn-ghost mt-3" onClick={close}>
          Revenir
        </button>
      </div>
    </div>
  );
}
