import { getPageData } from "@/lib/page-data";
import { jsonPublic } from "@/lib/public-api";

export async function GET() {
  const { achievements } = await getPageData();
  return jsonPublic(achievements);
}
