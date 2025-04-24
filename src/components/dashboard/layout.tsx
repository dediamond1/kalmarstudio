import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { Sidebar } from "./sidebar";
import { DashboardHeader } from "./header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await authClient.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <DashboardHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
