import type { AboutDTO } from "@/lib/page-types";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";

export function About({ data }: { data: AboutDTO }) {
  return (
    <Section
      id="about"
      eyebrow={data.eyebrow}
      title={data.title}
      description={data.description}
    >
      <Reveal>
        <div className="grid gap-8 lg:grid-cols-3">
          {data.pillars.map((pillar, i) => (
            <div
              key={`${pillar.label}-${i}`}
              className="rounded-xl border border-zinc-800/90 bg-zinc-900/30 p-6"
            >
              <p className="font-mono text-xs text-zinc-500">{pillar.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
