/** Vercel UI sometimes saves values wrapped in straight quotes — breaks APIs. */
export function stripWrappingQuotes(s: string): string {
  const t = s.trim();
  if (
    t.length >= 2 &&
    ((t.startsWith('"') && t.endsWith('"')) ||
      (t.startsWith("'") && t.endsWith("'")))
  ) {
    return t.slice(1, -1).trim();
  }
  return t;
}
