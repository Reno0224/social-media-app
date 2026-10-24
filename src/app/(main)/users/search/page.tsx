// src/app/(main)/users/search/page.tsx
"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { flattenUsers, useSearchUsers } from "@/hooks/use-users";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, ErrorState } from "@/components/features/states";
import { UserListItem } from "@/components/features/user-list-item";
import { UserListSkeleton } from "@/components/features/user-list";

function SearchView({ initialQuery }: { initialQuery: string }) {
  const [input, setInput] = useState(initialQuery);
  const term = useDebouncedValue(input, 400).trim();
  const query = useSearchUsers(term);
  const { fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError } = query;
  const users = flattenUsers(query.data);

  let body: React.ReactNode;
  if (!term) {
    body = (
      <EmptyState
        title="Search for people"
        description="Find people by their name or username."
      />
    );
  } else if (query.isLoading) {
    body = <UserListSkeleton />;
  } else if (query.isError && users.length === 0) {
    body = <ErrorState message={query.error.message} onRetry={() => query.refetch()} />;
  } else if (users.length === 0) {
    body = (
      <EmptyState
        title="No users found"
        description="Try a different name or username."
      />
    );
  } else {
    body = (
      <>
        <ul className="divide-y divide-neutral-900">
          {users.map((user) => (
            <UserListItem key={user.username} user={user} />
          ))}
        </ul>

        {isFetchNextPageError && (
          <ErrorState message="Failed to load more users" onRetry={() => fetchNextPage()} />
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

  return (
    <div className="mx-auto w-full max-w-[600px] space-y-xl pt-xl">
      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
        <Search className="pointer-events-none absolute left-xl top-1/2 size-5 -translate-y-1/2 text-neutral-500" />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search"
          aria-label="Search users"
          autoFocus={!initialQuery}
          className="h-12 rounded-full border-neutral-800 bg-neutral-950 pl-12 pr-xl text-sm shadow-none placeholder:text-neutral-500 dark:bg-neutral-950"
        />
      </form>
      {body}
    </div>
  );
}

function SearchContent() {
  const q = useSearchParams().get("q") ?? "";
  // key memaksa tampilan dibuat ulang saat pencarian dari navbar mengubah ?q=
  return <SearchView key={q} initialQuery={q} />;
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}