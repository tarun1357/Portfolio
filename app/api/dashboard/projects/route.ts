import { NextResponse } from "next/server";

import { dashboardUnauthorized } from "@/lib/dashboard-auth";
import { projectPutSchema } from "@/lib/dashboard-schemas";
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

  const parsed = projectPutSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const projects = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.project.deleteMany();
    for (let pi = 0; pi < projects.length; pi++) {
      const p = projects[pi];
      await tx.project.create({
        data: {
          name: p.name,
          problem: p.problem,
          solution: p.solution,
          sortOrder: pi,
          stackTags: {
            create: p.stack.map((tag, ti) => ({
              tag,
              sortOrder: ti,
            })),
          },
          impactLines: {
            create: p.impact.map((line, li) => ({
              line,
              sortOrder: li,
            })),
          },
          links: {
            create: p.links.map((link, li) => ({
              label: link.label,
              href: link.href,
              sortOrder: li,
            })),
          },
        },
      });
    }
  });

  return NextResponse.json({ ok: true });
}
