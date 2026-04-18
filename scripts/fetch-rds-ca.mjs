/**
 * Downloads AWS RDS combined CA bundle (no shell quoting issues).
 * Usage: node scripts/fetch-rds-ca.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dest = path.join(root, "certs", "global-bundle.pem");
const url =
  "https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem";

await fs.mkdir(path.dirname(dest), { recursive: true });
const res = await fetch(url);
if (!res.ok) throw new Error(`fetch failed: ${res.status} ${res.statusText}`);
const buf = Buffer.from(await res.arrayBuffer());
await fs.writeFile(dest, buf);
console.log(`Wrote ${dest} (${buf.length} bytes)`);
