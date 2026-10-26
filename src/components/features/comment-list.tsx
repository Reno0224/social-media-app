"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import {
  flattenComments,
  useComments,
  useDeleteComment,
} from "@/hooks/use-comments";
import { timeAgo } from "@/lib/date";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { PostComment } from "@/types/api";
import { UserAvatar } from "./user-avatar";
import { EmptyState, ErrorState } from "./states";
import { useMe } from "@/hooks/use-me";

function CommentItem({
  comment,
  isMine,
  onDelete,
}: {
  comment: PostComment;
  isMine: boolean;
  onDelete: (id: number) => void;
}) {
  const pending = comment.id < 0; // komentar sementara, belum dikonfirmasi server
  const profileHref = `/profile/${encodeURIComponent(comment.author.username)}`;

  return (
    <li className={cn("space-y-md py-lg", pending && "opacity-60")}>
      <div className="flex items-center gap-lg">
        <Link
          href={profileHref}
          aria-label={`Open ${comment.author.name}'s profile`}
        >
          <UserAvatar
            name={comment.author.name}
            avatarUrl={comment.author.avatarUrl}
            className="size-10"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={profileHref}
            className="block truncate text-sm font-semibold"
          >
            {comment.author.name}
          </Link>
          <time
            dateTime={comment.createdAt}
            suppressHydrationWarning
            className="block text-xs text-neutral-400"
          >
            {pending ? "Sending..." : timeAgo(comment.createdAt)}
          </time>
        </div>

        {isMine && !pending && (
          <button
            type="button"
            onClick={() => onDelete(comment.id)}
            aria-label="Delete comment"
            className="cursor-pointer text-neutral-400 hover:text-accent-red"
          >
            <Trash2 className="size-5" />
          </button>
        )}
      </div>
      <p className="whitespace-pre-line wrap-break-words text-sm">
        {comment.text}
      </p>
    </li>
  );
}

export function CommentList({ postId }: { postId: number }) {
  const query = useComments(postId);
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = query;
  const { remove } = useDeleteComment(postId);
  const comments = flattenComments(query.data);
  const { data: me } = useMe();
  const isMine = (c: PostComment) =>
    c.isMine ?? (!!me && me.profile.username === c.author.username);

  if (query.isLoading) {
    return (
      <ul className="space-y-lg py-lg">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="flex gap-lg">
            <div className="size-10 animate-pulse rounded-full bg-neutral-800" />
            <div className="flex-1 space-y-xs">
              <div className="h-4 w-28 animate-pulse rounded-md bg-neutral-800" />
              <div className="h-3 w-16 animate-pulse rounded-md bg-neutral-800" />
            </div>
          </li>
        ))}
      </ul>
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

  if (comments.length === 0) {
    return (
      <EmptyState
        className="py-3xl"
        title="No Comments yet"
        description="Start the conversation"
      />
    );
  }

  return (
    <>
      <ul className="divide-y divide-neutral-900">
        {comments.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            isMine={isMine(c)}
            onDelete={remove}
          />
        ))}
      </ul>

      {isFetchNextPageError && (
        <ErrorState
          message="Failed to load more comments"
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
          {isFetchingNextPage ? "Loading..." : "Load more comments"}
        </Button>
      )}
    </>
  );
}
