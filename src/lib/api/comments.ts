import { api } from "./client";
import type { CommentsPage, PostComment } from "@/types/api";

const LIMIT = 10;

export const commentsApi = {
  list: (postId: number, page: number) =>
    api<CommentsPage>(
      `/api/posts/${postId}/comments?page=${page}&limit=${LIMIT}`,
    ),

  add: (postId: number, text: string) =>
    api<PostComment>(`/api/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  remove: (commentId: number) =>
    api<unknown>(`/api/comments/${commentId}`, { method: "DELETE" }),
};
