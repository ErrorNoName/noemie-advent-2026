import { motion } from "framer-motion";
import { useRef, useState, type RefObject } from "react";
import { useGentle } from "../hooks/useGentle.ts";
import { peelStickers, type PeelPlay } from "../lib/experience.ts";
import { publicUrl } from "../lib/publicUrl.ts";

function Peel({
  src,
  play,
  delay,
  bounds,
}: {
  src: string;
  play: PeelPlay;
  delay: number;
  bounds: RefObject<HTMLDivElement | null>;
}) {
  const { reduced } = useGentle();
  const [tick, setTick] = useState(0);
  const rest = play === "drag" ? -6 : 5;
  const interactive = play === "drag" || play === "tap";
  return (
    <motion.button
      type="button"
      className={`peel-sticker is-${play}`}
      aria-label={play === "drag" ? "Déplacer le sticker" : play === "tap" ? "Agiter le sticker" : undefined}
      aria-hidden={interactive ? undefined : true}
      tabIndex={interactive ? 0 : -1}
      drag={play === "drag" && !reduced}
      dragConstraints={bounds}
      dragElastic={0.12}
      dragMomentum={false}
      initial={reduced ? false : { opacity: 0, scale: 0.35, y: 18, rotate: rest - 16 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        rotate: tick > 0 && !reduced ? [rest, rest + 12, rest - 8, rest] : rest,
      }}
      transition={
        reduced
          ? { duration: 0 }
          : { type: "spring", stiffness: 460, damping: 14, delay: tick > 0 ? 0 : delay }
      }
      onClick={() => {
        if (play === "tap" || play === "drag") setTick((value) => value + 1);
      }}
    >
      <img src={publicUrl(src)} alt="" draggable={false} />
    </motion.button>
  );
}

export function PeelStickers({ day, revealed }: { day: number; revealed: boolean }) {
  const bounds = useRef<HTMLDivElement>(null);
  if (!revealed) return null;
  const stickers = peelStickers(day);
  if (stickers.length === 0) return null;
  return (
    <div className="peel-row" ref={bounds} data-day={day}>
      {stickers.map((sticker, index) => (
        <Peel
          key={sticker.src}
          src={sticker.src}
          play={sticker.play}
          delay={index * 0.12}
          bounds={bounds}
        />
      ))}
    </div>
  );
}
