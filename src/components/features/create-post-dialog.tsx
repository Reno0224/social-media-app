// src/components/features/create-post-dialog.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, X } from "lucide-react";
import { useCreatePost } from "@/hooks/use-post";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { closeCreatePost } from "@/store/slices/ui-slice";
import {
  createPostSchema,
  validateImageFile,
  type CreatePostInput,
} from "@/lib/validations/post";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function CreatePostForm({ onDone }: { onDone: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ file: File; url: string } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const { mutate, isPending } = useCreatePost();

  const form = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { caption: "" },
  });
  const captionError = form.formState.errors.caption?.message;

  // lepaskan URL pratinjau saat diganti atau saat form ditutup
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  function pickFile(file: File | undefined) {
    if (!file) return;
    const error = validateImageFile(file);
    if (error) {
      setFileError(error);
      return;
    }
    setFileError(null);
    setPreview({ file, url: URL.createObjectURL(file) });
  }

  function onSubmit({ caption }: CreatePostInput) {
    if (!preview) {
      setFileError("Please choose an image");
      return;
    }
    mutate({ file: preview.file, caption }, { onSuccess: onDone });
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-xl">
      <div className="space-y-sm">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            pickFile(e.dataTransfer.files[0]);
          }}
          className={cn(
            "relative flex h-[min(340px,40dvh)] w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed",
            dragging ? "border-primary-200 bg-neutral-900" : "border-neutral-700 bg-neutral-950"
          )}
        >
          {preview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.url}
                alt="Selected image preview"
                className="size-full object-cover"
              />
              <button
                type="button"
                onClick={() => setPreview(null)}
                aria-label="Remove image"
                className="absolute right-md top-md grid size-8 cursor-pointer place-items-center rounded-full bg-black/70 text-white"
              >
                <X className="size-5" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center gap-md p-xl text-center"
            >
              <ImagePlus className="size-8 text-neutral-400" />
              <span className="text-sm font-semibold">Click to upload or drag and drop</span>
              <span className="text-xs text-neutral-400">PNG, JPG, or WEBP up to 5 MB</span>
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          aria-label="Choose image"
          className="sr-only"
          onChange={(e) => {
            pickFile(e.target.files?.[0]);
            e.target.value = ""; // izinkan memilih file yang sama lagi
          }}
        />

        {fileError && (
          <p role="alert" className="text-xs text-accent-red">
            {fileError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-sm">
        <Label htmlFor="caption" className="text-sm font-medium">
          Caption
        </Label>
        <Textarea
          {...form.register("caption")}
          id="caption"
          rows={3}
          placeholder="Write a caption..."
          aria-invalid={!!captionError}
          className={cn(
            "rounded-xl border-neutral-800 bg-neutral-950 text-sm dark:bg-neutral-950",
            captionError && "border-accent-red"
          )}
        />
        {captionError && (
          <p role="alert" className="text-xs text-accent-red">
            {captionError}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={!preview || isPending}
        className="h-11 w-full rounded-full bg-primary-300 font-semibold text-white hover:bg-primary-200"
      >
        {isPending ? "Sharing..." : "Share"}
      </Button>
    </form>
  );
}

export function CreatePostDialog() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.createPostOpen);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) dispatch(closeCreatePost());
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        style={{ width: "min(520px, calc(100vw - 2rem))", maxWidth: "none" }}
        className="max-h-[92dvh] gap-3xl overflow-y-auto rounded-2xl border-neutral-800 bg-neutral-950 p-3xl text-neutral-50"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Create Post</DialogTitle>
        </DialogHeader>
        <CreatePostForm onDone={() => dispatch(closeCreatePost())} />
      </DialogContent>
    </Dialog>
  );
}