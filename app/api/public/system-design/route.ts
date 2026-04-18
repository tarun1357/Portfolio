import { getPageData } from "@/lib/page-data";
import { jsonPublic } from "@/lib/public-api";

export async function GET() {
  const { systemDesign } = await getPageData();
  return jsonPublic(systemDesign);
}
