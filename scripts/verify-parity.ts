/**
 * Compare JSON shape from `content/*.ts` vs MySQL after seed.
 * Requires: migrate + seed, `DATABASE_URL` set, `PORTFOLIO_USE_STATIC_CONTENT` unset.
 */
import "dotenv/config";

import { buildStaticPageData } from "../lib/static-page-data";
import { loadPageFromDatabase } from "../lib/page-data";

function stableStringify(value: unknown): string {
  return JSON.stringify(sortKeys(value), null, 2);
}

function sortKeys(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(sortKeys);
  const obj = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(obj).sort()) {
    out[k] = sortKeys(obj[k]);
  }
  return out;
}

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("DATABASE_URL is not set — cannot load from MySQL.");
    process.exit(1);
  }
  if (process.env.PORTFOLIO_USE_STATIC_CONTENT === "1") {
    console.error("PORTFOLIO_USE_STATIC_CONTENT=1 — unset to verify DB parity.");
    process.exit(1);
  }

  const fromStatic = stableStringify(buildStaticPageData());
  const fromDb = stableStringify(await loadPageFromDatabase());

  if (fromStatic !== fromDb) {
    console.error("Mismatch: static content/*.ts snapshot differs from database.");
    console.error("--- static length", fromStatic.length, "db length", fromDb.length);
    process.exit(1);
  }

  console.log("OK — database payload matches static content snapshot.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
