import {
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { UploadXlsxFille } from 'src/dto/UploadXlsxFileDto.dto';
import { StatsService } from './stats.service';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
  @Get('csv')
  @Header(
    'content-type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  async getStatsCsv() {
    return await this.statsService.getStatsCsv();
  }

  @ApiParam({ name: 'id', description: 'popst id' })
  @Get('/:id')
  async getPostStats(@Param('id', ParseIntPipe) postId: number) {
    return await this.statsService.getPostStats(postId);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Xlsx upload',
    type: UploadXlsxFille,
  })
  @Post('/import/xlsx')
  @Header(
    'content-type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @UseInterceptors(FileInterceptor('xlsx'))
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    return await this.statsService.uploadExcel(file);
  }
}
