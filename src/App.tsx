import { useState, type ReactNode } from "react";
import { Calendar } from "./components/Calendar.tsx";
import { CollageBackdrop } from "./components/CollageBackdrop.tsx";
import { Confetti } from "./components/Confetti.tsx";
import { Gate } from "./components/Gate.tsx";
import { BoardOrbit } from "./components/Scrapbook.tsx";
import { ShotProvider } from "./components/ShotStore.tsx";
import { SouvenirsGallery } from "./components/SouvenirsGallery.tsx";
import { recipient, type AdventDay } from "./data/days.ts";
import { useDevMode } from "./hooks/useDevMode.ts";
import { useMemory } from "./hooks/useMemory.ts";
import { useNow } from "./hooks/useNow.ts";
import { useTestMode } from "./hooks/useTestMode.ts";
import { parisDateKey } from "./lib/time.ts";
import { unlockedSouvenirDays } from "./lib/souvenirs.ts";
import { resetAdvent } from "./lib/storage.ts";
import { DayScene } from "./scenes/DayScene.tsx";

type View =
  | { name: "calendar" }
  | { name: "day"; day: AdventDay; fresh: boolean }
  | { name: "souvenirs" };

export function App() {
  const dev = useDevMode();
  const test = useTestMode();
  const now = useNow();
  const { memory, markOpened, unlock, lock, setShotCount } = useMemory();
  const [view, setView] = useState<View>({ name: "calendar" });
  const [burst, setBurst] = useState(0);

  if (!dev && !test && memory.codeOk !== true) {
    return (
      <div className="desk is-gate">
        <CollageBackdrop tone="gate" />
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

  const daysOpen = unlockedSouvenirDays({
    today: parisDateKey(now),
    opened: memory.opened,
    dev,
    test,
  });

  let tone: "home" | "day" | "souvenirs" = "home";
  let screen: ReactNode;
  switch (view.name) {
    case "day":
      tone = "day";
      screen = <DayScene day={view.day} onBack={closeDay} />;
      break;
    case "souvenirs":
      tone = "souvenirs";
      screen = <SouvenirsGallery daysOpen={daysOpen} onBack={() => setView({ name: "calendar" })} />;
      break;
    case "calendar":
      screen = (
        <Calendar
          now={now}
          opened={memory.opened}
          dev={dev}
          test={test}
          onOpen={openDay}
          onSouvenirs={() => setView({ name: "souvenirs" })}
          onLock={() => {
            lock();
            setView({ name: "calendar" });
          }}
        />
      );
      break;
    default: {
      const unexpected: never = view;
      screen = unexpected;
    }
  }

  return (
    <ShotProvider value={{ shots: memory.shots, setShotCount }}>
    <div className={`desk is-${tone}`}>
      <CollageBackdrop tone={tone} />
      <BoardOrbit />
      {test ? (
        <div className="test-bar">
          <span className="test-pill">Test</span>
          <button type="button" className="test-reset" onClick={resetAdvent}>
            Réinitialiser
          </button>
        </div>
      ) : dev ? (
        <div className="preview-badge">PREVIEW</div>
      ) : null}
      <Confetti burst={burst} />
      {screen}
    </div>
    </ShotProvider>
  );
}
