"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import type { SiteDTO } from "@/lib/page-types";

export function Hero({ site }: { site: SiteDTO }) {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-16 sm:pb-32 sm:pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-emerald-400/90">
          {site.role}
        </p>
        {reduce ? (
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
            {site.hero.headline}
          </h1>
        ) : (
          <motion.h1
            className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {site.hero.headline}
          </motion.h1>
        )}
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          {site.hero.sub}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#experience"
            className="inline-flex items-center justify-center rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-white"
          >
            View impact
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950/40 px-4 py-2.5 text-sm font-medium text-zinc-100 backdrop-blur transition-colors hover:border-zinc-500"
          >
            Start a conversation
          </a>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-emerald-400/90 transition-colors hover:text-emerald-300"
          >
            Engineering notes →
          </Link>
        </div>
      </div>
    </section>
  );
}
