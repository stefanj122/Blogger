import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostStatus } from 'src/entitie/postStatus.entity';
import { PostVisitListener } from 'src/events/visit.listenter';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostStatus])],
  controllers: [StatsController],
  providers: [StatsService, PostVisitListener],
})
export class StatsModule {}
