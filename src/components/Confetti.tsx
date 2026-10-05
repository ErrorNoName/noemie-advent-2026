import { motion, useReducedMotion } from "framer-motion";

const COLORS = ["#7eb6ff", "#e56b8a", "#fff6ee", "#ffd0e0", "#c5deff", "#f4a4b8", "#fff"];

export function Confetti({ burst }: { burst: number }) {
  const reduced = useReducedMotion();
  if (!burst || reduced) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {Array.from({ length: 26 }, (_, index) => (
        <motion.span
          key={`${burst}-${index}`}
          className="confetti-bit"
          style={{
            left: `${(index * 37) % 100}%`,
            background: COLORS[index % COLORS.length],
            borderRadius: index % 3 === 0 ? "50%" : "2px",
            width: index % 2 === 0 ? 8 : 6,
            height: index % 2 === 0 ? 12 : 8,
          }}
          initial={{ y: -24, rotate: 0, opacity: 1 }}
          animate={{ y: "105vh", rotate: 240 + index * 18, opacity: 0 }}
          transition={{ duration: 1.5 + (index % 5) * 0.12, ease: "easeOut", delay: (index % 7) * 0.02 }}
        />
      ))}
    </div>
  );
}
