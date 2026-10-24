"use client";

import Link from "next/link";
import { useMe } from "@/hooks/use-me";
import type { UserSummary } from "@/types/api";
import { UserAvatar } from "./user-avatar";
import { FollowButton } from "./follow-button";

export function UserListItem({ user }: { user: UserSummary }) {
  const { data: me } = useMe();
  const isMe = user.isMe === true || me?.profile.username === user.username;
  const href = isMe ? "/me" : `/profile/${encodeURIComponent(user.username)}`;

  return (
    <li className="flex items-center gap-lg py-lg">
      <Link href={href} aria-label={`Open ${user.username}'s profile`}>
        <UserAvatar
          name={user.name}
          avatarUrl={user.avatarUrl}
          className="size-12"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <Link href={href} className="block truncate text-md font-semibold">
          {user.name}
        </Link>
        <p className="truncate text-sm text-neutral-400">{user.username}</p>
      </div>

      {!isMe && (
        <FollowButton
          username={user.username}
          isFollowing={user.isFollowedByMe === true}
          className="h-9 px-xl"
        />
      )}
    </li>
  );
}
