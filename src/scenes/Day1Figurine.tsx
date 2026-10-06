import { useState } from "react";
import { CollageText } from "../components/CollageText.tsx";
import { FoilBag } from "../components/FoilBag.tsx";
import { giftFor, teaserFor } from "../data/days.ts";
import { useCloseScene } from "./scene-context.ts";

export function Day1() {
  const close = useCloseScene();
  const [run, setRun] = useState(0);
  const [clear, setClear] = useState(false);

  return (
    <div className="open-scene">
      <CollageText as="p" text="Jour 1" size="kicker" />
      <CollageText as="h2" text="Figurine surprise" size="title" />
      <div className="open-stage">
        <FoilBag
          key={run}
          onClear={() => {
            setClear(true);
          }}
        />
      </div>
      <p className="open-caption">
        {clear ? "Elle était là depuis le début." : `${teaserFor(1)} Tapote, ou secoue le téléphone.`}
      </p>
      {clear ? <p className="open-caption">{giftFor(1)}</p> : null}
      <div className="open-actions">
        {clear ? (
          <button
            type="button"
            className="btn-line"
            onClick={() => {
              setClear(false);
              setRun((value) => value + 1);
            }}
          >
            Encore
          </button>
        ) : null}
        <button type="button" className="btn-ink" onClick={close}>
          C’est doux
        </button>
      </div>
    </div>
  );
}
