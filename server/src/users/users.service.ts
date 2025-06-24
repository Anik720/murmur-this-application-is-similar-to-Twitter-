import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dtos/user-response.dto';
import { Follow } from 'src/follows/entities/follow.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

async findById(id: number, relations: string[] = []): Promise<User> {
  const user = await this.usersRepository.findOne({
    where: { id },
    ...(relations.length > 0 && { relations }),
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  return user;
}


  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

async getProfile(id: number): Promise<UserResponseDto> {
  try {
    const user = await this.findById(id, [
      'followers',
      'following',
      'murmurs',
      'murmurs.user',
      'murmurs.likes',
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const followersIds = Array.isArray(user.followers)
      ? user.followers.map(f => f.followerId)
      : [];

    const followingIds = Array.isArray(user.following)
      ? user.following.map(f => f.followingId)
      : [];

    const followCount = followersIds.length;
    const followedCount = followingIds.length;

    const murmurs :any =
      Array.isArray(user.murmurs) &&
      user.murmurs.map(murmur => ({
        id: murmur.id,
        content: murmur.content,
        user: murmur.user
          ? {
              id: murmur.user.id,
              username: murmur.user.username,
            }
          : null,
        likeCount: Array.isArray(murmur.likes) ? murmur.likes.length : 0,
        likedUserIds: Array.isArray(murmur.likes)
          ? murmur.likes.map(like => like.userId)
          : [],
        createdAt: murmur.createdAt,
      }));

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      followCount,
      followedCount,
      followersIds,
      followingIds,
      murmurs: murmurs || [],
    };
  } catch (error) {
    console.error('Error in getProfile:', error);
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to fetch user profile');
  }
}



async searchUsers(query: string): Promise<UserResponseDto[]> {
  if (!query) return [];

  const users = await this.usersRepository.find({
    where: [
      { username: ILike(`%${query}%`) },
      { email: ILike(`%${query}%`) },
    ],
    take: 20, // limit to 20 results (adjust as needed)
  });

  return users.map(user => ({
    id: user.id,
    username: user.username,
    email: user.email,
    followCount: 0,
    followedCount: 0,
    followersIds: [],
    followingIds: [],
  }));
}

}