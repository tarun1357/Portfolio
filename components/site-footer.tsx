import Link from "next/link";

import type { SiteDTO } from "@/lib/page-types";

export function SiteFooter({ site }: { site: SiteDTO }) {
  return (
    <footer className="border-t border-zinc-800/80 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs text-zinc-500">
            © {new Date().getFullYear()} {site.name}
          </p>
          <p className="mt-1 text-sm text-zinc-400">{site.focus}</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a
            href={site.links.github}
            className="text-zinc-400 transition-colors hover:text-zinc-100"
          >
            GitHub
          </a>
          <a
            href={site.links.linkedin}
            className="text-zinc-400 transition-colors hover:text-zinc-100"
          >
            LinkedIn
          </a>
          <a
            href={site.links.email}
            className="text-zinc-400 transition-colors hover:text-zinc-100"
          >
            Email
          </a>
          <Link
            href="/blog"
            className="text-zinc-400 transition-colors hover:text-zinc-100"
          >
            Writing
          </Link>
        </div>
      </div>
    </footer>
  );
}
