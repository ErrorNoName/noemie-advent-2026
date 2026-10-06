import raw from "../data/backgrounds.json" with { type: "json" };
import { publicUrl } from "../lib/publicUrl.ts";

export type BackdropTone = "home" | "day" | "souvenirs" | "gate";

export function CollageBackdrop({ tone }: { tone: BackdropTone }) {
  return (
    <div className={`collage-backdrop is-${tone}`} aria-hidden>
      <div className="collage-mosaic">
        {raw.panels.map((panel) => {
          const fallback = panel.sources[0];
          if (!fallback) return null;
          const srcSet = panel.sources
            .map((source) => `${publicUrl(source.file)} ${source.width}w`)
            .join(", ");
          return (
            <img
              key={panel.id}
              className="collage-panel"
              src={publicUrl(fallback.file)}
              srcSet={srcSet}
              sizes="25vw"
              width={panel.width}
              height={panel.height}
              alt=""
              decoding="async"
              loading="lazy"
            />
          );
        })}
      </div>
      <div className="collage-veil" />
    </div>
  );
}
