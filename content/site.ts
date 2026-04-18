import { resolveSiteUrl } from "@/lib/site-url";

export const site = {
  name: "Tarun Saini",
  role: "Software Development Engineer",
  focus: "Backend · Systems · Distributed architectures",
  /** Canonical URL — set NEXT_PUBLIC_SITE_URL on Vercel (may include or omit scheme). */
  url: resolveSiteUrl(),
  links: {
    github: "https://github.com/tarunsaini",
    linkedin: "https://www.linkedin.com/in/tarunsaini",
    email: "mailto:tarun.saini@example.com",
  },
  hero: {
    headline: "Building reliable backends at scale.",
    sub:
      "I design and ship services where throughput, correctness, and operability matter—migrations under load, event-driven flows, and performance work rooted in profiling and data.",
  },
};
