// src/app/(main)/(private)/me/page.tsx
"use client";

import { useMe } from "@/hooks/use-me";
import { formatDate } from "@/lib/date";
import { UserAvatar } from "@/components/features/avatar";
import { EditProfileDialog } from "@/components/features/edit-profile-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MePage() {
  const { data, isLoading, isError, error, refetch } = useMe();

  if (isLoading) {
    return (
      <div className="space-y-xl">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-lg text-center">
        <p className="text-muted-foreground">
          {error?.message ?? "Failed to load profile"}
        </p>
        <Button onClick={() => refetch()}>Try again</Button>
      </div>
    );
  }

  const { profile, stats } = data;
  const items = [
    { label: "Posts", value: stats.posts },
    { label: "Followers", value: stats.followers },
    { label: "Following", value: stats.following },
    { label: "Likes", value: stats.likes },
  ];

  return (
    <div className="space-y-3xl">
      <section className="flex flex-col gap-xl sm:flex-row sm:items-center">
        <UserAvatar
          name={profile.name}
          avatarUrl={profile.avatarUrl}
          className="size-20 text-xl"
        />
        <div className="flex-1 space-y-xs">
          <h1 className="text-display-xs font-bold">{profile.name}</h1>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
          <p className="text-sm">{profile.bio || "No bio yet."}</p>
          <p className="text-xs text-muted-foreground">
            Joined {formatDate(profile.createAt)}
          </p>
        </div>
        <EditProfileDialog profile={profile} />
      </section>

      <section className="grid grid-cols-4 gap-md rounded-2xl border border-border p-xl text-center">
        {items.map((s) => (
          <div key={s.label}>
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </section>

      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
        </TabsList>
        <TabsContent
          value="posts"
          className="py-3xl text-center text-sm text-muted-foreground"
        >
          Your posts will appear here.
        </TabsContent>
        <TabsContent
          value="saved"
          className="py-3xl text-center text-sm text-muted-foreground"
        >
          Saved posts will appear here.
        </TabsContent>
        <TabsContent
          value="likes"
          className="py-3xl text-center text-sm text-muted-foreground"
        >
          Liked posts will appear here.
        </TabsContent>
      </Tabs>
    </div>
  );
}
