import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entitie/comment.entity';
import { PostStatus } from 'src/entitie/postStatus.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(PostStatus)
    private readonly postStatusRepository: Repository<PostStatus>,
  ) {}

  async postVisited(postId: number) {
    const stats = await this.postStatusRepository.findOneBy({
      post: { id: postId },
    });
    stats.postViews++;
    await this.postStatusRepository.save(stats);
  }

  async updatePostStats(comment: Comment) {
    const stats = await this.postStatusRepository.findOne({
      where: { post: { id: comment.post.id } },
    });
    stats.avgRating *= stats.numberOfComments;
    stats.avgRating += comment.rate;
    stats.numberOfComments++;
    stats.avgRating /= stats.numberOfComments;
    comment.user ? stats.userComments++ : stats.guestComments++;

    await this.postStatusRepository.save(stats);
  }
}
