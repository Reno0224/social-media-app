// src/app/(main)/(private)/me/page.tsx
"use client";

import { Bookmark, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { useMe } from "@/hooks/use-me";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/features/states";
import { ProfileHeader } from "@/components/features/profile-header";
import { ProfileTabs } from "@/components/features/profile-tabs";
import { UserPostsGrid, SavedPostsGrid } from "@/components/features/post-grid";

export default function MePage() {
  const { data, isLoading, isError, error, refetch } = useMe();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[812px] space-y-xl md:pt-xl">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState message={error?.message} onRetry={() => refetch()} />;
  }

  const { profile, stats } = data;

  return (
    <div className="mx-auto w-full max-w-[812px] space-y-3xl md:pt-xl">
      <ProfileHeader profile={profile} stats={stats} />

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
                    title="Your story starts here"
                    description="Share your first post and let the world see your moments, passions, and memories. Make this space truly yours."
                    action={
                      <Button
                        className="mt-xl h-10 w-64.75 rounded-full bg-primary-300 text-md font-semibold text-white hover:bg-primary-200 md:h-12"
                        onClick={() =>
                          toast.info("Create post comes in a later step")
                        }
                      >
                        Upload My First Post
                      </Button>
                    }
                  />
                }
              />
            ),
          },
          {
            key: "saved",
            label: "Saved",
            icon: Bookmark,
            content: (
              <SavedPostsGrid
                emptyState={
                  <EmptyState
                    className="py-35"
                    title="No saved posts yet"
                    description="Posts you save will show up here."
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
