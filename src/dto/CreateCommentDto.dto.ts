import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ type: 'number', description: 'Post id' })
  @IsNumber()
  post: number;

  @ApiProperty({ description: 'User ID, is optional' })
  @IsOptional()
  @IsNumber()
  user?: number;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rate: number;
}
