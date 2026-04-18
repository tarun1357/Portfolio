import { getPageData } from "@/lib/page-data";
import { jsonPublic } from "@/lib/public-api";

/** Read-only JSON mirror of the home page payload (same cache as RSC). */
export async function GET() {
  const data = await getPageData();
  return jsonPublic(data);
}
