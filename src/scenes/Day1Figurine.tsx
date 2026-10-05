import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChromeBlobs } from "../components/ChromeBlobs.tsx";
import { Figurine } from "../components/illustrations.tsx";
import { useGentle } from "../hooks/useGentle.ts";
import { giftFor, teaserFor } from "../data/days.ts";
import { useCloseScene } from "./scene-context.ts";

type Step = "shadow" | "pouch" | "reveal";

export function Day1() {
  const close = useCloseScene();
  const { reduced, pop } = useGentle();
  const need = reduced ? 1 : 6;
  const [step, setStep] = useState<Step>("shadow");
  const [power, setPower] = useState(0);
  const lastShake = useRef(0);

  useEffect(() => {
    if (step !== "pouch" || reduced) return;
    const onMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;
      const magnitude = Math.abs(acc.x ?? 0) + Math.abs(acc.y ?? 0) + Math.abs(acc.z ?? 0);
      const now = Date.now();
      if (magnitude < 22 || now - lastShake.current < 280) return;
      lastShake.current = now;
      setPower((value) => Math.min(need, value + 1));
    };
    window.addEventListener("devicemotion", onMotion);
    return () => window.removeEventListener("devicemotion", onMotion);
  }, [need, reduced, step]);

  useEffect(() => {
    if (step !== "pouch" || power < need) return;
    const id = window.setTimeout(() => setStep("reveal"), reduced ? 0 : 420);
    return () => window.clearTimeout(id);
  }, [need, power, reduced, step]);

  return (
    <div className="relative">
      <p className="eyebrow text-center">Jour 1</p>
      <h2 className="mt-1 text-center font-serif text-4xl italic">Figurine surprise</h2>
      <AnimatePresence mode="wait">
        {step === "shadow" ? (
          <motion.div key="shadow" className="mystery mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mx-auto w-40">
              <Figurine className="mystery-fig" label="Silhouette encore secrète" />
            </div>
            <p className="mt-2 font-serif text-2xl italic">{teaserFor(1)}</p>
            <p className="mt-1 text-sm text-white/70">Pas encore de nom. Juste une forme.</p>
            <button
              type="button"
              className="btn-ink mt-5"
              onClick={() => {
                const motionEvent = DeviceMotionEvent as unknown as {
                  requestPermission?: () => Promise<string>;
                };
                if (typeof motionEvent.requestPermission === "function") {
                  void motionEvent.requestPermission().catch(() => undefined);
                }
                setStep("pouch");
              }}
            >
              S’approcher
            </button>
          </motion.div>
        ) : null}
        {step === "pouch" ? (
          <motion.div key="pouch" className="relative mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ChromeBlobs />
            <p className="chrome-word relative text-center text-5xl">Unbox me</p>
            <p className="relative mt-1 text-center text-sm uppercase tracking-[0.16em] text-mute">Secoue un peu…</p>
            <button
              type="button"
              className="pouch-btn relative mt-4"
              onClick={() => setPower((value) => Math.min(need, value + 1))}
              aria-describedby="shake-help"
            >
              <motion.div
                className="pouch"
                key={power}
                animate={
                  power >= need
                    ? { rotate: 0, y: -8, scale: 1.04 }
                    : { rotate: [0, -7, 8, -5, 0] }
                }
                transition={reduced ? { duration: 0 } : { duration: 0.42 }}
              >
                <span className="pouch-seal">
                  <span className="font-serif text-lg italic text-mute">?</span>
                </span>
              </motion.div>
            </button>
            <p id="shake-help" className="mt-3 text-center text-sm text-mute">
              {reduced ? "Un toucher suffit." : "Tapote la pochette, ou secoue le téléphone."}
            </p>
            <div
              className="mx-auto mt-3 flex max-w-[180px] gap-1"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={need}
              aria-valuenow={power}
              aria-label="Secousses"
            >
              {Array.from({ length: need }, (_, index) => (
                <span
                  key={index}
                  className={`h-1.5 flex-1 rounded-full ${index < power ? "bg-rose" : "bg-white/80"}`}
                />
              ))}
            </div>
          </motion.div>
        ) : null}
        {step === "reveal" ? (
          <motion.div key="reveal" className="relative mt-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ChromeBlobs />
            <div className="reveal-disc">
              <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={pop}>
                <Figurine className="w-40" />
              </motion.div>
            </div>
            <p className="relative mt-4 text-center text-xs uppercase tracking-[0.2em] text-mute">pour toi · une seule</p>
            <p className="relative text-center font-serif text-2xl italic">Elle était là depuis le début.</p>
            <p className="relative mt-2 text-center text-sm text-mute">{giftFor(1)}</p>
            <div className="relative mt-5 flex justify-center gap-3">
              <button
                type="button"
                className="btn-line max-w-[140px]"
                onClick={() => {
                  setPower(0);
                  setStep("pouch");
                }}
              >
                Encore
              </button>
              <button type="button" className="btn-ink" onClick={close}>
                C’est doux
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
