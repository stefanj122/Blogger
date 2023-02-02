import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsMiddleware } from 'src/middleware/posts.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entitie/post.entitie';
import { User } from 'src/entitie/user.entity';
import { PostVisitListener } from 'src/events/visit.listenter';
import { PostStatus } from 'src/entitie/postStatus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, PostStatus])],
  providers: [PostsService, PostVisitListener],
  controllers: [PostsController],
})
export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PostsMiddleware).forRoutes(PostsController);
  }
}
