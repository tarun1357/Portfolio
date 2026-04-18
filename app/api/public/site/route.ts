import { getPageData } from "@/lib/page-data";
import { jsonPublic } from "@/lib/public-api";

export async function GET() {
  const { site } = await getPageData();
  return jsonPublic(site);
}
