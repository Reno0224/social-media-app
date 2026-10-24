// src/components/features/post-menu.tsx
"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useMe } from "@/hooks/use-me";
import { useDeletePost } from "@/hooks/use-post";
import type { Post } from "@/types/api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function PostMenu({ post, onDeleted }: { post: Post; onDeleted: () => void }) {
  const { data: me } = useMe();
  const { remove } = useDeletePost();
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Post tidak punya penanda pemilik dan author.id tidak unik,
  // jadi cocokkan username. Server tetap menolak kalau bukan pemilik.
  const isOwner = !!me && me.profile.username === post.author.username;
  if (!isOwner) return null;

  function handleConfirm() {
    setConfirmOpen(false);
    remove(post.id); // hilang dari semua daftar seketika
    onDeleted(); // tutup modal atau pindah halaman
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Post options"
          className="grid size-8 cursor-pointer place-items-center rounded-full outline-hidden hover:bg-neutral-900 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <MoreHorizontal className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setConfirmOpen(true)} className="text-accent-red">
            Delete post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent
          aria-describedby={undefined}
          style={{ width: "min(400px, calc(100vw - 2rem))", maxWidth: "none" }}
          className="gap-xl rounded-2xl border-neutral-800 bg-neutral-950 p-3xl text-neutral-50"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Delete this post?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-400">
            This action cannot be undone. The post and its comments will be removed.
          </p>
          <div className="flex justify-end gap-md">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              className="rounded-full border-neutral-800 bg-transparent dark:bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              className="rounded-full bg-accent-red text-white hover:bg-accent-red/90"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}