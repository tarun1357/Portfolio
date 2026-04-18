# Tarun Saini — Portfolio

Personal portfolio site (Next.js App Router, TypeScript, Tailwind CSS v4). Home page content is loaded from **MySQL via Prisma** when `DATABASE_URL` is set; otherwise it falls back to `content/*.ts`.

## Prerequisites

- Node.js 18.18+ (recommended: current LTS) with **npm** installed

## Setup

```bash
cd tarun-portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env` and adjust. If you do not have MySQL running locally, leave `DATABASE_URL` empty or set `PORTFOLIO_USE_STATIC_CONTENT=1` so builds use static content only.

## Scripts

| Command              | Description                                      |
| -------------------- | ------------------------------------------------ |
| `npm run dev`        | Dev server                                       |
| `npm run build`      | Production build (`postinstall` runs `prisma generate`) |
| `npm run start`      | Run production server                            |
| `npm run lint`       | ESLint                                           |
| `npm run format`     | Prettier                                         |
| `npm run db:migrate` | `prisma migrate deploy`                          |
| `npm run db:seed`    | Seed DB from `content/*.ts`                      |
| `npm run verify:parity` | Compare DB payload to static snapshot (after seed) |

## Deployment & database

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for **Vercel env vars**, **caching**, **migration backup/rollback**, and the locked **Option A** architecture (Next.js + DB in one deploy).

## Stack

- **Framework:** Next.js 15 (App Router)
- **Data:** Prisma ORM + MySQL-compatible host (PlanetScale / TiDB / etc.)
- **Styling:** Tailwind CSS v4
- **Motion:** Framer Motion
- **Lint/format:** ESLint + Prettier + `eslint-config-prettier`
