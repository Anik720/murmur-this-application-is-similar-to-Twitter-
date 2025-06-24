import { Entity, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Murmur } from '../../murmurs/entities/murmur.entity';

@Entity('likes')
export class Like {
  @Column({ type: 'int', primary: true })
  userId: number;

  @Column({ type: 'int', primary: true })
  murmurId: number;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @ManyToOne(() => Murmur, (murmur) => murmur.likes)
  murmur: Murmur;

  @CreateDateColumn()
  createdAt: Date;
}