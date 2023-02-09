import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { StatsService } from './stats.service';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
  @Get('csv')
  async getStatsCsv() {
    return await this.statsService.getStatsCsv();
  }

  @ApiParam({ name: 'id', description: 'popst id' })
  @Get('/:id')
  async getPostStats(@Param('id', ParseIntPipe) postId: number) {
    return await this.statsService.getPostStats(postId);
  }
}
