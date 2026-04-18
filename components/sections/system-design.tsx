import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import type { SystemDesignCardDTO } from "@/lib/page-types";

export function SystemDesignSection({
  cards,
}: {
  cards: SystemDesignCardDTO[];
}) {
  return (
    <Section
      id="systems"
      eyebrow="Systems"
      title="Design highlights recruiters can skim in 30 seconds."
      description="Short notes on how I think about reliability—not buzzwords. Each item maps to trade-offs I’ve argued for in production."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((item, i) => (
          <Reveal key={`${item.topic}-${i}`} delay={i * 0.05}>
            <div className="h-full rounded-xl border border-zinc-800/90 bg-zinc-900/25 p-6 transition-colors hover:border-zinc-700/90">
              <h3 className="text-base font-semibold text-zinc-100">
                {item.topic}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {item.angle}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
