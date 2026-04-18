import { NextResponse } from "next/server";

/** Shared cache policy for read-only public portfolio JSON (matches `/api/public/page`). */
export const PUBLIC_JSON_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
} as const;

export function jsonPublic(body: unknown) {
  return NextResponse.json(body, { headers: PUBLIC_JSON_HEADERS });
}
