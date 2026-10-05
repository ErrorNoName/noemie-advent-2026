import type { CSSProperties } from "react";

const PALETTE: Record<number, { box: string; side: string; lid: string; ribbon: string; bow: string }> = {
  1: { box: "#f6c6d6", side: "#e7a9be", lid: "#ffe6ef", ribbon: "#d5dee8", bow: "#f7fbff" },
  2: { box: "#ffd0b8", side: "#f0b498", lid: "#ffe8da", ribbon: "#fff6ee", bow: "#ffe0d0" },
  3: { box: "#e7d4f6", side: "#d0b6e8", lid: "#f6eefc", ribbon: "#f4a4b8", bow: "#fff0f4" },
  4: { box: "#fff1e4", side: "#f3d7c4", lid: "#fff8f1", ribbon: "#e23b3b", bow: "#ffd5d8" },
  5: { box: "#d7f0ec", side: "#b7ddd8", lid: "#f3fffd", ribbon: "#9aa8b8", bow: "#fff" },
  6: { box: "#ffe7a8", side: "#f0cf78", lid: "#fff6d8", ribbon: "#f4a4b8", bow: "#fff0f4" },
  7: { box: "#e7ebf3", side: "#c5ceda", lid: "#f7f8fb", ribbon: "#f4a4b8", bow: "#fff" },
  8: { box: "#c5deff", side: "#9cc4f5", lid: "#e7f2ff", ribbon: "#3b82f6", bow: "#fff" },
};

export function Present({
  day,
  open,
  available,
  locked,
  shaking,
  large,
}: {
  day: number;
  open: boolean;
  available?: boolean;
  locked?: boolean;
  shaking?: boolean;
  large?: boolean;
}) {
  const palette = PALETTE[day] ?? PALETTE[1];
  const style = {
    "--box": palette.box,
    "--side": palette.side,
    "--lid": palette.lid,
    "--ribbon": palette.ribbon,
    "--bow": palette.bow,
  } as CSSProperties;

  return (
    <div className={`present-bob ${available ? "is-available" : ""} ${shaking ? "is-shaking" : ""}`}>
      <div className={`present-scale ${large ? "is-large" : ""}`}>
        <div className={`present ${open ? "is-open" : ""}`} style={style}>
          <span className="p-shadow" />
          <span className="p-side" />
          <span className="p-front">
            <span className="p-ribbon-v" />
            <span className="p-num">{day}</span>
          </span>
          <span className="p-lid">
            <span className="p-lid-top" />
            <span className="p-bow">
              <span className="p-knot" />
            </span>
          </span>
          {locked ? (
            <span className="lock-badge" aria-hidden>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
                <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 10 V8 a4 4 0 0 1 8 0 v2" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </span>
          ) : null}
          {open ? (
            <span className="open-heart" aria-hidden>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
                <path
                  d="M12 19s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z"
                  fill="currentColor"
                />
              </svg>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
