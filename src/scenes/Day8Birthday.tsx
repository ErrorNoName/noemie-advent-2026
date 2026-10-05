import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Confetti } from "../components/Confetti.tsx";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { useGentle } from "../hooks/useGentle.ts";
import { useCloseScene } from "./scene-context.ts";

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
  if (name.includes("éclair") || name.includes("eclair")) return { title: "Éclair" };
  if (name.includes("gâteau") || name.includes("gateau")) return { title: "Gâteau", note: "lait & caramel doux" };
  if (name.includes("glace")) return { title: "Glace café" };
  if (name.includes("religieuse")) return { title: "Religieuses" };
  if (name.includes("pêche") || name.includes("peche")) return { title: "Pêche" };
  return { title: item.charAt(0).toUpperCase() + item.slice(1) };
}

export function Day8({ breakfast, extras }: { breakfast: string[]; extras: string[] }) {
  const close = useCloseScene();
  const { reduced, pop } = useGentle();
  const [open, setOpen] = useState(false);
  const [pull, setPull] = useState(0);
  const origin = useRef<number | null>(null);
  const spring = reduced ? { duration: 0 } : pop;

  function unwrap() {
    if (open) return;
    setOpen(true);
    if (!reduced && "vibrate" in navigator) navigator.vibrate(16);
  }

  return (
    <div className="open-scene">
      <Confetti burst={open ? 1 : 0} />
      <p className="eyebrow">Jour 8 · 21 octobre</p>
      <h2 className="font-serif italic">Joyeux anniversaire</h2>
      <div className="open-stage day8-stage" data-open={open ? "yes" : "no"}>
        {open ? (
          <div className="day8-settle">
            <motion.div
              className="day8-heroes"
              initial={{ y: -28, opacity: 0, rotate: -6 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ ...spring, delay: reduced ? 0 : 0.12 }}
            >
              <GiftPhoto src="stickers/jour-8/giant-teddy-1.webp" alt="Énorme peluche" className="day8-teddy" />
              <GiftPhoto src="stickers/jour-8/bouquet-1.webp" alt="Fleurs" className="day8-flowers" />
            </motion.div>
            <motion.div
              className="love-note"
              initial={{ rotate: -18, y: -16, opacity: 0, scale: 0.86 }}
              animate={{ rotate: -4, y: 0, opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: reduced ? 0 : 0.55 }}
            >
              <span className="love-tape" />
              je t’aime
            </motion.div>
            <ul className="tray">
              {breakfast.map((item, index) => {
                const label = pastryLabel(item);
                return (
                  <motion.li
                    key={item}
                    className="tray-bit"
                    initial={{ x: 42, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 220, damping: 20, delay: 0.95 + index * 0.16 }
                    }
                  >
                    <GiftPhoto src={pastrySrc(item)} alt={label.title} className="tray-photo" />
                    <p>{label.title}</p>
                    {label.note ? <p className="text-mute">{label.note}</p> : null}
                  </motion.li>
                );
              })}
            </ul>
          </div>
        ) : (
          <button
            type="button"
            className="gift-ribbon"
            aria-label="Dénouer le ruban"
            style={{ touchAction: "none" }}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              origin.current = event.clientY;
            }}
            onPointerMove={(event) => {
              if (origin.current == null) return;
              setPull(Math.max(0, Math.min(140, event.clientY - origin.current)));
            }}
            onPointerUp={() => {
              if (pull > 70) unwrap();
              else setPull(0);
              origin.current = null;
            }}
            onPointerCancel={() => {
              setPull(0);
              origin.current = null;
            }}
          >
            <span className="gift-box" aria-hidden />
            <motion.span className="gift-bow" style={{ y: pull }} aria-hidden>
              <svg viewBox="0 0 140 180">
                <path d="M62 0h16v180H62z" fill="#e56b8a" />
                <path d="M18 36c22 14 28 12 52 0 22 12 30 14 52 0-12 22-22 26-52 18-30 8-40 4-52-18z" fill="#f4b3c6" />
                <circle cx="70" cy="48" r="8" fill="#fff8f2" />
              </svg>
            </motion.span>
          </button>
        )}
      </div>
      <p className="open-caption">
        {open ? "La peluche, les fleurs, le mot, puis le plateau." : "Huit matins. Celui-ci est le tien."}
      </p>
      {open ? <p className="open-caption">{extras.join(" · ")}</p> : null}
      <div className="open-actions">
        {open ? (
          <button type="button" className="btn-ink" onClick={close}>
            Merci
          </button>
        ) : (
          <button type="button" className="btn-ink" onClick={unwrap}>
            Dénouer le ruban
          </button>
        )}
      </div>
    </div>
  );
}
