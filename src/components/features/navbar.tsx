// src/components/features/navbar.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
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

function Logo({ small = false }: { small?: boolean }) {
  return (
    <Link href="/feed" className="flex items-center gap-md">
      <Image
        src="/icon/logo.svg"
        alt="Sociality"
        width={140}
        height={36}
        priority
        className={small ? "h-6 w-auto" : "h-8 w-auto"}
      />
    </Link>
  );
}

function AccountMenu({
  showName = false,
  avatarClassName,
}: {
  showName?: boolean;
  avatarClassName: string;
}) {
  const router = useRouter();
  const { data, isError } = useMe();
  const logout = useLogout();
  const profile = data?.profile;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open user menu"
        className="flex cursor-pointer items-center gap-lg rounded-full outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
      >
        <UserAvatar
          name={profile?.name ?? "?"}
          avatarUrl={profile?.avatarUrl ?? null}
          className={avatarClassName}
        />
        {showName &&
          (profile ? (
            <span className="max-w-35 truncate text-md font-semibold text-white">
              {profile.name}
            </span>
          ) : !isError ? (
            <span className="h-5 w-24 animate-pulse rounded-md bg-neutral-800" />
          ) : null)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push("/me")}>
          My profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/me/likes")}>
          My likes
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function GuestActions() {
  return (
    <div className="flex items-center gap-md">
      <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
        Login
      </Link>
      <Link
        href="/register"
        className={buttonVariants({ className: "rounded-full" })}
      >
        Register
      </Link>
    </div>
  );
}

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const { isAuthenticated, isHydrated } = useIsAuthenticated();
  const { data } = useMe();
  const profile = data?.profile;
  const isProfile = pathname === "/me";

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(
      q ? `/users/search?q=${encodeURIComponent(q)}` : "/users/search",
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-900 bg-black text-neutral-50">
      {/* ===== Mobile (di bawah md) ===== */}
      <div className="md:hidden">
        {isProfile ? (
          <div className="flex h-16 items-center gap-lg px-xl">
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
            {isHydrated && isAuthenticated && (
              <AccountMenu avatarClassName="size-10" />
            )}
          </div>
        ) : (
          <div className="flex h-16 items-center justify-between px-xl">
            <Logo small />
            <div className="flex items-center gap-lg">
              <Link
                href="/users/search"
                aria-label="Search users"
                className="grid size-10 place-items-center rounded-full text-neutral-300 hover:text-white"
              >
                <Search className="size-6" />
              </Link>
              {!isHydrated ? null : isAuthenticated ? (
                <AccountMenu avatarClassName="size-10" />
              ) : (
                <GuestActions />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ===== Desktop (md ke atas) ===== */}
      <nav className="mx-auto hidden h-20 w-full max-w-[1200px] items-center gap-xl px-4xl md:flex">
        <div className="flex flex-1 items-center">
          <Logo />
        </div>

        <form
          onSubmit={handleSearch}
          role="search"
          className="relative w-full max-w-[491px]"
        >
          <Search className="pointer-events-none absolute left-xl top-1/2 size-5 -translate-y-1/2 text-neutral-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search users"
            className="h-12 rounded-full border-neutral-800 bg-neutral-950 pl-12 pr-xl text-sm shadow-none placeholder:text-neutral-500 dark:bg-neutral-950"
          />
        </form>

        <div className="flex flex-1 items-center justify-end">
          {!isHydrated ? null : isAuthenticated ? (
            <AccountMenu showName avatarClassName="size-12" />
          ) : (
            <GuestActions />
          )}
        </div>
      </nav>
    </header>
  );
}
