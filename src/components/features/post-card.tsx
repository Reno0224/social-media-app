// src/components/features/post-card.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { timeAgo } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/api";
import { UserAvatar } from "./user-avatar";
import { PostActions } from "./post-actions";

interface PostCardProps {
  post: Post;
  isSaved?: boolean;
  onToggleLike?: (post: Post) => void;
  onToggleSave?: (post: Post) => void;
  onOpenComments?: (post: Post) => void;
  priority?: boolean;
}

export function PostCard({
  post,
  isSaved = false,
  onToggleLike,
  onToggleSave,
  onOpenComments,
  priority = false,
}: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const caption = post.caption ?? "";
  const isLong = caption.length > 90 || caption.split("\n").length > 2;
  const profileHref = `/profile/${encodeURIComponent(post.author.username)}`;

  return (
    <article className="border-b border-neutral-900 pb-xl text-neutral-50">
      <header className="flex items-center gap-lg pb-lg pt-xl">
        <Link href={profileHref} aria-label={`Open ${post.author.username}'s profile`}>
          <UserAvatar
            name={post.author.name}
            avatarUrl={post.author.avatarUrl}
            className="size-16 text-lg"
          />
        </Link>
        <div className="min-w-0">
          <Link href={profileHref} className="block truncate text-md font-semibold">
            {post.author.username}
          </Link>
          <time dateTime={post.createdAt} suppressHydrationWarning className="text-sm text-neutral-400">
            {timeAgo(post.createdAt)}
          </time>
        </div>
      </header>

      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-900">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={caption.slice(0, 80) || "Post image"}
            fill
            sizes="(min-width: 640px) 600px, 100vw"
            priority={priority}
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-neutral-500">
            No image
          </div>
        )}
      </div>

      <div className="mt-lg">
        <PostActions
          post={post}
          isSaved={isSaved}
          onToggleLike={onToggleLike}
          onToggleSave={onToggleSave}
          onOpenComments={onOpenComments ? () => onOpenComments(post) : undefined}
        />
      </div>

      <div className="mt-lg space-y-xs">
        <Link href={profileHref} className="block text-md font-semibold">
          {post.author.username}
        </Link>
        {caption && (
          <p className={cn("whitespace-pre-line break-words text-md", !expanded && "line-clamp-2")}>
            {caption}
          </p>
        )}
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="cursor-pointer text-md font-semibold text-primary-200"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </article>
  );
}