// src/lib/query-keys.ts
export const queryKeys = {
  me: ["me"] as const,
  posts: ["posts"] as const,
  feed: ["posts", "feed"] as const,
  userPosts: (username: string) => ["posts", "user", username] as const,
  postDetail: (id: number) => ["posts", "detail", id] as const,
  myLikes: ["posts", "likes", "me"] as const,
  userLikes: (username: string) =>
    ["posts", "likes", "user", username] as const,
  saved: ["saved"] as const,
  savedList: ["saved", "list"] as const,
  savedIds: ["saved", "ids"] as const,
  comments: (id: number) => ["comments", id] as const,
  users: ["users"] as const,
  userSearch: (q: string) => ["users", "search", q] as const,
  userProfile: (username: string) => ["users", "profile", username] as const,
  userList: (kind: string, id: string | number = "me") =>
    ["users", "list", kind, id] as const,
};
