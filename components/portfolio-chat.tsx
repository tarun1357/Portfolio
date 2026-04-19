"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, MessageSquareText, Send, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Role = "user" | "assistant";

type Msg = { id: string; role: Role; content: string };

function id() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function PortfolioChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi — ask anything about Tarun’s background, stack, or experience. I only answer from what’s on this portfolio.",
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom, open]);

  async function send() {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    const userMsg: Msg = { id: id(), role: "user", content: q };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        reply?: string;
        response_returned?: boolean;
        error?: string;
        issues?: Record<string, string[] | undefined>;
      };

      if (!res.ok) {
        const flat = Object.values(data.issues ?? {})
          .flat()
          .filter(Boolean) as string[];
        const msg =
          flat[0] ??
          data.error ??
          "Sorry — the assistant couldn’t answer that. Is GEMINI_API_KEY set?";
        setMessages((m) => [...m, { id: id(), role: "assistant", content: msg }]);
        return;
      }

      setMessages((m) => [
        ...m,
        {
          id: id(),
          role: "assistant",
          content: data.reply ?? "(empty response)",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: id(),
          role: "assistant",
          content: "Network hiccup — try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pointer-events-none fixed right-4 top-24 z-[60] flex flex-col items-end sm:right-6 sm:top-28">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            id="portfolio-chat-panel"
            className="pointer-events-auto mb-3 flex max-h-[min(72vh,520px)] w-[min(calc(100vw-2rem),400px)] flex-col overflow-hidden rounded-2xl border border-emerald-500/25 bg-zinc-950/95 shadow-[0_0_0_1px_rgba(16,185,129,0.08),0_24px_48px_-12px_rgba(0,0,0,0.65)] backdrop-blur-xl supports-[backdrop-filter]:bg-zinc-950/85"
            role="dialog"
            aria-label="Ask about Tarun chat"
          >
            <div className="flex items-center justify-between gap-2 border-b border-zinc-800/90 bg-gradient-to-r from-emerald-950/50 via-zinc-950/80 to-zinc-950 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/25 to-teal-600/20 ring-1 ring-emerald-400/30">
                  <Sparkles className="h-4 w-4 text-emerald-300" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-medium text-zinc-100">Ask about Tarun</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-500/80">
                    Portfolio assistant
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-800/80 hover:text-zinc-200"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              ref={listRef}
              className="flex min-h-[220px] flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" ? (
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800/90 ring-1 ring-zinc-700/80">
                      <Bot className="h-4 w-4 text-emerald-400/90" aria-hidden />
                    </span>
                  ) : null}
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-2xl rounded-tr-md bg-emerald-600/25 px-3.5 py-2.5 text-sm leading-relaxed text-zinc-100 ring-1 ring-emerald-500/25"
                        : "max-w-[90%] rounded-2xl rounded-tl-md bg-zinc-900/90 px-3.5 py-2.5 text-sm leading-relaxed text-zinc-200 ring-1 ring-zinc-700/80"
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading ? (
                <div className="flex items-center gap-2 pl-10 text-xs text-zinc-500">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-500/90" />
                  Thinking…
                </div>
              ) : null}
            </div>

            <form
              className="border-t border-zinc-800/90 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              <label htmlFor="portfolio-chat-input" className="sr-only">
                Your question
              </label>
              <div className="flex gap-2">
                <input
                  id="portfolio-chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. What does Tarun work on at Park+?"
                  disabled={loading}
                  className="min-w-0 flex-1 rounded-xl border border-zinc-700/90 bg-zinc-900/90 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
                  autoComplete="off"
                  maxLength={2000}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 px-4 py-2.5 text-sm font-medium text-zinc-950 shadow-lg shadow-emerald-900/25 transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Ask
                      <Send className="h-3.5 w-3.5" aria-hidden />
                    </>
                  )}
                </button>
              </div>
              <p className="mt-2 font-mono text-[10px] leading-relaxed text-zinc-600">
                Answers use verified portfolio context only and may decline uncertain questions.
              </p>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        layout
        onClick={() => setOpen((o) => !o)}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-zinc-950 shadow-[0_12px_40px_-8px_rgba(16,185,129,0.55)] ring-2 ring-emerald-400/35 transition-transform hover:scale-[1.03] active:scale-[0.98]"
        aria-expanded={open}
        aria-controls="portfolio-chat-panel"
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquareText className="h-6 w-6" strokeWidth={2} />
        )}
      </motion.button>
    </div>
  );
}
