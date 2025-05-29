"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

export default function DashboardAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  type SessionData = {
    user?: {
      id: string;
      name?: string;
      email?: string;
      emailVerified?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
      image?: string | null;
    };
    session?: {
      id?: string;
      createdAt?: Date;
      expiresAt?: Date;
      userId?: string;
      ipAddress?: string | null;
      userAgent?: string | null;
    };
  } | null;

  const [session, setSession] = useState<SessionData>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check session first
        const sessionData = await authClient.getSession();
        setSession(sessionData?.data || null);

        console.log("DashboardAuthWrapper", sessionData?.data);

        // If session exists, check user role
        if (sessionData?.data?.user?.email) {
          const res = await fetch(
            `/api/users?email=${encodeURIComponent(sessionData.data.user.email)}`
          );
          if (!res.ok) throw new Error("Failed to fetch user role");
          const userData = await res.json();
          setUserRole(userData.role || "user");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  if (userRole !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h1 className="text-2xl font-bold">Unauthorized Access</h1>
        <p className="text-muted-foreground">
          You don't have permission to view this page
        </p>
        <button
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
          onClick={() => router.push("/")}
        >
          Return Home
        </button>
      </div>
    );
  }

  return children;
}
