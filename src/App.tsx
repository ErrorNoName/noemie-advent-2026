import { useState } from "react";
import { Calendar } from "./components/Calendar.tsx";
import { Confetti } from "./components/Confetti.tsx";
import { Gate } from "./components/Gate.tsx";
import { DeskScraps } from "./components/Scrapbook.tsx";
import { recipient, type AdventDay } from "./data/days.ts";
import { useDevMode } from "./hooks/useDevMode.ts";
import { useMemory } from "./hooks/useMemory.ts";
import { useNow } from "./hooks/useNow.ts";
import { useTestMode } from "./hooks/useTestMode.ts";
import { resetAdvent } from "./lib/storage.ts";
import { DayScene } from "./scenes/DayScene.tsx";

type View = { name: "calendar" } | { name: "day"; day: AdventDay; fresh: boolean };

export function App() {
  const dev = useDevMode();
  const test = useTestMode();
  const now = useNow();
  const { memory, markOpened, unlock, lock } = useMemory();
  const [view, setView] = useState<View>({ name: "calendar" });
  const [burst, setBurst] = useState(0);

  if (!dev && !test && memory.codeOk !== true) {
    return (
      <div className="desk">
        <Gate recipient={recipient} onUnlock={unlock} />
      </div>
    );
  }

  function openDay(day: AdventDay, fresh: boolean) {
    if (fresh) markOpened(day.date);
    setView({ name: "day", day, fresh });
  }

  function closeDay() {
    if (view.name === "day" && view.fresh) setBurst((value) => value + 1);
    setView({ name: "calendar" });
  }

  return (
    <div className="desk">
      <DeskScraps />
      {test ? <div className="preview-badge">TEST</div> : dev ? <div className="preview-badge">PREVIEW</div> : null}
      {test ? (
        <button type="button" className="test-reset" onClick={resetAdvent}>
          Réinitialiser
        </button>
      ) : null}
      <Confetti burst={burst} />
      {view.name === "day" ? (
        <DayScene day={view.day} onBack={closeDay} />
      ) : (
        <Calendar
          now={now}
          opened={memory.opened}
          dev={dev}
          test={test}
          onOpen={openDay}
          onLock={() => {
            lock();
            setView({ name: "calendar" });
          }}
        />
      )}
    </div>
  );
}
