import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { authClient } from "@/lib/auth-client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await authClient.getSession();

  // if (!session?.data) {
  //   return null;
  // }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
