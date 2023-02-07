import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entitie/comment.entity';
import { Post } from 'src/entitie/post.entitie';
import { PostStatus } from 'src/entitie/postStatus.entity';
import { User } from 'src/entitie/user.entity';
import { StatsService } from 'src/stats/stats.service';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Post, PostStatus])],
  controllers: [CommentController],
  providers: [CommentService, StatsService],
})
export class CommentModule {}
