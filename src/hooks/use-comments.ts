// src/hooks/use-comments.ts
"use client";

import { useRef } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { commentsApi } from "@/lib/api/comments";
import { queryKeys } from "@/lib/query-key";
import { useMe } from "@/hooks/use-me";
import { patchPost } from "@/hooks/use-post";
import type { CommentsPage, PostComment } from "@/types/api";
import { track } from "@/lib/analytics";

export function useComments(postId: number) {
  return useInfiniteQuery({
    queryKey: queryKeys.comments(postId),
    queryFn: ({ pageParam }) => commentsApi.list(postId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const p = last?.pagination;
      if (!p) return undefined;
      return p.page * p.limit < p.total ? p.page + 1 : undefined;
    },
    enabled: Number.isInteger(postId) && postId > 0,
  });
}

/** Gabungkan semua halaman dan buang duplikat berdasarkan id. */
export function flattenComments(
  data?: InfiniteData<CommentsPage>,
): PostComment[] {
  if (!data) return [];
  const seen = new Set<number>();
  const result: PostComment[] = [];
  for (const page of data.pages) {
    for (const c of page?.comments ?? []) {
      if (seen.has(c.id)) continue;
      seen.add(c.id);
      result.push(c);
    }
  }
  return result;
}

export function useAddComment(postId: number) {
  const qc = useQueryClient();
  const { data: me } = useMe();

  return useMutation({
    mutationFn: (text: string) => commentsApi.add(postId, text),

    onMutate: async (text) => {
      track("submit_comment", { postId });
      await qc.cancelQueries({ queryKey: queryKeys.comments(postId) });
      await qc.cancelQueries({ queryKey: queryKeys.posts });

      const prevComments = qc.getQueryData<InfiniteData<CommentsPage>>(
        queryKeys.comments(postId),
      );
      const prevPosts = qc.getQueriesData({ queryKey: queryKeys.posts });

      if (me) {
        // id negatif = komentar sementara yang belum dikonfirmasi server
        const temp: PostComment = {
          id: -Date.now(),
          text,
          createdAt: new Date().toISOString(),
          author: {
            id: me.profile.id,
            username: me.profile.username,
            name: me.profile.name,
            avatarUrl: me.profile.avatarUrl,
          },
          isMine: true,
        };

        qc.setQueryData<InfiniteData<CommentsPage>>(
          queryKeys.comments(postId),
          (old) => {
            if (!old || old.pages.length === 0) return old;
            const [first, ...rest] = old.pages;
            return {
              ...old,
              pages: [
                {
                  ...first,
                  comments: [temp, ...first.comments],
                  pagination: {
                    ...first.pagination,
                    total: first.pagination.total + 1,
                  },
                },
                ...rest,
              ],
            };
          },
        );
        patchPost(qc, postId, (p) => ({
          ...p,
          commentCount: p.commentCount + 1,
        }));
      }

      return { prevComments, prevPosts };
    },

    onError: (e, _text, ctx) => {
      if (ctx) {
        qc.setQueryData(queryKeys.comments(postId), ctx.prevComments);
        ctx.prevPosts.forEach(([key, data]) => qc.setQueryData(key, data));
      }
      toast.error(e.message);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.comments(postId) });
      qc.invalidateQueries({ queryKey: queryKeys.posts });
    },
  });
}

export function useDeleteComment(postId: number) {
  const qc = useQueryClient();
  const inFlight = useRef(new Set<number>());

  const mutation = useMutation({
    mutationFn: (commentId: number) => commentsApi.remove(commentId),

    onMutate: async (commentId) => {
      await qc.cancelQueries({ queryKey: queryKeys.comments(postId) });
      await qc.cancelQueries({ queryKey: queryKeys.posts });

      const prevComments = qc.getQueryData<InfiniteData<CommentsPage>>(
        queryKeys.comments(postId),
      );
      const prevPosts = qc.getQueriesData({ queryKey: queryKeys.posts });

      qc.setQueryData<InfiniteData<CommentsPage>>(
        queryKeys.comments(postId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              comments: (page.comments ?? []).filter((c) => c.id !== commentId),
              pagination: {
                ...page.pagination,
                total: Math.max(0, page.pagination.total - 1),
              },
            })),
          };
        },
      );
      patchPost(qc, postId, (p) => ({
        ...p,
        commentCount: Math.max(0, p.commentCount - 1),
      }));

      return { prevComments, prevPosts };
    },

    onError: (e, _id, ctx) => {
      if (ctx) {
        qc.setQueryData(queryKeys.comments(postId), ctx.prevComments);
        ctx.prevPosts.forEach(([key, data]) => qc.setQueryData(key, data));
      }
      toast.error(e.message);
    },

    onSettled: (_data, _err, commentId) => {
      inFlight.current.delete(commentId);
      qc.invalidateQueries({ queryKey: queryKeys.comments(postId) });
      qc.invalidateQueries({ queryKey: queryKeys.posts });
    },
  });

  function remove(commentId: number) {
    // komentar sementara (id negatif) belum ada di server, dan klik beruntun diabaikan
    if (commentId < 0 || inFlight.current.has(commentId)) return;
    inFlight.current.add(commentId);
    mutation.mutate(commentId);
  }

  return { remove };
}
