import { DOOR } from "../data/art.ts";
import { publicUrl } from "../lib/publicUrl.ts";

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
  const src = DOOR[day] ?? DOOR[1] ?? "";
  return (
    <div
      className={`parcel ${open ? "is-open" : ""} ${available ? "is-available" : ""} ${shaking ? "is-shaking" : ""} ${large ? "is-large" : ""} ${locked ? "is-locked" : ""}`}
    >
      <img src={publicUrl(src)} alt="" className="parcel-cut" draggable={false} />
      <span className="parcel-num">{day}</span>
      {locked ? (
        <span className="lock-badge" aria-hidden>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
            <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 10 V8 a4 4 0 0 1 8 0 v2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </span>
      ) : null}
    </div>
  );
}
