import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Murmur } from './entities/murmur.entity';
import { CreateMurmurDto } from './dtos/create-murmur.dto';
import { MurmurResponseDto } from './dtos/murmur-response.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class MurmursService {
  constructor(
    @InjectRepository(Murmur)
    private murmursRepository: Repository<Murmur>,
    private usersService: UsersService,
  ) {}

  async create(userId: number, createMurmurDto: CreateMurmurDto): Promise<MurmurResponseDto> {
    console.log('createMurmurDto', createMurmurDto);
    const user = await this.usersService.findById(userId);
    const murmur = this.murmursRepository.create({
      content: createMurmurDto.content,
      user,
    });
    const savedMurmur = await this.murmursRepository.save(murmur);
    return this.mapToResponseDto(savedMurmur);
  }

  async findOne(id: number): Promise<MurmurResponseDto> {
    const murmur = await this.murmursRepository
      .createQueryBuilder('murmur')
      .leftJoinAndSelect('murmur.user', 'user')
      .leftJoinAndSelect('murmur.likes', 'likes')
      .where('murmur.id = :id', { id })
      .getOne();
    if (!murmur) {
      throw new NotFoundException('Murmur not found');
    }
    return this.mapToResponseDto(murmur);
  }

async findTimeline(
  userId: number,
  page: number = 1,
  limit: number = 10,
): Promise<{ murmurs: MurmurResponseDto[]; total: number }> {

  const user = await this.usersService.findById(userId, ['following']);

  const followingIds = user.following.map(follow => follow.followingId);

  const userIds = [...followingIds, userId];

  const [murmurs, total] = await this.murmursRepository
    .createQueryBuilder('murmur')
    .leftJoinAndSelect('murmur.user', 'user')
    .leftJoinAndSelect('murmur.likes', 'likes')
    .where('murmur.userId IN (:...userIds)', { userIds })
    .orderBy('murmur.createdAt', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    murmurs: murmurs.map(murmur => this.mapToResponseDto(murmur)),
    total,
  };
}



  async findByUser(userId: number): Promise<MurmurResponseDto[]> {
    const murmurs = await this.murmursRepository
      .createQueryBuilder('murmur')
      .leftJoinAndSelect('murmur.user', 'user')
      .leftJoinAndSelect('murmur.likes', 'likes')
      .where('murmur.userId = :userId', { userId })
      .orderBy('murmur.createdAt', 'DESC')
      .getMany();
    return murmurs.map(murmur => this.mapToResponseDto(murmur));
  }

  async delete(id: number, userId: number): Promise<void> {
    const murmur = await this.murmursRepository.findOne({ where: { id, user: { id: userId } } });
    if (!murmur) {
      throw new NotFoundException('Murmur not found or not authorized');
    }
    await this.murmursRepository.remove(murmur);
  }

  private mapToResponseDto(murmur: Murmur): MurmurResponseDto {
    return {
      id: murmur.id,
      content: murmur.content,
      user: {
        id: murmur.user.id,
        username: murmur.user.username,
      },
      likeCount: murmur.likes ? murmur.likes.length : 0,
      likedUserIds: murmur.likes?.map(like => like.userId) || [],
      createdAt: murmur.createdAt,
    };
  }
}