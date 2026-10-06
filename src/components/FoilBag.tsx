import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useGentle } from "../hooks/useGentle.ts";
import { playCrinkle } from "../lib/touchSound.ts";
import { publicUrl } from "../lib/publicUrl.ts";

type Phase = "sealed" | "tear" | "rise" | "away";

const POUCH = "stickers/jour-1/noemie-foil-pouch.jpg";
const HERO = "stickers/jour-1/labubu-popmart.webp";

const SPARKS = [
  { left: "14%", top: "18%", delay: 0 },
  { left: "72%", top: "14%", delay: 0.14 },
  { left: "78%", top: "56%", delay: 0.26 },
  { left: "18%", top: "62%", delay: 0.08 },
];

function Sparkles() {
  return (
    <div className="sparkles" aria-hidden>
      {SPARKS.map((spark) => (
        <motion.svg
          key={`${spark.left}-${spark.top}`}
          viewBox="0 0 20 20"
          className="spark"
          style={{ left: spark.left, top: spark.top }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 1, 0.35, 1], scale: [0.4, 1, 0.7, 1] }}
          transition={{ duration: 1.5, delay: spark.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M10 1.2 11.7 7.4 18 8.4 11.8 10.6 10 17.2 8.1 10.6 2 8.4 8.2 7.4Z" fill="#fff" />
        </motion.svg>
      ))}
    </div>
  );
}

export function FoilBag({ onClear }: { onClear: () => void }) {
  const { reduced } = useGentle();
  const need = reduced ? 1 : 3;
  const [shakes, setShakes] = useState(0);
  const [phase, setPhase] = useState<Phase>("sealed");
  const [pose, setPose] = useState({ rotate: 0, sx: 1, sy: 1 });
  const stageRef = useRef<HTMLDivElement>(null);
  const seal = useAnimation();
  const lastShake = useRef(0);
  const cleared = useRef(false);
  const shakesRef = useRef(0);
  const phaseRef = useRef<Phase>("sealed");
  const bumpRef = useRef<(x: number, _y: number, sound: boolean) => void>(() => undefined);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const bucket = timers.current;
    return () => {
      for (const id of bucket) window.clearTimeout(id);
    };
  }, []);

  useEffect(() => {
    bumpRef.current = (clientX, _clientY, sound) => {
      if (phaseRef.current !== "sealed") return;
      const box = stageRef.current?.getBoundingClientRect();
      const nx = box && box.width > 0 ? (clientX - box.left) / box.width - 0.5 : 0;
      if (sound && !reduced) playCrinkle();
      if (!reduced && "vibrate" in navigator) navigator.vibrate(12);

      const next = shakesRef.current + 1;
      shakesRef.current = next;
      setShakes(next);
      if (next < need) {
        setPose({ rotate: nx * 12, sx: 1.08, sy: 0.84 });
        void seal.start({
          y: [0, -14, 0],
          scaleY: [1, 1.65, 1],
          transition: { duration: reduced ? 0 : 0.46, times: [0, 0.32, 1] },
        });
        const settle = window.setTimeout(() => setPose({ rotate: 0, sx: 1, sy: 1 }), reduced ? 0 : 240);
        timers.current.push(settle);
        return;
      }

      setPose({ rotate: nx * 6, sx: 0.96, sy: 1.1 });
      void seal.start({ y: -18, scaleY: 1.85, transition: { duration: reduced ? 0 : 0.28 } });
      phaseRef.current = "tear";
      setPhase("tear");
      const peel = window.setTimeout(() => {
        void seal.start({
          y: -120,
          x: 26,
          rotate: -18,
          opacity: 0,
          scaleY: 1,
          transition: { duration: reduced ? 0 : 0.5, ease: [0.4, 0, 0.2, 1] },
        });
      }, reduced ? 0 : 300);
      timers.current.push(peel);
      const riseAt = window.setTimeout(() => {
        phaseRef.current = "rise";
        setPhase("rise");
      }, reduced ? 0 : 680);
      const awayAt = window.setTimeout(() => {
        phaseRef.current = "away";
        setPhase("away");
        if (!cleared.current) {
          cleared.current = true;
          onClear();
        }
      }, reduced ? 0 : 1500);
      timers.current.push(riseAt, awayAt);
    };
  }, [need, onClear, reduced, seal]);

  useEffect(() => {
    const onMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;
      const mag = Math.abs(acc.x ?? 0) + Math.abs(acc.y ?? 0) + Math.abs(acc.z ?? 0);
      const now = Date.now();
      if (mag > 28 && now - lastShake.current > 380) {
        lastShake.current = now;
        const box = stageRef.current?.getBoundingClientRect();
        bumpRef.current(box ? box.left + box.width / 2 : 0, box ? box.top + box.height / 2 : 0, false);
      }
    };
    window.addEventListener("devicemotion", onMotion);
    return () => window.removeEventListener("devicemotion", onMotion);
  }, []);

  function askMotion() {
    const motionEvent = DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof motionEvent.requestPermission === "function") {
      void motionEvent.requestPermission().catch(() => undefined);
    }
  }

  const pouchGone = phase === "away";
  const prizeUp = phase === "rise" || phase === "away";
  const pouchSrc = publicUrl(POUCH);

  return (
    <div className="foil-live">
    <div className="foil-stage" ref={stageRef} data-phase={phase}>
      <motion.img
        className="foil-figurine"
        src={publicUrl(HERO)}
        alt={prizeUp ? "Figurine" : ""}
        draggable={false}
        initial={false}
        animate={prizeUp ? { y: 0, opacity: 1 } : { y: 86, opacity: 0 }}
        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 16 }}
      />
      {prizeUp ? <Sparkles /> : null}
      <motion.div
        className="foil-pouch"
        initial={false}
        animate={
          pouchGone
            ? { y: 210, opacity: 0, rotate: 10, scale: 0.9 }
            : { y: 0, opacity: 1, rotate: pose.rotate, scaleX: pose.sx, scaleY: pose.sy }
        }
        transition={
          pouchGone
            ? { duration: reduced ? 0 : 0.55, ease: [0.4, 0, 0.2, 1] }
            : { type: "spring", stiffness: 460, damping: 14 }
        }
      >
        <button
          type="button"
          className="foil-hit"
          aria-label="Secouer la pochette Noémie Gift"
          onPointerDown={askMotion}
          onClick={(event) => bumpRef.current(event.clientX, event.clientY, true)}
        >
          <img className="foil-photo foil-body" src={pouchSrc} alt="" draggable={false} />
          <motion.img
            className="foil-photo foil-seal"
            src={pouchSrc}
            alt=""
            draggable={false}
            animate={seal}
            initial={{ y: 0, scaleY: 1, opacity: 1 }}
          />
        </button>
      </motion.div>
    </div>
      {phase === "sealed" ? (
        <div className="foil-pips" aria-hidden>
          {Array.from({ length: 3 }, (_, index) => (
            <span key={index} className={index < (reduced ? shakes * 3 : shakes) ? "is-on" : ""} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
