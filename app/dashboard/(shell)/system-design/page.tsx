import { SystemDesignForm } from "@/components/dashboard/system-design-form";
import { loadDashboardBundle } from "@/lib/dashboard-load";

export const metadata = {
  title: "System design",
};

export default async function SystemDesignDashboardPage() {
  const bundle = await loadDashboardBundle();

  return <SystemDesignForm initial={bundle.page.systemDesign} />;
}
