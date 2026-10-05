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
      return "Tourne le bouton, du bout des doigts.";
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
    setAngle((value) => value + (delta * 180) / Math.PI);
    if (spun.current >= NEED) {
      setPhase("capsule");
      if (!reduced && "vibrate" in navigator) navigator.vibrate(18);
    }
  }

  return (
    <div className="open-scene">
      <p className="eyebrow">Jour 4</p>
      <h2 className="font-serif italic">Machine gacha</h2>
      <div className="open-stage">
        <div className="gacha gacha-live" data-phase={phase}>
          <div className="gacha-cap" />
          <div className="gacha-body">
            <div className="gacha-window">
              <div className="gacha-poster">
                <p className="font-serif text-lg leading-tight italic text-ink">
                  Ouvre
                  <br />
                  quand tu
                  <br />
                  es prête.
                </p>
              </div>
              <span className="cap pink c2" />
              <span className="cap white c3" />
              <span className="cap mint c5" />
            </div>
            <div className="gacha-controls">
              <div className="gacha-price" aria-hidden>
                200
              </div>
              <div className="gacha-slot" />
              <button
                type="button"
                className="gacha-dial"
                aria-label="Tourner la manivelle"
                style={{ touchAction: "none" }}
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
                <motion.span className="gacha-rotor" style={{ rotate: angle }}>
                  <span className="gacha-knob" />
                  <span className="gacha-core" />
                </motion.span>
              </button>
            </div>
            <div className="gacha-tray">
              <AnimatePresence>
                {phase === "capsule" ? (
                  <motion.button
                    key="capsule"
                    type="button"
                    className="capsule-btn"
                    aria-label="Ouvrir la capsule"
                    initial={{ y: -80, opacity: 0, rotate: -20 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ rotate: 150, scale: 0.2, opacity: 0 }}
                    transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 16 }}
                    onClick={() => {
                      setPhase("open");
                      if (!reduced && "vibrate" in navigator) navigator.vibrate(12);
                    }}
                  >
                    <GiftPhoto src="stickers/jour-4/gashapon-capsule.webp" alt="" className="h-14 w-14 object-contain" />
                  </motion.button>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      {phase === "open" && note ? (
        <motion.div initial={{ scale: 0.7, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={pop}>
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
        <button type="button" className="btn-ghost" onClick={close}>
          Revenir aux cases
        </button>
      </div>
    </div>
  );
}
