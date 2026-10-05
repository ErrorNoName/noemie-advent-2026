import { useEffect, useState } from "react";
import { days, type AdventDay } from "../data/days.ts";
import { doorStatus, stateLabel } from "../lib/doors.ts";
import { caseNumberForToday, formatDateKey, formatParisLong, formatShort, parisDateKey } from "../lib/time.ts";
import { Countdown } from "./Countdown.tsx";
import { CornerScraps } from "./Scrapbook.tsx";
import { Present } from "./Present.tsx";

export function Calendar({
  now,
  opened,
  dev,
  onOpen,
  onLock,
}: {
  now: Date;
  opened: Record<string, boolean>;
  dev: boolean;
  onOpen: (day: AdventDay, fresh: boolean) => void;
  onLock: () => void;
}) {
  const today = parisDateKey(now);
  const caseNumber = caseNumberForToday(today);
  const [hint, setHint] = useState<string | null>(null);
  const [shakeDay, setShakeDay] = useState<number | null>(null);
  const anyLocked = days.some(
    (day) => doorStatus({ date: day.date, today, opened: opened[day.date] === true, dev }) === "locked",
  );

  useEffect(() => {
    if (!hint) return;
    const id = window.setTimeout(() => setHint(null), 3200);
    return () => window.clearTimeout(id);
  }, [hint]);

  function press(day: AdventDay) {
    const status = doorStatus({
      date: day.date,
      today,
      opened: opened[day.date] === true,
      dev,
    });
    if (status === "locked") {
      setShakeDay(day.day);
      window.setTimeout(() => setShakeDay((current) => (current === day.day ? null : current)), 480);
      setHint(`Pas encore. Cette case s’ouvre le ${formatDateKey(day.date)}.`);
      return;
    }
    onOpen(day, status === "available");
  }

  return (
    <div className="column relative">
      <header className="relative px-5 pt-7">
        <CornerScraps />
        <p className="eyebrow relative">pour toi</p>
        <div className="relative mt-1 flex items-end justify-between gap-3">
          <h1 className="font-serif text-[2.7rem] italic leading-none">Noémie</h1>
          <p className="pb-1 text-sm text-mute">Case {caseNumber} / 8</p>
        </div>
        <p className="relative mt-2 font-serif text-xl">{formatParisLong(now)}</p>
      </header>
      <Countdown now={now} />
      <ol className="pips" aria-hidden>
        {days.map((day) => {
          const status = doorStatus({
            date: day.date,
            today,
            opened: opened[day.date] === true,
            dev,
          });
          return <li key={day.date} className={status} />;
        })}
      </ol>
      {hint ? (
        <p className="hint-banner" role="status">
          {hint}
        </p>
      ) : null}
      <div className="door-grid">
        {days.map((day) => {
          const status = doorStatus({
            date: day.date,
            today,
            opened: opened[day.date] === true,
            dev,
          });
          const label =
            status === "locked"
              ? `Case ${day.day}, fermée jusqu’au ${formatDateKey(day.date)}`
              : status === "opened"
                ? `Case ${day.day}, déjà ouverte, revoir`
                : `Case ${day.day}, prête à ouvrir`;
          return (
            <button
              key={day.date}
              type="button"
              className={`gift-btn ${day.date === today ? "is-today" : ""}`}
              aria-label={label}
              onClick={() => press(day)}
            >
              <Present
                day={day.day}
                open={status === "opened"}
                available={status === "available"}
                locked={status === "locked"}
                shaking={shakeDay === day.day}
              />
              <span className="gift-date">{formatShort(day.date)}</span>
              <span className="gift-state">{stateLabel(status, day.date, today)}</span>
            </button>
          );
        })}
      </div>
      <footer className="px-6 pt-4 text-center">
        {anyLocked ? (
          <p className="text-sm text-mute">Chaque case s’ouvre à minuit, heure de Paris.</p>
        ) : (
          <p className="text-sm text-mute">Tout est là. Tu peux tout revoir.</p>
        )}
        {dev ? null : (
          <button type="button" className="btn-ghost mt-3" onClick={onLock}>
            Verrouiller
          </button>
        )}
      </footer>
    </div>
  );
}
