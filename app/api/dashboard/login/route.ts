import { NextResponse } from "next/server";

import {
  DASHBOARD_COOKIE_NAME,
  signDashboardSession,
} from "@/lib/dashboard-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.DASHBOARD_SESSION_SECRET?.trim();
  const password = process.env.DASHBOARD_PASSWORD?.trim();
  if (!secret || secret.length < 16 || !password) {
    return NextResponse.json(
      {
        error:
          "Dashboard login is not configured (set DASHBOARD_PASSWORD and DASHBOARD_SESSION_SECRET).",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const pwd =
    typeof body === "object" &&
    body !== null &&
    "password" in body &&
    typeof (body as { password: unknown }).password === "string"
      ? (body as { password: string }).password
      : "";

  if (pwd !== password) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = signDashboardSession(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DASHBOARD_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
