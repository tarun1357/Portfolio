import { NextResponse } from "next/server";

import { dashboardUnauthorized } from "@/lib/dashboard-auth";
import { siteProfilePatchSchema } from "@/lib/dashboard-schemas";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(req: Request) {
  const denied = dashboardUnauthorized(req);
  if (denied) return denied;

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = siteProfilePatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const d = parsed.data;
  await prisma.siteProfile.update({
    where: { id: 1 },
    data: {
      name: d.name,
      role: d.role,
      focus: d.focus,
      heroHeadline: d.heroHeadline,
      heroSub: d.heroSub,
      githubUrl: d.githubUrl,
      linkedinUrl: d.linkedinUrl,
      emailMailto: d.emailMailto,
      chatContext: d.chatContext,
    },
  });

  return NextResponse.json({ ok: true });
}
