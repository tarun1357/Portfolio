import fs from "fs";
import path from "path";

/** Rewrites `sslcert=` to an absolute path so Prisma finds the RDS CA from any cwd. */
export function resolveDatabaseUrlForPrisma(raw: string | undefined): string | undefined {
  if (!raw?.trim() || !raw.includes("sslcert=")) return raw;

  const root = process.cwd();

  return raw.replace(/sslcert=([^&]+)/g, (_, encoded: string) => {
    const rel = decodeURIComponent(encoded);
    const abs = path.isAbsolute(rel) ? rel : path.join(root, rel);
    if (!fs.existsSync(abs)) {
      console.warn(
        `[resolve-database-url] sslcert missing at ${abs}; using unresolved DATABASE_URL`,
      );
      return `sslcert=${encoded}`;
    }
    return `sslcert=${encodeURIComponent(abs)}`;
  });
}
