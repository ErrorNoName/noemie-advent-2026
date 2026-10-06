import type { MemoryPhoto } from "../lib/souvenirs.ts";
import { stampText } from "../lib/souvenirs.ts";
import { publicUrl } from "../lib/publicUrl.ts";
import { PrintDeco } from "./PrintDeco.tsx";

export function MemoryPrint({
  photo,
  fresh = false,
  eager = false,
  contain = false,
}: {
  photo: MemoryPhoto;
  fresh?: boolean;
  eager?: boolean;
  contain?: boolean;
}) {
  const stamp = stampText(photo.date, photo.kind);
  return (
    <figure
      className={`memory-print is-${photo.kind}${fresh ? " is-fresh" : ""}${contain ? " is-contain" : ""}`}
    >
      <span className="print-window">
        <img
          src={publicUrl(photo.src)}
          alt=""
          width={photo.width}
          height={photo.height}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
        />
        <span className="print-grain" />
        {photo.kind === "film" ? <span className="print-halation" /> : null}
        {photo.kind === "digital" ? <span className="print-vignette" /> : null}
        {stamp ? <span className={`print-stamp is-${photo.kind}`}>{stamp}</span> : null}
      </span>
      <PrintDeco order={photo.order} />
    </figure>
  );
}
