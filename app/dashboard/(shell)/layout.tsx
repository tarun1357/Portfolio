import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireDashboardSession } from "@/lib/dashboard-auth-server";

export default async function DashboardShellLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireDashboardSession();
  return <DashboardShell>{children}</DashboardShell>;
}
