import { NextResponse } from "next/server";

import { dashboardUnauthorized } from "@/lib/dashboard-auth";
import { experiencePutSchema } from "@/lib/dashboard-schemas";
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

  const parsed = experiencePutSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const roles = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.experienceRole.deleteMany();
    for (let ri = 0; ri < roles.length; ri++) {
      const role = roles[ri];
      await tx.experienceRole.create({
        data: {
          company: role.company,
          title: role.title,
          location: role.location,
          period: role.period,
          summary: role.summary,
          sortOrder: ri,
            highlights: {
            create: role.highlights.map((h, hi) => ({
              title: h.title,
              detail: h.detail,
              sortOrder: hi,
              metrics:
                h.metrics.length > 0
                  ? {
                      create: h.metrics.map((text, mi) => ({
                        text,
                        sortOrder: mi,
                      })),
                    }
                  : undefined,
            })),
          },
        },
      });
    }
  });

  return NextResponse.json({ ok: true });
}
