import { useRef, useState } from "react";
import { useGentle } from "../hooks/useGentle.ts";
import { deviceForDay } from "../lib/devices.ts";
import { memoriesForDay, type SouvenirDay } from "../lib/souvenirs.ts";
import { DeviceFrame } from "./DeviceFrame.tsx";
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
  const device = deviceForDay(day);
  const safeIndex = shot === 0 ? 0 : Math.min(Math.max(index, 0), shot - 1);
  const current = shot > 0 ? photos[safeIndex] : null;
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
    <section className="memory-roll" data-camera={device.id} data-shot={shot}>
      {flash ? <span className="camera-flash" /> : null}
      <div
        className="camera-stage"
        role="button"
        tabIndex={0}
        data-full={full ? "yes" : "no"}
        aria-label={
          full
            ? `Toute la pellicule du ${device.label} est développée`
            : `Déclencher le ${device.label}, souvenir ${shot + 1} sur ${photos.length}`
        }
        onPointerDown={(event) => {
          drag.current = event.clientX;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          if (drag.current == null) return;
          const delta = event.clientX - drag.current;
          drag.current = null;
          if (delta <= -36) {
            nudge(1);
            return;
          }
          if (delta >= 36) {
            nudge(-1);
            return;
          }
          shoot();
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            shoot();
          } else if (event.key === "ArrowRight") {
            nudge(1);
          } else if (event.key === "ArrowLeft") {
            nudge(-1);
          }
        }}
      >
        <DeviceFrame device={device} photo={current ?? null} fresh={freshId === current?.id} eager />
      </div>
      <p className="open-caption">
        {full
          ? "Toute la pellicule de ce jour est là. Fais glisser l’écran."
          : shot === 0
            ? "Appuie sur l’appareil. Le souvenir se développe dans l’écran."
            : `${shot} sur ${photos.length}. Encore un déclenchement.`}
      </p>
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
