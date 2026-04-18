export type Project = {
  name: string;
  problem: string;
  solution: string;
  stack: string[];
  impact: string[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    name: "LMS & pitch evaluation platform",
    problem:
      "Learning and evaluation flows needed structured content delivery, submissions, and review—without fragile one-off scripts or opaque state.",
    solution:
      "Modeled domains with clear service boundaries, async work where appropriate, and APIs that stay honest about failure modes and retries.",
    stack: ["Go / service design", "PostgreSQL", "REST/gRPC-style APIs", "AuthN boundaries"],
    impact: [
      "Clearer ownership between content, attempts, and grading pipelines",
      "Operational logs and metrics tied to user journeys—not just HTTP 200s",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/tarunsaini" },
      { label: "Details (add case study)", href: "#contact" },
    ],
  },
  {
    name: "Driver payroll system",
    problem:
      "Paying hundreds of drivers on recurring cycles with correctness, audits, and recovery when upstream data drifts.",
    solution:
      "Deterministic computation paths, idempotent jobs, reconciliation reports, and explicit handling for partial failures—so finance and ops can trust the numbers.",
    stack: ["Batch & scheduling", "PostgreSQL", "Kafka (events)", "Observability"],
    impact: [
      "Scaled to 700+ drivers with traceable payout lineage",
      "Reduced firefighting via reconcilers and alerting on anomalies",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/tarunsaini" },
      { label: "Discuss", href: "#contact" },
    ],
  },
];
