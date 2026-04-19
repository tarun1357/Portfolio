import { StackForm } from "@/components/dashboard/stack-form";
import { loadDashboardBundle } from "@/lib/dashboard-load";

export const metadata = {
  title: "Stack",
};

export default async function StackDashboardPage() {
  const bundle = await loadDashboardBundle();

  return <StackForm initial={bundle.page.stackGroups} />;
}
