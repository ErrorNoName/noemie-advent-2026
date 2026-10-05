import { useEffect, useState } from "react";

interface Manifest {
  shared?: string[];
  [folder: string]: string[] | undefined;
}

const SPOTS = [
  { left: "2%", top: "18%", rot: -14 },
  { left: "78%", top: "6%", rot: 10 },
  { left: "80%", top: "58%", rot: 16 },
  { left: "4%", top: "64%", rot: -8 },
];

export function DayStickers({ day }: { day: number }) {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/stickers/manifest.json")
      .then((response) => response.json())
      .then((manifest: Manifest) => {
        if (cancelled) return;
        const own = manifest[`jour-${day}`] ?? [];
        const shared = (manifest.shared ?? []).slice(0, 2);
        setFiles([
          ...own.map((file) => `/stickers/jour-${day}/${file}`),
          ...shared.map((file) => `/stickers/shared/${file}`),
        ]);
      })
      .catch(() => {
        if (!cancelled) setFiles([]);
      });
    return () => {
      cancelled = true;
    };
  }, [day]);

  if (files.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {files.slice(0, SPOTS.length).map((src, index) => {
        const spot = SPOTS[index];
        if (!spot) return null;
        return (
          <img
            key={src}
            src={src}
            alt=""
            className="sticker-float"
            style={{ left: spot.left, top: spot.top, transform: `rotate(${spot.rot}deg)` }}
          />
        );
      })}
    </div>
  );
}
