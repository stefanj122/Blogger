import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entitie';
@Entity({ name: 'postStatus' })
export class PostStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  postViews: number;

  @Column({ default: 0 })
  numberOfComments: number;

  @Column({ default: 0, type: 'float' })
  avgRating: number;

  @Column({ default: 0 })
  userComments: number;

  @Column({ default: 0 })
  guestComments: number;

  @OneToOne(() => Post, (post) => post.stats)
  post: Post;
}
