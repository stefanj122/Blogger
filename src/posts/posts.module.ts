import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsMiddleware } from 'src/middleware/posts.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entitie/post.entitie';
import { User } from 'src/entitie/user.entity';
import { PostStatus } from 'src/entitie/postStatus.entity';
import { Comment } from 'src/entitie/comment.entity';
import { StatsModule } from 'src/stats/stats.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, PostStatus, Comment]),
    StatsModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PostsMiddleware).forRoutes(PostsController);
  }
}
