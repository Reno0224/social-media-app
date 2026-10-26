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
import { track } from "@/lib/analytics";

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
export function patchPost(qc: QueryClient, id: number, fn: (p: Post) => Post) {
  qc.setQueriesData({ queryKey: queryKeys.posts }, (old: unknown) => {
    if (!old || typeof old !== "object") return old;

    if ("pages" in old) {
      const data = old as InfiniteData<PostsPage>;
      return {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          posts: (page.posts ?? []).map((p) => (p.id === id ? fn(p) : p)),
        })),
      };
    }

    if ("id" in old && (old as Post).id === id) return fn(old as Post);
    return old;
  });
}

export function useToggleLike() {
  const qc = useQueryClient();
  const inFlight = useRef(new Set<number>());

  const mutation = useMutation({
    mutationFn: ({ id, like }: { id: number; like: boolean }) =>
      like ? postsApi.like(id) : postsApi.unlike(id),

    onMutate: async ({ id, like }) => {
      await qc.cancelQueries({ queryKey: queryKeys.posts });
      const snapshot = qc.getQueriesData({ queryKey: queryKeys.posts });
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
    if (inFlight.current.has(post.id)) return;
    inFlight.current.add(post.id);
    track(post.likedByMe ? "unlike_post" : "like_post" , {postId: post.id})
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
    track(isSaved ? "unsave_post" : "save_post" , {postId})
    mutation.mutate({ id: postId, save: !isSaved });
  }

  return { toggle };
}

export function usePost(id: number) {
  return useQuery({
    queryKey: queryKeys.postDetail(id),
    queryFn: () => postsApi.get(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

/** Buang satu post dari SEMUA daftar di cache (feed, gallery, dst). */
export function removePostFromLists(qc: QueryClient, id: number) {
  qc.setQueriesData({ queryKey: queryKeys.posts }, (old: unknown) => {
    if (!old || typeof old !== "object" || !("pages" in old)) return old;
    const data = old as InfiniteData<PostsPage>;
    return {
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        posts: (page.posts ?? []).filter((p) => p.id !== id),
        pagination: {
          ...page.pagination,
          total: Math.max(0, page.pagination.total - 1),
        },
      })),
    };
  });
}

export function useCreatePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ file, caption }: { file: File; caption: string }) =>
      postsApi.create(file, caption),
    onSuccess: () => {
      toast.success("Post shared");
      // post baru muncul di feed dan gallery, dan angka Post di profil ikut naik
      qc.invalidateQueries({ queryKey: queryKeys.posts });
      qc.invalidateQueries({ queryKey: queryKeys.me });
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  const inFlight = useRef(new Set<number>());

  const mutation = useMutation({
    mutationFn: (id: number) => postsApi.remove(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKeys.posts });
      const snapshot = qc.getQueriesData({ queryKey: queryKeys.posts });
      removePostFromLists(qc, id); // hilang dari semua daftar seketika
      return { snapshot };
    },

    onError: (e, _id, ctx) => {
      ctx?.snapshot.forEach(([key, data]) => qc.setQueryData(key, data));
      toast.error(e.message);
    },

    onSuccess: (_data, id) => {
      toast.success("Post deleted");
      qc.removeQueries({ queryKey: queryKeys.postDetail(id) });
      qc.removeQueries({ queryKey: queryKeys.comments(id) });
    },

    onSettled: (_data, _err, id) => {
      inFlight.current.delete(id);
      qc.invalidateQueries({ queryKey: queryKeys.posts });
      qc.invalidateQueries({ queryKey: queryKeys.saved });
      qc.invalidateQueries({ queryKey: queryKeys.me });
    },
  });

  function remove(id: number) {
    if (inFlight.current.has(id)) return; // klik beruntun diabaikan
    inFlight.current.add(id);
    mutation.mutate(id);
  }

  return { remove };
}

export function useMyLikes() {
  const { isAuthenticated, isHydrated } = useIsAuthenticated();
  return useInfiniteQuery({
    queryKey: queryKeys.myLikes,
    queryFn: ({ pageParam }) => postsApi.myLikes(pageParam),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
    enabled: isHydrated && isAuthenticated,
  });
}

export function useUserLikes(username: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.userLikes(username),
    queryFn: ({ pageParam }) => postsApi.userLikes(username, pageParam),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
    enabled: username.length > 0,
  });
}
