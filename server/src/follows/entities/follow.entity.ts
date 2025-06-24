import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('follows')
export class Follow {
  @PrimaryColumn()
  followerId: number;

  @PrimaryColumn()
  followingId: number;

  @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followerId' })
  follower: User;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followingId' })
  following: User;

  @CreateDateColumn()
  createdAt: Date;
}
