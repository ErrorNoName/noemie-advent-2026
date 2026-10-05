import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
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
  const name = content.toLowerCase();
  if (name.includes("bonbon")) return "Bonbons";
  if (name.includes("boisson")) return "Boisson";
  if (name.includes("peluche")) return "Mini peluche";
  return content.charAt(0).toUpperCase() + content.slice(1);
}

export function Day6() {
  const close = useCloseScene();
  const { reduced, pop } = useGentle();
  const [open, setOpen] = useState(false);
  const origin = useRef<number | null>(null);
  const [lift, setLift] = useState(0);
  const basket = dayByNumber(6);
  const contents = basket.day === 6 ? basket.contents : [];

  function reveal() {
    if (open) return;
    setOpen(true);
    if (!reduced && "vibrate" in navigator) navigator.vibrate(12);
  }

  return (
    <div className="open-scene">
      <p className="eyebrow">Jour 6</p>
      <h2 className="font-serif italic">Panier gourmand</h2>
      <div className="open-stage" data-open={open ? "yes" : "no"}>
        <AnimatePresence mode="wait">
          {open ? (
            <ul key="items" className="pop-row">
              {contents.map((item, index) => {
                const title = titleFor(item);
                return (
                  <motion.li
                    key={item}
                    className="pop-bit"
                    initial={{ opacity: 0, y: 28, scale: 0.86 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={reduced ? { duration: 0 } : { ...pop, delay: 0.12 + index * 0.18 }}
                  >
                    <GiftPhoto src={photoFor(item)} alt={title} className="pop-photo" />
                    <p className="font-serif italic">{title}</p>
                    <p className="text-mute">{NOTES[index] ?? "pour toi"}</p>
                  </motion.li>
                );
              })}
            </ul>
          ) : (
            <motion.button
              key="lid"
              type="button"
              className="basket-lid"
              aria-label="Soulever le tissu"
              exit={{ y: -180, opacity: 0, rotate: -8 }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 160, damping: 18 }}
              style={{ touchAction: "none" }}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                origin.current = event.clientY;
              }}
              onPointerMove={(event) => {
                if (origin.current == null) return;
                setLift(Math.max(0, Math.min(120, origin.current - event.clientY)));
              }}
              onPointerUp={() => {
                if (lift > 48) reveal();
                else setLift(0);
                origin.current = null;
              }}
              onPointerCancel={() => {
                setLift(0);
                origin.current = null;
              }}
            >
              <motion.span className="basket-cloth" style={{ y: -lift }} aria-hidden>
                <svg viewBox="0 0 200 70" className="cloth-svg">
                  <path d="M8 18c28 22 48 8 70 8s40 16 70-6c10 20 8 34-6 40H16C4 50 0 34 8 18z" fill="#f7d7e2" />
                  <path d="M20 28c24 10 40 4 58 4s36 8 62-2" fill="none" stroke="#fff" strokeWidth="3" />
                </svg>
              </motion.span>
              <GiftPhoto src="stickers/jour-6/gift-basket.webp" alt="Panier fermé" className="basket-photo" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <p className="open-caption">{open ? "Tout est sorti, bien aligné." : teaserFor(6)}</p>
      <p className="open-caption">{basket.giftPhysical}</p>
      <div className="open-actions">
        {open ? null : (
          <button type="button" className="btn-line" onClick={reveal}>
            Soulever le tissu
          </button>
        )}
        {open ? (
          <button type="button" className="btn-ink" onClick={close}>
            Tout remettre dans le panier
          </button>
        ) : null}
      </div>
    </div>
  );
}
