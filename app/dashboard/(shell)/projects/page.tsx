import { ProjectsForm } from "@/components/dashboard/projects-form";
import { loadDashboardBundle } from "@/lib/dashboard-load";

export const metadata = {
  title: "Projects",
};

export default async function ProjectsDashboardPage() {
  const bundle = await loadDashboardBundle();

  return <ProjectsForm initial={bundle.page.projects} />;
}
