/**
 * Prisma’s CLI / engines resolve `sslcert=` relative to an unpredictable cwd.
 * This wrapper rewrites `sslcert` to an absolute path before spawning commands.
 *
 * Usage: node scripts/exec-with-prisma-env.mjs npx prisma migrate deploy
 */
import { spawnSync } from "child_process";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

dotenv.config({ path: path.join(root, ".env") });

function resolveDatabaseUrl(raw) {
  if (!raw || !raw.includes("sslcert=")) return raw;
  return raw.replace(/sslcert=([^&]+)/g, (_, encoded) => {
    const rel = decodeURIComponent(encoded);
    const abs = path.isAbsolute(rel) ? rel : path.join(root, rel);
    if (!fs.existsSync(abs)) {
      console.error(`[exec-with-prisma-env] sslcert file not found: ${abs}`);
      console.error("Run: npm run certs:rds-ca");
      process.exit(1);
    }
    return `sslcert=${encodeURIComponent(abs)}`;
  });
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error(
    "Usage: node scripts/exec-with-prisma-env.mjs <command> [args...]",
  );
  console.error(
    'Example: node scripts/exec-with-prisma-env.mjs npx prisma migrate deploy',
  );
  process.exit(1);
}

const env = {
  ...process.env,
  DATABASE_URL: resolveDatabaseUrl(process.env.DATABASE_URL),
};

const [cmd, ...rest] = args;
const result = spawnSync(cmd, rest, {
  stdio: "inherit",
  env,
  cwd: root,
});

process.exit(result.status === null ? 1 : result.status);
