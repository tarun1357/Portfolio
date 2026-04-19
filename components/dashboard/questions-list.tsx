"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function QuestionsList({
  initial,
}: {
  initial: Array<{ id: number; questionText: string; createdAt: string }>;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<number | null>(null);

  async function remove(id: number) {
    setPending(id);
    try {
      const res = await fetch(`/api/dashboard/unanswered/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) return;
      router.refresh();
    } finally {
      setPending(null);
    }
  }

  if (initial.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No unanswered questions yet. When the chat bot does not have an answer in your published
        context, visitor questions are stored here.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {initial.map((q) => (
        <li
          key={q.id}
          className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="min-w-0 space-y-1">
            <p className="text-sm text-zinc-200">{q.questionText}</p>
            <p className="font-mono text-xs text-zinc-500">
              {new Date(q.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            type="button"
            disabled={pending === q.id}
            className="shrink-0 text-xs text-red-400 hover:underline disabled:opacity-40"
            onClick={() => remove(q.id)}
          >
            {pending === q.id ? "Removing…" : "Dismiss"}
          </button>
        </li>
      ))}
    </ul>
  );
}
