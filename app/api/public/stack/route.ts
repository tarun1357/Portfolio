import { getPageData } from "@/lib/page-data";
import { jsonPublic } from "@/lib/public-api";

/** Returns `stackGroups` from the DB (grouped stack items). */
export async function GET() {
  const { stackGroups } = await getPageData();
  return jsonPublic(stackGroups);
}
