import { getPageData } from "@/lib/page-data";
import { jsonPublic } from "@/lib/public-api";

export async function GET() {
  const { projects } = await getPageData();
  return jsonPublic(projects);
}
