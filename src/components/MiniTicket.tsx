import type { ReactNode } from "react";

export function MiniTicket({ kicker, children }: { kicker: string; children: ReactNode }) {
  return (
    <div className="note-card">
      <p className="eyebrow">{kicker}</p>
      <div className="mt-2 font-serif text-[1.65rem] italic leading-snug text-ink">{children}</div>
    </div>
  );
}
