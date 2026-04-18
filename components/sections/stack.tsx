import { Cloud, Code2, ServerCog, Wrench } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { stackGroups } from "@/content/stack";

const icons = [Code2, ServerCog, Cloud, Wrench] as const;

export function Stack() {
  return (
    <Section
      id="stack"
      eyebrow="Tech stack"
      title="Tools I reach for—grouped, not a logo soup."
      description="Grouped by how I think about work: languages, backend primitives, infra, and the observability habits that keep services explainable."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {stackGroups.map((g, i) => {
          const Icon = icons[i] ?? Code2;
          return (
            <Reveal key={g.title} delay={i * 0.05}>
              <div className="rounded-xl border border-zinc-800/90 bg-zinc-900/20 p-6">
                <div className="flex items-center gap-2">
                  <Icon
                    aria-hidden
                    className="h-4 w-4 text-emerald-500/90"
                    strokeWidth={1.75}
                  />
                  <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
                    {g.title}
                  </h3>
                </div>
                <ul className="mt-4 space-y-2">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-zinc-300"
                    >
                      <span
                        aria-hidden
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-500/70"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
