"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Menu, Bell, Search, LogOut } from "lucide-react";
import { UserDropdown } from "@/components/dashboard/user-dropdown";
import { Routes } from "@/config/Routes";

export function DashboardHeader() {
  const [session, setSession] = useState<{
    user?: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      createdAt: Date;
      updatedAt: Date;
      image?: string | null;
    };
    session?: {
      id: string;
      createdAt: Date;
      expiresAt: Date;
      ipAddress?: string | null;
      userAgent?: string | null;
      impersonatedBy?: string | null;
      updatedAt: Date;
    };
  } | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionResult = await authClient.getSession();
      setSession(sessionResult?.data || null);
    };
    fetchSession();
  }, []);

  const _handleLogout = async () => {
    try {
      await authClient.signOut();
      // Clear any local session storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("session");
        sessionStorage.removeItem("session");
      }
      // Force full page reload to clear all state
      window.location.href = Routes.HOME;
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted px-4 lg:h-[60px] lg:px-6 fixed right-0 left-[320px] top-0 z-40">
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
      <form action={Routes.HOME} method="POST">
        <Button
          variant="ghost"
          size="icon"
          type="submit"
          className="hover:bg-red-50 hover:text-red-600"
          title="Logout"
          onClick={() => _handleLogout()}
        >
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
      </form>
      <UserDropdown user={session?.user} />
    </header>
  );
}
