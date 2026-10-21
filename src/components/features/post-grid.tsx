// src/components/features/post-grid.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useUserPosts, flattenPosts } from "@/hooks/use-post";
import { useLoadMore } from "@/hooks/use-load-more";
import { ErrorState } from "./states";

export function UserPostsGrid({
  username,
  emptyState,
}: {
  username: string;
  emptyState: React.ReactNode;
}) {
  const query = useUserPosts(username);
  const posts = flattenPosts(query.data);

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = query;
  const sentinelRef = useLoadMore(
    fetchNextPage,
    !!hasNextPage && !isFetchingNextPage,
  );

  if (query.isLoading) {
    return (
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-md bg-neutral-800"
          />
        ))}
      </div>
    );
  }

  if (query.isError) {
    return (
      <ErrorState
        message={query.error.message}
        onRetry={() => query.refetch()}
      />
    );
  }

  if (posts.length === 0) return <>{emptyState}</>;

  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            aria-label={post.caption.slice(0, 60) || "Open post"}
            className="relative aspect-square overflow-hidden rounded-md bg-neutral-900"
          >
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt=""
                fill
                sizes="(min-width: 812px) 270px, 33vw"
                className="object-cover"
              />
            )}
          </Link>
        ))}
      </div>
      <div ref={sentinelRef} className="h-px" />
    </>
  );
}
