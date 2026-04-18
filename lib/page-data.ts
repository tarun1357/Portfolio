import { unstable_cache } from "next/cache";

import type { PageData, SiteDTO } from "@/lib/page-types";
import { prisma } from "@/lib/prisma";
import { resolveSiteUrl } from "@/lib/site-url";
import { buildStaticPageData } from "@/lib/static-page-data";

/** Used by `npm run verify:parity` after migrate + seed; not needed at runtime. */
export async function loadPageFromDatabase(): Promise<PageData> {
  const profile = await prisma.siteProfile.findUnique({ where: { id: 1 } });
  if (!profile) throw new Error("site_profile row missing (run prisma db seed)");

  const [stackGroups, roles, projects, systemCards, achievementRows] =
    await Promise.all([
      prisma.stackGroup.findMany({
        orderBy: { sortOrder: "asc" },
        include: { items: { orderBy: { sortOrder: "asc" } } },
      }),
      prisma.experienceRole.findMany({
        orderBy: { sortOrder: "asc" },
        include: {
          highlights: {
            orderBy: { sortOrder: "asc" },
            include: { metrics: { orderBy: { sortOrder: "asc" } } },
          },
        },
      }),
      prisma.project.findMany({
        orderBy: { sortOrder: "asc" },
        include: {
          stackTags: { orderBy: { sortOrder: "asc" } },
          impactLines: { orderBy: { sortOrder: "asc" } },
          links: { orderBy: { sortOrder: "asc" } },
        },
      }),
      prisma.systemDesignCard.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.achievement.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

  const site: SiteDTO = {
    name: profile.name,
    role: profile.role,
    focus: profile.focus,
    url: resolveSiteUrl(),
    links: {
      github: profile.githubUrl,
      linkedin: profile.linkedinUrl,
      email: profile.emailMailto,
    },
    hero: {
      headline: profile.heroHeadline,
      sub: profile.heroSub,
    },
  };

  return {
    site,
    experience: roles.map((r) => ({
      company: r.company,
      title: r.title,
      location: r.location,
      period: r.period,
      summary: r.summary,
      highlights: r.highlights.map((h) => ({
        title: h.title,
        detail: h.detail,
        metrics: h.metrics.map((m) => m.text),
      })),
    })),
    projects: projects.map((p) => ({
      name: p.name,
      problem: p.problem,
      solution: p.solution,
      stack: p.stackTags.map((t) => t.tag),
      impact: p.impactLines.map((l) => l.line),
      links: p.links.map((l) => ({ label: l.label, href: l.href })),
    })),
    stackGroups: stackGroups.map((g) => ({
      title: g.title,
      iconKey: g.iconKey,
      items: g.items.map((it) => ({
        label: it.label,
        iconUrl: it.iconUrl,
        accentColor: it.accentColor,
      })),
    })),
    systemDesign: systemCards.map((c) => ({
      topic: c.topic,
      angle: c.angle,
    })),
    achievements: achievementRows.map((a) => ({
      title: a.title,
      detail: a.detail,
      tone: a.tone,
    })),
  };
}

function shouldQueryDatabase(): boolean {
  if (!process.env.DATABASE_URL?.trim()) return false;
  // Opt out without deleting DATABASE_URL (e.g. placeholder URL when MySQL isn’t running).
  if (process.env.PORTFOLIO_USE_STATIC_CONTENT === "1") return false;
  return true;
}

async function loadPageDataUncached(): Promise<PageData> {
  if (!shouldQueryDatabase()) {
    return buildStaticPageData();
  }
  try {
    return await loadPageFromDatabase();
  } catch (e) {
    console.error("[page-data] Falling back to static content:", e);
    return buildStaticPageData();
  }
}

/** Cached portfolio document for RSC + metadata (revalidate: 60s). */
export const getPageData = unstable_cache(loadPageDataUncached, ["portfolio-page-v1"], {
  revalidate: 60,
  tags: ["portfolio"],
});
