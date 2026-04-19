"use client";

import type { AboutDTO } from "@/lib/page-types";
import { useState } from "react";

const input =
  "mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-600/80 focus:ring-2 focus:ring-emerald-500/30";

export function AboutForm({ initial }: { initial: AboutDTO }) {
  const [eyebrow, setEyebrow] = useState(initial.eyebrow);
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [pillars, setPillars] = useState(() =>
    initial.pillars.map((p) => ({ label: p.label, body: p.body })),
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
      const res = await fetch("/api/dashboard/about", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eyebrow,
          title,
          description,
          pillars,
        }),
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
        <h1 className="text-xl font-semibold text-zinc-100">About section</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Section heading and the three pillar cards shown under About on the home page.
        </p>
      </div>
      <form onSubmit={save} className="max-w-xl space-y-4">
        <label className="block text-sm">
          <span className="text-zinc-400">Eyebrow</span>
          <input className={input} value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="text-zinc-400">Title</span>
          <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="text-zinc-400">Description</span>
          <textarea
            className={`${input} min-h-[80px]`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <div className="space-y-4 pt-2">
          <p className="text-sm font-medium text-zinc-300">Pillar cards</p>
          {pillars.map((p, i) => (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
              <div className="flex justify-between gap-2">
                <span className="text-xs font-mono text-zinc-500">Card {i + 1}</span>
                <button
                  type="button"
                  className="text-xs text-red-400 hover:underline"
                  onClick={() => setPillars((prev) => prev.filter((_, j) => j !== i))}
                >
                  Remove
                </button>
              </div>
              <label className="block text-sm">
                <span className="text-zinc-400">Label</span>
                <input
                  className={input}
                  value={p.label}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPillars((prev) =>
                      prev.map((x, j) => (j === i ? { ...x, label: v } : x)),
                    );
                  }}
                />
              </label>
              <label className="block text-sm">
                <span className="text-zinc-400">Body</span>
                <textarea
                  className={`${input} min-h-[72px]`}
                  value={p.body}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPillars((prev) =>
                      prev.map((x, j) => (j === i ? { ...x, body: v } : x)),
                    );
                  }}
                />
              </label>
            </div>
          ))}
          <button
            type="button"
            className="text-sm text-emerald-400 hover:underline"
            onClick={() =>
              setPillars((prev) => [...prev, { label: "New", body: "" }])
            }
          >
            + Add pillar
          </button>
        </div>
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
