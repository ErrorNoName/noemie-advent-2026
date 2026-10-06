import raw from "../data/devices.json" with { type: "json" };
import type { SouvenirDay } from "./souvenirs.ts";

/**
 * Folder for the camera and screen cutouts.
 * The files here are WebP copies of the upscaled cutouts, long side at most
 * 1400px, with the original transparency kept. Screen boxes stay fractions
 * of the image, so the photo keeps the same place.
 */
export const DEVICE_ASSET_DIR = "stickers/devices";

function cutoutFile(file: string, role: string): string {
  if (role === "decor") return file;
  const name = file.slice(file.lastIndexOf("/") + 1);
  return `${DEVICE_ASSET_DIR}/${name}`;
}

export const DEVICE_FILTERS = [
  "compact",
  "kawaii",
  "phone",
  "album",
  "crt",
  "pixel",
  "gloss",
  "document",
  "handset",
] as const;

export type DeviceFilter = (typeof DEVICE_FILTERS)[number];

export type DeviceRole = "camera" | "screen" | "decor";

export interface ScreenBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DeviceCut {
  id: string;
  file: string;
  width: number;
  height: number;
  role: DeviceRole;
  filter: DeviceFilter | null;
  screen: ScreenBox | null;
  small: boolean;
  label: string;
}

const DAY_DEVICE: Record<SouvenirDay, string> = {
  2: "hello-kitty",
  4: "pink-cybershot",
  6: "silver-cybershot",
  8: "canon",
};

function isRole(value: string): value is DeviceRole {
  return value === "camera" || value === "screen" || value === "decor";
}

function isFilter(value: string): value is DeviceFilter {
  return (DEVICE_FILTERS as readonly string[]).includes(value);
}

function parseDevice(entry: (typeof raw.devices)[number]): DeviceCut {
  if (!isRole(entry.role)) throw new Error(`Rôle inconnu pour ${entry.id}`);
  if (entry.filter !== null && !isFilter(entry.filter)) throw new Error(`Filtre inconnu pour ${entry.id}`);
  const showsPhoto = entry.role === "camera" || entry.role === "screen";
  if (showsPhoto && (entry.screen == null || entry.filter == null)) {
    throw new Error(`Écran manquant pour ${entry.id}`);
  }
  if (!showsPhoto && (entry.screen != null || entry.filter != null)) {
    throw new Error(`Décor avec écran pour ${entry.id}`);
  }
  return {
    id: entry.id,
    file: cutoutFile(entry.file, entry.role),
    width: entry.width,
    height: entry.height,
    role: entry.role,
    filter: entry.filter,
    screen: entry.screen,
    small: entry.small,
    label: entry.label,
  };
}

const DEVICES = raw.devices.map(parseDevice);
const GALLERY = DEVICES.filter((device) => device.role === "screen");
const PINS = DEVICES.filter((device) => device.role === "decor");

export function allDevices(): DeviceCut[] {
  return DEVICES;
}

/** Stable mix so a photo always opens in the same device. */
export function mix(n: number): number {
  let x = Math.imul(n + 1, 0x45d9f3b) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b) >>> 0;
  return (x ^ (x >>> 16)) >>> 0;
}

export function deviceForDay(day: SouvenirDay): DeviceCut {
  const id = DAY_DEVICE[day];
  const found = DEVICES.find((device) => device.id === id);
  if (!found?.screen || !found.filter) throw new Error(`Appareil du jour ${day} introuvable`);
  return found;
}

export function galleryDevice(order: number): DeviceCut {
  const found = GALLERY[mix(order) % GALLERY.length];
  if (!found?.screen || !found.filter) throw new Error("Galerie d’appareils vide");
  return found;
}

export function pinFor(order: number): DeviceCut {
  const found = PINS[mix(order + 17) % PINS.length];
  if (!found) throw new Error("Pinces vides");
  return found;
}

/**
 * How the memory photo sits in the shell.
 * The upscaled cutouts keep a solid screen, so the photo is drawn on top
 * and clipped to this inset and corner radius (fractions of the screen box).
 */
export interface ScreenFit {
  inset: number;
  radius: number;
}

const SCREEN_FIT: Record<string, ScreenFit> = {
  "hello-kitty": { inset: 0.014, radius: 0.05 },
  "word-window": { inset: 0.02, radius: 0.05 },
  "music-player": { inset: 0.016, radius: 0.045 },
  "switch-lite": { inset: 0.014, radius: 0.05 },
  "ps-vita": { inset: 0.014, radius: 0.045 },
  tamagotchi: { inset: 0.03, radius: 0.34 },
  "vertical-phone": { inset: 0.02, radius: 0.07 },
  mp3: { inset: 0.016, radius: 0.05 },
  iphone: { inset: 0.012, radius: 0.09 },
  ipod: { inset: 0.016, radius: 0.04 },
  "silver-cybershot": { inset: 0.016, radius: 0.05 },
  "retro-tv": { inset: 0.018, radius: 0.16 },
  nokia: { inset: 0.016, radius: 0.045 },
  "pink-cybershot": { inset: 0.014, radius: 0.05 },
  "flip-phone": { inset: 0.04, radius: 0.3 },
  canon: { inset: 0.02, radius: 0.08 },
};

export function screenFit(id: string): ScreenFit {
  const fit = SCREEN_FIT[id];
  if (!fit) throw new Error(`Cadre d’écran manquant pour ${id}`);
  return fit;
}

export function pinAnchor(order: number): { x: number; rotate: number } {
  const slot = mix(order + 3) % 3;
  const x = slot === 0 ? 32 : slot === 1 ? 50 : 68;
  const rotate = (mix(order + 9) % 15) - 7;
  return { x, rotate };
}

export function lcdDate(date: string): string {
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return "";
  return `${day}.${month}.${year.slice(-2)}`;
}

export function recClock(date: string, order: number): string {
  const stamp = lcdDate(date);
  const hour = String(14 + (order % 6)).padStart(2, "0");
  const minute = String((order * 13) % 60).padStart(2, "0");
  return `${stamp}  ${hour}:${minute}`;
}
