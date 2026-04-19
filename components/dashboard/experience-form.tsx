"use client";

import type { ExperienceHighlightDTO, ExperienceRoleDTO } from "@/lib/page-types";
import { useState } from "react";

const input =
  "mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-600/80 focus:ring-2 focus:ring-emerald-500/30";

function emptyHighlight(): ExperienceHighlightDTO {
  return { title: "", detail: "", metrics: [] };
}

function emptyRole(): ExperienceRoleDTO {
  return {
    company: "",
    title: "",
    location: "",
    period: "",
    summary: "",
    highlights: [emptyHighlight()],
  };
}

export function ExperienceForm({ initial }: { initial: ExperienceRoleDTO[] }) {
  const [roles, setRoles] = useState<ExperienceRoleDTO[]>(() =>
    initial.length ? structuredClone(initial) : [emptyRole()],
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
      const res = await fetch("/api/dashboard/experience", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roles),
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
        <h1 className="text-xl font-semibold text-zinc-100">Experience</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Replaces all roles in the database. The first role is highlighted on the home page.
        </p>
      </div>
      <form onSubmit={save} className="max-w-2xl space-y-8">
        {roles.map((role, ri) => (
          <div
            key={ri}
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs text-zinc-500">Role {ri + 1}</span>
              <button
                type="button"
                className="text-xs text-red-400 hover:underline"
                onClick={() =>
                  setRoles((prev) => prev.filter((_, j) => j !== ri))
                }
              >
                Remove role
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-2">
                <span className="text-zinc-400">Company</span>
                <input
                  className={input}
                  value={role.company}
                  onChange={(e) =>
                    setRoles((prev) =>
                      prev.map((r, j) =>
                        j === ri ? { ...r, company: e.target.value } : r,
                      ),
                    )
                  }
                />
              </label>
              <label className="block text-sm">
                <span className="text-zinc-400">Title</span>
                <input
                  className={input}
                  value={role.title}
                  onChange={(e) =>
                    setRoles((prev) =>
                      prev.map((r, j) =>
                        j === ri ? { ...r, title: e.target.value } : r,
                      ),
                    )
                  }
                />
              </label>
              <label className="block text-sm">
                <span className="text-zinc-400">Location</span>
                <input
                  className={input}
                  value={role.location}
                  onChange={(e) =>
                    setRoles((prev) =>
                      prev.map((r, j) =>
                        j === ri ? { ...r, location: e.target.value } : r,
                      ),
                    )
                  }
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="text-zinc-400">Period</span>
                <input
                  className={input}
                  value={role.period}
                  onChange={(e) =>
                    setRoles((prev) =>
                      prev.map((r, j) =>
                        j === ri ? { ...r, period: e.target.value } : r,
                      ),
                    )
                  }
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="text-zinc-400">Summary</span>
                <textarea
                  className={`${input} min-h-[80px]`}
                  value={role.summary}
                  onChange={(e) =>
                    setRoles((prev) =>
                      prev.map((r, j) =>
                        j === ri ? { ...r, summary: e.target.value } : r,
                      ),
                    )
                  }
                />
              </label>
            </div>

            <div className="space-y-4 border-t border-zinc-800/80 pt-4">
              <p className="text-sm font-medium text-zinc-300">Highlights</p>
              {role.highlights.map((h, hi) => (
                <div
                  key={`${ri}-${hi}`}
                  className="rounded-lg border border-zinc-800/90 p-4 space-y-3"
                >
                  <div className="flex justify-between">
                    <span className="text-xs text-zinc-500">Highlight {hi + 1}</span>
                    <button
                      type="button"
                      className="text-xs text-red-400 hover:underline"
                      onClick={() =>
                        setRoles((prev) =>
                          prev.map((r, j) =>
                            j === ri
                              ? {
                                  ...r,
                                  highlights: r.highlights.filter(
                                    (_, k) => k !== hi,
                                  ),
                                }
                              : r,
                          ),
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                  <label className="block text-sm">
                    <span className="text-zinc-400">Title</span>
                    <input
                      className={input}
                      value={h.title}
                      onChange={(e) =>
                        setRoles((prev) =>
                          prev.map((r, j) =>
                            j === ri
                              ? {
                                  ...r,
                                  highlights: r.highlights.map((x, k) =>
                                    k === hi
                                      ? { ...x, title: e.target.value }
                                      : x,
                                  ),
                                }
                              : r,
                          ),
                        )
                      }
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-zinc-400">Detail</span>
                    <textarea
                      className={`${input} min-h-[72px]`}
                      value={h.detail}
                      onChange={(e) =>
                        setRoles((prev) =>
                          prev.map((r, j) =>
                            j === ri
                              ? {
                                  ...r,
                                  highlights: r.highlights.map((x, k) =>
                                    k === hi
                                      ? { ...x, detail: e.target.value }
                                      : x,
                                  ),
                                }
                              : r,
                          ),
                        )
                      }
                    />
                  </label>
                  <div className="space-y-2">
                    <span className="text-xs text-zinc-500">Metrics (one per line)</span>
                    {h.metrics.map((m, mi) => (
                      <div key={mi} className="flex gap-2">
                        <input
                          className={input}
                          value={m}
                          onChange={(e) =>
                            setRoles((prev) =>
                              prev.map((r, j) =>
                                j === ri
                                  ? {
                                      ...r,
                                      highlights: r.highlights.map((x, k) =>
                                        k === hi
                                          ? {
                                              ...x,
                                              metrics: x.metrics.map((t, n) =>
                                                n === mi ? e.target.value : t,
                                              ),
                                            }
                                          : x,
                                      ),
                                    }
                                  : r,
                              ),
                            )
                          }
                        />
                        <button
                          type="button"
                          className="shrink-0 text-xs text-red-400"
                          onClick={() =>
                            setRoles((prev) =>
                              prev.map((r, j) =>
                                j === ri
                                  ? {
                                      ...r,
                                      highlights: r.highlights.map((x, k) =>
                                        k === hi
                                          ? {
                                              ...x,
                                              metrics: x.metrics.filter(
                                                (_, n) => n !== mi,
                                              ),
                                            }
                                          : x,
                                      ),
                                    }
                                  : r,
                              ),
                            )
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="text-xs text-emerald-400 hover:underline"
                      onClick={() =>
                        setRoles((prev) =>
                          prev.map((r, j) =>
                            j === ri
                              ? {
                                  ...r,
                                  highlights: r.highlights.map((x, k) =>
                                    k === hi
                                      ? {
                                          ...x,
                                          metrics: [...x.metrics, ""],
                                        }
                                      : x,
                                  ),
                                }
                              : r,
                          ),
                        )
                      }
                    >
                      + Metric
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="text-sm text-emerald-400 hover:underline"
                onClick={() =>
                  setRoles((prev) =>
                    prev.map((r, j) =>
                      j === ri
                        ? {
                            ...r,
                            highlights: [...r.highlights, emptyHighlight()],
                          }
                        : r,
                    ),
                  )
                }
              >
                + Add highlight
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-emerald-400 hover:underline"
          onClick={() => setRoles((prev) => [...prev, emptyRole()])}
        >
          + Add role
        </button>
        {err ? (
          <p className="text-sm text-red-400" role="alert">
            {err}
          </p>
        ) : null}
        {msg ? <p className="text-sm text-emerald-400">{msg}</p> : null}
        <button
          type="submit"
          disabled={pending || roles.length === 0}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-40"
        >
          {pending ? "Saving…" : "Save all roles"}
        </button>
      </form>
    </div>
  );
}
