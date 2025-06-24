export interface User {
  id: string;
  username: string;
  name: string;
  followCount: number;
  followedCount: number;
  isFollowed?: boolean;
}

export interface Murmur {
  id: string;
  text: string;
  userId: string;
  username: string;
  name: string;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}