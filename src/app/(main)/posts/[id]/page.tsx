// src/app/(main)/posts/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PostDetailView } from "@/components/features/post-detail-view";

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        className="flex cursor-pointer items-center gap-md py-md text-md font-semibold"
      >
        <ArrowLeft className="size-6" />
        Post
      </button>

      <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950">
        <PostDetailView postId={id} onDeleted={() => router.replace("/feed")} />
      </div>
    </div>
  );
}
