/** Static fallback — matches seeded DB `about_*` + `about_pillar`. */

export const aboutSection = {
  eyebrow: "About",
  title: "Backend-first, production-minded.",
  description:
    "I care about systems that stay boring when load gets interesting: clear contracts, measurable SLOs, and code that survives on-call—not slide decks.",
  pillars: [
    {
      label: "Principle",
      body:
        "Prefer explicit failure modes over silent success. Make queues, timeouts, and retries observable.",
    },
    {
      label: "Execution",
      body:
        "Ship iteratively with migration-friendly changes: feature flags, shadow reads, and progressive rollout instead of big-bang rewrites.",
    },
    {
      label: "Collaboration",
      body:
        "Pair deeply with product and ops—metrics should answer business questions, not only decorate dashboards.",
    },
  ],
} as const;
