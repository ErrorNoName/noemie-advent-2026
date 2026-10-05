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
  const { reduced, fade } = useGentle();
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
    const openLid = window.setTimeout(() => setLid(true), 220);
    const show = window.setTimeout(() => setReady(true), 1100);
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
        <div className="relative px-5 pb-16">
          <DayStickers day={day.day} />
          <AnimatePresence mode="wait">
            {ready ? (
              <motion.div key="content" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={fade}>
                {children}
              </motion.div>
            ) : (
              <motion.div
                key="lid"
                className="grid min-h-[62dvh] place-items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fade}
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
