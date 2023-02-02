import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { PostStatus } from './postStatus.entity';
import { User } from './user.entity';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Comment, (coments) => coments.post)
  comments: Comment[];

  @OneToOne(() => PostStatus, (stats) => stats.post)
  @JoinColumn()
  stats: PostStatus;

  @Column({ type: 'varchar', length: 255, default: 'Title' })
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
