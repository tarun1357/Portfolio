import { PrismaClient } from "@prisma/client";

import { resolveDatabaseUrlForPrisma } from "@/lib/resolve-database-url";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const resolvedUrl = resolveDatabaseUrlForPrisma(process.env.DATABASE_URL);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(resolvedUrl ? { datasources: { db: { url: resolvedUrl } } } : {}),
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
