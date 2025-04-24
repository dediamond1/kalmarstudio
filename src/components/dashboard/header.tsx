import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Menu, Bell, Search } from "lucide-react";
import { UserDropdown } from "@/components/dashboard/user-dropdown";
import type { AuthSession } from "@/types/auth";

export async function DashboardHeader() {
  const sessionResult = await authClient.getSession();
  const session = sessionResult?.data || null;

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Button variant="outline" size="icon" className="shrink-0 md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <Button variant="outline" size="icon" className="ml-auto">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Toggle notifications</span>
      </Button>
      <UserDropdown user={session?.user} />
    </header>
  );
}
