import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { projects } from "@/content/projects";

export function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Systems with measurable outcomes."
      description="Representative work where the hard part wasn’t CRUD—it was correctness, throughput, and operational clarity."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.06}>
            <article className="flex h-full flex-col rounded-2xl border border-zinc-800/90 bg-zinc-950/40 p-6 sm:p-7">
              <h3 className="text-lg font-semibold text-zinc-50">{p.name}</h3>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                    Problem
                  </dt>
                  <dd className="mt-1 leading-relaxed text-zinc-400">
                    {p.problem}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                    Solution
                  </dt>
                  <dd className="mt-1 leading-relaxed text-zinc-300">
                    {p.solution}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                    Stack
                  </dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {p.stack.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-zinc-900/80 px-2 py-1 font-mono text-[11px] text-zinc-400"
                      >
                        {t}
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                    Impact
                  </dt>
                  <dd className="mt-2">
                    <ul className="list-inside list-disc space-y-1 text-zinc-400">
                      {p.impact.map((x) => (
                        <li key={x} className="leading-relaxed">
                          {x}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-3 border-t border-zinc-800/80 pt-6">
                {p.links.map((l) =>
                  l.href.startsWith("http") ? (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-emerald-400/90 transition-colors hover:text-emerald-300"
                    >
                      {l.label} →
                    </a>
                  ) : (
                    <Link
                      key={l.label}
                      href={l.href}
                      className="text-sm font-medium text-emerald-400/90 transition-colors hover:text-emerald-300"
                    >
                      {l.label} →
                    </Link>
                  ),
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
