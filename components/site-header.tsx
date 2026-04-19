import Link from "next/link";

const tailLinks = [
  { href: "#experience", label: "Experience" },
  { href: "#systems", label: "Systems" },
  { href: "#projects", label: "Projects" },
  { href: "#stack", label: "Stack" },
  { href: "#achievements", label: "Achievements" },
  { href: "#contact", label: "Contact" },
] as const;

export function SiteHeader({
  siteName,
  focusHint,
  showEducation,
}: {
  siteName: string;
  focusHint: string;
  showEducation: boolean;
}) {
  const links = [
    { href: "#about", label: "About" },
    ...(showEducation ? [{ href: "#education" as const, label: "Education" }] : []),
    ...tailLinks,
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md supports-[backdrop-filter]:bg-zinc-950/70">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight text-zinc-100"
        >
          {siteName}
          <span className="text-zinc-600"> · </span>
          <span className="font-normal text-zinc-400">{focusHint}</span>
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-100"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/blog"
            className="text-xs font-medium text-emerald-400/90 transition-colors hover:text-emerald-300"
          >
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
