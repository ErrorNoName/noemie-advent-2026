import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { useGentle } from "../hooks/useGentle.ts";
import { publicUrl } from "../lib/publicUrl.ts";

type Phase = "sealed" | "tear" | "rise" | "away";

const HERO = "stickers/jour-1/labubu-popmart.webp";

function edge(x0: number, x1: number, y: number, count: number, depth: number): Array<[number, number]> {
  const step = (x1 - x0) / count;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= count; i += 1) {
    const x = x0 + step * i;
    const tooth = i % 2 === 0 ? 0 : depth;
    pts.push([Math.round(x * 10) / 10, Math.round((y + tooth) * 10) / 10]);
  }
  return pts;
}

function trace(pts: Array<[number, number]>, move: boolean): string {
  return pts.map(([x, y], index) => `${index === 0 && move ? "M" : "L"}${x} ${y}`).join(" ");
}

const TOP = edge(36, 224, 46, 18, 8);
const BOTTOM = edge(226, 34, 276, 18, 8);

const BAG = [
  trace(TOP, true),
  "C 246 108 248 196 226 258",
  trace(BOTTOM, false),
  "C 14 196 12 108 36 54",
  "Z",
].join(" ");

const TOP_LINE = TOP.map(([x, y]) => `${x},${y}`).join(" ");
const BOTTOM_LINE = BOTTOM.map(([x, y]) => `${x},${y}`).join(" ");

const SPARKS = [
  { left: "6%", top: "12%", delay: 0 },
  { left: "78%", top: "8%", delay: 0.18 },
  { left: "84%", top: "62%", delay: 0.32 },
  { left: "4%", top: "68%", delay: 0.1 },
  { left: "48%", top: "0%", delay: 0.24 },
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
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 1, 0.35, 1], scale: [0.35, 1, 0.7, 1], rotate: [0, 18, 0] }}
          transition={{ duration: 1.7, delay: spark.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M10 1.2 11.7 7.4 18 8.4 11.8 10.6 10 17.2 8.1 10.6 2 8.4 8.2 7.4Z" fill="#fff" />
        </motion.svg>
      ))}
    </div>
  );
}

export function FoilBag({ onClear }: { onClear: () => void }) {
  const uid = useId().replace(/:/g, "");
  const { reduced } = useGentle();
  const need = reduced ? 1 : 3;
  const [shakes, setShakes] = useState(0);
  const [phase, setPhase] = useState<Phase>("sealed");
  const [shine, setShine] = useState({ x: 36, y: 30 });
  const stageRef = useRef<HTMLDivElement>(null);
  const wobble = useAnimation();
  const lastShake = useRef(0);
  const cleared = useRef(false);
  const shakesRef = useRef(0);
  const bumpRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const onTilt = (event: DeviceOrientationEvent) => {
      const gamma = event.gamma ?? 0;
      const beta = event.beta ?? 45;
      setShine({
        x: 50 + Math.max(-24, Math.min(24, gamma)) * 0.7,
        y: 34 + Math.max(-20, Math.min(20, beta - 45)) * 0.45,
      });
    };
    window.addEventListener("deviceorientation", onTilt);
    return () => window.removeEventListener("deviceorientation", onTilt);
  }, []);

  useEffect(() => {
    if (phase !== "sealed") return;
    const onMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;
      const magnitude = Math.abs(acc.x ?? 0) + Math.abs(acc.y ?? 0) + Math.abs(acc.z ?? 0);
      const now = Date.now();
      if (magnitude < 24 || now - lastShake.current < 320) return;
      lastShake.current = now;
      bumpRef.current();
    };
    window.addEventListener("devicemotion", onMotion);
    return () => window.removeEventListener("devicemotion", onMotion);
  }, [phase]);

  useEffect(() => {
    bumpRef.current = () => {
      const next = Math.min(need, shakesRef.current + 1);
      shakesRef.current = next;
      setShakes(next);
      if (next >= need) setPhase((current) => (current === "sealed" ? "tear" : current));
      if (!reduced && "vibrate" in navigator) navigator.vibrate(10);
      void wobble.start({
        rotate: [0, -7, 8, -5, 4, 0],
        scale: [1, 1.035, 0.98, 1],
        transition: { duration: reduced ? 0 : 0.46 },
      });
    };
  }, [need, reduced, wobble]);

  useEffect(() => {
    if (phase === "sealed" || phase === "away") return;
    const delay = reduced ? 0 : phase === "tear" ? 720 : 980;
    const id = window.setTimeout(() => {
      setPhase(phase === "tear" ? "rise" : "away");
    }, delay);
    return () => window.clearTimeout(id);
  }, [phase, reduced]);

  useEffect(() => {
    if (phase !== "away" || cleared.current) return;
    cleared.current = true;
    onClear();
  }, [onClear, phase]);

  function askMotion() {
    const motionEvent = DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof motionEvent.requestPermission === "function") {
      void motionEvent.requestPermission().catch(() => undefined);
    }
  }

  function trackShine(event: PointerEvent<HTMLDivElement>) {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    setShine({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  const metal = `foil-metal-${uid}`;
  const shineId = `foil-shine-${uid}`;
  const noise = `foil-noise-${uid}`;
  const clip = `foil-clip-${uid}`;
  const shown = phase === "rise" || phase === "away";

  return (
    <div
      ref={stageRef}
      className={`foil-stage ${phase === "away" ? "is-clear" : ""}`}
      style={{ "--sx": `${shine.x}%`, "--sy": `${shine.y}%` } as CSSProperties}
      onPointerMove={trackShine}
      data-phase={phase}
    >
      <AnimatePresence>
        {phase !== "away" ? (
          <motion.button
            key="pouch"
            type="button"
            className="foil-hit"
            aria-label="Secouer la pochette"
            animate={wobble}
            exit={{ y: 210, opacity: 0, rotate: 12, scale: 0.86 }}
            transition={{ type: "spring", stiffness: 140, damping: 16 }}
            onPointerDown={askMotion}
            onClick={() => {
              if (phase === "sealed") bumpRef.current();
            }}
          >
            <div className={phase === "sealed" ? "foil-float" : "foil-float is-still"}>
              <svg viewBox="0 0 260 318" className="foil-svg" role="img" aria-label="Pochette Noémie Gift">
                <defs>
                  <linearGradient id={metal} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fbfcfd" />
                    <stop offset="16%" stopColor="#d7dee6" />
                    <stop offset="34%" stopColor="#f7f8fa" />
                    <stop offset="50%" stopColor="#a9b3bf" />
                    <stop offset="66%" stopColor="#eef1f5" />
                    <stop offset="82%" stopColor="#c5ced8" />
                    <stop offset="100%" stopColor="#f4f6f8" />
                  </linearGradient>
                  <radialGradient id={shineId} cx={`${shine.x}%`} cy={`${shine.y}%`} r="46%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
                    <stop offset="28%" stopColor="#ffffff" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                  <filter id={noise} x="0" y="0" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="5" />
                    <feColorMatrix type="saturate" values="0" />
                  </filter>
                  <clipPath id={clip}>
                    <path d={BAG} />
                  </clipPath>
                </defs>
                <path d={BAG} fill={`url(#${metal})`} />
                <g clipPath={`url(#${clip})`}>
                  <rect width="260" height="318" filter={`url(#${noise})`} opacity="0.42" style={{ mixBlendMode: "multiply" }} />
                </g>
                <path d={BAG} fill={`url(#${shineId})`} style={{ mixBlendMode: "screen" }} />
                <path d={BAG} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.4" />
                <polyline points={BOTTOM_LINE} fill="none" stroke="#f7f8fa" strokeWidth="8" strokeLinejoin="miter" />
                <polyline points={BOTTOM_LINE} fill="none" stroke="#7f8b99" strokeWidth="1.15" strokeLinejoin="miter" />
                {shown ? <path d="M78 86c18 22 86 22 104 0l-8 18c-22 16-66 16-88 0Z" fill="#2a3138" /> : null}
                <motion.g
                  animate={phase === "sealed" ? { y: 0, opacity: 1, rotate: 0 } : { y: -70, x: 28, rotate: -14, opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.66, ease: [0.2, 0.75, 0.2, 1] }}
                  style={{ transformOrigin: "130px 42px" }}
                >
                  <polyline points={TOP_LINE} fill="none" stroke="#fbfcfd" strokeWidth="9" strokeLinejoin="miter" />
                  <polyline points={TOP_LINE} fill="none" stroke="#6f7c8a" strokeWidth="1.2" strokeLinejoin="miter" />
                </motion.g>
                <g fill="none" stroke="#161616" strokeWidth="2.05" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M96 118c1-18 14-24 20-12" />
                  <path d="M146 106c6-14 18-10 18 10" />
                  <ellipse cx="130" cy="146" rx="34" ry="30" />
                  <circle cx="118" cy="144" r="1.7" fill="#161616" stroke="none" />
                  <circle cx="144" cy="144" r="1.7" fill="#161616" stroke="none" />
                  <path d="M108 154h7" />
                  <path d="M146 154h7" />
                  <path d="M122 160c3.2 3.4 10 3.4 13.2 0" />
                  <path d="M108 172c6 14 38 14 44 0" />
                  <path d="M104 176c-8 6-6 14 2 16" />
                  <path d="M156 176c8 6 6 14-2 16" />
                  <rect x="114" y="184" width="32" height="22" rx="1.5" />
                  <path d="M130 184v22M114 194h32" />
                  <path d="M130 184c-7-8-14-4-12 1 5 1 9 1 12-1z" />
                  <path d="M130 184c7-8 14-4 12 1-5 1-9 1-12-1z" />
                </g>
                <text
                  x="130"
                  y="232"
                  textAnchor="middle"
                  fill="#161616"
                  fontFamily="Outfit, sans-serif"
                  fontSize="18"
                  fontWeight="650"
                  letterSpacing="0.4"
                >
                  Noémie Gift
                </text>
              </svg>
            </div>
          </motion.button>
        ) : null}
      </AnimatePresence>
      {shown ? (
        <motion.div
          className="foil-prize"
          initial={{ y: 86, opacity: 0, scale: 0.72 }}
          animate={{ y: phase === "away" ? 0 : 18, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 170, damping: 15 }}
        >
          <img src={publicUrl(HERO)} alt="Petite figurine" draggable={false} />
          <Sparkles />
        </motion.div>
      ) : null}
      {phase === "sealed" ? (
        <div
          className="foil-pips"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={need}
          aria-valuenow={shakes}
          aria-label="Secousses"
        >
          {Array.from({ length: need }, (_, index) => (
            <span key={index} className={index < shakes ? "is-on" : ""} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
