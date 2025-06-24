import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Like } from '../../likes/entities/like.entity';

@Entity('murmurs')
export class Murmur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 280 })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.murmurs)
  user: User;

  @OneToMany(() => Like, (like) => like.murmur)
  likes: Like[];
}