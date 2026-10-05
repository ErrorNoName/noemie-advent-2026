import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import type { AdventDay } from "../data/days.ts";
import { useGentle } from "../hooks/useGentle.ts";
import { formatDateKey } from "../lib/time.ts";
import { Present } from "./Present.tsx";
import { DayStickers } from "./Stickers.tsx";
import { SceneCloseContext } from "../scenes/scene-context.ts";

export function SceneShell({
  day,
  onBack,
  children,
}: {
  day: AdventDay;
  onBack: () => void;
  children: ReactNode;
}) {
  const { reduced, fade, pop } = useGentle();
  const [lid, setLid] = useState(reduced);
  const [ready, setReady] = useState(reduced);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBack]);

  useEffect(() => {
    if (reduced) return;
    const openLid = window.setTimeout(() => setLid(true), 180);
    const show = window.setTimeout(() => setReady(true), 720);
    return () => {
      window.clearTimeout(openLid);
      window.clearTimeout(show);
    };
  }, [reduced]);

  return (
    <SceneCloseContext.Provider value={onBack}>
      <div className="scene column" data-day={day.day}>
        <div className="scene-top">
          <button type="button" className="back-btn" onClick={onBack}>
            <span aria-hidden>← </span>
            Retour
          </button>
          <p className="font-serif italic text-mute">{formatDateKey(day.date)}</p>
        </div>
        <div className="scene-stage">
          <DayStickers day={day.day} />
          <AnimatePresence mode="wait">
            {ready ? (
              <motion.div
                key="content"
                className="scene-copy"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={fade}
              >
                {children}
              </motion.div>
            ) : (
              <motion.div
                key="lid"
                className="lid-exit"
                initial={{ opacity: 0, y: 16, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0, y: -210, x: 36, rotate: -18, scale: 0.62 }
                }
                transition={reduced ? { duration: 0 } : { ...pop, opacity: { duration: 0.35 } }}
                role="status"
                aria-label="La case s’ouvre"
              >
                <Present day={day.day} open={lid} large />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SceneCloseContext.Provider>
  );
}
