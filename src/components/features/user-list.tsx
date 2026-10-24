"use client";

import {
  flattenUsers,
  useUserList,
  type UserListSource,
} from "@/hooks/use-users";
import { Button } from "@/components/ui/button";
import { UserListItem } from "./user-list-item";
import { EmptyState, ErrorState } from "./states";

export function UserListSkeleton() {
  return (
    <ul className="space-y-lg py-lg">
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} className="flex items-center gap-lg">
          <div className="size-12 animate-pulse rounded-full bg-neutral-800" />
          <div className="flex-1 space-y-xs">
            <div className="h-4 w-32 animate-pulse rounded-md bg-neutral-800" />
            <div className="h-3 w-20 animate-pulse rounded-md bg-neutral-800" />
          </div>
        </li>
      ))}
    </ul>
  );
}

interface UserListProps {
  source: UserListSource;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function UserList({
  source,
  emptyTitle = "No users yet",
  emptyDescription,
}: UserListProps) {
  const query = useUserList(source);
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = query;
  const users = flattenUsers(query.data);

  if (query.isLoading) return <UserListSkeleton />;

  // gagal di halaman pertama; kalau data sudah ada, daftar tetap tampil
  if (query.isError && users.length === 0) {
    return (
      <ErrorState
        message={query.error.message}
        onRetry={() => query.refetch()}
      />
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState
        className="py-3xl"
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <>
      <ul className="divide-y divide-neutral-900">
        {users.map((user) => (
          <UserListItem key={user.username} user={user} />
        ))}
      </ul>

      {isFetchNextPageError && (
        <ErrorState
          message="Failed to load more users"
          onRetry={() => fetchNextPage()}
        />
      )}

      {hasNextPage && (
        <Button
          type="button"
          variant="ghost"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className="w-full cursor-pointer font-semibold text-primary-200"
        >
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </Button>
      )}
    </>
  );
}
