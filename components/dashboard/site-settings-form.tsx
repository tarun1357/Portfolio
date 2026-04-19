"use client";

import { useState } from "react";

const input =
  "mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-600/80 focus:ring-2 focus:ring-emerald-500/30";

type Props = {
  initial: {
    name: string;
    role: string;
    focus: string;
    heroHeadline: string;
    heroSub: string;
    githubUrl: string;
    linkedinUrl: string;
    emailMailto: string;
    chatContext: string;
  };
};

export function SiteSettingsForm({ initial }: Props) {
  const [f, setF] = useState(initial);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [pending, setPending] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setErr("");
    setPending(true);
    try {
      const res = await fetch("/api/dashboard/site", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name,
          role: f.role,
          focus: f.focus,
          heroHeadline: f.heroHeadline,
          heroSub: f.heroSub,
          githubUrl: f.githubUrl,
          linkedinUrl: f.linkedinUrl,
          emailMailto: f.emailMailto,
          chatContext: f.chatContext.trim() === "" ? null : f.chatContext,
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
        <h1 className="text-xl font-semibold text-zinc-100">Site & chat context</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Hero copy, identity line, links, and verified facts for the Ask-about-me assistant.
        </p>
      </div>
      <form onSubmit={save} className="max-w-xl space-y-4">
        <label className="block text-sm">
          <span className="text-zinc-400">Display name</span>
          <input
            className={input}
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          <span className="text-zinc-400">Role line</span>
          <input className={input} value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} />
        </label>
        <label className="block text-sm">
          <span className="text-zinc-400">Focus line</span>
          <input className={input} value={f.focus} onChange={(e) => setF({ ...f, focus: e.target.value })} />
        </label>
        <label className="block text-sm">
          <span className="text-zinc-400">Hero headline</span>
          <input
            className={input}
            value={f.heroHeadline}
            onChange={(e) => setF({ ...f, heroHeadline: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          <span className="text-zinc-400">Hero subtext</span>
          <textarea
            className={`${input} min-h-[100px]`}
            value={f.heroSub}
            onChange={(e) => setF({ ...f, heroSub: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          <span className="text-zinc-400">GitHub URL</span>
          <input
            className={input}
            value={f.githubUrl}
            onChange={(e) => setF({ ...f, githubUrl: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          <span className="text-zinc-400">LinkedIn URL</span>
          <input
            className={input}
            value={f.linkedinUrl}
            onChange={(e) => setF({ ...f, linkedinUrl: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          <span className="text-zinc-400">Email (mailto:…)</span>
          <input
            className={input}
            value={f.emailMailto}
            onChange={(e) => setF({ ...f, emailMailto: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          <span className="text-zinc-400">Chat assistant context</span>
          <textarea
            className={`${input} min-h-[220px] font-mono text-xs`}
            placeholder="Facts the chatbot may cite — stay aligned with what you publish publicly."
            value={f.chatContext}
            onChange={(e) => setF({ ...f, chatContext: e.target.value })}
          />
        </label>
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
