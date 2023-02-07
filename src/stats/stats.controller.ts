import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StatsService } from './stats.service';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
  @Get('csv')
  async getStatsCsv() {
    return await this.statsService.getStatsCsv();
  }
}
