import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { isGateCode } from "../lib/code.ts";
import { ChromeBlobs } from "./ChromeBlobs.tsx";
import { useGentle } from "../hooks/useGentle.ts";

export function Gate({ recipient, onUnlock }: { recipient: string; onUnlock: () => void }) {
  const { fade } = useGentle();
  const [value, setValue] = useState("");
  const [fails, setFails] = useState(0);
  const [error, setError] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (isGateCode(value, recipient)) {
      onUnlock();
      return;
    }
    setError(true);
    setFails((count) => count + 1);
  }

  return (
    <div className="column relative flex min-h-dvh flex-col justify-center px-5 py-10">
      <ChromeBlobs />
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={fade}
      >
        <article className="ticket">
          <span className="ticket-notch left" />
          <span className="ticket-notch right" />
          <p className="eyebrow">Admit two</p>
          <p className="mt-3 font-serif text-sm uppercase tracking-[0.18em] text-mute">Tu es invitée</p>
          <h1 className="mt-2 font-serif text-5xl italic leading-none text-ink">Pour {recipient}</h1>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-ink">
            Huit matins, du 14 au 21 octobre.
            <br />
            Un cadeau par jour. Le reste reste secret.
          </p>
          <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
            <label className="text-sm text-mute" htmlFor="gate-code">
              Ton prénom
            </label>
            <input
              id="gate-code"
              className="field"
              autoComplete="given-name"
              autoCapitalize="words"
              enterKeyHint="go"
              placeholder="Écris-le ici"
              value={value}
              aria-invalid={error}
              aria-describedby={error ? "gate-error" : undefined}
              onChange={(event) => {
                setValue(event.target.value);
                setError(false);
              }}
            />
            {error ? (
              <p id="gate-error" className="font-serif text-rose italic" role="alert">
                {fails >= 2 ? "Le prénom qu’on écrit sur le gâteau." : "Ce n’est pas tout à fait ça."}
              </p>
            ) : null}
            <button className="btn-ink" type="submit">
              Entrer
            </button>
          </form>
          <hr className="ticket-dash" />
          <div className="flex items-end justify-between gap-3">
            <p className="text-sm text-mute">Rien ici ne se partage.</p>
            <p className="font-serif text-xl italic">21 oct.</p>
          </div>
        </article>
      </motion.div>
    </div>
  );
}
