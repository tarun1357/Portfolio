import fs from "fs";
import path from "path";

/**
 * Prepares `DATABASE_URL` for Prisma:
 * - If `sslcert=` points at a file that exists, rewrite to an absolute path (local dev / RDS bundle).
 * - If the PEM is missing (typical on Vercel: no `certs/` in the deployment), **drop** `sslcert`
 *   so Prisma does not validate/open a non-existent path — keep `sslaccept=accept_invalid_certs`
 *   for RDS TLS without shipping the CA file.
 */
export function resolveDatabaseUrlForPrisma(raw: string | undefined): string | undefined {
  if (!raw?.trim() || !raw.includes("sslcert=")) return raw;

  const qIndex = raw.indexOf("?");
  if (qIndex === -1) return raw;

  const root = process.cwd();
  const prefix = raw.slice(0, qIndex);
  const query = raw.slice(qIndex + 1);
  const parts = query.split("&").filter(Boolean);
  const out: string[] = [];

  for (const part of parts) {
    if (!part.startsWith("sslcert=")) {
      out.push(part);
      continue;
    }
    const encodedVal = part.slice("sslcert=".length);
    let decoded: string;
    try {
      decoded = decodeURIComponent(encodedVal);
    } catch {
      out.push(part);
      continue;
    }
    const abs = path.isAbsolute(decoded) ? decoded : path.join(root, decoded);
    if (fs.existsSync(abs)) {
      out.push(`sslcert=${encodeURIComponent(abs)}`);
    } else {
      console.warn(
        `[resolve-database-url] sslcert missing at ${abs}; omitting sslcert for this runtime (serverless-friendly).`,
      );
    }
  }

  if (out.length === 0) return prefix;
  return `${prefix}?${out.join("&")}`;
}
