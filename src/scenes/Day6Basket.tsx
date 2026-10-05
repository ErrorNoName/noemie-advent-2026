import { motion } from "framer-motion";
import { useState } from "react";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { dayByNumber, teaserFor } from "../data/days.ts";
import { useGentle } from "../hooks/useGentle.ts";
import { useCloseScene } from "./scene-context.ts";

const NOTES = ["un sachet, pour plus tard", "fraîche, à partager ou pas", "toute petite, et déjà à toi"];

function photoFor(content: string): string {
  const name = content.toLowerCase();
  if (name.includes("boisson")) return "stickers/jour-6/bubble-tea-1.webp";
  if (name.includes("peluche")) return "stickers/jour-6/keychain-teddy.webp";
  return "stickers/jour-6/candy-basket.webp";
}

function titleFor(content: string): string {
  return content.charAt(0).toUpperCase() + content.slice(1);
}

export function Day6() {
  const close = useCloseScene();
  const { reduced, pop } = useGentle();
  const [open, setOpen] = useState(false);
  const basket = dayByNumber(6);
  const contents = basket.day === 6 ? basket.contents : [];

  return (
    <div>
      <p className="eyebrow text-center">Jour 6</p>
      <h2 className="mt-1 text-center font-serif text-4xl italic">Panier gourmand</h2>
      <div className="basket mt-2">
        <GiftPhoto
          src={open ? "stickers/jour-6/candy-basket.webp" : "stickers/jour-6/gift-basket.webp"}
          alt={open ? "Panier ouvert" : "Panier fermé"}
        />
      </div>
      {open ? (
        <ul className="mt-2 flex flex-col gap-2">
          {contents.map((item, index) => {
            const title = titleFor(item);
            return (
              <motion.li
                key={item}
                className="item-card"
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={reduced ? { duration: 0 } : { ...pop, delay: index * 0.18 }}
              >
                <GiftPhoto src={photoFor(item)} alt={title} className="h-16 w-full object-contain" />
                <div>
                  <p className="font-serif text-xl italic">{title}</p>
                  <p className="text-sm text-mute">{NOTES[index] ?? "pour toi"}</p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-2 text-center">
          <p className="text-mute">{teaserFor(6)}</p>
          <button type="button" className="btn-ink mt-4" onClick={() => setOpen(true)}>
            Soulever le tissu
          </button>
        </div>
      )}
      <p className="mt-4 text-center text-sm text-mute">{basket.giftPhysical}</p>
      {open ? (
        <div className="mt-4 text-center">
          <button type="button" className="btn-ink" onClick={close}>
            Tout remettre dans le panier
          </button>
        </div>
      ) : null}
    </div>
  );
}
