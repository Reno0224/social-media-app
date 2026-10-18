// src/components/features/navbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIsAuthenticated, useLogout } from "@/hooks/use-auth";
import { useMe } from "@/hooks/use-me";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "./avatar";

export function Navbar() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useIsAuthenticated();
  const { data } = useMe();
  const logout = useLogout();
  const profile = data?.profile;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-[960px] items-center justify-between px-xl">
        <div className="flex items-center gap-3xl">
          <Link href="/feed" className="text-lg font-bold">
            Sociality
          </Link>
          <Link
            href="/users/search"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Search
          </Link>
        </div>

        {!isHydrated ? null : isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Open user menu"
              className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <UserAvatar
                name={profile?.name ?? "?"}
                avatarUrl={profile?.avatarUrl ?? null}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                @{profile?.username ?? "..."}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/me")}>
                My profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-md">
            <Link
              href="/login"
              className={buttonVariants({ variant: "ghost" })}
            >
              Login
            </Link>
            <Link href="/register" className={buttonVariants()}>
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
