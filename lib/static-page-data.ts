import { achievements } from "@/content/achievements";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { site as siteContent } from "@/content/site";
import { stackGroups } from "@/content/stack";
import { systemDesignHighlights } from "@/content/system-design";
import { resolveSiteUrl } from "@/lib/site-url";

import type { PageData } from "@/lib/page-types";

const STACK_ICON_KEYS = ["code2", "servercog", "cloud", "wrench"] as const;

/** Same document shape as DB-backed load — used when `DATABASE_URL` is unset or DB errors. */
export function buildStaticPageData(): PageData {
  return {
    site: {
      name: siteContent.name,
      role: siteContent.role,
      focus: siteContent.focus,
      url: resolveSiteUrl(),
      links: { ...siteContent.links },
      hero: { ...siteContent.hero },
    },
    experience: experience.map((role) => ({
      company: role.company,
      title: role.title,
      location: role.location,
      period: role.period,
      summary: role.summary,
      highlights: role.highlights.map((h) => ({
        title: h.title,
        detail: h.detail,
        metrics: h.metrics ? [...h.metrics] : [],
      })),
    })),
    projects: projects.map((p) => ({
      name: p.name,
      problem: p.problem,
      solution: p.solution,
      stack: [...p.stack],
      impact: [...p.impact],
      links: p.links.map((l) => ({ ...l })),
    })),
    stackGroups: stackGroups.map((g, i) => ({
      title: g.title,
      iconKey: STACK_ICON_KEYS[i] ?? null,
      items: g.items.map((label) => ({
        label,
        iconUrl: null,
        accentColor: null,
      })),
    })),
    systemDesign: systemDesignHighlights.map((s) => ({
      topic: s.topic,
      angle: s.angle,
    })),
    achievements: achievements.map((a) => ({
      title: a.title,
      detail: a.detail,
      tone: a.tone,
    })),
  };
}
