"use client";

import type { EducationEntryDTO } from "@/lib/page-types";
import { useState } from "react";

const input =
  "mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-600/80 focus:ring-2 focus:ring-emerald-500/30";

function emptyRow(): EducationEntryDTO {
  return {
    institution: "",
    degree: "",
    period: "",
    detail: "",
  };
}

export function EducationForm({ initial }: { initial: EducationEntryDTO[] }) {
  const [rows, setRows] = useState<EducationEntryDTO[]>(() =>
    initial.length ? initial.map((r) => ({ ...r })) : [],
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
      const res = await fetch("/api/dashboard/education", {
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
        <h1 className="text-xl font-semibold text-zinc-100">Education</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Appears on the home page when at least one entry exists. Leave empty to hide the section.
        </p>
      </div>
      <form onSubmit={save} className="max-w-xl space-y-6">
        {rows.map((row, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-xs font-mono text-zinc-500">Entry {i + 1}</span>
              <button
                type="button"
                className="text-xs text-red-400 hover:underline"
                onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))}
              >
                Remove
              </button>
            </div>
            <label className="block text-sm">
              <span className="text-zinc-400">Institution</span>
              <input
                className={input}
                value={row.institution}
                onChange={(e) =>
                  setRows((prev) =>
                    prev.map((r, j) =>
                      j === i ? { ...r, institution: e.target.value } : r,
                    ),
                  )
                }
              />
            </label>
            <label className="block text-sm">
              <span className="text-zinc-400">Degree / program</span>
              <input
                className={input}
                value={row.degree}
                onChange={(e) =>
                  setRows((prev) =>
                    prev.map((r, j) =>
                      j === i ? { ...r, degree: e.target.value } : r,
                    ),
                  )
                }
              />
            </label>
            <label className="block text-sm">
              <span className="text-zinc-400">Period</span>
              <input
                className={input}
                value={row.period}
                onChange={(e) =>
                  setRows((prev) =>
                    prev.map((r, j) =>
                      j === i ? { ...r, period: e.target.value } : r,
                    ),
                  )
                }
              />
            </label>
            <label className="block text-sm">
              <span className="text-zinc-400">Detail</span>
              <textarea
                className={`${input} min-h-[72px]`}
                value={row.detail}
                onChange={(e) =>
                  setRows((prev) =>
                    prev.map((r, j) =>
                      j === i ? { ...r, detail: e.target.value } : r,
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
          onClick={() => setRows((prev) => [...prev, emptyRow()])}
        >
          + Add education entry
        </button>
        {err ? (
          <p className="text-sm text-red-400" role="alert">
            {err}
          </p>
        ) : null}
        {msg ? <p className="text-sm text-emerald-400">{msg}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-40"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
}
