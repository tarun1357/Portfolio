import { NextResponse } from "next/server";

import { dashboardUnauthorized } from "@/lib/dashboard-auth";
import { achievementsPutSchema } from "@/lib/dashboard-schemas";
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

  const parsed = achievementsPutSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const rows = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.achievement.deleteMany();
    await tx.achievement.createMany({
      data: rows.map((a, i) => ({
        title: a.title,
        detail: a.detail,
        tone: a.tone,
        sortOrder: i,
      })),
    });
  });

  return NextResponse.json({ ok: true });
}
