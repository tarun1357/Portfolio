import { EducationForm } from "@/components/dashboard/education-form";
import { loadDashboardBundle } from "@/lib/dashboard-load";

export const metadata = {
  title: "Education",
};

export default async function EducationDashboardPage() {
  const bundle = await loadDashboardBundle();

  return <EducationForm initial={bundle.page.education} />;
}
