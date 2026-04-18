import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";

export function About() {
  return (
    <Section
      id="about"
      eyebrow="About"
      title="Backend-first, production-minded."
      description="I care about systems that stay boring when load gets interesting: clear contracts, measurable SLOs, and code that survives on-call—not slide decks."
    >
      <Reveal>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-xl border border-zinc-800/90 bg-zinc-900/30 p-6">
            <p className="font-mono text-xs text-zinc-500">Principle</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              Prefer{" "}
              <strong className="font-medium text-zinc-100">explicit</strong>{" "}
              failure modes over silent success. Make queues, timeouts, and
              retries observable.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800/90 bg-zinc-900/30 p-6">
            <p className="font-mono text-xs text-zinc-500">Execution</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              Ship iteratively with migration-friendly changes: feature flags,
              shadow reads, and progressive rollout instead of big-bang rewrites.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800/90 bg-zinc-900/30 p-6">
            <p className="font-mono text-xs text-zinc-500">Collaboration</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              Pair deeply with product and ops—metrics should answer business
              questions, not only decorate dashboards.
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
