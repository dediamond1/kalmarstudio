import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { authClient } from "@/lib/auth-client";
import Orders from "@/components/dashboard/Orders";

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
    <div className="">
      <div className="fixed inset-0 w-[320px] bg-muted/40 border-r">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 w-[100vw - 320px] h-screen ml-[320px]">
        <DashboardHeader />
        <div className="flex flex-1 flex-col mt-16">{children}</div>
      </div>
    </div>
  );
}
