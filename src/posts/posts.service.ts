import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostsDto } from 'src/dto/CreatePostsDto.dto';
import { UpdatePostsDto } from 'src/dto/UpdatePostsDto.dto';
import { Comment } from 'src/entitie/comment.entity';
import { Post } from 'src/entitie/post.entitie';
import { PostStatus } from 'src/entitie/postStatus.entity';
import { User } from 'src/entitie/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(PostStatus)
    private postStatsRepository: Repository<PostStatus>,
    private eventEmitter: EventEmitter2,
  ) {}

  async getPosts(): Promise<{ posts: Post[]; count: number }> {
    const [data, count] = await this.postsRepository.findAndCount();
    return { posts: data, count: count };
  }

  async getPostsById(id: number): Promise<{ post: Post; comments: Comment[] }> {
    const post = await this.postsRepository.findOne({
      where: { id },
    });
    const comments = await this.commentRepository.find({
      where: { post: { id: post.id }, isApproved: true },
    });
    if (post) {
      this.eventEmitter.emit('postVisited', post.id);
      return { post, comments };
    }
    throw new BadRequestException('Post not found');
  }

  async createPost(createPostsDto: CreatePostsDto): Promise<Post> {
    const user = await this.userRepository.findOneBy({
      id: createPostsDto.userId,
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const postStats = await this.postStatsRepository.save({});
    const post = await this.postsRepository.save({
      user: user,
      stats: postStats,
      ...createPostsDto,
    });
    return post;
  }

  async updatePost(
    updatePostDto: Partial<UpdatePostsDto>,
    id: number,
  ): Promise<Post> {
    return this.postsRepository.save({ id, ...updatePostDto });
  }

  deletePost(id: number) {
    return this.postsRepository.delete({ id });
  }

  async getUserPosts(id: number): Promise<Post[]> {
    const user = await this.userRepository.findOneBy({ id });
    return await this.postsRepository.find({
      where: { user: { id: user.id } },
      relations: ['user'],
    });
  }

  async getPostStatus(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user', 'stats'],
    });
    if (post) {
      return post;
    } else {
      throw new BadRequestException('Post not found');
    }
  }
}
