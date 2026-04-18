import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import type { ExperienceRoleDTO } from "@/lib/page-types";

export function Experience({ role }: { role: ExperienceRoleDTO }) {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Park+ · impact at scale"
      description={role.summary}
    >
      <Reveal>
        <article className="rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/40 to-zinc-950/30 p-6 sm:p-8">
          <header className="flex flex-col gap-2 border-b border-zinc-800/90 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-zinc-50">
                {role.company}
              </h3>
              <p className="mt-1 text-sm text-emerald-400/90">{role.title}</p>
            </div>
            <div className="font-mono text-xs text-zinc-500">
              <span>{role.period}</span>
              <span className="mx-2 text-zinc-700">·</span>
              <span>{role.location}</span>
            </div>
          </header>
          <ul className="mt-8 space-y-10">
            {role.highlights.map((h, idx) => (
              <li key={`${h.title}-${idx}`} className="relative pl-6">
                <span
                  aria-hidden
                  className="absolute left-0 top-2 h-2 w-2 rounded-full bg-emerald-500/80"
                />
                <h4 className="text-base font-medium text-zinc-100">
                  {h.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {h.detail}
                </p>
                {h.metrics.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {h.metrics.map((m) => (
                      <li
                        key={m}
                        className="rounded-md border border-zinc-800 bg-zinc-950/60 px-2.5 py-1 font-mono text-[11px] text-zinc-400"
                      >
                        {m}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {idx < role.highlights.length - 1 ? (
                  <div className="mt-10 h-px w-full bg-zinc-800/80" />
                ) : null}
              </li>
            ))}
          </ul>
        </article>
      </Reveal>
    </Section>
  );
}
