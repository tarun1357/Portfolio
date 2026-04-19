import { AchievementsForm } from "@/components/dashboard/achievements-form";
import { loadDashboardBundle } from "@/lib/dashboard-load";

export const metadata = {
  title: "Achievements",
};

export default async function AchievementsDashboardPage() {
  const bundle = await loadDashboardBundle();

  return <AchievementsForm initial={bundle.page.achievements} />;
}
