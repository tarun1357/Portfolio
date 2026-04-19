import { NextResponse } from "next/server";

import { dashboardUnauthorized } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const denied = dashboardUnauthorized(req);
  if (denied) return denied;

  const { id } = await props.params;
  const num = Number(id);
  if (!Number.isFinite(num)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const row = await prisma.unansweredChatQuestion.findFirst({
    where: { id: num, siteProfileId: 1 },
  });
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.unansweredChatQuestion.delete({ where: { id: num } });
  return NextResponse.json({ ok: true });
}
