import type { ReactNode } from "react";
import type { AdventDay } from "../data/days.ts";
import { SceneShell } from "../components/SceneShell.tsx";
import { Day1 } from "./Day1Figurine.tsx";
import { Day2 } from "./Day2Squishy.tsx";
import { Day3 } from "./Day3Plush.tsx";
import { Day4 } from "./Day4Gacha.tsx";
import { Day5 } from "./Day5Clip.tsx";
import { Day6 } from "./Day6Basket.tsx";
import { Day7 } from "./Day7Lighter.tsx";
import { Day8 } from "./Day8Birthday.tsx";

export function DayScene({ day, onBack }: { day: AdventDay; onBack: () => void }) {
  let scene: ReactNode;
  switch (day.day) {
    case 1:
      scene = <Day1 />;
      break;
    case 2:
      scene = <Day2 />;
      break;
    case 3:
      scene = <Day3 />;
      break;
    case 4:
      scene = <Day4 />;
      break;
    case 5:
      scene = <Day5 />;
      break;
    case 6:
      scene = <Day6 />;
      break;
    case 7:
      scene = <Day7 />;
      break;
    case 8:
      scene = <Day8 breakfast={day.breakfast} extras={day.extras} />;
      break;
    default: {
      const unexpected: never = day;
      throw new Error(`Jour inconnu : ${JSON.stringify(unexpected)}`);
    }
  }

  return (
    <SceneShell day={day} onBack={onBack}>
      {scene}
    </SceneShell>
  );
}
