"use client";

import { useToggleFollow } from "@/hooks/use-users";
import { useRequireAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FollowButtonProps {
  username: string;
  isFollowing: boolean;
  className?: string;
}

export function FollowButton({
  username,
  isFollowing,
  className,
}: FollowButtonProps) {
  const { toggle, isPending } = useToggleFollow();
  const requireAuth = useRequireAuth();

  return (
    <Button
      type="button"
      disabled={isPending}
      aria-pressed={isFollowing}
      aria-label={isFollowing ? `Unfollow ${username}` : `Follow ${username}`}
      onClick={() => requireAuth(() => toggle(username, isFollowing))}
      className={cn(
        "h-10 cursor-pointer rounded-full px-3xl text-sm font-semibold",
        isFollowing
          ? "border border-neutral-700 bg-transparent text-neutral-50 hover:bg-neutral-900 dark:bg-transparent"
          : "bg-primary-300 text-white hover:bg-primary-200",
        className,
      )}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
