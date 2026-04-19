"use client";

import type { StackGroupDTO } from "@/lib/page-types";
import { useState } from "react";

const input =
  "mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-600/80 focus:ring-2 focus:ring-emerald-500/30";

function emptyGroup(): StackGroupDTO {
  return {
    title: "",
    iconKey: null,
    items: [{ label: "", iconUrl: null, accentColor: null }],
  };
}

export function StackForm({ initial }: { initial: StackGroupDTO[] }) {
  const [groups, setGroups] = useState<StackGroupDTO[]>(() =>
    initial.length ? structuredClone(initial) : [emptyGroup()],
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
      const res = await fetch("/api/dashboard/stack", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          groups.map((g) => ({
            ...g,
            iconKey: g.iconKey?.trim() === "" ? null : g.iconKey,
          })),
        ),
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
        <h1 className="text-xl font-semibold text-zinc-100">Tech stack</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Groups and items — icon keys match Lucide-style keys used in the UI (
          <span className="font-mono text-xs">code2</span>,{" "}
          <span className="font-mono text-xs">servercog</span>, …).
        </p>
      </div>
      <form onSubmit={save} className="max-w-2xl space-y-8">
        {groups.map((g, gi) => (
          <div
            key={gi}
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4"
          >
            <div className="flex justify-between">
              <span className="font-mono text-xs text-zinc-500">Group {gi + 1}</span>
              <button
                type="button"
                className="text-xs text-red-400 hover:underline"
                onClick={() =>
                  setGroups((prev) => prev.filter((_, j) => j !== gi))
                }
              >
                Remove group
              </button>
            </div>
            <label className="block text-sm">
              <span className="text-zinc-400">Title</span>
              <input
                className={input}
                value={g.title}
                onChange={(e) =>
                  setGroups((prev) =>
                    prev.map((x, j) =>
                      j === gi ? { ...x, title: e.target.value } : x,
                    ),
                  )
                }
              />
            </label>
            <label className="block text-sm">
              <span className="text-zinc-400">Icon key (optional)</span>
              <input
                className={`${input} font-mono text-xs`}
                placeholder="code2"
                value={g.iconKey ?? ""}
                onChange={(e) =>
                  setGroups((prev) =>
                    prev.map((x, j) =>
                      j === gi
                        ? {
                            ...x,
                            iconKey:
                              e.target.value.trim() === ""
                                ? null
                                : e.target.value,
                          }
                        : x,
                    ),
                  )
                }
              />
            </label>
            <div className="space-y-3 border-t border-zinc-800/80 pt-3">
              <p className="text-sm text-zinc-400">Items</p>
              {g.items.map((it, ii) => (
                <div
                  key={`${gi}-${ii}`}
                  className="grid gap-2 rounded-lg border border-zinc-800/90 p-3 sm:grid-cols-3"
                >
                  <label className="block text-sm sm:col-span-3">
                    <span className="text-xs text-zinc-500">Label</span>
                    <input
                      className={input}
                      value={it.label}
                      onChange={(e) =>
                        setGroups((prev) =>
                          prev.map((gr, j) =>
                            j === gi
                              ? {
                                  ...gr,
                                  items: gr.items.map((item, k) =>
                                    k === ii
                                      ? { ...item, label: e.target.value }
                                      : item,
                                  ),
                                }
                              : gr,
                          ),
                        )
                      }
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-xs text-zinc-500">Icon URL</span>
                    <input
                      className={`${input} font-mono text-xs`}
                      value={it.iconUrl ?? ""}
                      onChange={(e) =>
                        setGroups((prev) =>
                          prev.map((gr, j) =>
                            j === gi
                              ? {
                                  ...gr,
                                  items: gr.items.map((item, k) =>
                                    k === ii
                                      ? {
                                          ...item,
                                          iconUrl:
                                            e.target.value.trim() === ""
                                              ? null
                                              : e.target.value,
                                        }
                                      : item,
                                  ),
                                }
                              : gr,
                          ),
                        )
                      }
                    />
                  </label>
                  <label className="block text-sm sm:col-span-2">
                    <span className="text-xs text-zinc-500">Accent (hex)</span>
                    <input
                      className={`${input} font-mono text-xs`}
                      placeholder="#22c55e"
                      value={it.accentColor ?? ""}
                      onChange={(e) =>
                        setGroups((prev) =>
                          prev.map((gr, j) =>
                            j === gi
                              ? {
                                  ...gr,
                                  items: gr.items.map((item, k) =>
                                    k === ii
                                      ? {
                                          ...item,
                                          accentColor:
                                            e.target.value.trim() === ""
                                              ? null
                                              : e.target.value,
                                        }
                                      : item,
                                  ),
                                }
                              : gr,
                          ),
                        )
                      }
                    />
                  </label>
                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      type="button"
                      className="text-xs text-red-400 hover:underline"
                      onClick={() =>
                        setGroups((prev) =>
                          prev.map((gr, j) =>
                            j === gi
                              ? {
                                  ...gr,
                                  items: gr.items.filter((_, k) => k !== ii),
                                }
                              : gr,
                          ),
                        )
                      }
                    >
                      Remove item
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="text-xs text-emerald-400 hover:underline"
                onClick={() =>
                  setGroups((prev) =>
                    prev.map((gr, j) =>
                      j === gi
                        ? {
                            ...gr,
                            items: [
                              ...gr.items,
                              {
                                label: "",
                                iconUrl: null,
                                accentColor: null,
                              },
                            ],
                          }
                        : gr,
                    ),
                  )
                }
              >
                + Item
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-emerald-400 hover:underline"
          onClick={() => setGroups((prev) => [...prev, emptyGroup()])}
        >
          + Add group
        </button>
        {err ? (
          <p className="text-sm text-red-400" role="alert">
            {err}
          </p>
        ) : null}
        {msg ? <p className="text-sm text-emerald-400">{msg}</p> : null}
        <button
          type="submit"
          disabled={pending || groups.length === 0}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-40"
        >
          {pending ? "Saving…" : "Save stack"}
        </button>
      </form>
    </div>
  );
}
