"use client";

import type { AchievementDTO } from "@/lib/page-types";
import { useState } from "react";

const input =
  "mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-600/80 focus:ring-2 focus:ring-emerald-500/30";

export function AchievementsForm({ initial }: { initial: AchievementDTO[] }) {
  const [rows, setRows] = useState<AchievementDTO[]>(() =>
    initial.length ? structuredClone(initial) : [{ title: "", detail: "", tone: "" }],
  );
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [pending, setPending] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setErr("");
    setPending(true);
    try {
      const res = await fetch("/api/dashboard/achievements", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rows),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErr(data.error ?? "Save failed.");
        return;
      }
      setMsg("Saved.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">Achievements</h1>
        <p className="mt-1 text-sm text-zinc-500">Replaces all achievement rows.</p>
      </div>
      <form onSubmit={save} className="max-w-xl space-y-6">
        {rows.map((r, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
            <div className="flex justify-between">
              <span className="font-mono text-xs text-zinc-500">Row {i + 1}</span>
              <button
                type="button"
                className="text-xs text-red-400 hover:underline"
                onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))}
              >
                Remove
              </button>
            </div>
            <label className="block text-sm">
              <span className="text-zinc-400">Title</span>
              <input
                className={input}
                value={r.title}
                onChange={(e) =>
                  setRows((prev) =>
                    prev.map((x, j) =>
                      j === i ? { ...x, title: e.target.value } : x,
                    ),
                  )
                }
              />
            </label>
            <label className="block text-sm">
              <span className="text-zinc-400">Detail</span>
              <input
                className={input}
                value={r.detail}
                onChange={(e) =>
                  setRows((prev) =>
                    prev.map((x, j) =>
                      j === i ? { ...x, detail: e.target.value } : x,
                    ),
                  )
                }
              />
            </label>
            <label className="block text-sm">
              <span className="text-zinc-400">Tone</span>
              <textarea
                className={`${input} min-h-[72px]`}
                value={r.tone}
                onChange={(e) =>
                  setRows((prev) =>
                    prev.map((x, j) =>
                      j === i ? { ...x, tone: e.target.value } : x,
                    ),
                  )
                }
              />
            </label>
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-emerald-400 hover:underline"
          onClick={() =>
            setRows((prev) => [...prev, { title: "", detail: "", tone: "" }])
          }
        >
          + Add achievement
        </button>
        {err ? (
          <p className="text-sm text-red-400" role="alert">
            {err}
          </p>
        ) : null}
        {msg ? <p className="text-sm text-emerald-400">{msg}</p> : null}
        <button
          type="submit"
          disabled={pending || rows.length === 0}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-40"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
}
