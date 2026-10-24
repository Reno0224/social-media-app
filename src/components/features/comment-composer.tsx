// src/components/features/comment-composer.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Smile } from "lucide-react";
import { commentSchema, type CommentInput } from "@/lib/validations/comment";
import { useAddComment } from "@/hooks/use-comments";
import { useIsAuthenticated } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const EMOJIS = [
  "😀", "😂", "😍", "🥰", "😎", "🤩",
  "😊", "😉", "🥳", "😭", "😡", "🤔",
  "👍", "👏", "🙏", "🔥", "❤️", "✨",
];

export function CommentComposer({ postId }: { postId: number }) {
  const { isAuthenticated, isHydrated } = useIsAuthenticated();
  const pathname = usePathname();
  const [showEmoji, setShowEmoji] = useState(false);
  const { mutate } = useAddComment(postId);

  const form = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: { text: "" },
  });
  const text = useWatch({ control: form.control, name: "text" });
  const hasText = !!text?.trim();
  const error = form.formState.errors.text?.message;

  if (!isHydrated) return null;

  if (!isAuthenticated) {
    return (
      <p className="text-sm text-neutral-400">
        <Link
          href={`/login?returnTo=${encodeURIComponent(pathname)}`}
          className="font-semibold text-primary-200"
        >
          Login
        </Link>{" "}
        to leave a comment.
      </p>
    );
  }

  function addEmoji(emoji: string) {
    form.setValue("text", (form.getValues("text") ?? "") + emoji, { shouldDirty: true });
    form.setFocus("text");
  }

  function onSubmit({ text }: CommentInput) {
    form.reset({ text: "" }); // kosongkan segera, komentar sudah tampil secara optimistic
    setShowEmoji(false);
    mutate(text, {
      onError: () => form.setValue("text", text), // kembalikan teks kalau gagal
    });
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-md">
      {showEmoji && (
        <div
          role="group"
          aria-label="Emoji"
          className="grid grid-cols-6 gap-md rounded-xl border border-neutral-800 bg-neutral-950 p-lg"
        >
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => addEmoji(emoji)}
              aria-label={`Insert ${emoji}`}
              className="cursor-pointer text-xl transition-transform hover:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div
        className={cn(
          "flex h-12 items-center gap-md rounded-xl border bg-neutral-950 px-lg",
          error ? "border-accent-red" : "border-neutral-800"
        )}
      >
        <button
          type="button"
          onClick={() => setShowEmoji((v) => !v)}
          aria-label="Toggle emoji picker"
          aria-expanded={showEmoji}
          className="cursor-pointer text-neutral-400 hover:text-white"
        >
          <Smile className="size-5" />
        </button>

        <Input
          {...form.register("text")}
          id="comment-input"
          placeholder="Add Comment"
          aria-label="Add comment"
          aria-invalid={!!error}
          autoComplete="off"
          className="h-full flex-1 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0 dark:bg-transparent"
        />

        <button
          type="submit"
          disabled={!hasText}
          className={cn(
            "text-sm font-semibold",
            hasText ? "cursor-pointer text-primary-200" : "text-neutral-600"
          )}
        >
          Post
        </button>
      </div>

      {error && (
        <p role="alert" className="text-xs text-accent-red">
          {error}
        </p>
      )}
    </form>
  );
}