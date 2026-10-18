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
