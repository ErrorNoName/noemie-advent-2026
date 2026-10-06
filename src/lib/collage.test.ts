import { describe, expect, it } from "vitest";
import { layoutCollage } from "./collage.ts";

describe("layoutCollage", () => {
  it("prefers the pin cuts for W E I N O R S and paper for the rest", () => {
    const pieces = layoutCollage("Noémie").flatMap((word) => word.pieces);
    const native = pieces.filter((piece) => piece.kind === "glyph" && piece.pool === "native");
    const paper = pieces.filter((piece) => piece.kind === "glyph" && piece.pool === "paper");
    expect(native.map((piece) => (piece.kind === "glyph" ? piece.char : ""))).toEqual(["N", "O", "E", "I", "E"]);
    expect(paper.map((piece) => (piece.kind === "glyph" ? piece.char : ""))).toEqual(["M"]);
    expect(native.every((piece) => piece.kind === "glyph" && piece.src.includes("letters/pin/"))).toBe(true);
    expect(paper.every((piece) => piece.kind === "glyph" && piece.src.includes("letters/paper/"))).toBe(true);
    const accent = pieces.find((piece) => piece.kind === "glyph" && piece.accent === "acute");
    expect(accent && accent.kind === "glyph" ? accent.char : "").toBe("E");
  });

  it("uses a paper tag for the missing 8 and keeps a word stable", () => {
    const once = layoutCollage("Jour 8");
    const twice = layoutCollage("Jour 8");
    expect(once).toEqual(twice);
    const tag = once.flatMap((word) => word.pieces).find((piece) => piece.kind === "tag");
    expect(tag && tag.kind === "tag" ? tag.char : "").toBe("8");
    const jourA = layoutCollage("Jour 1")[0]?.pieces;
    const jourB = layoutCollage("Jour 2")[0]?.pieces;
    expect(jourA).toEqual(jourB);
  });

  it("does not repeat the same cut inside one word when another exists", () => {
    const letters = layoutCollage("Souvenirs")
      .flatMap((word) => word.pieces)
      .filter((piece) => piece.kind === "glyph" && piece.char === "S");
    const sources = letters.map((piece) => (piece.kind === "glyph" ? piece.src : ""));
    expect(new Set(sources).size).toBe(sources.length);
  });
});
