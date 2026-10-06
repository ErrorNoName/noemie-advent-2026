import { useEffect, useState } from "react";
import { composedSticker } from "../lib/composeSticker.ts";

export function PrintDeco({ order }: { order: number }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    void composedSticker(order).then((url) => {
      if (live && url) setSrc(url);
    });
    return () => {
      live = false;
    };
  }, [order]);

  if (!src) return null;
  return <img className="print-deco" src={src} alt="" draggable={false} />;
}
