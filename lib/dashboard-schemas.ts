import { z } from "zod";

export const siteProfilePatchSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  focus: z.string().min(1),
  heroHeadline: z.string().min(1),
  heroSub: z.string(),
  githubUrl: z.string().min(1),
  linkedinUrl: z.string().min(1),
  emailMailto: z.string().min(1),
  chatContext: z.string().nullable(),
});

export const aboutPutSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  description: z.string(),
  pillars: z.array(
    z.object({
      label: z.string(),
      body: z.string(),
    }),
  ),
});

export const educationPutSchema = z.array(
  z.object({
    institution: z.string(),
    degree: z.string(),
    period: z.string(),
    detail: z.string(),
  }),
);

export const experienceHighlightSchema = z.object({
  title: z.string(),
  detail: z.string(),
  metrics: z.array(z.string()),
});

export const experienceRoleSchema = z.object({
  company: z.string(),
  title: z.string(),
  location: z.string(),
  period: z.string(),
  summary: z.string(),
  highlights: z.array(experienceHighlightSchema),
});

export const experiencePutSchema = z.array(experienceRoleSchema);

export const projectPutSchema = z.array(
  z.object({
    name: z.string(),
    problem: z.string(),
    solution: z.string(),
    stack: z.array(z.string()),
    impact: z.array(z.string()),
    links: z.array(
      z.object({
        label: z.string(),
        href: z.string(),
      }),
    ),
  }),
);

export const stackPutSchema = z.array(
  z.object({
    title: z.string(),
    iconKey: z.string().nullable(),
    items: z.array(
      z.object({
        label: z.string(),
        iconUrl: z.string().nullable(),
        accentColor: z.string().nullable(),
      }),
    ),
  }),
);

export const systemDesignPutSchema = z.array(
  z.object({
    topic: z.string(),
    angle: z.string(),
  }),
);

export const achievementsPutSchema = z.array(
  z.object({
    title: z.string(),
    detail: z.string(),
    tone: z.string(),
  }),
);
