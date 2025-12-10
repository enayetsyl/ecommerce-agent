"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import { useGetMe } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated } = useAppContext();
  const { data, isLoading, isError } = useGetMe();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError || !isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
