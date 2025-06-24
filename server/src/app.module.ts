import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';  // <-- Import ConfigModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';
import { Murmur } from './murmurs/entities/murmur.entity';
import { Follow } from './follows/entities/follow.entity';
import { Like } from './likes/entities/like.entity'; // Correct Like import
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MurmursModule } from './murmurs/murmurs.module';
import { FollowsModule } from './follows/follows.module';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // <-- Make ConfigModule global
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'docker',
      password: 'docker',
      database: 'test',
      entities: [User, Murmur, Follow, Like],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UsersModule,
    MurmursModule,
    FollowsModule,
    LikesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
