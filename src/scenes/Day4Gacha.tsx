import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, type PointerEvent } from "react";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { MiniTicket } from "../components/MiniTicket.tsx";
import { giftFor } from "../data/days.ts";
import { useGentle } from "../hooks/useGentle.ts";
import { useCloseScene } from "./scene-context.ts";

const NOTES = [
  "Tu es ma personne préférée.",
  "Pour les mots qu’on ne dit pas tout haut.",
  "Garde ce papier pour un jour mou.",
];

type Phase = "crank" | "capsule" | "open";

function hint(phase: Phase): string {
  switch (phase) {
    case "crank":
      return "Fais tourner la machine, du bout des doigts.";
    case "capsule":
      return "Elle est tombée. Touche-la pour l’ouvrir.";
    case "open":
      return "Un petit mot, rien que pour toi.";
    default: {
      const unexpected: never = phase;
      return unexpected;
    }
  }
}

const NEED = 5;

export function Day4() {
  const close = useCloseScene();
  const { reduced, pop } = useGentle();
  const [phase, setPhase] = useState<Phase>("crank");
  const [angle, setAngle] = useState(0);
  const [noteIndex, setNoteIndex] = useState(0);
  const drag = useRef<{ last: number; moved: number } | null>(null);
  const spun = useRef(0);
  const note = NOTES[noteIndex] ?? NOTES[0];

  function pointAngle(event: PointerEvent<HTMLButtonElement>): number {
    const rect = event.currentTarget.getBoundingClientRect();
    return Math.atan2(event.clientY - (rect.top + rect.height / 2), event.clientX - (rect.left + rect.width / 2));
  }

  function crankBy(delta: number) {
    if (phase !== "crank") return;
    spun.current += Math.abs(delta);
    setAngle((value) => value + delta * 18);
    if (spun.current >= NEED) {
      setPhase("capsule");
      if (!reduced && "vibrate" in navigator) navigator.vibrate(16);
    }
  }

  return (
    <div className="open-scene">
      <p className="eyebrow">Jour 4</p>
      <h2 className="font-serif italic">Machine gacha</h2>
      <div className="collage gacha-collage" data-phase={phase}>
        <motion.button
          type="button"
          className="cut machine-hit"
          aria-label="Tourner la machine"
          style={{ touchAction: "none", rotate: angle }}
          onPointerDown={(event) => {
            if (phase !== "crank") return;
            event.currentTarget.setPointerCapture(event.pointerId);
            drag.current = { last: pointAngle(event), moved: 0 };
          }}
          onPointerMove={(event) => {
            if (!drag.current || phase !== "crank") return;
            const next = pointAngle(event);
            let delta = next - drag.current.last;
            if (delta > Math.PI) delta -= Math.PI * 2;
            if (delta < -Math.PI) delta += Math.PI * 2;
            drag.current.last = next;
            drag.current.moved += Math.abs(delta);
            crankBy(delta);
          }}
          onPointerUp={() => {
            if (drag.current && drag.current.moved < 0.25) crankBy(1.8);
            drag.current = null;
          }}
        >
          <GiftPhoto src="stickers/jour-4/gacha-pastel.webp" alt="Machine gacha" className="fill-cut" />
        </motion.button>
        <AnimatePresence>
          {phase !== "crank" ? (
            <motion.button
              key="capsule"
              type="button"
              className="cut capsule-cut"
              aria-label="Ouvrir la capsule"
              initial={{ y: -24, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 18 }}
              onClick={() => {
                if (phase !== "capsule") return;
                setPhase("open");
                if (!reduced && "vibrate" in navigator) navigator.vibrate(12);
              }}
            >
              <GiftPhoto src="stickers/jour-4/gashapon-capsule.webp" alt="" className="fill-cut" />
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>
      {phase === "open" && note ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={pop}>
          <MiniTicket kicker="dans la capsule">{note}</MiniTicket>
        </motion.div>
      ) : (
        <p className="open-caption">{hint(phase)}</p>
      )}
      <p className="open-caption">{giftFor(4)}</p>
      <div className="open-actions">
        {phase === "open" ? (
          <button
            type="button"
            className="btn-line"
            onClick={() => {
              spun.current = 0;
              setAngle(0);
              setNoteIndex((index) => (index + 1) % NOTES.length);
              setPhase("crank");
            }}
          >
            Encore une pièce
          </button>
        ) : null}
        <button type="button" className="btn-ink" onClick={close}>
          Revenir aux cases
        </button>
      </div>
    </div>
  );
}
