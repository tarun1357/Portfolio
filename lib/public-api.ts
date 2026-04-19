import { NextResponse } from "next/server";

/** Avoid edge/browser caching stale portfolio JSON — same freshness as DB-backed pages. */
export const PUBLIC_JSON_HEADERS = {
  "Cache-Control": "private, no-store",
} as const;

export function jsonPublic(body: unknown) {
  return NextResponse.json(body, { headers: PUBLIC_JSON_HEADERS });
}
