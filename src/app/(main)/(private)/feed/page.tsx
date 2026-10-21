"use client";

import Link from "next/link";
import {
  flattenPosts,
  useInfiniteFeed,
  useSavedIds,
  useToggleLike,
  useToggleSave,
} from "@/hooks/use-post";
import { useLoadMore } from "@/hooks/use-load-more";
import { buttonVariants } from "@/components/ui/button";
import { PostCard } from "@/components/features/post-card";
import {
  EmptyState,
  ErrorState,
  PostCardSkeleton,
} from "@/components/features/states";

export default function FeedPage() {
  const feed = useInfiniteFeed();
  const { toggle: toggleLike } = useToggleLike();
  const { toggle: toggleSave } = useToggleSave();
  const { savedIds } = useSavedIds();
  const posts = flattenPosts(feed.data);

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = feed;
  const sentinelRef = useLoadMore(
    () => fetchNextPage(),
    !!hasNextPage && !isFetchingNextPage,
  );

  if (feed.isLoading) {
    return (
      <div className="mx-auto w-full max-w-[600px] space-y-xl pt-xl">
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    );
  }

  if (feed.isError) {
    return (
      <ErrorState message={feed.error.message} onRetry={() => feed.refetch()} />
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        title="Your feed is empty"
        description="Follow people to see their posts here."
        action={
          <Link
            href="/users/search"
            className={buttonVariants({ className: "mt-lg rounded-full" })}
          >
            Find people
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[600px]">
      {posts.map((post, i) => (
        <PostCard
          key={post.id}
          post={post}
          priority={i === 0}
          isSaved={savedIds.has(post.id)}
          onToggleLike={toggleLike}
          onToggleSave={(p) => toggleSave(p.id, savedIds.has(p.id))}
        />
      ))}

      {isFetchingNextPage && <PostCardSkeleton />}
      {feed.isFetchNextPageError && (
        <ErrorState
          message="Failed to load more posts"
          onRetry={() => fetchNextPage()}
        />
      )}
      <div ref={sentinelRef} className="h-px" />
    </div>
  );
}
