import { ExperienceForm } from "@/components/dashboard/experience-form";
import { loadDashboardBundle } from "@/lib/dashboard-load";

export const metadata = {
  title: "Experience",
};

export default async function ExperienceDashboardPage() {
  const bundle = await loadDashboardBundle();

  return <ExperienceForm initial={bundle.page.experience} />;
}
