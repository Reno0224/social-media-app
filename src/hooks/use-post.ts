// src/hooks/use-post.ts
"use client";

import { useMemo, useRef } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { postsApi } from "@/lib/api/posts";
import { queryKeys } from "@/lib/query-key";
import { useIsAuthenticated } from "@/hooks/use-auth";
import type { Pagination, Post, PostsPage } from "@/types/api";

function getNextPage(last: { pagination: Pagination }) {
  const p = last?.pagination;
  if (!p) return undefined;
  return p.page * p.limit < p.total ? p.page + 1 : undefined;
}

/** Gabungkan semua halaman dan buang duplikat berdasarkan id. */
export function flattenPosts<T extends { id: number }>(
  data?: InfiniteData<{ posts: T[] }>,
): T[] {
  if (!data) return [];

  const seen = new Set<number>();
  const result: T[] = [];

  for (const page of data.pages) {
    for (const post of page?.posts ?? []) {
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

export function useSavedPosts() {
  const { isAuthenticated, isHydrated } = useIsAuthenticated();
  return useInfiniteQuery({
    queryKey: queryKeys.savedList,
    queryFn: ({ pageParam }) => postsApi.saved(pageParam),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
    enabled: isHydrated && isAuthenticated,
  });
}

/** Himpunan id post yang sudah disimpan user. */
export function useSavedIds() {
  const { isAuthenticated, isHydrated } = useIsAuthenticated();
  const query = useQuery({
    queryKey: queryKeys.savedIds,
    queryFn: postsApi.allSavedIds,
    enabled: isHydrated && isAuthenticated,
  });
  const savedIds = useMemo(() => new Set(query.data ?? []), [query.data]);
  return { savedIds, isLoading: query.isLoading };
}

/** Ubah satu post di SEMUA daftar yang ada di cache (feed, gallery, dst). */
function patchPost(qc: QueryClient, id: number, fn: (p: Post) => Post) {
  qc.setQueriesData<InfiniteData<PostsPage>>(
    { queryKey: queryKeys.posts },
    (old) => {
      if (!old?.pages) return old; // lewati cache yang bukan daftar
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          posts: (page.posts ?? []).map((p) => (p.id === id ? fn(p) : p)),
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
      // Tetapkan nilai, bukan sekadar menambah angka: aman kalau terpanggil dua kali.
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
      qc.invalidateQueries({ queryKey: queryKeys.posts }); // samakan dengan server
    },
  });

  function toggle(post: Post) {
    if (inFlight.current.has(post.id)) return; // abaikan klik beruntun pada post yang sama
    inFlight.current.add(post.id);
    mutation.mutate({ id: post.id, like: !post.likedByMe });
  }

  return { toggle };
}

export function useToggleSave() {
  const qc = useQueryClient();
  const inFlight = useRef(new Set<number>());

  const mutation = useMutation({
    mutationFn: ({ id, save }: { id: number; save: boolean }) =>
      save ? postsApi.save(id) : postsApi.unsave(id),

    onMutate: async ({ id, save }) => {
      await qc.cancelQueries({ queryKey: queryKeys.savedIds });
      const previous = qc.getQueryData<number[]>(queryKeys.savedIds);
      qc.setQueryData<number[]>(queryKeys.savedIds, (old = []) => {
        const has = old.includes(id);
        if (save) return has ? old : [...old, id];
        return has ? old.filter((x) => x !== id) : old;
      });
      return { previous };
    },

    onError: (e, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKeys.savedIds, ctx.previous);
      toast.error(e.message);
    },

    onSettled: (_data, _err, vars) => {
      inFlight.current.delete(vars.id);
      qc.invalidateQueries({ queryKey: queryKeys.saved }); // daftar dan id ikut disinkronkan
    },
  });

  function toggle(postId: number, isSaved: boolean) {
    if (inFlight.current.has(postId)) return;
    inFlight.current.add(postId);
    mutation.mutate({ id: postId, save: !isSaved });
  }

  return { toggle };
}
