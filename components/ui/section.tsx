import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-28 border-t border-zinc-800/80 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
          {eyebrow ? (
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-400/90">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={`${id}-heading`}
            className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {description}
            </p>
          ) : null}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
