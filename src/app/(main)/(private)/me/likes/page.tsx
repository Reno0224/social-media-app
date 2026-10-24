"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MyLikesGrid } from "@/components/features/post-grid";
import { EmptyState } from "@/components/features/states";

export default function MyLikesPage() {
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-[812px]">
      <button
        type="button"
        onClick={() => router.push("/me")}
        aria-label="Back to profile"
        className="flex cursor-pointer items-center gap-md py-md text-md font-semibold"
      >
        <ArrowLeft className="size-6" />
        My Likes
      </button>

      <div className="pt-md">
        <MyLikesGrid
          emptyState={
            <EmptyState
              className="py-35"
              title="No liked posts yet"
              description="Posts you like will show up here."
            />
          }
        />
      </div>
    </div>
  );
}
