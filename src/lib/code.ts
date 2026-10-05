export function normalizeName(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

/** Le code est le prénom de la destinataire, accents et casse ignorés. */
export function isGateCode(input: string, recipient: string): boolean {
  if (input.trim().length === 0 || input.length > 40) return false;
  return normalizeName(input) === normalizeName(recipient);
}
