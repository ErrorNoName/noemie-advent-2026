import { useId } from "react";

export function BalloonDigit({ digit }: { digit: string }) {
  const id = `foil${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 90 124" className="balloon-digit" aria-hidden>
      <defs>
        <linearGradient id={id} x1="18%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#f7fcff" />
          <stop offset="24%" stopColor="#9fd4ff" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="74%" stopColor="#1e4ed8" />
          <stop offset="100%" stopColor="#c5e4ff" />
        </linearGradient>
      </defs>
      <text
        x="45"
        y="62"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Fredoka, Outfit, sans-serif"
        fontSize="82"
        fontWeight="700"
        fill={`url(#${id})`}
        stroke="#14357a"
        strokeWidth="5"
        paintOrder="stroke fill"
      >
        {digit}
      </text>
      <ellipse cx="30" cy="38" rx="11" ry="6" fill="white" opacity="0.42" transform="rotate(-28 30 38)" />
      <path d="M45 104c-2 8-8 14-16 18" fill="none" stroke="#8eb6ef" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
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

export function RoundBalloon({
  className,
  color,
}: {
  className?: string;
  color: string;
}) {
  return (
    <svg viewBox="0 0 80 120" className={className} aria-hidden>
      <ellipse cx="40" cy="46" rx="26" ry="32" fill={color} />
      <ellipse cx="30" cy="32" rx="8" ry="5" fill="#fff" opacity="0.45" transform="rotate(-24 30 32)" />
      <path d="M40 76 L35 86 H45 Z" fill={color} />
      <path d="M40 86 C38 98 30 108 26 116" fill="none" stroke="#b9c6d6" strokeWidth="1.4" />
    </svg>
  );
}
