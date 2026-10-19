// src/components/features/navbar.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useIsAuthenticated, useLogout } from "@/hooks/use-auth";
import { useMe } from "@/hooks/use-me";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "./user-avatar";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isProfile = pathname === "/me";
  const [query, setQuery] = useState("");
  const { isAuthenticated, isHydrated } = useIsAuthenticated();
  const { data } = useMe();
  const logout = useLogout();
  const profile = data?.profile;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(
      q ? `/users/search?q=${encodeURIComponent(q)}` : "/users/search",
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-900 bg-black">
      {isProfile && (
        <div className="flex h-16 items-center gap-lg px-xl md:hidden">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="cursor-pointer"
          >
            <ArrowLeft className="size-6" />
          </button>
          <span className="flex-1 truncate text-md font-bold">
            {profile?.name}
          </span>
          <UserAvatar
            name={profile?.name ?? "?"}
            avatarUrl={profile?.avatarUrl ?? null}
            className="size-10"
          />
        </div>
      )}
      <nav className="flex justify-between py-5 px-4 md:px-30">
        <div className="flex flex-1 items-center">
          <Link href="/feed">
            <Image
              src="/icon/logo.svg"
              alt=""
              width={137}
              height={36}
              priority
            />
          </Link>
        </div>

        <form
          onSubmit={handleSearch}
          role="search"
          className="relative hidden w-full max-w-[491px] md:flex items-center"
        >
          <Search className="pointer-events-none absolute left-xl top-1/2 size-5 -translate-y-1/2 text-neutral-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search users"
            className="h-12 rounded-full border-neutral-900 bg-neutral-950 pl-12 pr-xl text-sm text-white placeholder:text-neutral-600 placeholder:text-sm"
          />
        </form>

        <div className="flex flex-1 items-center justify-end gap-lg">
          <Link
            href="/users/search"
            aria-label="Search users"
            className="rounded-full p-md text-neutral-300 hover:text-white md:hidden"
          >
            <Search className="size-5" />
          </Link>

          {!isHydrated ? null : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Open user menu"
                className="flex items-center gap-3 w-full max-w-80 cursor-pointer"
              >
                <UserAvatar
                  name={profile?.name ?? "?"}
                  avatarUrl={profile?.avatarUrl ?? null}
                  className="size-15"
                />
                <span className="hidden text-xl font-semibold sm:inline text-white">
                  {profile?.name ?? ""}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/me")}>
                  My profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
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
              <Link
                href="/register"
                className={buttonVariants({ className: "rounded-full" })}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
