import { jsonPublic } from "@/lib/public-api";

/** Lists read-only portfolio JSON endpoints (same Prisma-backed cache as the site). */
export async function GET() {
  return jsonPublic({
    description: "Public portfolio API — same data as the Next.js pages (MySQL via Prisma when configured).",
    endpoints: {
      full: "/api/public/page",
      site: "/api/public/site",
      experience: "/api/public/experience",
      projects: "/api/public/projects",
      stackGroups: "/api/public/stack",
      systemDesign: "/api/public/system-design",
      achievements: "/api/public/achievements",
    },
  });
}
