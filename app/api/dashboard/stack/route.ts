import { NextResponse } from "next/server";

import { dashboardUnauthorized } from "@/lib/dashboard-auth";
import { stackPutSchema } from "@/lib/dashboard-schemas";
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

  const parsed = stackPutSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const groups = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.stackGroup.deleteMany();
    for (let gi = 0; gi < groups.length; gi++) {
      const g = groups[gi];
      await tx.stackGroup.create({
        data: {
          title: g.title,
          sortOrder: gi,
          iconKey: g.iconKey,
          items: {
            create: g.items.map((it, ii) => ({
              label: it.label,
              sortOrder: ii,
              iconUrl: it.iconUrl,
              accentColor: it.accentColor,
            })),
          },
        },
      });
    }
  });

  return NextResponse.json({ ok: true });
}
