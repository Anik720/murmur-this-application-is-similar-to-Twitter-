export interface UserProfile {
  id: string;
  username: string;
  name: string;
  followCount: number;
  followedCount: number;
  isFollowed?: boolean;
}