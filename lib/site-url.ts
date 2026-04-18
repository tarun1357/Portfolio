/**
 * Normalizes NEXT_PUBLIC_SITE_URL so `new URL()` never throws (invalid URLs → 500 on boot).
 */
export function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return "http://localhost:3000";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `http://${raw}`;
}

export function getMetadataBase(): URL {
  try {
    return new URL(resolveSiteUrl());
  } catch {
    return new URL("http://localhost:3000");
  }
}
