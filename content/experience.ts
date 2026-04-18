export type Role = {
  company: string;
  title: string;
  location: string;
  period: string;
  summary: string;
  highlights: { title: string; detail: string; metrics?: string[] }[];
};

export const experience: Role[] = [
  {
    company: "Park+",
    title: "Software Development Engineer I",
    location: "India",
    period: "Present",
    summary:
      "Backend ownership for high-traffic mobility and ops products. Work spans cloud migration, transaction-heavy services, payroll at scale, and Kafka-centric event pipelines—always with an eye on latency, cost, and incident resilience.",
    highlights: [
      {
        title: "Cloud migration (GCP → Akamai)",
        detail:
          "Planned and executed infrastructure and application cutovers with minimal downtime, revisiting networking, secrets, observability, and rollback paths so services stayed predictable under traffic.",
        metrics: ["Multi-environment parity", "Runbooks + staged rollout"],
      },
      {
        title: "Vehicle Pass System",
        detail:
          "Owned flows serving very high transaction volume—consistency around issuance/validation, hot paths tuned for throughput, and defensive handling when dependencies jitter.",
        metrics: ["Peak traffic–aware design", "DB + cache alignment"],
      },
      {
        title: "Driver payroll platform",
        detail:
          "End-to-end payroll for 700+ drivers with auditable computation, reconciliation, and failure recovery so money movement stays explainable.",
        metrics: ["700+ drivers covered", "Batch + idempotency patterns"],
      },
      {
        title: "Kafka & event-driven architecture",
        detail:
          "Built and evolved producers/consumers with clear contracts, dead-letter discipline, and backpressure-aware processing to keep pipelines reliable as load grew.",
        metrics: ["Topic design", "Operational playbooks"],
      },
      {
        title: "Performance engineering",
        detail:
          "Used pprof and database tuning (indexes, query plans, connection behavior) to turn profiling signals into measurable wins—not guesswork.",
        metrics: ["pprof-led fixes", "Query + index iteration"],
      },
    ],
  },
];
