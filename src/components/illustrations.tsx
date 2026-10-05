type ArtProps = { className?: string; label?: string };

function svgProps(label: string | undefined, className: string | undefined) {
  if (label) {
    return { className, role: "img" as const, "aria-label": label };
  }
  return { className, "aria-hidden": true as const };
}

export function Figurine({ className, label = "Petite figurine" }: ArtProps) {
  return (
    <svg viewBox="0 0 200 230" {...svgProps(label, className)}>
      <ellipse cx="100" cy="208" rx="46" ry="10" fill="#d5dde6" />
      <ellipse cx="100" cy="196" rx="36" ry="12" fill="#eef2f6" stroke="#c5ced8" />
      <ellipse cx="62" cy="78" rx="16" ry="36" fill="#f6d7c8" />
      <ellipse cx="138" cy="78" rx="16" ry="36" fill="#f6d7c8" />
      <ellipse cx="62" cy="78" rx="8" ry="22" fill="#f8c2d0" />
      <ellipse cx="138" cy="78" rx="8" ry="22" fill="#f8c2d0" />
      <circle cx="100" cy="124" r="58" fill="#f7dccf" />
      <ellipse cx="100" cy="142" rx="34" ry="28" fill="#fff6ee" />
      <circle cx="78" cy="118" r="6" fill="#3a2a32" />
      <circle cx="122" cy="118" r="6" fill="#3a2a32" />
      <circle cx="80" cy="116" r="2" fill="#fff" />
      <circle cx="124" cy="116" r="2" fill="#fff" />
      <path d="M92 132 Q100 138 108 132" fill="none" stroke="#e58aa4" strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="66" cy="130" rx="8" ry="5" fill="#f4a0b8" opacity="0.85" />
      <ellipse cx="134" cy="130" rx="8" ry="5" fill="#f4a0b8" opacity="0.85" />
      <path d="M118 92 l8 4 -8 4 2-4z" fill="#7eb6ff" />
      <ellipse cx="74" cy="48" rx="10" ry="6" fill="#fff" opacity="0.7" transform="rotate(-20 74 48)" />
    </svg>
  );
}

export function Plush({ className, label = "Peluche" }: ArtProps) {
  return (
    <svg viewBox="0 0 220 230" {...svgProps(label, className)}>
      <ellipse cx="110" cy="210" rx="70" ry="12" fill="#f0c9d6" />
      <circle cx="58" cy="86" r="30" fill="#f3b7c8" />
      <circle cx="162" cy="86" r="30" fill="#f3b7c8" />
      <circle cx="58" cy="86" r="16" fill="#f8d5e0" />
      <circle cx="162" cy="86" r="16" fill="#f8d5e0" />
      <ellipse cx="110" cy="146" rx="78" ry="64" fill="#f6c3d2" />
      <ellipse cx="110" cy="158" rx="44" ry="36" fill="#fff4ea" stroke="#e7b3c2" strokeDasharray="4 4" />
      <circle cx="110" cy="108" r="52" fill="#f8d0dc" />
      <circle cx="92" cy="108" r="6.5" fill="#3a2a32" />
      <circle cx="128" cy="108" r="6.5" fill="#3a2a32" />
      <circle cx="94" cy="106" r="2" fill="#fff" />
      <circle cx="130" cy="106" r="2" fill="#fff" />
      <ellipse cx="110" cy="120" rx="7" ry="5" fill="#e58aa4" />
      <path d="M100 126 Q110 134 120 126" fill="none" stroke="#c96b86" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="74" cy="120" rx="9" ry="5" fill="#f099b0" opacity="0.8" />
      <ellipse cx="146" cy="120" rx="9" ry="5" fill="#f099b0" opacity="0.8" />
      <ellipse cx="110" cy="78" rx="14" ry="8" fill="#e56b8a" transform="rotate(-20 110 78)" />
      <ellipse cx="110" cy="78" rx="14" ry="8" fill="#ffb3c7" transform="rotate(25 110 78)" />
      <circle cx="110" cy="78" r="5" fill="#fff6ee" />
    </svg>
  );
}

export function Keychain({ className, label }: ArtProps) {
  return (
    <svg viewBox="0 0 120 140" {...svgProps(label, className)}>
      <circle cx="60" cy="22" r="12" fill="none" stroke="#c5ced8" strokeWidth="4" />
      <rect x="56" y="32" width="8" height="12" rx="2" fill="#c5ced8" />
      <circle cx="38" cy="70" r="14" fill="#f3b7c8" />
      <circle cx="82" cy="70" r="14" fill="#f3b7c8" />
      <circle cx="60" cy="84" r="32" fill="#f6c3d2" />
      <circle cx="48" cy="80" r="4" fill="#3a2a32" />
      <circle cx="72" cy="80" r="4" fill="#3a2a32" />
      <ellipse cx="60" cy="92" rx="6" ry="4" fill="#e58aa4" />
      <ellipse cx="60" cy="100" rx="16" ry="12" fill="#fff4ea" />
    </svg>
  );
}

export function Bouquet({ className, label = "Bouquet" }: ArtProps) {
  return (
    <svg viewBox="0 0 180 200" {...svgProps(label, className)}>
      <path d="M70 120 L90 190 L50 190 Z" fill="#e7c9a4" />
      <path d="M110 120 L130 190 L90 190 Z" fill="#f0d7b8" />
      <path d="M55 150 H125" stroke="#c9a27a" strokeWidth="3" />
      <line x1="70" y1="120" x2="48" y2="70" stroke="#7d9a62" strokeWidth="3" />
      <line x1="90" y1="118" x2="90" y2="52" stroke="#7d9a62" strokeWidth="3" />
      <line x1="108" y1="120" x2="132" y2="64" stroke="#7d9a62" strokeWidth="3" />
      <ellipse cx="48" cy="58" rx="12" ry="18" fill="#f4a0c0" />
      <ellipse cx="36" cy="70" rx="10" ry="14" fill="#ffd0e0" />
      <ellipse cx="60" cy="70" rx="10" ry="14" fill="#ffd0e0" />
      <circle cx="90" cy="48" r="16" fill="#ff8fb3" />
      <circle cx="80" cy="56" r="12" fill="#ffd0e0" />
      <circle cx="100" cy="56" r="12" fill="#ffd0e0" />
      <circle cx="90" cy="62" r="8" fill="#fff6ee" />
      <circle cx="132" cy="52" r="14" fill="#7eb6ff" />
      <circle cx="122" cy="62" r="10" fill="#d6e9ff" />
      <circle cx="142" cy="64" r="10" fill="#d6e9ff" />
      <circle cx="132" cy="70" r="6" fill="#fff" />
    </svg>
  );
}

export function Eclair({ className, label }: ArtProps) {
  return (
    <svg viewBox="0 0 140 70" {...svgProps(label, className)}>
      <ellipse cx="70" cy="40" rx="58" ry="18" fill="#f3d2a4" />
      <path d="M16 36 Q70 18 124 36 Q70 28 16 36" fill="#f6e2c4" />
      <path d="M18 34 Q70 14 122 34 Q70 26 18 34" fill="#6b422c" />
      <path d="M40 30 Q55 38 48 24" fill="none" stroke="#c6864a" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function CakeSlice({ className, label }: ArtProps) {
  return (
    <svg viewBox="0 0 120 100" {...svgProps(label, className)}>
      <path d="M20 40 L60 18 L100 40 L88 82 L32 82 Z" fill="#f0c3a0" />
      <path d="M28 46 L60 28 L92 46 L84 74 L36 74 Z" fill="#fff6ee" />
      <path d="M32 58 H88 L84 70 H36 Z" fill="#c6864a" />
      <circle cx="60" cy="34" r="6" fill="#e56b8a" />
    </svg>
  );
}

export function Sundae({ className, label }: ArtProps) {
  return (
    <svg viewBox="0 0 100 110" {...svgProps(label, className)}>
      <path d="M30 50 H70 L62 96 H38 Z" fill="#f7efe4" stroke="#e6d3c4" />
      <ellipse cx="50" cy="50" rx="28" ry="16" fill="#d2b49a" />
      <ellipse cx="50" cy="40" rx="22" ry="14" fill="#f3e2cf" />
      <circle cx="40" cy="34" r="4" fill="#fff" opacity="0.7" />
      <rect x="46" y="18" width="4" height="16" fill="#c6864a" />
    </svg>
  );
}

export function Religieuse({ className, label }: ArtProps) {
  return (
    <svg viewBox="0 0 90 120" {...svgProps(label, className)}>
      <ellipse cx="45" cy="86" rx="28" ry="22" fill="#f6e2c4" />
      <ellipse cx="45" cy="48" rx="20" ry="18" fill="#f6e2c4" />
      <path d="M20 78 Q45 70 70 78 Q45 92 20 78" fill="#6b422c" />
      <path d="M28 42 Q45 36 62 42 Q45 52 28 42" fill="#6b422c" />
      <circle cx="45" cy="28" r="5" fill="#e56b8a" />
    </svg>
  );
}

export function Peach({ className, label }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" {...svgProps(label, className)}>
      <path d="M50 20 Q30 20 24 40 Q18 70 50 86 Q82 70 76 40 Q70 20 50 20" fill="#fff6ee" stroke="#f0d5c8" />
      <path d="M50 22 Q48 40 50 84" fill="none" stroke="#f3ddd2" strokeWidth="2" />
      <path d="M50 24 Q66 18 74 28 Q64 26 54 32" fill="#b7d39a" />
    </svg>
  );
}

export function Candy({ className, label }: ArtProps) {
  return (
    <svg viewBox="0 0 120 70" {...svgProps(label, className)}>
      <path d="M20 35 L8 22 L18 18 L34 32" fill="#ffb3c7" />
      <path d="M100 35 L112 48 L102 52 L86 38" fill="#ffb3c7" />
      <rect x="28" y="22" width="64" height="28" rx="14" fill="#fff" stroke="#f4a0b8" />
      <path d="M48 22 Q52 36 48 50" stroke="#ffb3c7" fill="none" />
      <path d="M72 22 Q68 36 72 50" stroke="#ffb3c7" fill="none" />
    </svg>
  );
}

export function Can({ className, label }: ArtProps) {
  return (
    <svg viewBox="0 0 70 110" {...svgProps(label, className)}>
      <rect x="16" y="18" width="38" height="78" rx="12" fill="#f7c5d8" />
      <rect x="16" y="18" width="38" height="16" rx="8" fill="#fff6ee" />
      <rect x="16" y="48" width="38" height="18" fill="#7eb6ff" />
      <circle cx="35" cy="74" r="6" fill="#fff" />
      <ellipse cx="35" cy="18" rx="19" ry="6" fill="#e7eef5" />
    </svg>
  );
}

export function LighterArt({ lit, className }: { lit: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 120 200" className={className} role="img" aria-label={lit ? "Briquet allumé" : "Briquet"}>
      {lit ? (
        <g>
          <ellipse cx="60" cy="36" rx="16" ry="26" fill="#ffd0a8" />
          <ellipse cx="60" cy="40" rx="10" ry="18" fill="#fff6d8" />
          <ellipse cx="60" cy="46" rx="5" ry="10" fill="#ff8fb8" />
        </g>
      ) : null}
      <rect x="34" y="58" width="52" height="120" rx="16" fill="url(#metal)" stroke="#c5ced8" />
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="35%" stopColor="#f4b6cb" />
          <stop offset="60%" stopColor="#fff" />
          <stop offset="100%" stopColor="#d5dde6" />
        </linearGradient>
      </defs>
      <rect x="42" y="48" width="36" height="18" rx="4" fill="#e7eef5" stroke="#c5ced8" />
      <circle cx="78" cy="46" r="7" fill="#c5ced8" />
      <circle cx="78" cy="46" r="3" fill="#fff" />
      <path d="M60 100 l10 6 -10 4 2-5z" fill="#e56b8a" />
      <text x="60" y="132" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="16" fill="#e56b8a">
        n
      </text>
    </svg>
  );
}

export function BasketArt({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 260 180" className={className} aria-hidden>
      <path d="M70 70 Q130 20 190 70" fill="none" stroke="#c9a27a" strokeWidth="6" strokeLinecap="round" />
      <path d="M40 78 H220 L200 160 H60 Z" fill="#e7c48a" stroke="#c9a27a" strokeWidth="3" />
      <path d="M48 100 H214 M52 122 H208 M56 144 H204" stroke="#f3ddaa" strokeWidth="3" />
      <path d="M70 78 L80 160 M110 78 L114 160 M150 78 L146 160 M190 78 L180 160" stroke="#f6e7c2" strokeWidth="3" />
      {open ? (
        <path d="M48 78 Q130 20 214 78 Q130 96 48 78" fill="#fff" opacity="0.92" />
      ) : (
        <path d="M46 84 Q130 120 216 84 Q130 70 46 84" fill="#f7c5d8" />
      )}
    </svg>
  );
}

export function PixelHeart() {
  const rows = ["01100110", "11111111", "11111111", "01111110", "00111100", "00011000"];
  return (
    <span className="inline-grid grid-cols-8 gap-px" aria-hidden>
      {rows.flatMap((row, y) =>
        row.split("").map((cell, x) => (
          <span
            key={`${y}-${x}`}
            className={cell === "1" ? "h-[3px] w-[3px] bg-[#163324]" : "h-[3px] w-[3px]"}
          />
        )),
      )}
    </span>
  );
}
