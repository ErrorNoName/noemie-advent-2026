import { publicUrl } from "../lib/publicUrl.ts";

export function BalloonDigit({ digit }: { digit: string }) {
  const safe = /^[0-9]$/.test(digit) ? digit : "0";
  return (
    <img
      src={publicUrl(`timer/digit-${safe}.webp`)}
      alt=""
      className="balloon-digit"
      draggable={false}
    />
  );
}

export function BalloonColon() {
  return (
    <svg viewBox="0 0 22 124" className="balloon-colon" aria-hidden>
      <circle cx="11" cy="48" r="5.5" fill="#3b82f6" />
      <circle cx="11" cy="48" r="2" fill="#fff" opacity="0.7" />
      <circle cx="11" cy="74" r="5.5" fill="#3b82f6" />
      <circle cx="11" cy="74" r="2" fill="#fff" opacity="0.55" />
    </svg>
  );
}
