// src/components/features/post-grid.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  flattenPosts,
  useMyLikes,
  useSavedPosts,
  useUserLikes,
  useUserPosts,
} from "@/hooks/use-post";
import { useLoadMore } from "@/hooks/use-load-more";
import { ErrorState } from "./states";

interface GridItem {
  id: number;
  imageUrl: string | null;
  caption: string | null;
}

interface ImageGridProps {
  posts: GridItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  emptyState: React.ReactNode;
}

function ImageGrid({
  posts,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  emptyState,
}: ImageGridProps) {
  const sentinelRef = useLoadMore(
    fetchNextPage,
    hasNextPage && !isFetchingNextPage,
  );

  if (isLoading) {
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

  if (isError) return <ErrorState message={errorMessage} onRetry={onRetry} />;
  if (posts.length === 0) return <>{emptyState}</>;

  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            aria-label={post.caption?.slice(0, 60) || "Open post"}
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
      {isFetchingNextPage && (
        <div className="mt-1 grid grid-cols-3 gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-md bg-neutral-800"
            />
          ))}
        </div>
      )}
      <div ref={sentinelRef} className="h-px" />
    </>
  );
}

export function UserPostsGrid({
  username,
  emptyState,
}: {
  username: string;
  emptyState: React.ReactNode;
}) {
  const query = useUserPosts(username);
  return (
    <ImageGrid
      posts={flattenPosts(query.data)}
      isLoading={query.isLoading}
      isError={query.isError}
      errorMessage={query.error?.message}
      onRetry={() => query.refetch()}
      hasNextPage={!!query.hasNextPage}
      isFetchingNextPage={query.isFetchingNextPage}
      fetchNextPage={() => query.fetchNextPage()}
      emptyState={emptyState}
    />
  );
}

export function SavedPostsGrid({
  emptyState,
}: {
  emptyState: React.ReactNode;
}) {
  const query = useSavedPosts();
  return (
    <ImageGrid
      posts={flattenPosts(query.data)}
      isLoading={query.isLoading}
      isError={query.isError}
      errorMessage={query.error?.message}
      onRetry={() => query.refetch()}
      hasNextPage={!!query.hasNextPage}
      isFetchingNextPage={query.isFetchingNextPage}
      fetchNextPage={() => query.fetchNextPage()}
      emptyState={emptyState}
    />
  );
}

export function MyLikesGrid({ emptyState }: { emptyState: React.ReactNode }) {
  const query = useMyLikes();
  return (
    <ImageGrid
      posts={flattenPosts(query.data)}
      isLoading={query.isLoading}
      isError={query.isError}
      errorMessage={query.error?.message}
      onRetry={() => query.refetch()}
      hasNextPage={!!query.hasNextPage}
      isFetchingNextPage={query.isFetchingNextPage}
      fetchNextPage={() => query.fetchNextPage()}
      emptyState={emptyState}
    />
  );
}

export function UserLikesGrid({
  username,
  emptyState,
}: {
  username: string;
  emptyState: React.ReactNode;
}) {
  const query = useUserLikes(username);
  return (
    <ImageGrid
      posts={flattenPosts(query.data)}
      isLoading={query.isLoading}
      isError={query.isError}
      errorMessage={query.error?.message}
      onRetry={() => query.refetch()}
      hasNextPage={!!query.hasNextPage}
      isFetchingNextPage={query.isFetchingNextPage}
      fetchNextPage={() => query.fetchNextPage()}
      emptyState={emptyState}
    />
  );
}
