import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // if (!sessionResult?.data) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
  //         <p className="text-muted-foreground">
  //           Please login to access the dashboard
  //         </p>
  //         <Button asChild className="mt-4">
  //           <Link href="/auth/login">Go to Login</Link>
  //         </Button>
  //       </div>
  //     </div>
  //   );
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
