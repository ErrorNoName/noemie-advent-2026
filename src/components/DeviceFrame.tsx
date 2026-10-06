import type { CSSProperties } from "react";
import {
  lcdDate,
  pinAnchor,
  recClock,
  type DeviceCut,
  type DeviceFilter,
} from "../lib/devices.ts";
import { publicUrl } from "../lib/publicUrl.ts";
import type { MemoryPhoto } from "../lib/souvenirs.ts";

function ScreenFx({
  filter,
  date,
  order,
}: {
  filter: DeviceFilter;
  date: string;
  order: number;
}) {
  const stamp = lcdDate(date);
  switch (filter) {
    case "compact":
      return (
        <>
          <span className="fx-vignette" />
          {stamp ? <span className="fx-stamp">{stamp}</span> : null}
        </>
      );
    case "kawaii":
      return <span className="fx-bloom" />;
    case "phone":
      return (
        <>
          <span className="fx-noise" />
          {stamp ? <span className="fx-stamp is-phone">{stamp}</span> : null}
        </>
      );
    case "album":
      return (
        <span className="fx-album">
          <span className="fx-play" />
          <span className="fx-track">
            <span className="fx-bar" />
          </span>
        </span>
      );
    case "crt":
      return (
        <>
          <span className="fx-scan" />
          <span className="fx-chroma" />
          <span className="fx-rec">
            <span className="fx-dot" />
            REC {recClock(date, order)}
          </span>
        </>
      );
    case "pixel":
      return <span className="fx-dither" />;
    case "gloss":
      return <span className="fx-gloss" />;
    case "document":
    case "handset":
      return null;
    default: {
      const unexpected: never = filter;
      return unexpected;
    }
  }
}

export function DeviceFrame({
  device,
  photo = null,
  fresh = false,
  pin = null,
  eager = false,
}: {
  device: DeviceCut;
  photo?: MemoryPhoto | null;
  fresh?: boolean;
  pin?: DeviceCut | null;
  eager?: boolean;
}) {
  const screen = device.screen;
  const filter = device.filter;
  if (!screen || !filter) return null;
  const anchor = pin ? pinAnchor(photo?.order ?? 1) : null;
  const pinStyle: CSSProperties | undefined = anchor
    ? { left: `${anchor.x}%`, ["--pin-rot" as string]: `${anchor.rotate}deg` }
    : undefined;

  return (
    <span
      className={`device-frame${device.small ? " is-small" : ""}`}
      data-device={device.id}
      data-filter={filter}
      style={{ aspectRatio: `${device.width} / ${device.height}` }}
    >
      <span
        className="device-screen"
        style={{
          left: `${screen.x * 100}%`,
          top: `${screen.y * 100}%`,
          width: `${screen.w * 100}%`,
          height: `${screen.h * 100}%`,
        }}
      >
        {photo ? (
          <img
            className={`device-photo is-${filter}${fresh ? " is-fresh" : ""}`}
            src={publicUrl(photo.src)}
            alt=""
            width={photo.width}
            height={photo.height}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
          />
        ) : null}
        {photo ? <ScreenFx filter={filter} date={photo.date} order={photo.order} /> : null}
      </span>
      <img
        className="device-shell"
        src={publicUrl(device.file)}
        alt=""
        width={device.width}
        height={device.height}
        draggable={false}
      />
      {pin && pinStyle ? (
        <img
          className={`device-pin is-${pin.id}${pin.small ? " is-small" : ""}`}
          style={pinStyle}
          src={publicUrl(pin.file)}
          alt=""
          draggable={false}
        />
      ) : null}
    </span>
  );
}
