// src/components/features/post-detail-view.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  usePost,
  useSavedIds,
  useToggleLike,
  useToggleSave,
} from "@/hooks/use-post";
import { useRequireAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/client";
import { timeAgo } from "@/lib/date";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "./user-avatar";
import { PostActions } from "./post-actions";
import { CommentList } from "./comment-list";
import { CommentComposer } from "./comment-composer";
import { EmptyState, ErrorState } from "./states";
import { PostMenu } from "./post-menu";

interface PostDetailViewProps {
  postId: number;
  onDeleted?: () => void;
}

export function PostDetailView({ postId , onDeleted} : PostDetailViewProps) {
  const query = usePost(postId);
  const { toggle: toggleLike } = useToggleLike();
  const { toggle: toggleSave } = useToggleSave();
  const { savedIds } = useSavedIds();
  const requireAuth = useRequireAuth();

  const notFound =
    !Number.isInteger(postId) ||
    postId <= 0 ||
    (query.error instanceof ApiError && query.error.status === 404);

  if (notFound) {
    return (
      <EmptyState
        title="Post not found"
        description="This post may have been deleted or the link is incorrect."
      />
    );
  }

  if (query.isLoading) {
    return (
      <div className="grid gap-xl p-xl md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Skeleton className="h-48 w-full md:h-96" />
        <div className="space-y-lg">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <ErrorState
        message={query.error?.message}
        onRetry={() => query.refetch()}
      />
    );
  }

  const post = query.data;
  const profileHref = `/profile/${encodeURIComponent(post.author.username)}`;

  return (
    <div className="flex h-[88dvh] flex-col text-neutral-50 md:grid md:h-[min(720px,85dvh)] md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      {/* Gambar */}
      <div className="relative h-48 shrink-0 bg-neutral-900 md:h-auto">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.caption?.slice(0, 80) || "Post image"}
            fill
            priority
            sizes="(min-width: 768px) 720px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-neutral-500">
            No image
          </div>
        )}
      </div>

      {/* Panel kanan */}
      <div className="flex min-h-0 flex-1 flex-col md:flex-none md:h-auto">
        <header className="flex shrink-0 items-center gap-lg px-xl pt-xl">
          <Link
            href={profileHref}
            aria-label={`Open ${post.author.name}'s profile`}
          >
            <UserAvatar
              name={post.author.name}
              avatarUrl={post.author.avatarUrl}
              className="size-10"
            />
          </Link>
          <div className="min-w-0 flex-1">
            <Link
              href={profileHref}
              className="block truncate text-sm font-semibold"
            >
              {post.author.name}
            </Link>
            <time
              dateTime={post.createdAt}
              suppressHydrationWarning
              className="block text-xs text-neutral-400"
            >
              {timeAgo(post.createdAt)}
            </time>
          </div>
          
          <PostMenu post={post} onDeleted={() => onDeleted?.()} />
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-xl py-lg">
          {post.caption && (
            <p className="whitespace-pre-line break-words text-sm">
              {post.caption}
            </p>
          )}
          <h2 className="pt-xl text-md font-bold">Comments</h2>
          <CommentList postId={post.id} />
        </div>

        <footer className="shrink-0 space-y-lg border-t border-neutral-900 p-xl">
          <PostActions
            post={post}
            isSaved={savedIds.has(post.id)}
            onToggleLike={(p) => requireAuth(() => toggleLike(p))}
            onToggleSave={(p) =>
              requireAuth(() => toggleSave(p.id, savedIds.has(p.id)))
            }
            onOpenComments={() =>
              document.getElementById("comment-input")?.focus()
            }
          />
          <CommentComposer postId={post.id} />
        </footer>
      </div>
    </div>
  );
}
