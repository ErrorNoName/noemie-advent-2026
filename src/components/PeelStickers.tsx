import { motion } from "framer-motion";
import { useEffect, useRef, useState, type RefObject } from "react";
import { useGentle } from "../hooks/useGentle.ts";
import { composedSticker } from "../lib/composeSticker.ts";
import { peelStickers, type PeelPlay, type PeelSize, type PeelSticker } from "../lib/experience.ts";
import { publicUrl } from "../lib/publicUrl.ts";

function Peel({
  src,
  play,
  delay,
  bounds,
  size = "regular",
}: {
  src: string;
  play: PeelPlay;
  delay: number;
  bounds: RefObject<HTMLDivElement | null>;
  size?: PeelSize;
}) {
  const { reduced } = useGentle();
  const [tick, setTick] = useState(0);
  const rest = play === "drag" ? -6 : 5;
  const interactive = play === "drag" || play === "tap";
  return (
    <motion.button
      type="button"
      className={`peel-sticker is-${play} is-${size}`}
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
      <img src={src.startsWith("data:") ? src : publicUrl(src)} alt="" width={120} height={120} draggable={false} />
    </motion.button>
  );
}

function GeneratedPeel({
  order,
  delay,
  bounds,
}: {
  order: number;
  delay: number;
  bounds: RefObject<HTMLDivElement | null>;
}) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    void composedSticker(order).then((url) => {
      if (live && url) setSrc(url);
    });
    return () => {
      live = false;
    };
  }, [order]);
  if (!src) return <span className="peel-sticker is-pending" aria-hidden />;
  return <Peel src={src} play="tap" delay={delay} bounds={bounds} />;
}

export function MagazinePeel({
  stickers,
  generated = [],
}: {
  stickers: PeelSticker[];
  generated?: number[];
}) {
  const bounds = useRef<HTMLDivElement>(null);
  if (stickers.length === 0 && generated.length === 0) return null;
  return (
    <div className="mag-row" ref={bounds}>
      {stickers.map((sticker, index) => (
        <Peel
          key={sticker.src}
          src={sticker.src}
          play={sticker.play}
          size={sticker.size}
          delay={index * 0.1}
          bounds={bounds}
        />
      ))}
      {generated.map((order, index) => (
        <GeneratedPeel key={order} order={order} delay={(stickers.length + index) * 0.1} bounds={bounds} />
      ))}
    </div>
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
          size={sticker.size}
          delay={index * 0.12}
          bounds={bounds}
        />
      ))}
    </div>
  );
}
