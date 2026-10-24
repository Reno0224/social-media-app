"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { UserListSource } from "@/hooks/use-users";
import { UserList } from "./user-list";

interface UserListPageProps {
  title: string;
  source: UserListSource;
  emptyTitle: string;
  emptyDescription?: string;
}

export function UserListPage({
  title,
  source,
  emptyTitle,
  emptyDescription,
}: UserListPageProps) {
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-[600px]">
      <button
        type="button"
        onClick={() => router.push("/me")}
        aria-label="Back to profile"
        className="flex cursor-pointer items-center gap-md py-md text-md font-semibold"
      >
        <ArrowLeft className="size-6" />
        {title}
      </button>
      <UserList
        source={source}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      />
    </div>
  );
}
