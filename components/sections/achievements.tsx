import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { achievements } from "@/content/achievements";

export function Achievements() {
  return (
    <Section
      id="achievements"
      eyebrow="Achievements"
      title="Proof of discipline—not the whole story."
      description="Useful signals for rigor and sustained practice; production impact lives in experience and projects above."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {achievements.map((a, i) => (
          <Reveal key={a.title} delay={i * 0.07}>
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-gradient-to-br from-emerald-950/35 via-zinc-950/40 to-zinc-950 p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl"
              />
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-400/90">
                {a.title}
              </p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-zinc-50">
                {a.detail}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {a.tone}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
