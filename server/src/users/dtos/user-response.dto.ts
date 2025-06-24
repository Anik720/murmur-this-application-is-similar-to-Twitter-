import { Murmur } from '../../murmurs/entities/murmur.entity';

export class UserResponseDto {
  id: number;
  username: string;
  email: string;
  followCount: number;
  followedCount: number;
  followersIds: number[];
  followingIds: number[];
  murmurs?: Murmur[]; // add murmurs here
}
