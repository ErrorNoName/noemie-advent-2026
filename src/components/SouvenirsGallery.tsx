import { useEffect, useRef, useState } from "react";
import { galleryDevice, pinFor } from "../lib/devices.ts";
import { allMemories, type MemoryPhoto, type SouvenirDay } from "../lib/souvenirs.ts";
import { CollageText } from "./CollageText.tsx";
import { DeviceFrame } from "./DeviceFrame.tsx";

export function SouvenirsGallery({
  daysOpen,
  onBack,
}: {
  daysOpen: SouvenirDay[];
  onBack: () => void;
}) {
  const photos = allMemories().filter((photo) => daysOpen.includes(photo.day));
  const [open, setOpen] = useState<MemoryPhoto | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = dialog.current;
    if (!node || !open) return;
    if (!node.open) node.showModal();
    let live = true;
    const onClose = () => {
      if (live) setOpen(null);
    };
    node.addEventListener("close", onClose);
    return () => {
      live = false;
      node.removeEventListener("close", onClose);
      if (node.open) node.close();
    };
  }, [open]);

  return (
    <div className="column souvenirs">
      <div className="scene-top">
        <button type="button" className="back-btn" onClick={onBack}>
          <span aria-hidden>← </span>
          Retour
        </button>
      </div>
      <header className="souvenir-head">
        <CollageText as="h1" text="Souvenirs" size="display" />
        <p className="open-caption">
          {photos.length === 0
            ? "Les souvenirs arrivent avec leur jour."
            : `${photos.length} ${photos.length > 1 ? "tirages débloqués" : "tirage débloqué"}.`}
        </p>
      </header>
      {photos.length === 0 ? null : (
        <ul className="souvenir-grid">
          {photos.map((photo) => (
            <li key={photo.id}>
              <button
                type="button"
                className="souvenir-open"
                aria-label={`Souvenir ${photo.order}, jour ${photo.day}`}
                onClick={() => setOpen(photo)}
              >
                <DeviceFrame device={galleryDevice(photo.order)} photo={photo} pin={pinFor(photo.order)} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {open ? (
        <dialog ref={dialog} className="souvenir-dialog" aria-label={`Souvenir ${open.order}`}>
          <DeviceFrame
            device={galleryDevice(open.order)}
            photo={open}
            pin={pinFor(open.order)}
            eager
          />
          <button type="button" className="btn-ink" onClick={() => dialog.current?.close()}>
            Fermer
          </button>
        </dialog>
      ) : null}
    </div>
  );
}
