import { describe, expect, it } from "vitest";
import {
  DEVICE_ASSET_DIR,
  allDevices,
  deviceForDay,
  galleryDevice,
  lcdDate,
  pinFor,
  recClock,
} from "./devices.ts";

const CAMERAS = ["hello-kitty", "pink-cybershot", "silver-cybershot", "canon"];

describe("devices", () => {
  it("keeps a screen rectangle on every device that shows a photo", () => {
    const devices = allDevices();
    expect(devices).toHaveLength(22);
    const framed = devices.filter((device) => device.role !== "decor");
    const decor = devices.filter((device) => device.role === "decor");
    expect(framed).toHaveLength(16);
    expect(decor).toHaveLength(6);
    for (const device of devices) {
      expect(device.file.startsWith(`${DEVICE_ASSET_DIR}/`)).toBe(true);
      expect(device.file.endsWith(".webp")).toBe(true);
    }
    for (const device of framed) {
      expect(device.screen).toBeTruthy();
      expect(device.filter).toBeTruthy();
      const screen = device.screen;
      if (!screen) throw new Error(device.id);
      expect(screen.x).toBeGreaterThanOrEqual(0);
      expect(screen.y).toBeGreaterThanOrEqual(0);
      expect(screen.w).toBeGreaterThan(0.2);
      expect(screen.h).toBeGreaterThan(0.2);
      expect(screen.x + screen.w).toBeLessThanOrEqual(1.001);
      expect(screen.y + screen.h).toBeLessThanOrEqual(1.001);
    }
    expect(decor.every((device) => device.screen == null && device.filter == null)).toBe(true);
    expect(decor.find((device) => device.id === "paperclip")?.small).toBe(true);
    expect(framed.find((device) => device.id === "vertical-phone")?.small).toBe(true);
  });

  it("assigns the four cameras to days 2, 4, 6 and 8, and the other screens to the gallery", () => {
    expect(deviceForDay(2).id).toBe("hello-kitty");
    expect(deviceForDay(2).filter).toBe("kawaii");
    expect(deviceForDay(4).id).toBe("pink-cybershot");
    expect(deviceForDay(6).id).toBe("silver-cybershot");
    expect(deviceForDay(8).id).toBe("canon");
    expect(deviceForDay(4).filter).toBe("compact");
    expect(deviceForDay(8).filter).toBe("compact");
    const gallery = Array.from({ length: 30 }, (_, index) => galleryDevice(index + 1));
    expect(gallery.every((device) => device.role === "screen")).toBe(true);
    expect(gallery.some((device) => CAMERAS.includes(device.id))).toBe(false);
    expect(new Set(gallery.map((device) => device.id)).size).toBeGreaterThan(4);
    expect(galleryDevice(12).id).toBe(gallery[11]?.id);
    const pins = Array.from({ length: 30 }, (_, index) => pinFor(index + 1));
    expect(pins.every((pin) => pin.role === "decor")).toBe(true);
    expect(new Set(pins.map((pin) => pin.id)).size).toBeGreaterThan(3);
    expect(pins.find((pin) => pin.id === "paperclip")?.small).toBe(true);
  });

  it("formats the compact date and the CRT clock", () => {
    expect(lcdDate("2026-10-19")).toBe("19.10.26");
    expect(recClock("2026-10-21", 8)).toBe("21.10.26  16:44");
  });
});
