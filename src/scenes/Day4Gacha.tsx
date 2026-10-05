import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MiniTicket } from "../components/MiniTicket.tsx";
import { useGentle } from "../hooks/useGentle.ts";
import { giftFor } from "../data/days.ts";
import { useCloseScene } from "./scene-context.ts";

const NOTES = [
  "Tu es ma personne préférée.",
  "Pour les mots qu’on ne dit pas tout haut.",
  "Garde ce papier pour un jour mou.",
];

type Phase = "idle" | "coin" | "spin" | "drop" | "capsule" | "open";

function buttonLabel(phase: Phase): string {
  switch (phase) {
    case "idle":
      return "Glisser une pièce";
    case "coin":
    case "spin":
    case "drop":
      return "Ça tourne…";
    case "capsule":
      return "Ouvrir la capsule";
    case "open":
      return "Encore une pièce";
    default: {
      const unexpected: never = phase;
      return unexpected;
    }
  }
}

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export function Day4() {
  const close = useCloseScene();
  const { reduced } = useGentle();
  const [phase, setPhase] = useState<Phase>("idle");
  const [turns, setTurns] = useState(0);
  const [noteIndex, setNoteIndex] = useState(0);
  const busy = useRef(false);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  async function play() {
    if (busy.current) return;
    if (phase === "capsule") {
      setPhase("open");
      return;
    }
    if (phase === "open") {
      setPhase("idle");
      setNoteIndex((index) => (index + 1) % NOTES.length);
      return;
    }
    busy.current = true;
    setPhase("coin");
    await wait(reduced ? 0 : 600);
    if (!alive.current) return;
    setPhase("spin");
    setTurns((value) => value + 4);
    await wait(reduced ? 0 : 1200);
    if (!alive.current) return;
    setPhase("drop");
    await wait(reduced ? 0 : 650);
    if (!alive.current) return;
    setPhase("capsule");
    busy.current = false;
  }

  const note = NOTES[noteIndex] ?? NOTES[0];
  const spinning = phase === "coin" || phase === "spin" || phase === "drop";

  return (
    <div>
      <p className="eyebrow text-center">Jour 4</p>
      <h2 className="mt-1 text-center font-serif text-4xl italic">Machine gacha</h2>
      <p className="mt-1 text-center text-mute">Quand tu es prête.</p>
      <div className="gacha mt-4">
        <div className="gacha-cap" />
        <div className="gacha-body">
          <div className="gacha-window">
            <div className="gacha-poster">
              <p className="font-balloon text-[1.15rem] leading-[0.9] font-bold text-[#e23b3b]">
                OPEN
                <br />
                WHEN
                <br />
                YOU’RE
                <br />
                READY.
              </p>
            </div>
            <div className="gacha-star" aria-hidden>
              ✦
            </div>
            <div className="gacha-caps" aria-hidden>
              <i className="cap pink c1" />
              <i className="cap white c2" />
              <i className="cap mint c3" />
              <i className="cap pink c4" />
              <i className="cap white c5" />
            </div>
          </div>
          <div className="gacha-controls">
            <div className="gacha-price" aria-hidden>
              200
            </div>
            <div className="gacha-slot" />
            <motion.div
              className="gacha-dial"
              animate={{ rotate: turns * 360 }}
              transition={reduced ? { duration: 0 } : { duration: 1.15, ease: [0.4, 0, 0.2, 1] }}
            >
              <span className="gacha-knob" />
              <span className="gacha-core" />
            </motion.div>
          </div>
          <div className="gacha-tray">
            <AnimatePresence>
              {phase === "coin" ? (
                <motion.span
                  key="coin"
                  className="absolute top-0 h-4 w-4 rounded-full bg-[#f4c96b]"
                  initial={{ y: -28, opacity: 1 }}
                  animate={{ y: 18, opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.55 }}
                />
              ) : null}
              {phase === "capsule" || phase === "drop" ? (
                <motion.span
                  key="ball"
                  className="cap pink"
                  style={{ position: "relative" }}
                  initial={{ y: -70, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 14 }}
                />
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center gap-3">
        {phase === "open" && note ? (
          <MiniTicket kicker="dans la capsule">{note}</MiniTicket>
        ) : (
          <p className="text-center text-sm text-mute">
            {phase === "capsule" ? "Elle est tombée. À toi de l’ouvrir." : "Une pièce imaginaire. Un vrai petit vertige."}
          </p>
        )}
        <button type="button" className="btn-ink" onClick={() => void play()} disabled={spinning}>
          {buttonLabel(phase)}
        </button>
        <button type="button" className="btn-ghost" onClick={close}>
          Revenir aux cases
        </button>
      </div>
      <p className="mt-3 text-center text-sm text-mute">{giftFor(4)}</p>
    </div>
  );
}
