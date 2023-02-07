import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
// import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { CreateCommentDto } from 'src/dto/CreateCommentDto.dto';
import { Comment } from 'src/entitie/comment.entity';
import { StatsService } from 'src/stats/stats.service';
import { CommentService } from './comment.service';

@ApiTags('comments')
@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly statsService: StatsService,
  ) {}

  @Post()
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return await this.commentService.createComment(createCommentDto);
  }

  @ApiQuery({
    name: 'page',
    type: Number,
    required: true,
    description: "can't be zero or negative",
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'post id',
  })
  @Get('/:id')
  async getComments(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Param('id', ParseIntPipe) postId: number,
  ): Promise<{ count: number; data: Comment[] }> {
    return await this.commentService.getComments(page, limit, postId);
  }
  //   @Get()
  //   async getComments(@Paginate() query: PaginateQuery) {
  //     return await this.commentService.findAllComments(query);
  //   }
  // @Patch(':id')
  // async approveComment(@Param('id', ParseIntPipe) id: number) {
  //   return await this.commentService.approveComment(id);
  // }

  @Get('/approve/:id')
  async approveComment(
    @Param('id', ParseIntPipe) id: number,
    @Query('approve', ParseBoolPipe) approve: boolean,
  ) {
    const comment = await this.commentService.approveComment(id, approve);
    if (comment) {
      await this.statsService.updatePostStats(comment);
      return comment;
    }
  }

  // @ApiParam({ required: true, name: 'id' })
  // @Get(':id')
  // async getComment(
  //   @Param('id', ParseIntPipe)
  //   id: number,
  // ): Promise<Comment> {
  //   return await this.commentService.getComment(id);
  // }
}
