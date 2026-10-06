import { useRef, useState } from "react";
import { useGentle } from "../hooks/useGentle.ts";
import { cameraKind, cameraLabel, memoriesForDay, type SouvenirDay } from "../lib/souvenirs.ts";
import { CameraBody } from "./CameraBody.tsx";
import { MemoryPrint } from "./MemoryPrint.tsx";
import { useShots } from "./ShotStore.tsx";

export function MemoryCamera({ day, revealed }: { day: SouvenirDay; revealed: boolean }) {
  const photos = memoriesForDay(day);
  const { shots, setShotCount } = useShots();
  const stored = shots[String(day)] ?? 0;
  const shot = Math.max(0, Math.min(photos.length, stored));
  const [index, setIndex] = useState(0);
  const [flash, setFlash] = useState(false);
  const [freshId, setFreshId] = useState<string | null>(null);
  const drag = useRef<number | null>(null);
  const { reduced } = useGentle();
  const kind = cameraKind(day);
  const safeIndex = shot === 0 ? 0 : Math.min(Math.max(index, 0), shot - 1);
  const current = photos[safeIndex];
  const full = shot >= photos.length;

  if (!revealed) return null;

  function shoot() {
    if (full) return;
    const next = photos[shot];
    if (!next) return;
    if (!reduced) {
      setFlash(true);
      window.setTimeout(() => setFlash(false), 460);
      if ("vibrate" in navigator) navigator.vibrate(12);
    }
    setShotCount(day, shot + 1);
    setIndex(shot);
    setFreshId(next.id);
  }

  function nudge(direction: -1 | 1) {
    setIndex((value) => {
      const currentIndex = shot === 0 ? 0 : Math.min(Math.max(value, 0), shot - 1);
      return Math.min(shot - 1, Math.max(0, currentIndex + direction));
    });
  }

  return (
    <section className="memory-roll" data-camera={kind} data-shot={shot}>
      {flash ? <span className="camera-flash" /> : null}
      <button
        type="button"
        className="camera-hit"
        onClick={shoot}
        disabled={full}
        aria-label={
          full
            ? `Toute la pellicule ${cameraLabel(kind)} est développée`
            : `Déclencher le ${cameraLabel(kind)}, souvenir ${shot + 1} sur ${photos.length}`
        }
      >
        <CameraBody kind={kind} />
      </button>
      <p className="open-caption">
        {full
          ? "Toute la pellicule de ce jour est là. Fais défiler les tirages."
          : shot === 0
            ? "Appuie sur l’appareil. Le souvenir se développe."
            : `${shot} sur ${photos.length}. Encore un déclenchement.`}
      </p>
      {current && shot > 0 ? (
        <div
          className={`print-deck${shot > 1 ? " has-more" : ""}`}
          onPointerDown={(event) => {
            drag.current = event.clientX;
          }}
          onPointerUp={(event) => {
            if (drag.current == null) return;
            const delta = event.clientX - drag.current;
            drag.current = null;
            if (delta <= -40) nudge(1);
            else if (delta >= 40) nudge(-1);
          }}
          onPointerCancel={() => {
            drag.current = null;
          }}
        >
          <MemoryPrint photo={current} fresh={freshId === current.id} eager contain />
        </div>
      ) : null}
      {shot > 1 ? (
        <div className="print-nav">
          <button type="button" className="btn-ghost" onClick={() => nudge(-1)} disabled={safeIndex === 0}>
            Précédent
          </button>
          <span>
            {safeIndex + 1} / {shot}
          </span>
          <button type="button" className="btn-ghost" onClick={() => nudge(1)} disabled={safeIndex >= shot - 1}>
            Suivant
          </button>
        </div>
      ) : null}
    </section>
  );
}
