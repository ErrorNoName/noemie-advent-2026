export type DoorStatus = "locked" | "available" | "opened";

/**
 * Une case déjà ouverte reste rejouable, même si la date est encore future
 * (ouverture faite en preview). Sinon : débloquée à partir du jour Paris,
 * ou tout de suite avec ?dev=1 / ?preview=all.
 * /test et ?test=1 ouvrent les huit cases, quelle que soit la date.
 */
export function doorStatus(input: {
  date: string;
  today: string;
  opened: boolean;
  dev: boolean;
  test?: boolean;
}): DoorStatus {
  if (input.test || input.opened) return "opened";
  if (input.dev || input.today >= input.date) return "available";
  return "locked";
}

export function stateLabel(status: DoorStatus, date: string, today: string): string {
  switch (status) {
    case "locked":
      return "bientôt";
    case "opened":
      return "revoir";
    case "available":
      return date === today ? "aujourd’hui" : "ouvrir";
    default: {
      const unexpected: never = status;
      return unexpected;
    }
  }
}
