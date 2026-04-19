"use client";

/**
 * Covers failures in the root layout (must include its own html/body).
 * Imports global CSS so this shell is never unstyled like raw browser defaults.
 */
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 px-6 py-16 font-sans text-zinc-100 antialiased">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-lg font-medium text-zinc-100">Something went wrong</h2>
          <p className="mt-2 text-sm text-zinc-400">
            {process.env.NODE_ENV === "development" ? error.message : "Please refresh or try again."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-8 rounded-lg bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-950"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
