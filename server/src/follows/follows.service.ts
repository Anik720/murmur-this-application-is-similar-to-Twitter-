import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private followsRepository: Repository<Follow>,
    private usersService: UsersService,
  ) {}

  async follow(followerId: number, followingId: number): Promise<void> {
    if (followerId === followingId) {
      throw new BadRequestException('Cannot follow yourself');
    }
    const follower = await this.usersService.findById(followerId);
    const following = await this.usersService.findById(followingId);
    const existingFollow = await this.followsRepository.findOne({
      where: { followerId, followingId },
    });
    if (existingFollow) {
      throw new BadRequestException('Already following');
    }
    const follow = this.followsRepository.create({
      followerId,
      followingId,
      follower,
      following,
    });
    await this.followsRepository.save(follow);
  }

  async unfollow(followerId: number, followingId: number): Promise<void> {
    const follow = await this.followsRepository.findOne({
      where: { followerId, followingId },
    });
    if (!follow) {
      throw new NotFoundException('Not following');
    }
    await this.followsRepository.remove(follow);
  }
}