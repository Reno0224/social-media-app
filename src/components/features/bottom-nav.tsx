"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  onCreate?: () => void;
}

export function BottomNav({ onCreate }: BottomNavProps) {
  const pathname = usePathname();
  const homeActive = pathname === "/feed";
  const profileActive = pathname.startsWith("/me");

  return (
    <nav
      aria-label="Main"
      className="fixed bottom-6 left-1/2 z-50 flex h-20 w-[360px] max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center justify-between rounded-full border border-neutral-800 bg-neutral-950/90 px-4xl backdrop-blur-md sm:bottom-8"
    >
      <Link
        href="/feed"
        aria-current={homeActive ? "page" : undefined}
        className={cn(
          "flex flex-col items-center gap-xs text-md",
          homeActive
            ? "font-semibold text-primary-200"
            : "font-normal text-neutral-50",
        )}
      >
        <House className="size-6 fill-current" />
        Home
      </Link>
      <button
        type="button"
        onClick={onCreate}
        aria-label="Create post"
        className="grid size-12 cursor-pointer place-items-center rounded-full bg-primary-300 text-white transition-colors hover:bg-primary-200"
      >
        <Plus className="size-6" />
      </button>

      <Link
        href="/me"
        aria-current={profileActive ? "page" : undefined}
        className={cn(
          "flex flex-col items-center gap-xs text-md",
          profileActive
            ? "font-semibold text-primary-200"
            : "font-normal text-neutral-50",
        )}
      >
        <User className="size-6 fill-current" />
        Profile
      </Link>
    </nav>
  );
}
