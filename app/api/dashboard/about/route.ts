import { NextResponse } from "next/server";

import { dashboardUnauthorized } from "@/lib/dashboard-auth";
import { aboutPutSchema } from "@/lib/dashboard-schemas";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function PUT(req: Request) {
  const denied = dashboardUnauthorized(req);
  if (denied) return denied;

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = aboutPutSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { eyebrow, title, description, pillars } = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.aboutPillar.deleteMany({ where: { siteProfileId: 1 } });
    await tx.siteProfile.update({
      where: { id: 1 },
      data: {
        aboutEyebrow: eyebrow,
        aboutTitle: title,
        aboutDescription: description,
      },
    });
    if (pillars.length > 0) {
      await tx.aboutPillar.createMany({
        data: pillars.map((p, i) => ({
          siteProfileId: 1,
          label: p.label,
          body: p.body,
          sortOrder: i,
        })),
      });
    }
  });

  return NextResponse.json({ ok: true });
}
