// src/components/features/public-profile-header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { toast } from "sonner";
import type { PublicProfile } from "@/types/api";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";
import { FollowButton } from "./follow-button";
import { UserListDialog } from "./user-list-dialog";

type ListKind = "followers" | "following";

export function PublicProfileHeader({ profile }: { profile: PublicProfile }) {
  const [openList, setOpenList] = useState<ListKind | null>(null);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/profile/${encodeURIComponent(profile.username)}`
      );
      toast.success("Profile link copied");
    } catch {
      toast.error("Could not copy link");
    }
  }

  const items: { label: string; value: number; list?: ListKind }[] = [
    { label: "Post", value: profile.counts.post },
    { label: "Followers", value: profile.counts.followers, list: "followers" },
    { label: "Following", value: profile.counts.following, list: "following" },
    { label: "Likes", value: profile.counts.likes },
  ];

  return (
    <section className="space-y-xl">
      <div className="flex flex-col gap-xl md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-xl">
          <UserAvatar name={profile.name} avatarUrl={profile.avatarUrl} className="size-16 text-xl" />
          <div className="min-w-0">
            <h1 className="truncate text-md font-bold">{profile.name}</h1>
            <p className="truncate text-md text-neutral-300">{profile.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-lg">
          {profile.isMe ? (
            <Link
              href="/me"
              className={buttonVariants({
                variant: "outline",
                className:
                  "h-10 flex-1 rounded-full border-neutral-800 bg-transparent px-3xl text-md font-semibold md:h-12 md:flex-none dark:bg-transparent",
              })}
            >
              Edit Profile
            </Link>
          ) : (
            <FollowButton
              username={profile.username}
              isFollowing={profile.isFollowing}
              className="h-10 flex-1 text-md md:h-12 md:flex-none"
            />
          )}
          <Button
            type="button"
            variant="outline"
            onClick={handleShare}
            aria-label="Copy profile link"
            className="size-10 shrink-0 rounded-full border-neutral-800 bg-transparent p-0 md:size-12 dark:bg-transparent"
          >
            <Send className="size-5" />
          </Button>
        </div>
      </div>

      {profile.bio && <p className="whitespace-pre-line break-words text-md">{profile.bio}</p>}

      <div className="grid grid-cols-4 divide-x divide-neutral-800">
        {items.map((s) => {
          const content = (
            <>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-sm text-neutral-400 md:text-md">{s.label}</p>
            </>
          );
          const base = "flex flex-col items-center gap-xxs px-md py-xs";
          const list = s.list;

          return list ? (
            <button
              key={s.label}
              type="button"
              onClick={() => setOpenList(list)}
              aria-label={`View ${s.label.toLowerCase()}`}
              className={cn(base, "cursor-pointer rounded-md hover:bg-neutral-900/50")}
            >
              {content}
            </button>
          ) : (
            <div key={s.label} className={base}>
              {content}
            </div>
          );
        })}
      </div>

      {openList && (
        <UserListDialog
          open
          onOpenChange={(open) => {
            if (!open) setOpenList(null);
          }}
          title={openList === "followers" ? "Followers" : "Following"}
          source={
            openList === "followers"
              ? { kind: "followers", username: profile.username }
              : { kind: "following", username: profile.username }
          }
          emptyTitle={openList === "followers" ? "No followers yet" : "Not following anyone yet"}
        />
      )}
    </section>
  );
}