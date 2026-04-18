import Link from "next/link";

import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Writing",
  description:
    "Short engineering notes on reliability, Kafka, and hot paths—not tutorial noise.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-400/90">
        Blog
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50">
        Writing
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
        MDX-backed posts shipped from the repo. Add more files in{" "}
        <code className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-xs text-zinc-300">
          content/blog
        </code>{" "}
        to publish.
      </p>

      <ul className="mt-12 space-y-8">
        {posts.map((post) => (
          <li key={post.slug} className="border-b border-zinc-800/90 pb-8">
            <Link href={`/blog/${post.slug}`} className="group block">
              <p className="font-mono text-xs text-zinc-500">{post.date}</p>
              <h2 className="mt-2 text-lg font-semibold text-zinc-100 transition-colors group-hover:text-white">
                {post.title}
              </h2>
              {post.description ? (
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {post.description}
                </p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-12 text-sm text-zinc-500">
        <Link
          href="/"
          className="text-emerald-400/90 underline-offset-4 hover:text-emerald-300 hover:underline"
        >
          ← Back to portfolio
        </Link>
      </p>
    </div>
  );
}
