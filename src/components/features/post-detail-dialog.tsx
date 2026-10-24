"use client";

import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PostDetailView } from "./post-detail-view";

interface PostDetailDialogProps {
  postId: number | null;
  onClose: () => void;
}

export function PostDetailDialog({ postId, onClose }: PostDetailDialogProps) {
  return (
    <Dialog
      open={postId !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        style={{ width: "min(1200px, calc(100vw - 2rem))", maxWidth: "none" }}
        className="gap-0 border-0 bg-transparent p-0 shadow-none"
      >
        <DialogTitle className="sr-only">Post details</DialogTitle>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 grid size-8 cursor-pointer place-items-center rounded-full bg-black/60 text-white md:-top-12 md:right-0 md:bg-transparent"
        >
          <X className="size-6" />
        </button>

        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 text-neutral-50">
          {postId !== null && (
            <PostDetailView postId={postId} onDeleted={onClose} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
