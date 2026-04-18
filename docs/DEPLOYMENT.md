# Deployment & database operations

## Architecture decision (locked)

- **Pattern**: **Option A — BFF inside Next.js** — one deploy on Vercel; Server Components load portfolio content through `getPageData()` (Prisma → MySQL). No separate API process.
- **Recommended MySQL-compatible hosts** (pick one at signup; tiers change): **PlanetScale** or **TiDB Cloud Serverless** — both work well with serverless-style connections and Prisma. Alternatives: Railway, Render, or Aiven with connection limits suited to low traffic.

Blog posts remain **MDX files** in the repo (plan phase 2 could move them to the DB).

## Environment variables (Vercel)

| Variable | Where | Purpose |
|----------|--------|---------|
| `DATABASE_URL` | Server only | Prisma connection string (never `NEXT_PUBLIC_*`). |
| `NEXT_PUBLIC_SITE_URL` | Client + server | Canonical URL for metadata, OG URLs, and `resolveSiteUrl()`. |
| `PORTFOLIO_USE_STATIC_CONTENT` | Server | Set to `1` to skip Prisma and always use `content/*.ts` (optional escape hatch). |

Optional: enable Preview envs with a branch database or shared dev DB.

**Local dev without MySQL**: leave `DATABASE_URL` unset, or set `PORTFOLIO_USE_STATIC_CONTENT=1` if you keep a placeholder URL in `.env`.

### AWS RDS MySQL (Prisma `P1011` — “certificate was not trusted”)

The MySQL **CLI** and **DataGrip** can verify RDS with `global-bundle.pem` while **Prisma’s connector** often still reports `P1011` with `sslaccept=strict` and a CA file. The practical fix is to add:

```
?sslaccept=accept_invalid_certs
```

The connection still uses **TLS to AWS**; this only relaxes **certificate chain verification** in Prisma (documented MySQL URL option). For a stricter setup, use a VPN/bastion and keep `strict` + correct CA paths in a tool that supports them.

```bash
npm run certs:rds-ca
```

Use a **single line** in the shell (do not append `# comments` to the `curl` URL). The script is `node scripts/fetch-rds-ca.mjs` (no fragile `curl` one-liner).

### Prisma `P1001` but `mysql` / `db:ping` works

Prisma’s migrate engine resolves `sslcert=` paths differently than your shell’s cwd. This repo wraps DB commands with `scripts/exec-with-prisma-env.mjs`, which rewrites `sslcert` to an **absolute path** before `prisma` runs. Use **`npm run db:migrate`** (not raw `prisma migrate deploy`) unless you set an absolute `sslcert=` in `.env` yourself.

### `nc` works but Prisma reports `P1001`

TCP to port 3306 succeeding (`nc -vz … 3306`) means routing/security groups are fine. Next checks:

1. **Password encoding** — In `DATABASE_URL`, encode reserved characters in the password (e.g. `*` → `%2A`, `#` → `%23`, `@` → `%40`). JDBC/DataGrip often stores the password separately; Prisma reads one URL string.

2. **`sslcert` path** — Run Prisma from the repo root so `sslcert=certs/global-bundle.pem` resolves. Or use an absolute path to `global-bundle.pem`.

3. **IPv6 vs IPv4** — Node may prefer IPv6 (`AAAA`). If only IPv4 works to RDS, try:

   ```bash
   NODE_OPTIONS=--dns-result-order=ipv4first npm run db:migrate
   ```

4. **Smoke test** (same URL as Prisma):

   ```bash
   npm run db:ping
   ```

   If `db:ping` succeeds but Prisma fails, compare errors and Node options above.

## Build & Prisma on Vercel

1. **`DATABASE_URL`** — add under Project → Settings → Environment Variables for Production (and Preview if needed).
2. **`postinstall`** runs `prisma generate` so the client exists before `next build`.
3. **`build`** script runs `prisma generate && next build` as a safety net.

Apply schema changes **before** or **after** deploy using migrations against the target database (see below).

## Caching

- Home page data is loaded via `getPageData()` wrapped in `unstable_cache` with **`revalidate: 60`** seconds and tag `portfolio`.
- **`GET /api/public/page`** returns the same JSON document with `Cache-Control: public, s-maxage=60, stale-while-revalidate=120`.

For faster edits after DB updates without waiting 60s, add a future `revalidateTag('portfolio')` admin hook or redeploy.

## Migrations: backup & rollback

### Before you migrate

1. **Provider backup** — use your host’s snapshot/backup (PlanetScale branches, TiDB backups, etc.).
2. **Logical dump** (optional): `mysqldump "$DATABASE_URL" > backup-$(date +%Y%m%d).sql` from a trusted machine with DB access.

### Apply migrations (production)

Create the empty database once on the server if it does not exist (name must match the path in `DATABASE_URL`, e.g. `portfolio`):

```sql
CREATE DATABASE portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then:

```bash
DATABASE_URL="mysql://..." npx prisma migrate deploy
```

Run locally against prod only from a secure environment; CI can run the same command with a secret `DATABASE_URL`.

### Rollback

Prisma does not apply “down” migrations automatically. Safe approaches:

1. **Restore** the database from a snapshot/dump taken before the migration.
2. **Forward-fix**: add a new migration that reverses schema changes (manual SQL or `prisma migrate diff`), then deploy.

Keep migration files in Git so every deploy is reproducible.

### Seed (initial or reset content)

After migrations:

```bash
DATABASE_URL="mysql://..." npm run db:seed
```

This imports rows from `content/*.ts`. With `DATABASE_URL` unset, the site still builds using static `content/*.ts` via `buildStaticPageData()`.

### Verify seed parity (optional)

After seeding:

```bash
DATABASE_URL="mysql://..." npm run verify:parity
```

This compares a normalized JSON snapshot of `buildStaticPageData()` to `loadPageFromDatabase()`.
