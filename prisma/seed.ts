/**
 * Seeds MySQL from legacy `content/*.ts` — run after migrate (`npm run db:seed`).
 */
import "dotenv/config";

import { CHAT_BOT_CONTEXT } from "../content/ai-context";
import { achievements } from "../content/achievements";
import { experience } from "../content/experience";
import { projects } from "../content/projects";
import { site } from "../content/site";
import { stackGroups } from "../content/stack";
import { systemDesignHighlights } from "../content/system-design";
import { prisma } from "../lib/prisma";

const STACK_ICON_KEYS = ["code2", "servercog", "cloud", "wrench"] as const;

async function clearContent() {
  await prisma.highlightMetric.deleteMany();
  await prisma.experienceHighlight.deleteMany();
  await prisma.experienceRole.deleteMany();
  await prisma.projectStackTag.deleteMany();
  await prisma.projectImpactLine.deleteMany();
  await prisma.projectLink.deleteMany();
  await prisma.project.deleteMany();
  await prisma.stackItem.deleteMany();
  await prisma.stackGroup.deleteMany();
  await prisma.systemDesignCard.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.siteProfile.deleteMany();
}

async function main() {
  await clearContent();

  await prisma.siteProfile.create({
    data: {
      id: 1,
      name: site.name,
      role: site.role,
      focus: site.focus,
      heroHeadline: site.hero.headline,
      heroSub: site.hero.sub,
      githubUrl: site.links.github,
      linkedinUrl: site.links.linkedin,
      emailMailto: site.links.email,
      chatContext: CHAT_BOT_CONTEXT,
    },
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
            metrics: h.metrics
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

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
