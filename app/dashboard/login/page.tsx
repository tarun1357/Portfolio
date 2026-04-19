import { LoginForm } from "@/components/dashboard/login-form";
import { redirectIfDashboardAuthed } from "@/lib/dashboard-auth-server";

export const metadata = {
  title: "Dashboard login",
};

export default async function DashboardLoginPage() {
  await redirectIfDashboardAuthed();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-16">
      <LoginForm />
    </div>
  );
}
