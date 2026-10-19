// src/components/features/profile-header.tsx
"use client";

import { Send } from "lucide-react";
import { toast } from "sonner";
import type { Profile, ProfileStats } from "@/types/api";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./user-avatar";
import { EditProfileDialog } from "./edit-profile-dialog";

interface ProfileHeaderProps {
  profile: Profile;
  stats: ProfileStats;
}

export function ProfileHeader({ profile, stats }: ProfileHeaderProps) {
  async function handleShare() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/profile/${profile.username}`,
      );
      toast.success("Profile link copied");
    } catch {
      toast.error("Could not copy link");
    }
  }

  const items = [
    { label: "Post", value: stats.posts },
    { label: "Followers", value: stats.followers },
    { label: "Following", value: stats.following },
    { label: "Likes", value: stats.likes },
  ];

  return (
    <section className="space-y-xl">
      {/* Mobile: bertumpuk. Desktop: satu baris, tombol di kanan */}
      <div className="flex flex-col gap-xl md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-xl">
          <UserAvatar
            name={profile.name}
            avatarUrl={profile.avatarUrl}
            className="size-16 text-xl"
          />
          <div className="min-w-0">
            <h1 className="truncate text-md font-bold">{profile.name}</h1>
            <p className="truncate text-md text-neutral-300">
              {profile.username}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-lg">
          <EditProfileDialog
            profile={profile}
            className="h-10 flex-1 border-neutral-900 bg-transparent text-white px-3xl text-md font-semibold md:h-12 md:flex-none"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleShare}
            aria-label="Copy profile link"
            className="size-10 shrink-0 rounded-full border-neutral-900 bg-transparent text-white  p-0 md:size-12 "
          >
            <Send className="size-5" />
          </Button>
        </div>
      </div>

      {profile.bio && <p className="text-md text-white">{profile.bio}</p>}

      <div className="grid grid-cols-4 divide-x divide-neutral-900">
        {items.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center gap-xxs px-md py-xs"
          >
            <p className="text-xl text-white font-bold">{s.value}</p>
            <p className="text-md text-neutral-400 md:text-md">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
