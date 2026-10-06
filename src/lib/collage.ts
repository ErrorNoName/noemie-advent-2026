import catalog from "../data/glyphCatalog.json" with { type: "json" };

const NATIVE = new Set(["W", "E", "I", "N", "O", "R", "S"]);

const ACCENTS = {
  "\u0301": "acute",
  "\u0300": "grave",
  "\u0302": "circ",
  "\u0308": "diaeresis",
  "\u0327": "cedilla",
} as const;

export type Accent = (typeof ACCENTS)[keyof typeof ACCENTS];

export type Tick = "apostrophe" | "dot" | "hyphen";

interface Jitter {
  key: string;
  rotate: number;
  dy: number;
  scale: number;
}

export type CollagePiece =
  | (Jitter & { kind: "glyph"; char: string; src: string; pool: "native" | "paper"; accent?: Accent })
  | (Jitter & { kind: "tag"; char: string; accent?: Accent })
  | (Jitter & { kind: "tick"; tick: Tick });

export interface CollageWord {
  text: string;
  pieces: CollagePiece[];
}

function hash(seed: string): number {
  let value = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    value ^= seed.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function unit(seed: string): number {
  return (hash(seed) % 10000) / 10000;
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function jitter(seed: string, index: number): Pick<Jitter, "rotate" | "dy" | "scale"> {
  return {
    rotate: round((unit(`${seed}:${index}:r`) - 0.5) * 9),
    dy: round((unit(`${seed}:${index}:y`) - 0.5) * 5),
    scale: round(0.94 + unit(`${seed}:${index}:s`) * 0.1),
  };
}

function filesFor(char: string): { pool: "native" | "paper"; files: string[] } | null {
  const native = catalog.native[char as keyof typeof catalog.native];
  if (NATIVE.has(char) && native && native.length > 0) {
    return { pool: "native", files: native };
  }
  const paper = catalog.paper[char as keyof typeof catalog.paper];
  if (paper && paper.length > 0) return { pool: "paper", files: paper };
  return null;
}

function pickFile(files: string[], seed: string, index: number, used: Set<string>): string {
  const start = hash(`${seed}:${index}:f`) % files.length;
  for (let step = 0; step < files.length; step += 1) {
    const file = files[(start + step) % files.length];
    if (file && !used.has(file)) {
      used.add(file);
      return file;
    }
  }
  return files[start] ?? files[0] ?? "";
}

function tickFor(char: string): Tick | null {
  if (char === "'" || char === "’" || char === "ʼ" || char === "′") return "apostrophe";
  if (char === "." || char === "·" || char === "•") return "dot";
  if (char === "-" || char === "–" || char === "—") return "hyphen";
  return null;
}

function accentOf(marks: string): Accent | undefined {
  for (const mark of marks) {
    const accent = ACCENTS[mark as keyof typeof ACCENTS];
    if (accent) return accent;
  }
  return undefined;
}

function piecesForWord(word: string, wordIndex: number): CollagePiece[] {
  const used = new Set<string>();
  const pieces: CollagePiece[] = [];
  let pieceIndex = 0;
  for (const char of word) {
    const tick = tickFor(char);
    const motion = jitter(word, pieceIndex);
    const key = `${wordIndex}-${pieceIndex}-${char}`;
    if (tick) {
      pieces.push({ kind: "tick", tick, key, ...motion });
      pieceIndex += 1;
      continue;
    }
    const decomposed = char.normalize("NFD");
    const baseRaw = decomposed[0] ?? char;
    const accent = accentOf(decomposed.slice(1));
    const lookup = /[a-z]/i.test(baseRaw) ? baseRaw.toUpperCase() : baseRaw;
    const pool = filesFor(lookup);
    if (!pool) {
      pieces.push({ kind: "tag", char: lookup, accent, key, ...motion });
      pieceIndex += 1;
      continue;
    }
    pieces.push({
      kind: "glyph",
      char: lookup,
      src: pickFile(pool.files, word, pieceIndex, used),
      pool: pool.pool,
      accent,
      key,
      ...motion,
    });
    pieceIndex += 1;
  }
  return pieces;
}

/** Ransom-note layout. The same word always lands on the same cuts. */
export function layoutCollage(text: string): CollageWord[] {
  const words = text.trim().split(/\s+/u).filter((word) => word.length > 0);
  return words.map((word, index) => ({
    text: word,
    pieces: piecesForWord(word, index),
  }));
}
