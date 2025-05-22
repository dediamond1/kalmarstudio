"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionData = await authClient.getSession();
        setSession(sessionData?.data || null);
      } catch (error) {
        console.error("Session check failed:", error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
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

  return children;
}
