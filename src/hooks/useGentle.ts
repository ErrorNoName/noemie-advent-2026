import { useReducedMotion } from "framer-motion";

export function useGentle() {
  const reduced = useReducedMotion() ?? false;
  return {
    reduced,
    pop: reduced
      ? ({ duration: 0 } as const)
      : ({ type: "spring", stiffness: 280, damping: 18 } as const),
    fade: reduced ? ({ duration: 0 } as const) : ({ duration: 0.45 } as const),
  };
}
