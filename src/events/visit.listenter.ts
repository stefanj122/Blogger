import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { StatsService } from 'src/stats/stats.service';

@Injectable()
export class PostVisitListener {
  constructor(private readonly statsService: StatsService) {}
  @OnEvent('postVisited')
  async handlePostVisit(id: number) {
    return await this.statsService.postVisited(id);
  }
}
