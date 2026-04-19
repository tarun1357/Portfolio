import { AboutForm } from "@/components/dashboard/about-form";
import { loadDashboardBundle } from "@/lib/dashboard-load";

export const metadata = {
  title: "About",
};

export default async function AboutDashboardPage() {
  const bundle = await loadDashboardBundle();

  return <AboutForm initial={bundle.page.about} />;
}
