import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  const user = await this.findById(id);

  // Count how many users are following this user
  const followCount = await this.followRepository.count({
    where: { followingId: id },
  });

  // Count how many users this user is following
  const followedCount = await this.followRepository.count({
    where: { followerId: id },
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    followCount,
    followedCount,
  };
}

}