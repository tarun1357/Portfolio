import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  DASHBOARD_COOKIE_NAME,
  verifyDashboardSessionToken,
} from "@/lib/dashboard-auth";

/** Use in server components under `app/dashboard/(shell)/`. */
export async function requireDashboardSession(): Promise<void> {
  const secret = process.env.DASHBOARD_SESSION_SECRET?.trim();
  if (!secret || secret.length < 16) {
    redirect("/");
  }
  const c = await cookies();
  const token = c.get(DASHBOARD_COOKIE_NAME)?.value;
  if (!verifyDashboardSessionToken(token, secret)) {
    redirect("/dashboard/login");
  }
}

/** Login page — skip form when already signed in. */
export async function redirectIfDashboardAuthed(): Promise<void> {
  const secret = process.env.DASHBOARD_SESSION_SECRET?.trim();
  if (!secret || secret.length < 16) return;
  const c = await cookies();
  const token = c.get(DASHBOARD_COOKIE_NAME)?.value;
  if (verifyDashboardSessionToken(token, secret)) {
    redirect("/dashboard");
  }
}
