export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
}

export interface AuthData {
  token: string;
  user: User;
}

export interface Profile {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createAt: string;
}

export interface ProfileStats {
  posts: number;
  followers: number;
  following: number;
  likes: number;
}

export interface MeData {
  profile: Profile;
  stats: ProfileStats;
}

// gallery

export interface PostAuthor {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
}

export interface Post {
  id: number;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
  author: PostAuthor;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PostsPage {
  posts: Post[];
  pagination: Pagination;
}

export interface SavedPost {
  id: number;
  imageUrl: string | null;
  caption: string | null;
  createdAt: string;
}

export interface SavedPage {
  posts: SavedPost[];
  pagination: Pagination;
}

export interface PostComment {
  id: number;
  text: string;
  createdAt: string;
  author: PostAuthor;
  isMine?: boolean;
}

export interface CommentsPage {
  comments: PostComment[];
  pagination: Pagination;
}

export interface UserSummary {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe?: boolean;
  isMe?: boolean;
  followsMe: boolean;
}

export interface UsersPage {
  users: UserSummary[];
  pagination: Pagination;
}

export interface PublicProfile {
  id: number;
  name: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  counts: { post: number; followers: number; following: number; likes: number };
  isFollowing: boolean;
  isMe: boolean;
}
