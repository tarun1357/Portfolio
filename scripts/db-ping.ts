/**
 * Smoke-test DB connectivity with mysql2 + RDS CA (same TLS shape we want for Prisma).
 * Run: npm run db:ping
 */
import "dotenv/config";

import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";

function parseMysqlUrl(raw: string) {
  const u = new URL(raw);
  const user = decodeURIComponent(u.username || "");
  const password = decodeURIComponent(u.password || "");
  const host = u.hostname;
  const port = parseInt(u.port || "3306", 10);
  const pathname = u.pathname.replace(/^\//, "");
  const database = pathname ? pathname.split("/")[0] : undefined;
  const sslcert = u.searchParams.get("sslcert");
  const sslaccept = u.searchParams.get("sslaccept");
  return { user, password, host, port, database, sslcert, sslaccept };
}

async function main() {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) {
    console.error("DATABASE_URL is empty.");
    process.exit(1);
  }

  console.warn(
    "If login fails: percent-encode special characters in the password (* → %2A, # → %23, @ → %40).",
  );

  let sslCa: Buffer | undefined;
  const { user, password, host, port, database, sslcert, sslaccept } =
    parseMysqlUrl(raw);

  if (sslcert) {
    const abs = path.isAbsolute(sslcert)
      ? sslcert
      : path.join(process.cwd(), sslcert);
    if (!fs.existsSync(abs)) {
      console.error(`sslcert file not found: ${abs}`);
      console.error("Run: npm run certs:rds-ca");
      process.exit(1);
    }
    sslCa = fs.readFileSync(abs);
  }

  /** Mirror Prisma: accept_invalid_certs ⇒ TLS without full chain verify (RDS). */
  let sslOpts: { ca?: Buffer; rejectUnauthorized: boolean } | undefined;
  if (sslaccept === "accept_invalid_certs") {
    sslOpts = sslCa ? { ca: sslCa, rejectUnauthorized: false } : { rejectUnauthorized: false };
  } else if (sslCa) {
    sslOpts = { ca: sslCa, rejectUnauthorized: true };
  }

  const baseConfig = {
    host,
    port,
    user,
    password,
    ...(sslOpts ? { ssl: sslOpts } : {}),
  };

  console.log("Trying mysql2 connection (password hidden)...");
  try {
    const conn = await mysql.createConnection({
      ...baseConfig,
      ...(database ? { database } : {}),
    });
    const [rows] = await conn.query<Array<{ v: number }>>("SELECT 1 AS v");
    await conn.end();
    console.log("OK — mysql2 connected:", rows);
  } catch (e: unknown) {
    const err = e as { code?: string; errno?: number; message?: string };
    if (err.code === "ER_BAD_DB_ERROR" || err.errno === 1049) {
      console.error("Unknown database — create it on RDS first, e.g. in DataGrip:");
      console.error(
        "  CREATE DATABASE portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
      );
      console.error(`Expected database name from URL: "${database ?? "(none)"}"`);
      process.exit(1);
    }
    console.error("mysql2 connection failed:", e);
    process.exit(1);
  }
}

main();
