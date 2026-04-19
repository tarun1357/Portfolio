/** Shapes consumed by section components (stable API over DB or static fallback). */

export type SiteDTO = {
  name: string;
  role: string;
  focus: string;
  url: string;
  links: {
    github: string;
    linkedin: string;
    email: string;
  };
  hero: {
    headline: string;
    sub: string;
  };
};

export type ExperienceHighlightDTO = {
  title: string;
  detail: string;
  metrics: string[];
};

export type ExperienceRoleDTO = {
  company: string;
  title: string;
  location: string;
  period: string;
  summary: string;
  highlights: ExperienceHighlightDTO[];
};

export type ProjectDTO = {
  name: string;
  problem: string;
  solution: string;
  stack: string[];
  impact: string[];
  links: { label: string; href: string }[];
};

export type StackItemDTO = {
  label: string;
  iconUrl: string | null;
  accentColor: string | null;
};

export type StackGroupDTO = {
  title: string;
  iconKey: string | null;
  items: StackItemDTO[];
};

export type SystemDesignCardDTO = {
  topic: string;
  angle: string;
};

export type AchievementDTO = {
  title: string;
  detail: string;
  tone: string;
};

export type AboutPillarDTO = {
  label: string;
  body: string;
};

export type AboutDTO = {
  eyebrow: string;
  title: string;
  description: string;
  pillars: AboutPillarDTO[];
};

export type EducationEntryDTO = {
  institution: string;
  degree: string;
  period: string;
  detail: string;
};

export type PageData = {
  site: SiteDTO;
  about: AboutDTO;
  education: EducationEntryDTO[];
  experience: ExperienceRoleDTO[];
  projects: ProjectDTO[];
  stackGroups: StackGroupDTO[];
  systemDesign: SystemDesignCardDTO[];
  achievements: AchievementDTO[];
};
