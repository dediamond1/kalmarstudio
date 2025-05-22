import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import DashboardAuthWrapper from "@/components/dashboard/DashboardAuthWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthWrapper>
      <div className="">
        <div className="fixed inset-0 w-[320px] bg-muted/40 border-r">
          <Sidebar />
        </div>
        <div className="flex flex-col flex-1 w-[100vw - 320px] h-screen ml-[320px]">
          <DashboardHeader />
          <div className="flex flex-1 flex-col mt-16">{children}</div>
        </div>
      </div>
    </DashboardAuthWrapper>
  );
}
