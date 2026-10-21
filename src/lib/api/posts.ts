// src/lib/api/posts.ts
import { api } from "./client";
import type {
  Pagination,
  Post,
  PostsPage,
  SavedPage,
  SavedPost,
} from "@/types/api";

const LIMIT = 10;

interface RawPage<T> {
  items?: T[];
  posts?: T[];
  pagination: Pagination;
}

function normalize<T>(raw: RawPage<T>): { posts: T[]; pagination: Pagination } {
  return { posts: raw.items ?? raw.posts ?? [], pagination: raw.pagination };
}

async function fetchSaved(page: number, limit = LIMIT): Promise<SavedPage> {
  return normalize(
    await api<RawPage<SavedPost>>(`/api/me/saved?page=${page}&limit=${limit}`),
  );
}

export const postsApi = {
  feed: async (page: number): Promise<PostsPage> =>
    normalize(
      await api<RawPage<Post>>(`/api/feed?page=${page}&limit=${LIMIT}`),
    ),

  byUser: async (username: string, page: number): Promise<PostsPage> =>
    normalize(
      await api<RawPage<Post>>(
        `/api/users/${encodeURIComponent(username)}/posts?page=${page}&limit=${LIMIT}`,
      ),
    ),

  saved: fetchSaved,

  allSavedIds: async (): Promise<number[]> => {
    const ids: number[] = [];
    let page = 1;
    for (let i = 0; i < 20; i++) {
      const res = await fetchSaved(page, 50);
      ids.push(...res.posts.map((p) => p.id));
      const { limit, total } = res.pagination;
      if (page * limit >= total) break;
      page += 1;
    }
    return ids;
  },

  like: (id: number) =>
    api<unknown>(`/api/posts/${id}/like`, { method: "POST" }),
  unlike: (id: number) =>
    api<unknown>(`/api/posts/${id}/like`, { method: "DELETE" }),
  save: (id: number) =>
    api<unknown>(`/api/posts/${id}/save`, { method: "POST" }),
  unsave: (id: number) =>
    api<unknown>(`/api/posts/${id}/save`, { method: "DELETE" }),
};
