import { createHmac, timingSafeEqual } from "crypto";

import { NextResponse } from "next/server";

function getCookieValue(
  req: Request,
  name: string,
): string | undefined {
  const header = req.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const s = part.trim();
    const i = s.indexOf("=");
    if (i === -1) continue;
    const k = s.slice(0, i);
    if (k === name) {
      return decodeURIComponent(s.slice(i + 1).replace(/\+/g, " "));
    }
  }
  return undefined;
}

/** HttpOnly cookie set by POST `/api/dashboard/login`. */
export const DASHBOARD_COOKIE_NAME = "pf_dash";

const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

export function signDashboardSession(secret: string): string {
  const exp = Date.now() + SESSION_MS;
  const payload = Buffer.from(JSON.stringify({ exp }), "utf8").toString(
    "base64url",
  );
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyDashboardSessionToken(
  token: string | undefined,
  secret: string,
): boolean {
  if (!token || !secret) return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", secret).update(payload).digest(
    "base64url",
  );
  try {
    if (sig.length !== expected.length) return false;
    if (
      !timingSafeEqual(Buffer.from(sig, "utf8"), Buffer.from(expected, "utf8"))
    )
      return false;
  } catch {
    return false;
  }
  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString(),
    ) as { exp?: number };
    return typeof parsed.exp === "number" && Date.now() < parsed.exp;
  } catch {
    return false;
  }
}

/** Returns a JSON error response when the browser is not authenticated for dashboard APIs. */
export function dashboardUnauthorized(req: Request): NextResponse | null {
  const secret = process.env.DASHBOARD_SESSION_SECRET?.trim();
  if (!secret || secret.length < 16) {
    return NextResponse.json(
      {
        error:
          "Dashboard is not configured. Set DASHBOARD_SESSION_SECRET (16+ chars) in the environment.",
      },
      { status: 503 },
    );
  }
  const token = getCookieValue(req, DASHBOARD_COOKIE_NAME);
  if (!verifyDashboardSessionToken(token, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
