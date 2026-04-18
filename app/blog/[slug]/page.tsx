import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";

import { site } from "@/content/site";
import { getAllPosts, getPostBySlug, getPostSlugs } from "@/lib/posts";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = `${site.url}/blog/${slug}`;
  return {
    title: post.meta.title,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      url,
      type: "article",
      publishedTime: post.meta.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.description,
    },
  };
}

export default async function BlogPostPage(props: Props) {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const all = getAllPosts();
  const idx = all.findIndex((p) => p.slug === slug);
  const prev = idx >= 0 ? all[idx + 1] : undefined;
  const next = idx > 0 ? all[idx - 1] : undefined;

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <nav className="font-mono text-xs text-emerald-400/90">
        <Link href="/blog" className="hover:text-emerald-300">
          ← Writing
        </Link>
      </nav>
      <header className="mt-8 border-b border-zinc-800/90 pb-10">
        <p className="font-mono text-xs text-zinc-500">{post.meta.date}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          {post.meta.title}
        </h1>
        {post.meta.description ? (
          <p className="mt-4 text-base text-zinc-400">{post.meta.description}</p>
        ) : null}
      </header>

      <div className="prose prose-invert prose-zinc mt-10 max-w-none prose-headings:scroll-mt-28 prose-headings:font-semibold prose-a:text-emerald-400/95 prose-pre:bg-zinc-900">
        <MDXRemote source={post.content} />
      </div>

      <footer className="mt-16 flex flex-col gap-6 border-t border-zinc-800/90 pt-10 sm:flex-row sm:justify-between">
        {prev ? (
          <Link
            href={`/blog/${prev.slug}`}
            className="text-sm text-zinc-400 hover:text-zinc-100"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/blog/${next.slug}`}
            className="text-sm text-zinc-400 hover:text-zinc-100 sm:text-right"
          >
            {next.title} →
          </Link>
        ) : null}
      </footer>
    </article>
  );
}
