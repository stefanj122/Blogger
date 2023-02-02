import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class PostVisitListener {
  constructor(private readonly postsService: PostsService) {}
  @OnEvent('postVisited')
  async handlePostVisit(id: number) {
    return await this.postsService.postVisit(id);
  }
}
