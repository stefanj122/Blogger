import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entitie';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (users) => users.comments)
  user: User;

  @ManyToOne(() => Post, (posts) => posts.comments)
  post: Post;

  @Column({ nullable: true, type: 'varchar' })
  email: string;

  @Column({ nullable: true, type: 'varchar' })
  name: string;

  @Column({ nullable: false, type: 'varchar' })
  title: string;

  @Column({ nullable: true, type: 'text' })
  content: string;

  @Column({ type: 'integer' })
  rate: number;

  @Column({ default: false })
  isApproved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
