// src/hooks/use-users.ts
"use client";

import { useRef } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { usersApi } from "@/lib/api/users";
import { queryKeys } from "@/lib/query-key";
import { useIsAuthenticated } from "@/hooks/use-auth";
import type { Pagination, PublicProfile, UserSummary, UsersPage } from "@/types/api";
import { track } from "@/lib/analytics";



function nextPage(last: { pagination: Pagination }) {
  const p = last?.pagination;
  if (!p) return undefined;
  return p.page * p.limit < p.total ? p.page + 1 : undefined;
}

/** Gabungkan semua halaman dan buang duplikat berdasarkan username (id tidak unik). */
export function flattenUsers(data?: InfiniteData<UsersPage>): UserSummary[] {
  if (!data) return [];
  const seen = new Set<string>();
  const result: UserSummary[] = [];
  for (const page of data.pages) {
    for (const user of page?.users ?? []) {
      if (seen.has(user.username)) continue;
      seen.add(user.username);
      result.push(user);
    }
  }
  return result;
}

export function useSearchUsers(q: string) {
  const term = q.trim();
  return useInfiniteQuery({
    queryKey: queryKeys.userSearch(term),
    queryFn: ({ pageParam }) => usersApi.search(term, pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPage,
    enabled: term.length > 0,
  });
}

export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: queryKeys.userProfile(username),
    queryFn: () => usersApi.profile(username),
    enabled: username.length > 0,
  });
}

export type UserListSource =
  | { kind: "followers"; username: string }
  | { kind: "following"; username: string }
  | { kind: "my-followers" }
  | { kind: "my-following" }
  | { kind: "post-likes"; postId: number };

function describe(source: UserListSource) {
  switch (source.kind) {
    case "followers":
      return {
        key: queryKeys.userList("followers", source.username),
        fetch: (page: number) => usersApi.followers(source.username, page),
        needsAuth: false,
      };
    case "following":
      return {
        key: queryKeys.userList("following", source.username),
        fetch: (page: number) => usersApi.following(source.username, page),
        needsAuth: false,
      };
    case "my-followers":
      return {
        key: queryKeys.userList("my-followers"),
        fetch: (page: number) => usersApi.myFollowers(page),
        needsAuth: true,
      };
    case "my-following":
      return {
        key: queryKeys.userList("my-following"),
        fetch: (page: number) => usersApi.myFollowing(page),
        needsAuth: true,
      };
    case "post-likes":
      return {
        key: queryKeys.userList("post-likes", source.postId),
        fetch: (page: number) => usersApi.postLikes(source.postId, page),
        needsAuth: false,
      };
  }
}

export function useUserList(source: UserListSource) {
  const { isAuthenticated, isHydrated } = useIsAuthenticated();
  const cfg = describe(source);

  return useInfiniteQuery({
    queryKey: cfg.key,
    queryFn: ({ pageParam }) => cfg.fetch(pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPage,
    enabled: cfg.needsAuth ? isHydrated && isAuthenticated : true,
  });
}

/** Ubah status follow di SEMUA cache pengguna: daftar (search, followers, likes) dan profil. */
function patchFollow(qc: QueryClient, username: string, next: boolean) {
  qc.setQueriesData({ queryKey: queryKeys.users }, (old: unknown) => {
    if (!old || typeof old !== "object") return old;

    if ("pages" in old) {
      const data = old as InfiniteData<UsersPage>;
      return {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          users: (page.users ?? []).map((u) =>
            u.username === username ? { ...u, isFollowedByMe: next } : u
          ),
        })),
      };
    }

    if ("isFollowing" in old && (old as PublicProfile).username === username) {
      const p = old as PublicProfile;
      if (p.isFollowing === next) return p;
      return {
        ...p,
        isFollowing: next,
        counts: {
          ...p.counts,
          followers: Math.max(0, p.counts.followers + (next ? 1 : -1)),
        },
      };
    }

    return old;
  });
}

export function useToggleFollow() {
  const qc = useQueryClient();
  const inFlight = useRef(new Set<string>());

  const mutation = useMutation({
    mutationFn: ({ username, follow }: { username: string; follow: boolean }) =>
      follow ? usersApi.follow(username) : usersApi.unfollow(username),

    onMutate: async ({ username, follow }) => {
      await qc.cancelQueries({ queryKey: queryKeys.users });
      const snapshot = qc.getQueriesData({ queryKey: queryKeys.users });
      // Tetapkan nilai, bukan membalik: aman kalau terpanggil dua kali.
      patchFollow(qc, username, follow);
      return { snapshot };
    },

    onError: (e, _vars, ctx) => {
      ctx?.snapshot.forEach(([key, data]) => qc.setQueryData(key, data));
      toast.error(e.message);
    },

    onSettled: (_data, _err, vars) => {
      inFlight.current.delete(vars.username);
      qc.invalidateQueries({ queryKey: queryKeys.users });
      qc.invalidateQueries({ queryKey: queryKeys.me }); // angka Following di profilku
      qc.invalidateQueries({ queryKey: queryKeys.feed }); // isi feed ikut berubah
    },
  });

  function toggle(username: string, isFollowing: boolean) {
    if (inFlight.current.has(username)) return; // klik beruntun diabaikan
    inFlight.current.add(username);
    track(isFollowing ? "unfollow_user" : "follow_user" , {username})
    mutation.mutate({ username, follow: !isFollowing });
  }

  return { toggle, isPending: mutation.isPending };
}