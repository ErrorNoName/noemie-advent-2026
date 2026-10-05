import { motion } from "framer-motion";
import { useState } from "react";
import { Confetti } from "../components/Confetti.tsx";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { useGentle } from "../hooks/useGentle.ts";
import { useCloseScene } from "./scene-context.ts";

type Step = "hello" | "plush" | "note" | "tray" | "finale";

const ORDER: Step[] = ["hello", "plush", "note", "tray", "finale"];

function pastrySrc(item: string): string {
  const name = item.toLowerCase();
  if (name.includes("éclair") || name.includes("eclair")) return "stickers/jour-8/eclair-1.webp";
  if (name.includes("gâteau") || name.includes("gateau")) return "stickers/jour-8/cake-1.webp";
  if (name.includes("glace")) return "stickers/jour-8/icecream-1.webp";
  if (name.includes("religieuse")) return "stickers/jour-8/religieuse.webp";
  if (name.includes("pêche") || name.includes("peche")) return "stickers/jour-8/peach-1.webp";
  return "stickers/jour-8/profiterole.webp";
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
          <div className="flex items-end justify-center gap-2" aria-hidden>
            <GiftPhoto src="stickers/jour-8/bouquet-1.webp" alt="" className="diecut h-24 w-20" />
            <GiftPhoto src="stickers/jour-8/giant-teddy-1.webp" alt="" className="diecut h-32 w-24" />
          </div>
          <p className="mt-4 font-serif text-2xl italic">Huit matins. Celui-ci est le tien.</p>
        </div>
      ) : null}
      {step === "plush" || step === "note" || step === "tray" || step === "finale" ? (
        <motion.div
          className="mt-4 flex items-end justify-center gap-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={pop}
        >
          <GiftPhoto src="stickers/jour-8/giant-teddy-1.webp" alt="Énorme peluche" className="diecut h-36 w-28" />
          <GiftPhoto src="stickers/jour-8/bouquet-1.webp" alt="Fleurs" className="diecut h-28 w-20" />
        </motion.div>
      ) : null}
      {step === "note" || step === "tray" || step === "finale" ? (
        <motion.div
          className="love-note mt-4"
          initial={{ rotate: -12, scale: 0.8, opacity: 0 }}
          animate={{ rotate: -4, scale: 1, opacity: 1 }}
          transition={pop}
        >
          <span className="love-tape" />
          je t’aime
        </motion.div>
      ) : null}
      {step === "note" || step === "tray" || step === "finale" ? (
        <GiftPhoto src="stickers/jour-8/postit-2.webp" alt="Post-it" className="mx-auto mt-3 h-24 w-24 object-contain" />
      ) : null}
      {step === "tray" || step === "finale" ? (
        <ul className="breakfast-grid mt-6 text-left">
          {breakfast.map((item, itemIndex) => {
            const label = pastryLabel(item);
            return (
              <motion.li
                key={item}
                className="item-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduced ? { duration: 0 } : { ...pop, delay: itemIndex * 0.12 }}
              >
                <GiftPhoto src={pastrySrc(item)} alt={label.title} className="h-14 w-full object-contain" />
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
          <div className="mt-4 flex justify-center gap-3">
            <GiftPhoto src="stickers/jour-8/eclair-1.webp" alt="" className="diecut h-16 w-16" />
            <GiftPhoto src="stickers/jour-8/cake-1.webp" alt="" className="diecut h-16 w-16" />
            <GiftPhoto src="stickers/jour-8/peach-1.webp" alt="" className="diecut h-16 w-16" />
          </div>
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
