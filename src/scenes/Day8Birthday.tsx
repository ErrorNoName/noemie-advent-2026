import { motion } from "framer-motion";
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
  const spring = reduced ? { duration: 0 } : pop;

  return (
    <div className="open-scene">
      <Confetti burst={1} />
      <p className="eyebrow">Jour 8 · 21 octobre</p>
      <h2 className="font-serif italic">Joyeux anniversaire</h2>
      <div className="collage day8-collage">
        <motion.div
          className="cut teddy-cut"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: reduced ? 0 : 0.05 }}
        >
          <GiftPhoto src="stickers/jour-8/giant-teddy-2.webp" alt="Énorme peluche" className="fill-cut" />
        </motion.div>
        <motion.div
          className="cut flower-cut"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: reduced ? 0 : 0.18 }}
        >
          <GiftPhoto src="stickers/jour-8/bouquet-1.webp" alt="Fleurs" className="fill-cut" />
        </motion.div>
        <motion.p
          className="love-slip"
          initial={{ opacity: 0, rotate: -12, scale: 0.9 }}
          animate={{ opacity: 1, rotate: -6, scale: 1 }}
          transition={{ ...spring, delay: reduced ? 0 : 0.4 }}
        >
          je t’aime
        </motion.p>
        <ul className="tray-mini">
          {breakfast.map((item, index) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { ...pop, delay: 0.62 + index * 0.12 }}
            >
              <GiftPhoto src={pastrySrc(item)} alt={pastryLabel(item)} className="tray-mini-photo" />
              <span>{pastryLabel(item)}</span>
            </motion.li>
          ))}
        </ul>
      </div>
      <p className="open-caption">{extras.join(" · ")}</p>
      <p className="open-caption">Gâteau chocolat, lait et caramel doux.</p>
      <div className="open-actions">
        <button type="button" className="btn-ink" onClick={close}>
          Merci
        </button>
      </div>
    </div>
  );
}
