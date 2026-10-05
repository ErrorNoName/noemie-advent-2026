import { BalloonColon, BalloonDigit } from "./BalloonDigit.tsx";
import { ariaRemaining, getCountdownTarget, splitRemaining } from "../lib/time.ts";

function Pair({ value }: { value: number }) {
  const text = value.toString().padStart(2, "0");
  return (
    <div className="flex h-full items-end">
      <BalloonDigit digit={text.charAt(0)} />
      <BalloonDigit digit={text.charAt(1)} />
    </div>
  );
}

function Group({ value, label, tall }: { value: number; label: string; tall?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={tall ? "h-24" : "clock-digits"}>
        <Pair value={value} />
      </div>
      <span className="text-[0.65rem] uppercase tracking-[0.16em] text-mute">{label}</span>
    </div>
  );
}

export function Countdown({ now }: { now: Date }) {
  const target = getCountdownTarget(now);
  if (target.kind === "done") {
    return (
      <section className="px-4 pt-3 text-center" aria-label="Joyeux anniversaire. Toutes les cases sont débloquées.">
        <p className="font-serif text-3xl italic text-ink">C’est ouvert</p>
        <p className="mt-1 text-sm text-mute">{target.caption}</p>
      </section>
    );
  }
  const parts = splitRemaining(target.at.getTime() - now.getTime());
  return (
    <section className="px-1 pt-2" aria-label={ariaRemaining(parts, target.caption)}>
      {parts.days > 0 ? (
        <Group value={parts.days} label={parts.days > 1 ? "jours" : "jour"} tall />
      ) : null}
      <div className="mt-1 flex items-start justify-center">
        <Group value={parts.hours} label="heures" />
        <div className="clock-digits">
          <BalloonColon />
        </div>
        <Group value={parts.minutes} label="min" />
        <div className="clock-digits">
          <BalloonColon />
        </div>
        <Group value={parts.seconds} label="sec" />
      </div>
      <p className="mt-1 text-center font-serif text-lg italic text-ink">{target.caption}</p>
      <p className="text-center text-[0.68rem] uppercase tracking-[0.18em] text-mute">heure de Paris</p>
    </section>
  );
}
