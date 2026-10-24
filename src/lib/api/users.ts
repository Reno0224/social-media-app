// src/lib/api/users.ts
import { api } from "./client";
import type { PublicProfile, UsersPage } from "@/types/api";

const LIMIT = 10;
const enc = encodeURIComponent;

export const usersApi = {
  search: (q: string, page: number) =>
    api<UsersPage>(`/api/users/search?q=${enc(q)}&page=${page}&limit=${LIMIT}`),

  profile: (username: string) => api<PublicProfile>(`/api/users/${enc(username)}`),

  followers: (username: string, page: number) =>
    api<UsersPage>(`/api/users/${enc(username)}/followers?page=${page}&limit=${LIMIT}`),

  following: (username: string, page: number) =>
    api<UsersPage>(`/api/users/${enc(username)}/following?page=${page}&limit=${LIMIT}`),

  myFollowers: (page: number) =>
    api<UsersPage>(`/api/me/followers?page=${page}&limit=${LIMIT}`),

  myFollowing: (page: number) =>
    api<UsersPage>(`/api/me/following?page=${page}&limit=${LIMIT}`),

  postLikes: (postId: number, page: number) =>
    api<UsersPage>(`/api/posts/${postId}/likes?page=${page}&limit=${LIMIT}`),

  follow: (username: string) =>
    api<unknown>(`/api/follow/${enc(username)}`, { method: "POST" }),

  unfollow: (username: string) =>
    api<unknown>(`/api/follow/${enc(username)}`, { method: "DELETE" }),
};