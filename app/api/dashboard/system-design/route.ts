import { NextResponse } from "next/server";

import { dashboardUnauthorized } from "@/lib/dashboard-auth";
import { systemDesignPutSchema } from "@/lib/dashboard-schemas";
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

  const parsed = systemDesignPutSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const cards = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.systemDesignCard.deleteMany();
    await tx.systemDesignCard.createMany({
      data: cards.map((c, i) => ({
        topic: c.topic,
        angle: c.angle,
        sortOrder: i,
      })),
    });
  });

  return NextResponse.json({ ok: true });
}
