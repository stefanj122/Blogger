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
import { CommentService } from './comment.service';

@ApiTags('comments')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return await this.commentService.createComment(createCommentDto);
  }
  @ApiQuery({ name: 'page', type: 'number' })
  @Get()
  async getComments(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<{ count: number; data: Comment[] }> {
    return await this.commentService.getComments(page, limit);
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
    return await this.commentService.approveComment(id, approve);
  }

  @ApiParam({ required: true, name: 'id' })
  @Get(':id')
  async getComment(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<Comment> {
    return await this.commentService.getComment(id);
  }
}
