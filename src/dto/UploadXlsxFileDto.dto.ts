import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UploadXlsxFille {
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary' })
  xlsx: any;
}
