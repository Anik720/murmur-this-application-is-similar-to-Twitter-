import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { UsersService } from '../users/users.service';
import { MurmursService } from '../murmurs/murmurs.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    private usersService: UsersService,
    private murmursService: MurmursService,
  ) {}

  async like(userId: number, murmurId: number): Promise<void> {
    const user = await this.usersService.findById(userId);
    const murmur = await this.murmursService.findOne(murmurId);
    const existingLike = await this.likesRepository.findOne({
      where: { userId, murmurId },
    });
    if (existingLike) {
      throw new BadRequestException('Already liked');
    }
    const like = this.likesRepository.create({
      userId,
      murmurId,
      user,
      murmur,
    });
    await this.likesRepository.save(like);
  }

  async unlike(userId: number, murmurId: number): Promise<void> {
    const like = await this.likesRepository.findOne({
      where: { userId, murmurId },
    });
    if (!like) {
      throw new NotFoundException('Not liked');
    }
    await this.likesRepository.remove(like);
  }
}