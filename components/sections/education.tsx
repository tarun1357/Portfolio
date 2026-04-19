import type { EducationEntryDTO } from "@/lib/page-types";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";

export function Education({ entries }: { entries: EducationEntryDTO[] }) {
  if (entries.length === 0) return null;

  return (
    <Section
      id="education"
      eyebrow="Education"
      title="Background & credentials."
      description="Where I studied and what I focused on—kept concise and verifiable."
    >
      <Reveal>
        <ul className="space-y-6">
          {entries.map((e, i) => (
            <li
              key={`${e.institution}-${e.period}-${i}`}
              className="rounded-xl border border-zinc-800/90 bg-zinc-900/30 p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-medium text-zinc-100">{e.institution}</h3>
                <span className="font-mono text-xs text-zinc-500">{e.period}</span>
              </div>
              <p className="mt-1 text-sm text-emerald-400/90">{e.degree}</p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">{e.detail}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
