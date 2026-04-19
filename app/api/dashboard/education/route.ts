import { NextResponse } from "next/server";

import { dashboardUnauthorized } from "@/lib/dashboard-auth";
import { educationPutSchema } from "@/lib/dashboard-schemas";
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

  const parsed = educationPutSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const rows = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.educationEntry.deleteMany({ where: { siteProfileId: 1 } });
    if (rows.length > 0) {
      await tx.educationEntry.createMany({
        data: rows.map((e, i) => ({
          siteProfileId: 1,
          institution: e.institution,
          degree: e.degree,
          period: e.period,
          detail: e.detail,
          sortOrder: i,
        })),
      });
    }
  });

  return NextResponse.json({ ok: true });
}
