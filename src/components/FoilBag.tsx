import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { useGentle } from "../hooks/useGentle.ts";
import { publicUrl } from "../lib/publicUrl.ts";

type Phase = "sealed" | "open";

const POUCH = "stickers/jour-1/noemie-foil-pouch.jpg";
const HERO = "stickers/jour-1/labubu-popmart.webp";

const SPARKS = [
  { left: "12%", top: "16%", delay: 0 },
  { left: "74%", top: "12%", delay: 0.16 },
  { left: "80%", top: "58%", delay: 0.28 },
  { left: "16%", top: "64%", delay: 0.08 },
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
          animate={{ opacity: [0, 1, 0.4, 1], scale: [0.4, 1, 0.7, 1] }}
          transition={{ duration: 1.6, delay: spark.delay, repeat: Infinity, ease: "easeInOut" }}
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
  const [shine, setShine] = useState({ x: 42, y: 28 });
  const stageRef = useRef<HTMLDivElement>(null);
  const wobble = useAnimation();
  const lastShake = useRef(0);
  const cleared = useRef(false);
  const shakesRef = useRef(0);
  const bumpRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    bumpRef.current = () => {
      if (phase !== "sealed") return;
      const next = shakesRef.current + 1;
      shakesRef.current = next;
      setShakes(next);
      if (!reduced && "vibrate" in navigator) navigator.vibrate(10);
      void wobble.start({
        rotate: [0, -2.5, 2.2, -1.2, 0],
        scale: [1, 1.03, 0.98, 1],
        transition: { duration: reduced ? 0 : 0.42 },
      });
      if (next >= need) {
        setPhase("open");
        if (!cleared.current) {
          cleared.current = true;
          onClear();
        }
      }
    };
  }, [need, onClear, phase, reduced, wobble]);

  useEffect(() => {
    const onTilt = (event: DeviceOrientationEvent) => {
      const gamma = event.gamma ?? 0;
      const beta = event.beta ?? 0;
      setShine({
        x: Math.round(42 + Math.max(-18, Math.min(18, gamma)) * 0.6),
        y: Math.round(28 + Math.max(-20, Math.min(20, beta - 40)) * 0.35),
      });
    };
    const onMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;
      const mag = Math.abs(acc.x ?? 0) + Math.abs(acc.y ?? 0) + Math.abs(acc.z ?? 0);
      const now = Date.now();
      if (mag > 28 && now - lastShake.current > 360) {
        lastShake.current = now;
        bumpRef.current();
      }
    };
    window.addEventListener("deviceorientation", onTilt);
    window.addEventListener("devicemotion", onMotion);
    return () => {
      window.removeEventListener("deviceorientation", onTilt);
      window.removeEventListener("devicemotion", onMotion);
    };
  }, []);

  function aim(event: ReactPointerEvent<HTMLButtonElement>) {
    const box = stageRef.current?.getBoundingClientRect();
    if (!box) return;
    setShine({
      x: Math.round(((event.clientX - box.left) / box.width) * 100),
      y: Math.round(((event.clientY - box.top) / box.height) * 100),
    });
  }

  function askMotion() {
    const motion = DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof motion.requestPermission === "function") {
      void motion.requestPermission().catch(() => undefined);
    }
  }

  const shineStyle = { "--sx": `${shine.x}%`, "--sy": `${shine.y}%` } as CSSProperties;

  return (
    <div className={`foil-stage ${phase === "open" ? "is-open" : ""}`} ref={stageRef} data-phase={phase}>
      <AnimatePresence>
        {phase === "sealed" ? (
          <motion.button
            key="pouch"
            type="button"
            className="foil-hit foil-float"
            aria-label="Secouer la pochette Noémie Gift"
            animate={wobble}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: reduced ? 0 : 0.45, ease: [0.4, 0, 0.2, 1] }}
            onPointerDown={askMotion}
            onPointerMove={aim}
            onClick={() => bumpRef.current()}
          >
            <img src={publicUrl(POUCH)} alt="" draggable={false} />
            <span className="foil-shine" style={shineStyle} aria-hidden />
          </motion.button>
        ) : (
          <motion.div
            key="prize"
            className="foil-prize"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reduced ? { duration: 0 } : { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <img src={publicUrl(HERO)} alt="Figurine" draggable={false} />
            <Sparkles />
          </motion.div>
        )}
      </AnimatePresence>
      {phase === "sealed" ? (
        <div className="foil-pips" aria-hidden>
          {Array.from({ length: need }, (_, index) => (
            <span key={index} className={index < shakes ? "is-on" : ""} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
