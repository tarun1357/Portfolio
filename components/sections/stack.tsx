import { Cloud, Code2, LucideIcon, ServerCog, Wrench } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import type { StackGroupDTO } from "@/lib/page-types";

const FALLBACK_ICONS = [Code2, ServerCog, Cloud, Wrench] as const;

const ICON_MAP: Record<string, LucideIcon> = {
  code2: Code2,
  servercog: ServerCog,
  cloud: Cloud,
  wrench: Wrench,
};

function resolveGroupIcon(
  iconKey: string | null | undefined,
  index: number,
): LucideIcon {
  const k = iconKey?.toLowerCase();
  if (k && ICON_MAP[k]) return ICON_MAP[k];
  return FALLBACK_ICONS[index % FALLBACK_ICONS.length];
}

export function Stack({ stackGroups }: { stackGroups: StackGroupDTO[] }) {
  return (
    <Section
      id="stack"
      eyebrow="Tech stack"
      title="Tools I reach for—grouped, not a logo soup."
      description="Grouped by how I think about work: languages, backend primitives, infra, and the observability habits that keep services explainable."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {stackGroups.map((g, i) => {
          const Icon = resolveGroupIcon(g.iconKey, i);
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
                  {g.items.map((item, ii) => (
                    <li
                      key={`${g.title}-${ii}-${item.label}`}
                      className="flex items-start gap-2 text-sm text-zinc-300"
                    >
                      {item.iconUrl ? (
                        // Arbitrary URLs from CMS — `<img>` avoids widening `next/image` domains.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.iconUrl}
                          alt=""
                          width={16}
                          height={16}
                          className="mt-0.5 h-4 w-4 shrink-0"
                        />
                      ) : (
                        <span
                          aria-hidden
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-500/70"
                          style={
                            item.accentColor
                              ? { backgroundColor: item.accentColor }
                              : undefined
                          }
                        />
                      )}
                      <span
                        className={item.accentColor ? "" : undefined}
                        style={{ color: item.accentColor ?? undefined }}
                      >
                        {item.label}
                      </span>
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
