import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FileUploadDto {
  @ApiProperty()
  @IsOptional()
  fileName: string;

  @ApiProperty()
  @IsOptional()
  fileSize: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  mineType: any;
}
