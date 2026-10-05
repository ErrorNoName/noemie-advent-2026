import { motion } from "framer-motion";
import { useState } from "react";
import { Confetti } from "../components/Confetti.tsx";
import { RoundBalloon } from "../components/BalloonDigit.tsx";
import {
  Bouquet,
  CakeSlice,
  Eclair,
  Peach,
  Plush,
  Religieuse,
  Sundae,
} from "../components/illustrations.tsx";
import { ScrapRow } from "../components/Scrapbook.tsx";
import { useGentle } from "../hooks/useGentle.ts";
import { useCloseScene } from "./scene-context.ts";

type Step = "hello" | "plush" | "note" | "tray" | "finale";

const ORDER: Step[] = ["hello", "plush", "note", "tray", "finale"];

function pastryArt(item: string) {
  const name = item.toLowerCase();
  if (name.includes("éclair") || name.includes("eclair")) return Eclair;
  if (name.includes("gâteau") || name.includes("gateau")) return CakeSlice;
  if (name.includes("glace")) return Sundae;
  if (name.includes("religieuse")) return Religieuse;
  if (name.includes("pêche") || name.includes("peche")) return Peach;
  return Eclair;
}

function pastryLabel(item: string): { title: string; note?: string } {
  const name = item.toLowerCase();
  if (name.includes("gâteau") || name.includes("gateau")) {
    return { title: "Gâteau chocolat", note: "lait & caramel doux" };
  }
  return { title: item.charAt(0).toUpperCase() + item.slice(1) };
}

export function Day8({ breakfast, extras }: { breakfast: string[]; extras: string[] }) {
  const close = useCloseScene();
  const { reduced, pop } = useGentle();
  const [step, setStep] = useState<Step>("hello");
  const index = ORDER.indexOf(step);

  function next() {
    const following = ORDER[index + 1];
    if (following) setStep(following);
  }

  return (
    <div className="text-center">
      <Confetti burst={step === "finale" ? 1 : 0} />
      <p className="eyebrow">Jour 8 · 21 octobre</p>
      <h2 className="mt-1 font-serif text-4xl italic">Joyeux anniversaire</h2>
      {step === "hello" ? (
        <div className="mt-8">
          <div className="flex justify-center gap-2" aria-hidden>
            <RoundBalloon className="h-24" color="#7eb6ff" />
            <RoundBalloon className="h-28" color="#f4a4b8" />
            <RoundBalloon className="h-24" color="#d5dee8" />
          </div>
          <p className="mt-4 font-serif text-2xl italic">Huit matins. Celui-ci est le tien.</p>
        </div>
      ) : null}
      {step === "plush" || step === "note" || step === "tray" || step === "finale" ? (
        <motion.div
          className="mt-4 flex items-end justify-center gap-1"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={pop}
        >
          <Plush className="w-40" />
          <Bouquet className="w-28" />
        </motion.div>
      ) : null}
      {step === "note" || step === "tray" || step === "finale" ? (
        <motion.div className="sticky mt-2" initial={{ rotate: -12, scale: 0.8, opacity: 0 }} animate={{ rotate: -4, scale: 1, opacity: 1 }} transition={pop}>
          <span className="sticky-tape" />
          je t’aime
        </motion.div>
      ) : null}
      {step === "tray" || step === "finale" ? (
        <ul className="breakfast-grid mt-6 text-left">
          {breakfast.map((item, itemIndex) => {
            const Art = pastryArt(item);
            const label = pastryLabel(item);
            return (
              <motion.li
                key={item}
                className="item-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduced ? { duration: 0 } : { ...pop, delay: itemIndex * 0.12 }}
              >
                <Art className="h-14 w-full" label={label.title} />
                <div>
                  <p className="font-serif text-lg italic">{label.title}</p>
                  {label.note ? <p className="text-sm text-mute">{label.note}</p> : null}
                </div>
              </motion.li>
            );
          })}
        </ul>
      ) : null}
      {step === "finale" ? (
        <div className="mt-6">
          <ScrapRow />
          <p className="mt-4 text-sm text-mute">{extras.join(" · ")}</p>
          <p className="mt-2 font-serif text-2xl italic">Tout ça, et toi.</p>
          <button type="button" className="btn-ink mt-4" onClick={close}>
            Merci
          </button>
        </div>
      ) : (
        <button type="button" className="btn-ink mt-6" onClick={next}>
          Continuer
        </button>
      )}
    </div>
  );
}
