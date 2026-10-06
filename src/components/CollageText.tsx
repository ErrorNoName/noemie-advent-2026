import type { CSSProperties } from "react";
import { layoutCollage, type Accent, type CollagePiece } from "../lib/collage.ts";
import { publicUrl } from "../lib/publicUrl.ts";

type Tag = "h1" | "h2" | "p";
type Size = "display" | "title" | "kicker" | "date";
type Align = "start" | "center" | "end";

function PaperAccent({ kind }: { kind: Accent }) {
  switch (kind) {
    case "acute":
      return (
        <svg className="paper-accent" viewBox="0 0 16 12" aria-hidden>
          <path d="M3 10 L8 2 L11 3.2 L6.2 11.2 Z" />
        </svg>
      );
    case "grave":
      return (
        <svg className="paper-accent" viewBox="0 0 16 12" aria-hidden>
          <path d="M5 3.2 L8 2 L13 10 L9.8 11.2 Z" />
        </svg>
      );
    case "circ":
      return (
        <svg className="paper-accent" viewBox="0 0 18 12" aria-hidden>
          <path d="M1 9 L9 1.5 L17 9 L13.5 10.5 L9 5.2 L4.5 10.5 Z" />
        </svg>
      );
    case "diaeresis":
      return (
        <svg className="paper-accent" viewBox="0 0 18 8" aria-hidden>
          <rect x="1" y="1" width="5" height="5" rx="0.4" />
          <rect x="12" y="1" width="5" height="5" rx="0.4" />
        </svg>
      );
    case "cedilla":
      return (
        <svg className="paper-accent is-cedilla" viewBox="0 0 12 12" aria-hidden>
          <path d="M6 0.5 C6 0.5 9 3 8 6 C7 9 3 9 3.5 11" />
        </svg>
      );
    default: {
      const unexpected: never = kind;
      return unexpected;
    }
  }
}

function PieceView({ piece }: { piece: CollagePiece }) {
  const style = {
    transform: `translateY(${piece.dy}px) rotate(${piece.rotate}deg) scale(${piece.scale})`,
  } satisfies CSSProperties;
  switch (piece.kind) {
    case "glyph":
      return (
        <span className="glyph" style={style}>
          <img src={publicUrl(piece.src)} alt="" draggable={false} />
          {piece.accent ? <PaperAccent kind={piece.accent} /> : null}
        </span>
      );
    case "eight":
      return (
        <span className="glyph glyph-eight" style={style}>
          <img className="eight-loop is-top" src={publicUrl(piece.loops[0])} alt="" draggable={false} />
          <img className="eight-loop is-bottom" src={publicUrl(piece.loops[1])} alt="" draggable={false} />
        </span>
      );
    case "tag":
      return (
        <span className="glyph glyph-tag" style={style}>
          <span>{piece.char}</span>
          {piece.accent ? <PaperAccent kind={piece.accent} /> : null}
        </span>
      );
    case "tick":
      return <span className={`glyph glyph-tick is-${piece.tick}`} style={style} />;
    default: {
      const unexpected: never = piece;
      return unexpected;
    }
  }
}

export function CollageText({
  text,
  as = "p",
  size = "title",
  align = "center",
}: {
  text: string;
  as?: Tag;
  size?: Size;
  align?: Align;
}) {
  const words = layoutCollage(text);
  const TagName = as;
  return (
    <TagName className="collage-text" data-size={size} data-align={align} aria-label={text}>
      <span className="sr-only">{text}</span>
      <span className="collage-line" aria-hidden="true">
        {words.map((word, index) => (
          <span className="collage-word" key={`${word.text}-${index}`}>
            {word.pieces.map((piece) => (
              <PieceView key={piece.key} piece={piece} />
            ))}
          </span>
        ))}
      </span>
    </TagName>
  );
}
