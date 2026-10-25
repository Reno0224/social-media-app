// src/app/(main)/profile/[username]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { LayoutGrid, Heart } from "lucide-react";
import { usePublicProfile } from "@/hooks/use-users";
import { ApiError } from "@/lib/api/client";
import { safeDecode } from "@/lib/url";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/features/states";
import { PublicProfileHeader } from "@/components/features/public-profile-header";
import { ProfileTabs } from "@/components/features/profile-tabs";
import { UserPostsGrid, UserLikesGrid } from "@/components/features/post-grid";

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const username = safeDecode(params.username ?? "");
  const query = usePublicProfile(username);

  if (query.error instanceof ApiError && query.error.status === 404) {
    return (
      <EmptyState
        title="User not found"
        description="This account may have been removed or the link is incorrect."
      />
    );
  }

  if (query.isLoading) {
    return (
      <div className="mx-auto w-full max-w-[812px] space-y-xl md:pt-xl">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-64 w-full" />
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

  const profile = query.data;

  return (
    <div className="mx-auto w-full max-w-[812px] space-y-3xl md:pt-xl">
      <PublicProfileHeader key={profile.username} profile={profile} />

      <ProfileTabs
        tabs={[
          {
            key: "gallery",
            label: "Gallery",
            icon: LayoutGrid,
            content: (
              <UserPostsGrid
                username={profile.username}
                emptyState={
                  <EmptyState
                    className="py-35"
                    title="No posts yet"
                    description="This user has not shared anything yet."
                  />
                }
              />
            ),
          },
          {
            key: "likes",
            label: "Likes",
            icon: Heart,
            content: (
              <UserLikesGrid
                username={profile.username}
                emptyState={
                  <EmptyState
                    className="py-35"
                    title="No liked posts yet"
                    description="Posts this user likes will show up here."
                  />
                }
              />
            ),
          },
        ]}
      />
    </div>
  );
}
