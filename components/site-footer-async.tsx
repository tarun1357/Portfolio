import { SiteFooter } from "@/components/site-footer";
import { getPageData } from "@/lib/page-data";
import { buildStaticPageData } from "@/lib/static-page-data";

/** Footer DB fetch isolated from the root layout so Prisma/RDS failures never strip the styled shell. */
export async function SiteFooterAsync() {
  try {
    const data = await getPageData();
    return <SiteFooter site={data.site} />;
  } catch (e) {
    console.error("[site-footer-async] falling back to bundled site:", e);
    return <SiteFooter site={buildStaticPageData().site} />;
  }
}
