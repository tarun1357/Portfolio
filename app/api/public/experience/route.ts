import { getPageData } from "@/lib/page-data";
import { jsonPublic } from "@/lib/public-api";

export async function GET() {
  const { experience } = await getPageData();
  return jsonPublic(experience);
}
