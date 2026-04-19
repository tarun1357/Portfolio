/**
 * Restore experience, projects, stack, system-design, and achievements from `content/*.ts`
 * without deleting `site_profile` (hero, chat context, about pillars, education, unanswered Qs).
 *
 * Run: npm run db:restore-content
 */
import "dotenv/config";

import { achievements } from "../content/achievements";
import { experience } from "../content/experience";
import { projects } from "../content/projects";
import { stackGroups } from "../content/stack";
import { systemDesignHighlights } from "../content/system-design";
import { prisma } from "../lib/prisma";

const STACK_ICON_KEYS = ["code2", "servercog", "cloud", "wrench"] as const;

async function main() {
  await prisma.$transaction(async (tx) => {
    await tx.highlightMetric.deleteMany();
    await tx.experienceHighlight.deleteMany();
    await tx.experienceRole.deleteMany();
    await tx.projectStackTag.deleteMany();
    await tx.projectImpactLine.deleteMany();
    await tx.projectLink.deleteMany();
    await tx.project.deleteMany();
    await tx.stackItem.deleteMany();
    await tx.stackGroup.deleteMany();
    await tx.systemDesignCard.deleteMany();
    await tx.achievement.deleteMany();
  });

  for (let gi = 0; gi < stackGroups.length; gi++) {
    const g = stackGroups[gi];
    await prisma.stackGroup.create({
      data: {
        title: g.title,
        sortOrder: gi,
        iconKey: STACK_ICON_KEYS[gi] ?? null,
        items: {
          create: g.items.map((label, ii) => ({
            label,
            sortOrder: ii,
            iconUrl: null,
            accentColor: null,
          })),
        },
      },
    });
  }

  for (let ri = 0; ri < experience.length; ri++) {
    const role = experience[ri];
    await prisma.experienceRole.create({
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
              h.metrics && h.metrics.length > 0
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

  for (let pi = 0; pi < projects.length; pi++) {
    const p = projects[pi];
    await prisma.project.create({
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

  for (let si = 0; si < systemDesignHighlights.length; si++) {
    const s = systemDesignHighlights[si];
    await prisma.systemDesignCard.create({
      data: {
        topic: s.topic,
        angle: s.angle,
        sortOrder: si,
      },
    });
  }

  for (let ai = 0; ai < achievements.length; ai++) {
    const a = achievements[ai];
    await prisma.achievement.create({
      data: {
        title: a.title,
        detail: a.detail,
        tone: a.tone,
        sortOrder: ai,
      },
    });
  }

  console.log(
    "Restored stack, experience, projects, system-design, achievements from content/*.ts (site_profile unchanged).",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
