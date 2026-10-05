import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Confetti } from "../components/Confetti.tsx";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { useGentle } from "../hooks/useGentle.ts";
import { playTick } from "../lib/touchSound.ts";
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

function pastryLabel(item: string): string {
  const name = item.toLowerCase();
  if (name.includes("éclair") || name.includes("eclair")) return "Éclair";
  if (name.includes("gâteau") || name.includes("gateau")) return "Gâteau";
  if (name.includes("glace")) return "Glace";
  if (name.includes("religieuse")) return "Religieuse";
  if (name.includes("pêche") || name.includes("peche")) return "Pêche";
  return item.charAt(0).toUpperCase() + item.slice(1);
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
    setPull(0);
    if (!reduced) {
      playTick();
      if ("vibrate" in navigator) navigator.vibrate(16);
    }
  }

  return (
    <div className="open-scene">
      <Confetti burst={open ? 1 : 0} />
      <p className="eyebrow">Jour 8 · 21 octobre</p>
      <h2 className="font-serif italic">Joyeux anniversaire</h2>
      <div className="collage day8-collage" data-open={open ? "yes" : "no"}>
        {open ? (
          <>
            <motion.div
              className="cut teddy-cut"
              initial={{ opacity: 0, y: 24, rotate: -6 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ ...spring, delay: reduced ? 0 : 0.05 }}
            >
              <GiftPhoto src="stickers/jour-8/giant-teddy-2.webp" alt="Énorme peluche" className="fill-cut" />
            </motion.div>
            <motion.div
              className="cut flower-cut"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: reduced ? 0 : 0.28 }}
            >
              <GiftPhoto src="stickers/jour-8/bouquet-1.webp" alt="Fleurs" className="fill-cut" />
            </motion.div>
            <motion.p
              className="love-slip"
              initial={{ opacity: 0, rotate: -16, y: -8, scale: 0.86 }}
              animate={{ opacity: 1, rotate: -6, y: 0, scale: 1 }}
              transition={{ ...spring, delay: reduced ? 0 : 0.55 }}
            >
              je t’aime
            </motion.p>
            <ul className="tray-mini">
              {breakfast.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ x: 28, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={reduced ? { duration: 0 } : { ...pop, delay: 0.85 + index * 0.16 }}
                >
                  <GiftPhoto src={pastrySrc(item)} alt={pastryLabel(item)} className="tray-mini-photo" />
                  <span>{pastryLabel(item)}</span>
                </motion.li>
              ))}
            </ul>
          </>
        ) : (
          <motion.button
            type="button"
            className="party-stack"
            aria-label="Ouvrir le cadeau"
            style={{ touchAction: "none" }}
            animate={{ y: -pull }}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              origin.current = event.clientY;
            }}
            onPointerMove={(event) => {
              if (origin.current == null) return;
              setPull(Math.max(0, Math.min(90, origin.current - event.clientY)));
            }}
            onPointerUp={() => {
              if (pull > 46) unwrap();
              else setPull(0);
              origin.current = null;
            }}
            onPointerCancel={() => {
              setPull(0);
              origin.current = null;
            }}
          >
            <GiftPhoto src="stickers/jour-8/giant-teddy-1.webp" alt="" className="stack-teddy" />
            <GiftPhoto src="stickers/jour-8/bouquet-2.webp" alt="" className="stack-flowers" />
          </motion.button>
        )}
      </div>
      <p className="open-caption">{open ? extras.join(" · ") : "Tire le cadeau vers le haut."}</p>
      <p className="open-caption">{open ? "Gâteau chocolat, lait et caramel doux." : "La peluche, les fleurs, le mot, puis le plateau."}</p>
      <div className="open-actions">
        {open ? null : (
          <button type="button" className="btn-line" onClick={unwrap}>
            Ouvrir
          </button>
        )}
        <button type="button" className="btn-ink" onClick={close}>
          Merci
        </button>
      </div>
    </div>
  );
}
