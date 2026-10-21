import { api } from "./client";
import type { PostsPage } from "@/types/api";

const LIMIT = 10;

export const postsApi = {
  feed: (page: number) =>
    api<PostsPage>(`/api/feed?page=${page}&limit=${LIMIT}`),

  byUser: (username: string, page: number) =>
    api<PostsPage>(
      `/api/users/${encodeURIComponent(username)}/posts?page=${page}&limit=${LIMIT}`,
    ),
  like: (id: number) =>
    api<unknown>(`api/posts/${id}/like`, { method: "POST" }),

  unlike: (id: number) =>
    api<unknown>(`api/posts/${id}/like`, { method: "DELETE" }),
};
