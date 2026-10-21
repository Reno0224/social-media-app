"use client";

import { useRef } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { postsApi } from "@/lib/api/posts";
import { queryKeys } from "@/lib/query-key";
import { useIsAuthenticated } from "@/hooks/use-auth";
import type { Post, PostsPage } from "@/types/api";

function getNextPage(last: PostsPage) {
  const { page, totalPages } = last.pagination;
  return page < totalPages ? page + 1 : undefined;
}

export function flattenPosts(data?: InfiniteData<PostsPage>): Post[] {
  if (!data) return [];
  const seen = new Set<number>();
  const result: Post[] = [];
  for (const page of data.pages) {
    for (const post of page.posts) {
      if (seen.has(post.id)) continue;
      seen.add(post.id);
      result.push(post);
    }
  }

  return result;
}

export function useInfiniteFeed() {
  const { isAuthenticated, isHydrated } = useIsAuthenticated();
  return useInfiniteQuery({
    queryKey: queryKeys.feed,
    queryFn: ({ pageParam }) => postsApi.feed(pageParam),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
    enabled: isHydrated && isAuthenticated,
  });
}

export function useUserPosts(username: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.userPosts(username),
    queryFn: ({ pageParam }) => postsApi.byUser(username, pageParam),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
  });
}

function patchPost(qc: QueryClient, id: number, fn: (p: Post) => Post) {
  qc.setQueriesData<InfiniteData<PostsPage>>(
    { queryKey: queryKeys.posts },
    (old) => {
      if (!old?.pages) return old; // lewati cache yang bukan daftar
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          posts: page.posts.map((p) => (p.id === id ? fn(p) : p)),
        })),
      };
    },
  );
}

export function useToggleLike() {
  const qc = useQueryClient();
  const inFlight = useRef(new Set<number>());

  const mutation = useMutation({
    mutationFn: ({ id, like }: { id: number; like: boolean }) =>
      like ? postsApi.like(id) : postsApi.unlike(id),

    onMutate: async ({ id, like }) => {
      await qc.cancelQueries({ queryKey: queryKeys.posts });
      const snapshot = qc.getQueriesData<InfiniteData<PostsPage>>({
        queryKey: queryKeys.posts,
      });

      patchPost(qc, id, (p) =>
        p.likedByMe === like
          ? p
          : {
              ...p,
              likedByMe: like,
              likeCount: Math.max(0, p.likeCount + (like ? 1 : -1)),
            },
      );
      return { snapshot };
    },

    onError: (e, _vars, ctx) => {
      ctx?.snapshot.forEach(([key, data]) => qc.setQueryData(key, data));
      toast.error(e.message);
    },

    onSettled: (_data, _err, vars) => {
      inFlight.current.delete(vars.id);
      qc.invalidateQueries({ queryKey: queryKeys.posts });
    },
  });

  function toggle(post: Post) {
    if (inFlight.current.has(post.id)) return; //
    inFlight.current.add(post.id);
    mutation.mutate({ id: post.id, like: !post.likedByMe });
  }

  return { toggle };
}
