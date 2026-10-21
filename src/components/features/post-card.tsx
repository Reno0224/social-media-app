// src/components/features/post-card.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Heart, MessageSquareMore, Send } from "lucide-react";
import { toast } from "sonner";
import { timeAgo } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/api";
import { UserAvatar } from "./user-avatar";

interface PostCardProps {
  post: Post;
  isSaved?: boolean;
  onToggleLike?: (post: Post) => void;
  onToggleSave?: (post: Post) => void;
  priority?: boolean; // untuk gambar yang langsung terlihat di layar
}

export function PostCard({
  post,
  isSaved = false,
  onToggleLike,
  onToggleSave,
  priority = false,
}: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = post.caption.length > 90;
  const profileHref = `/profile/${post.author.username}`;

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy link");
    }
  }

  return (
    <article className="border-b border-neutral-900 pb-xl">
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
            alt={post.caption.slice(0, 80) || "Post image"}
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

      <div className="mt-lg flex items-center gap-2xl">
        <button
          type="button"
          onClick={() => onToggleLike?.(post)}
          aria-pressed={post.likedByMe}
          aria-label={post.likedByMe ? "Unlike post" : "Like post"}
          className="flex cursor-pointer items-center gap-md"
        >
          <Heart className={cn("size-6", post.likedByMe && "fill-accent-red text-accent-red")} />
          <span className="text-md font-medium">{post.likeCount}</span>
        </button>

        <Link href={`/posts/${post.id}`} aria-label="View comments" className="flex items-center gap-md">
          <MessageSquareMore className="size-6" />
          <span className="text-md font-medium">{post.commentCount}</span>
        </Link>

        <button type="button" onClick={handleShare} aria-label="Copy post link" className="cursor-pointer">
          <Send className="size-6" />
        </button>

        <button
          type="button"
          onClick={() => onToggleSave?.(post)}
          disabled={!onToggleSave}
          aria-pressed={isSaved}
          aria-label={isSaved ? "Unsave post" : "Save post"}
          className="ml-auto cursor-pointer disabled:cursor-default"
        >
          <Bookmark className={cn("size-6", isSaved && "fill-current")} />
        </button>
      </div>

      <div className="mt-lg space-y-xs">
        <Link href={profileHref} className="block text-md font-semibold">
          {post.author.username}
        </Link>
        <p className={cn("text-md", !expanded && "line-clamp-2")}>{post.caption}</p>
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