import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from 'src/dto/CreateFileDto.entity';
import { CreatePostsDto } from 'src/dto/CreatePostsDto.dto';
import { UpdatePostsDto } from 'src/dto/UpdatePostsDto.dto';
import { Post as customPost } from 'src/entitie/post.entitie';
import { PostsService } from './posts.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(): Promise<{ posts: customPost[]; count: number }> {
    return await this.postsService.getPosts();
  }
  @Get(':id')
  async getPostsById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<customPost> {
    return await this.postsService.getPostsById(id);
  }
  @Post()
  async createPost(
    @Body() createPostsDto: CreatePostsDto,
  ): Promise<customPost> {
    return await this.postsService.createPost(createPostsDto);
  }
  @ApiBody({ description: 'Update post', type: UpdatePostsDto })
  @Put(':id')
  updatePost(
    @Body() updatePostsDto: Partial<UpdatePostsDto>,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.postsService.updatePost(updatePostsDto, id);
  }
  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
  @Get('user/:id')
  getUserPosts(@Param('id', ParseIntPipe) id: number): Promise<customPost[]> {
    return this.postsService.getUserPosts(id);
  }
  @Get(':id/stats')
  async getPostStatus(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<customPost> {
    return await this.postsService.getPostStatus(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image upload',
    type: FileUploadDto,
  })
  @Post('uploadCoverImage')
  getUploadCoverImage(@Body() uploadFileDto: FileUploadDto) {
    return uploadFileDto;
  }
}
