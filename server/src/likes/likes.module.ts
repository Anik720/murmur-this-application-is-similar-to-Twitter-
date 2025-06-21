import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { Like } from './entities/like.entity';
import { UsersModule } from '../users/users.module';
import { MurmursModule } from '../murmurs/murmurs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Like]), UsersModule, MurmursModule],
  providers: [LikesService],
  controllers: [LikesController],
})
export class LikesModule {}