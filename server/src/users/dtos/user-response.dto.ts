export class UserResponseDto {
  id: number;
  username: string;
  email: string;
  followCount: number;
  followedCount: number;
  followersIds: number[]; // <-- Add this
  followingIds: number[]; // <-- Add this
}
