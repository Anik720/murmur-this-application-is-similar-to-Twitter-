import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MurmursController } from './murmurs.controller';
import { Murmur } from './entities/murmur.entity';
import { UsersModule } from '../users/users.module';
import { MurmursService } from './murmurs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Murmur]), UsersModule],
  providers: [MurmursService],
  controllers: [MurmursController],
exports: [MurmursService],
})
export class MurmursModule {}