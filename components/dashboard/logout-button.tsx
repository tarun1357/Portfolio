"use client";

import { useRouter } from "next/navigation";

export function DashboardLogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-xs text-zinc-500 underline-offset-4 hover:text-zinc-300 hover:underline"
      onClick={async () => {
        await fetch("/api/dashboard/logout", { method: "POST" });
        router.push("/dashboard/login");
        router.refresh();
      }}
    >
      Log out
    </button>
  );
}
