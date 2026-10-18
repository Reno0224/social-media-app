// src/components/features/auth-guard.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useIsAuthenticated, useLogout } from "@/hooks/use-auth";
import { useMe } from "@/hooks/use-me";
import { ApiError } from "@/lib/api/client";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isHydrated } = useIsAuthenticated();
  const router = useRouter();
  const pathname = usePathname();
  const logout = useLogout();
  const { error } = useMe();

  // belum login: arahkan ke login dan ingat halaman tujuan
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
    }
  }, [isHydrated, isAuthenticated, pathname, router]);

  // token ditolak server (kedaluwarsa atau tidak valid): keluar otomatis
  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) logout();
  }, [error, logout]);

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="space-y-xl">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
