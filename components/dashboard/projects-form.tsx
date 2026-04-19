"use client";

import type { ProjectDTO } from "@/lib/page-types";
import { useState } from "react";

const input =
  "mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-600/80 focus:ring-2 focus:ring-emerald-500/30";

function emptyProject(): ProjectDTO {
  return {
    name: "",
    problem: "",
    solution: "",
    stack: [],
    impact: [],
    links: [{ label: "", href: "" }],
  };
}

/** Split tags / impact only when saving — keeps paste and comma-typing working in controlled inputs. */
function stackToPayload(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function impactToPayload(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ProjectsForm({ initial }: { initial: ProjectDTO[] }) {
  const [projects, setProjects] = useState<ProjectDTO[]>(() =>
    initial.length ? structuredClone(initial) : [emptyProject()],
  );
  /** Raw textarea values — do not derive from `stack[]` on every keystroke (that broke paste). */
  const [stackText, setStackText] = useState<string[]>(() =>
    initial.length
      ? initial.map((p) => p.stack.join(", "))
      : [""],
  );
  const [impactText, setImpactText] = useState<string[]>(() =>
    initial.length
      ? initial.map((p) => p.impact.join("\n"))
      : [""],
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
      const payload = projects.map((p, i) => ({
        ...p,
        stack: stackToPayload(stackText[i] ?? ""),
        impact: impactToPayload(impactText[i] ?? ""),
      }));
      const res = await fetch("/api/dashboard/projects", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        <h1 className="text-xl font-semibold text-zinc-100">Projects</h1>
        <p className="mt-1 text-sm text-zinc-500">Replaces all projects in the database.</p>
      </div>
      <form onSubmit={save} className="max-w-2xl space-y-8">
        {projects.map((p, pi) => (
          <div
            key={pi}
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4"
          >
            <div className="flex justify-between">
              <span className="font-mono text-xs text-zinc-500">Project {pi + 1}</span>
              <button
                type="button"
                className="text-xs text-red-400 hover:underline"
                onClick={() => {
                  setProjects((prev) => prev.filter((_, j) => j !== pi));
                  setStackText((prev) => prev.filter((_, j) => j !== pi));
                  setImpactText((prev) => prev.filter((_, j) => j !== pi));
                }}
              >
                Remove
              </button>
            </div>
            <label className="block text-sm">
              <span className="text-zinc-400">Name</span>
              <input
                className={input}
                value={p.name}
                onChange={(e) =>
                  setProjects((prev) =>
                    prev.map((x, j) =>
                      j === pi ? { ...x, name: e.target.value } : x,
                    ),
                  )
                }
              />
            </label>
            <label className="block text-sm">
              <span className="text-zinc-400">Problem</span>
              <textarea
                className={`${input} min-h-[72px]`}
                value={p.problem}
                onChange={(e) =>
                  setProjects((prev) =>
                    prev.map((x, j) =>
                      j === pi ? { ...x, problem: e.target.value } : x,
                    ),
                  )
                }
              />
            </label>
            <label className="block text-sm">
              <span className="text-zinc-400">Solution</span>
              <textarea
                className={`${input} min-h-[72px]`}
                value={p.solution}
                onChange={(e) =>
                  setProjects((prev) =>
                    prev.map((x, j) =>
                      j === pi ? { ...x, solution: e.target.value } : x,
                    ),
                  )
                }
              />
            </label>
            <label className="block text-sm">
              <span className="text-zinc-400">Stack tags (comma-separated)</span>
              <input
                className={input}
                value={stackText[pi] ?? ""}
                onChange={(e) =>
                  setStackText((prev) =>
                    prev.map((t, j) => (j === pi ? e.target.value : t)),
                  )
                }
              />
            </label>
            <label className="block text-sm">
              <span className="text-zinc-400">Impact lines (one per line)</span>
              <textarea
                className={`${input} min-h-[80px]`}
                value={impactText[pi] ?? ""}
                onChange={(e) =>
                  setImpactText((prev) =>
                    prev.map((t, j) => (j === pi ? e.target.value : t)),
                  )
                }
              />
            </label>
            <div className="space-y-3">
              <span className="text-sm text-zinc-400">Links</span>
              {p.links.map((link, li) => (
                <div key={li} className="flex flex-col gap-2 sm:flex-row">
                  <input
                    placeholder="Label"
                    className={input}
                    value={link.label}
                    onChange={(e) =>
                      setProjects((prev) =>
                        prev.map((x, j) =>
                          j === pi
                            ? {
                                ...x,
                                links: x.links.map((l, k) =>
                                  k === li
                                    ? { ...l, label: e.target.value }
                                    : l,
                                ),
                              }
                            : x,
                        ),
                      )
                    }
                  />
                  <input
                    placeholder="URL"
                    className={input}
                    value={link.href}
                    onChange={(e) =>
                      setProjects((prev) =>
                        prev.map((x, j) =>
                          j === pi
                            ? {
                                ...x,
                                links: x.links.map((l, k) =>
                                  k === li ? { ...l, href: e.target.value } : l,
                                ),
                              }
                            : x,
                        ),
                      )
                    }
                  />
                  <button
                    type="button"
                    className="text-xs text-red-400 sm:self-end"
                    onClick={() =>
                      setProjects((prev) =>
                        prev.map((x, j) =>
                          j === pi
                            ? {
                                ...x,
                                links: x.links.filter((_, k) => k !== li),
                              }
                            : x,
                        ),
                      )
                    }
                  >
                    Remove link
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="text-xs text-emerald-400 hover:underline"
                onClick={() =>
                  setProjects((prev) =>
                    prev.map((x, j) =>
                      j === pi
                        ? {
                            ...x,
                            links: [...x.links, { label: "", href: "" }],
                          }
                        : x,
                    ),
                  )
                }
              >
                + Link
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-emerald-400 hover:underline"
          onClick={() => {
            setProjects((prev) => [...prev, emptyProject()]);
            setStackText((prev) => [...prev, ""]);
            setImpactText((prev) => [...prev, ""]);
          }}
        >
          + Add project
        </button>
        {err ? (
          <p className="text-sm text-red-400" role="alert">
            {err}
          </p>
        ) : null}
        {msg ? <p className="text-sm text-emerald-400">{msg}</p> : null}
        <button
          type="submit"
          disabled={pending || projects.length === 0}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-40"
        >
          {pending ? "Saving…" : "Save projects"}
        </button>
      </form>
    </div>
  );
}
