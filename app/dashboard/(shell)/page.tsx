import Link from "next/link";

import { loadDashboardBundle } from "@/lib/dashboard-load";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardOverviewPage() {
  const bundle = await loadDashboardBundle();
  const { page, unansweredQuestions } = bundle;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">Overview</h1>
        <p className="mt-2 max-w-xl text-sm text-zinc-500">
          Manage everything that powers the public portfolio: copy, projects, stack, and the chat
          assistant&apos;s verified context. Changes apply on the next page load for visitors.
        </p>
        <p className="mt-3 text-sm">
          <span className="text-zinc-500">Live site:</span>{" "}
          <a
            href={page.site.url}
            className="text-emerald-400 underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {page.site.url}
          </a>
        </p>
      </div>
      <dl className="grid max-w-lg gap-3 text-sm">
        <div className="flex justify-between gap-4 border-b border-zinc-800/80 pb-2">
          <dt className="text-zinc-500">Experience roles</dt>
          <dd className="text-zinc-200">{page.experience.length}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-zinc-800/80 pb-2">
          <dt className="text-zinc-500">Projects</dt>
          <dd className="text-zinc-200">{page.projects.length}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-zinc-800/80 pb-2">
          <dt className="text-zinc-500">Stack groups</dt>
          <dd className="text-zinc-200">{page.stackGroups.length}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-zinc-800/80 pb-2">
          <dt className="text-zinc-500">Unanswered chat questions</dt>
          <dd className="text-zinc-200">{unansweredQuestions.length}</dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/site"
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800/80"
        >
          Site & chat
        </Link>
        <Link
          href="/dashboard/questions"
          className="rounded-lg border border-emerald-900/80 bg-emerald-950/40 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-950/70"
        >
          Review chat gaps
        </Link>
      </div>
    </div>
  );
}
