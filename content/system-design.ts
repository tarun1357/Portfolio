export const systemDesignHighlights = [
  {
    topic: "Traffic spikes & hot paths",
    angle:
      "Separate read/write models where it pays off; cache with explicit TTL and invalidation stories; protect databases with backpressure and bulkheads.",
  },
  {
    topic: "Events & Kafka",
    angle:
      "Schema-ish contracts between teams, idempotent consumers, DLQs, replay strategy, and metrics that reveal lag before users do.",
  },
  {
    topic: "Data correctness",
    angle:
      "Payroll-scale problems need reconciliation, audit trails, and jobs that can resume—correctness beats cleverness.",
  },
  {
    topic: "Observability",
    angle:
      "Golden signals per service, traces that tie user journeys to infra, and profiling (e.g. pprof) that turns spikes into commits.",
  },
] as const;
