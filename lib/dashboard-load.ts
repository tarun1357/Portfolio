import { loadPageFromDatabase } from "@/lib/page-data";
import type { PageData } from "@/lib/page-types";
import { prisma } from "@/lib/prisma";

export type DashboardUnanswered = {
  id: number;
  questionText: string;
  createdAt: string;
};

export type DashboardBundle = {
  page: PageData;
  chatContext: string | null;
  unansweredQuestions: DashboardUnanswered[];
};

/** Server-only snapshot for authenticated dashboard pages. */
export async function loadDashboardBundle(): Promise<DashboardBundle> {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error(
      "[dashboard] DATABASE_URL must be set — the CMS reads and writes MySQL.",
    );
  }
  if (process.env.PORTFOLIO_USE_STATIC_CONTENT === "1") {
    throw new Error(
      "[dashboard] Unset PORTFOLIO_USE_STATIC_CONTENT — the CMS requires Prisma.",
    );
  }

  const [page, unanswered, profile] = await Promise.all([
    loadPageFromDatabase(),
    prisma.unansweredChatQuestion.findMany({
      where: { siteProfileId: 1 },
      orderBy: { createdAt: "desc" },
    }),
    prisma.siteProfile.findUnique({
      where: { id: 1 },
      select: { chatContext: true },
    }),
  ]);

  return {
    page,
    chatContext: profile?.chatContext ?? null,
    unansweredQuestions: unanswered.map((r) => ({
      id: r.id,
      questionText: r.questionText,
      createdAt: r.createdAt.toISOString(),
    })),
  };
}
