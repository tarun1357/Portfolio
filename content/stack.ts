export const stackGroups = [
  {
    title: "Languages",
    items: ["Go", "Python", "SQL", "TypeScript"],
  },
  {
    title: "Backend",
    items: [
      "REST / RPC-style APIs",
      "PostgreSQL",
      "Kafka",
      "Caching strategies",
      "Distributed transactions (patterns)",
      "Background jobs & scheduling",
    ],
  },
  {
    title: "DevOps / infra",
    items: ["GCP", "Akamai / edge & CDN concepts", "Docker", "CI/CD", "Linux"],
  },
  {
    title: "Tools & practice",
    items: ["pprof / profiling", "Structured logging", "Metrics & tracing", "Load testing mindset"],
  },
] as const;
