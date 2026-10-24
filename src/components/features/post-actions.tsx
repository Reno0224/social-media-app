// src/components/features/post-actions.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon, loadIcons } from "@iconify/react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/api";
import { UserListDialog } from "./user-list-dialog";

const LIKE_OFF = "mdi:heart-outline";
const LIKE_ON = "mdi:heart";
const COMMENT_ICON = "mage:message-dots";
const SHARE_ICON = "reicon:plane";

loadIcons([LIKE_OFF, LIKE_ON, COMMENT_ICON, SHARE_ICON]);

interface PostActionsProps {
  post: Post;
  isSaved: boolean;
  onToggleLike?: (post: Post) => void;
  onToggleSave?: (post: Post) => void;
  /** Kalau ada, ikon komentar menjadi tombol. Kalau tidak, menjadi tautan ke /posts/[id]. */
  onOpenComments?: () => void;
}

export function PostActions({
  post,
  isSaved,
  onToggleLike,
  onToggleSave,
  onOpenComments,
}: PostActionsProps) {
  const [likesOpen, setLikesOpen] = useState(false);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/posts/${post.id}`,
      );
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy link");
    }
  }

  const commentContent = (
    <>
      <Icon icon={COMMENT_ICON} width={24} height={24} aria-hidden />
      <span className="text-md font-medium">{post.commentCount}</span>
    </>
  );

  return (
    <>
      <div className="flex items-center gap-2xl">
        <div className="flex items-center gap-md">
          <button
            type="button"
            onClick={() => onToggleLike?.(post)}
            aria-pressed={post.likedByMe}
            aria-label={post.likedByMe ? "Unlike post" : "Like post"}
            className="cursor-pointer"
          >
            <Icon
              icon={post.likedByMe ? LIKE_ON : LIKE_OFF}
              width={24}
              height={24}
              aria-hidden
              className={post.likedByMe ? "text-accent-red" : undefined}
            />
          </button>
          <button
            type="button"
            onClick={() => setLikesOpen(true)}
            disabled={post.likeCount === 0}
            aria-label="View who liked this post"
            className="cursor-pointer text-md font-medium disabled:cursor-default"
          >
            {post.likeCount}
          </button>
        </div>

        {onOpenComments ? (
          <button
            type="button"
            onClick={onOpenComments}
            aria-label="View comments"
            className="flex cursor-pointer items-center gap-md"
          >
            {commentContent}
          </button>
        ) : (
          <Link
            href={`/posts/${post.id}`}
            aria-label="View comments"
            className="flex items-center gap-md"
          >
            {commentContent}
          </Link>
        )}

        <button
          type="button"
          onClick={handleShare}
          aria-label="Copy post link"
          className="cursor-pointer"
        >
          <Icon icon={SHARE_ICON} width={24} height={24} aria-hidden />
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

      <UserListDialog
        open={likesOpen}
        onOpenChange={setLikesOpen}
        title="Liked by"
        source={{ kind: "post-likes", postId: post.id }}
        emptyTitle="No likes yet"
      />
    </>
  );
}
