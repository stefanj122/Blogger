import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { CreateCommentDto } from 'src/dto/CreateCommentDto.dto';
import { Comment } from 'src/entitie/comment.entity';
import { Post } from 'src/entitie/post.entitie';
import { User } from 'src/entitie/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const currentPost = await this.postRepository.findOne({
      where: {
        id: createCommentDto.post,
      },
      relations: ['user'],
    });
    if (createCommentDto.user) {
      const currentUser = await this.userRepository.findOneBy({
        id: createCommentDto.user,
      });
      if (currentUser) {
        const comment = await this.commentRepository.save({
          post: currentPost,
          user: currentUser,
          title: createCommentDto.title,
          content: createCommentDto.content,
          rate: createCommentDto.rate,
        });
        this.eventEmitter.emit('newComment', currentPost.user, comment);
        return comment;
      }
    } else if (createCommentDto.email && createCommentDto.name) {
      const comment = await this.commentRepository.save({
        post: currentPost,
        email: createCommentDto.email,
        name: createCommentDto.name,
        title: createCommentDto.title,
        content: createCommentDto.content,
        rate: createCommentDto.rate,
      });
      this.eventEmitter.emit('newComment', currentPost.user, comment);
      return comment;
    } else {
      throw new BadRequestException('Comment not created');
    }
  }

  async getComments(
    page: number,
    limit: number,
    postId: number,
  ): Promise<{ count: number; data: Comment[] }> {
    const [data, count] = await this.commentRepository.findAndCount({
      where: { isApproved: true, post: { id: postId } },
      relations: ['user'],
      take: limit,
      skip: (page - 1) * limit,
    });
    this.eventEmitter.emit('postVisited', postId);
    return { count, data };
  }
  async findAllComments(query: PaginateQuery) {
    return paginate(query, this.commentRepository, {
      sortableColumns: ['id'],
    });
  }
  async approveComment(id: number, approve: boolean) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['post', 'user'],
    });
    if (comment && approve) {
      return await this.commentRepository.save(comment);
    } else if (!comment.isApproved) {
      await this.commentRepository.delete({ id });
      throw new BadRequestException('Comment deleted');
    } else {
      throw new BadRequestException('Comment not found');
    }
  }
  async getComment(id: number): Promise<Comment> {
    return await this.commentRepository.findOneBy({ id });
  }
}
