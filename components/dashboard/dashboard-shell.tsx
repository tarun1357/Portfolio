import Link from "next/link";

import { DashboardLogoutButton } from "@/components/dashboard/logout-button";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/site", label: "Site & chat" },
  { href: "/dashboard/about", label: "About" },
  { href: "/dashboard/education", label: "Education" },
  { href: "/dashboard/experience", label: "Experience" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/stack", label: "Stack" },
  { href: "/dashboard/system-design", label: "System design" },
  { href: "/dashboard/achievements", label: "Achievements" },
  { href: "/dashboard/questions", label: "Chat gaps" },
] as const;

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:flex-row md:px-6">
        <aside className="w-full shrink-0 space-y-4 md:w-56">
          <div>
            <p className="font-mono text-xs text-zinc-500">Portfolio CMS</p>
            <Link
              href="/"
              className="mt-1 block text-sm text-emerald-400/90 hover:text-emerald-300"
            >
              ← View site
            </Link>
          </div>
          <nav className="flex flex-col gap-0.5 text-sm" aria-label="Dashboard">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-2 py-1.5 text-zinc-300 transition-colors hover:bg-zinc-800/80 hover:text-zinc-100"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <DashboardLogoutButton />
        </aside>
        <div className="min-w-0 flex-1 space-y-6">{children}</div>
      </div>
    </div>
  );
}
