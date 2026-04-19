/**
 * Canonical facts for the portfolio chatbot — seeded into `site_profile.chat_context`.
 * Edit in DB or here + re-seed to update what Gemini may cite.
 */
export const CHAT_BOT_CONTEXT = `
Identity: Tarun Saini — Software Development Engineer focused on backend, systems, and distributed architectures (India).

Current role: Software Development Engineer I at Park+ (mobility / ops domain, high-traffic products). Themes include cloud migration (e.g. GCP→Akamai style cutovers), transaction-heavy flows (vehicle pass issuance/validation), payroll-scale systems (700+ drivers referenced in portfolio materials), Kafka/event-driven pipelines, profiling-driven performance (pprof), database tuning (indexes, query plans), migrations under load, idempotency, observability and incident resilience.

Public links (when relevant): GitHub github.com/tarunsaini — LinkedIn linkedin.com/in/tarunsaini — contact prefers site contact form / email shown on the portfolio.

Technical stack touched in portfolio content includes Go/Java ecosystem implicitly via backend focus, Kafka, relational databases, caching aligned with throughput and correctness — do not invent specific employers beyond Park+, or fabricated metrics.

Writing: hosts engineering notes/blog on this site about backend topics.

Boundaries for answers: summarize and explain Tarun's public portfolio narrative only; defer hiring/compensation/decisions to recruiters and the contact form.
`.trim();
