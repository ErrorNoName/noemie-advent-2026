import type { ReactNode } from "react";
import type { CameraKind } from "../lib/souvenirs.ts";
import { publicUrl } from "../lib/publicUrl.ts";

/**
 * Drop a public path here when that camera's cutout arrives.
 * An empty slot keeps the drawn placeholder.
 */
const CUTOUTS: Partial<Record<CameraKind, string>> = {};

function Placeholder({ kind }: { kind: CameraKind }) {
  let body: ReactNode;
  switch (kind) {
    case "polaroid":
      body = (
        <svg viewBox="0 0 120 132" aria-hidden>
          <rect x="8" y="6" width="104" height="120" rx="6" fill="#f4f1ea" stroke="#3a2a32" strokeWidth="2" />
          <rect x="18" y="16" width="84" height="72" rx="2" fill="#1c2430" />
          <circle cx="60" cy="52" r="18" fill="#2a3344" stroke="#d7dde6" strokeWidth="3" />
          <circle cx="60" cy="52" r="8" fill="#8fd0e8" />
          <rect x="18" y="92" width="84" height="6" fill="#f7d7e2" />
          <rect x="18" y="100" width="84" height="6" fill="#f6d7a4" />
          <rect x="18" y="108" width="84" height="6" fill="#b7ddd4" />
        </svg>
      );
      break;
    case "disposable":
      body = (
        <svg viewBox="0 0 140 78" aria-hidden>
          <rect x="4" y="10" width="132" height="58" rx="16" fill="#f7f3ea" stroke="#3a2a32" strokeWidth="2" />
          <rect x="16" y="20" width="28" height="16" rx="3" fill="#fff6d8" stroke="#3a2a32" strokeWidth="1.5" />
          <circle cx="78" cy="40" r="16" fill="#243044" stroke="#3a2a32" strokeWidth="2" />
          <circle cx="78" cy="40" r="6" fill="#9fd6ea" />
          <rect x="104" y="28" width="18" height="22" rx="3" fill="#3a2a32" />
        </svg>
      );
      break;
    case "digital":
      body = (
        <svg viewBox="0 0 132 86" aria-hidden>
          <rect x="6" y="16" width="120" height="62" rx="8" fill="#dfe7ea" stroke="#3a2a32" strokeWidth="2" />
          <rect x="14" y="24" width="36" height="22" rx="2" fill="#14302a" />
          <rect x="18" y="32" width="18" height="3" fill="#b6f3c8" />
          <rect x="18" y="38" width="12" height="3" fill="#b6f3c8" />
          <circle cx="86" cy="48" r="18" fill="#1b2430" stroke="#3a2a32" strokeWidth="2" />
          <circle cx="86" cy="48" r="7" fill="#d5e4ea" />
          <rect x="112" y="8" width="10" height="14" rx="2" fill="#3a2a32" />
        </svg>
      );
      break;
    case "film":
      body = (
        <svg viewBox="0 0 128 96" aria-hidden>
          <path d="M18 40 H110 V82 H18 Z" fill="#2c2428" stroke="#3a2a32" strokeWidth="2" />
          <path d="M38 40 L52 18 H92 L104 40 Z" fill="#3a2a32" />
          <circle cx="64" cy="62" r="16" fill="#111" stroke="#c5d0dc" strokeWidth="3" />
          <circle cx="64" cy="62" r="6" fill="#6ea8c9" />
          <rect x="8" y="48" width="14" height="22" fill="#2c2428" />
          <rect x="106" y="50" width="16" height="10" fill="#2c2428" />
        </svg>
      );
      break;
    default: {
      const unexpected: never = kind;
      return unexpected;
    }
  }
  return <span className={`camera-placeholder is-${kind}`}>{body}</span>;
}

export function CameraBody({ kind }: { kind: CameraKind }) {
  const src = CUTOUTS[kind];
  if (src) {
    return <img className="camera-cutout" src={publicUrl(src)} alt="" draggable={false} />;
  }
  return <Placeholder kind={kind} />;
}
