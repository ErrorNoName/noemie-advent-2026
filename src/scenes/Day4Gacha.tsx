import { motion } from "framer-motion";
import { useRef, useState, type PointerEvent } from "react";
import { GiftPhoto } from "../components/GiftPhoto.tsx";
import { giftFor } from "../data/days.ts";
import { useGentle } from "../hooks/useGentle.ts";
import { playTick } from "../lib/touchSound.ts";
import { useCloseScene } from "./scene-context.ts";

const NOTES = [
  "Tu es ma personne préférée.",
  "Pour les mots qu’on ne dit pas tout haut.",
  "Garde ce papier pour un jour mou.",
];

const PILLS = [
  { x: 18, y: 28, color: "#f4a7c2" },
  { x: 58, y: 18, color: "#fff8f2" },
  { x: 34, y: 48, color: "#b7ddd4" },
  { x: 70, y: 42, color: "#f6d7a4" },
];

type Phase = "crank" | "drop" | "held" | "open";

function hint(phase: Phase): string {
  switch (phase) {
    case "crank":
      return "Tourne le bouton, cran par cran.";
    case "drop":
      return "Elle est dans la trappe. Prends-la.";
    case "held":
      return "Tourne la capsule pour l’ouvrir.";
    case "open":
      return "Dedans, un petit mot.";
    default: {
      const unexpected: never = phase;
      return unexpected;
    }
  }
}

const STEPS = 8;

export function Day4() {
  const close = useCloseScene();
  const { reduced, pop } = useGentle();
  const [phase, setPhase] = useState<Phase>("crank");
  const [angle, setAngle] = useState(0);
  const [steps, setSteps] = useState(0);
  const [noteIndex, setNoteIndex] = useState(0);
  const drag = useRef<{ last: number; carry: number } | null>(null);
  const stepsRef = useRef(0);
  const phaseRef = useRef<Phase>("crank");
  const note = NOTES[noteIndex] ?? NOTES[0];

  function pointAngle(event: PointerEvent<HTMLButtonElement>): number {
    const rect = event.currentTarget.getBoundingClientRect();
    return Math.atan2(event.clientY - (rect.top + rect.height / 2), event.clientX - (rect.left + rect.width / 2));
  }

  function addStep(dir: number) {
    if (phaseRef.current !== "crank") return;
    stepsRef.current += 1;
    setSteps(stepsRef.current);
    setAngle((value) => value + dir * 45);
    if (stepsRef.current >= STEPS) {
      phaseRef.current = "drop";
      setPhase("drop");
    }
    if (!reduced) {
      playTick();
      if ("vibrate" in navigator) navigator.vibrate(8);
    }
  }

  return (
    <div className="open-scene">
      <p className="eyebrow">Jour 4</p>
      <h2 className="font-serif italic">Machine gacha</h2>
      <div className="gacha-stage" data-phase={phase} data-steps={steps}>
        <GiftPhoto src="stickers/jour-4/gacha-pastel.webp" alt="" className="gacha-still" />
        <div className="gacha-globe" aria-hidden>
          {PILLS.map((pill, index) => (
            <span
              key={pill.color}
              className="gacha-pill"
              style={{
                left: `${pill.x}%`,
                top: `${pill.y}%`,
                background: pill.color,
                transform: `translate(${Math.sin((angle + index * 40) / 28) * 7}px, ${Math.cos((angle + index * 20) / 24) * 6}px) rotate(${angle / 10}deg)`,
              }}
            />
          ))}
        </div>
        {phase === "crank" ? (
          <button
            type="button"
            className="gacha-knob"
            aria-label="Tourner le bouton"
            style={{ touchAction: "none" }}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              drag.current = { last: pointAngle(event), carry: 0 };
            }}
            onPointerMove={(event) => {
              if (!drag.current || phase !== "crank") return;
              const next = pointAngle(event);
              let delta = next - drag.current.last;
              if (delta > Math.PI) delta -= Math.PI * 2;
              if (delta < -Math.PI) delta += Math.PI * 2;
              drag.current.last = next;
              drag.current.carry += delta;
              const step = Math.PI / 4;
              while (drag.current.carry >= step) {
                drag.current.carry -= step;
                addStep(1);
              }
              while (drag.current.carry <= -step) {
                drag.current.carry += step;
                addStep(-1);
              }
            }}
            onPointerUp={() => {
              if (drag.current && Math.abs(drag.current.carry) < 0.2) addStep(1);
              drag.current = null;
            }}
          >
            <span className="gacha-rotor" style={{ transform: `rotate(${angle}deg)` }}>
              <span className="gacha-tab" />
            </span>
          </button>
        ) : null}
        {phase !== "crank" ? (
          <button
            type="button"
            className={`capsule-live ${phase === "held" || phase === "open" ? "is-held" : ""} ${phase === "open" ? "is-open" : ""}`}
            aria-label={phase === "drop" ? "Prendre la capsule" : "Ouvrir la capsule"}
            onClick={() => {
              if (phase === "drop") {
                setPhase("held");
                if (!reduced && "vibrate" in navigator) navigator.vibrate(10);
                return;
              }
              if (phase === "held") {
                setPhase("open");
                if (!reduced) {
                  playTick();
                  if ("vibrate" in navigator) navigator.vibrate(12);
                }
              }
            }}
          >
            <motion.span
              className="cap-half is-top"
              animate={{ rotate: phase === "open" ? -28 : 0, y: phase === "open" ? -16 : 0 }}
              transition={reduced ? { duration: 0 } : pop}
            >
              <GiftPhoto src="stickers/jour-4/gashapon-capsule.webp" alt="" className="cap-photo" />
            </motion.span>
            <motion.span
              className="cap-half is-bottom"
              animate={{ rotate: phase === "open" ? 24 : 0, y: phase === "open" ? 16 : 0 }}
              transition={reduced ? { duration: 0 } : pop}
            >
              <GiftPhoto src="stickers/jour-4/gashapon-capsule.webp" alt="" className="cap-photo" />
            </motion.span>
            {phase === "open" ? (
              <motion.span className="cap-prize" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <GiftPhoto src="stickers/jour-4/ic-12640.webp" alt="" className="cap-charm" />
              </motion.span>
            ) : null}
          </button>
        ) : null}
      </div>
      <p className="open-caption">{hint(phase)}</p>
      {phase === "open" && note ? <p className="open-kicker">{note}</p> : null}
      <p className="open-caption">{giftFor(4)}</p>
      <div className="open-actions">
        {phase === "open" ? (
          <button
            type="button"
            className="btn-line"
            onClick={() => {
              setAngle(0);
              stepsRef.current = 0;
              phaseRef.current = "crank";
              setSteps(0);
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
