export const queryKeys = {
  me: ["me"] as const,
  posts: ["posts"] as const,
  feed: ["posts", "feed"] as const,
  userPosts: (username: string) => ["posts", "user", username] as const,
  saved: ["saved", "list"] as const,
  savedIds: ["saved", "ids"] as const,
};
