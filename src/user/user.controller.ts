import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { User } from 'src/entitie/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dto/CreateUserDto.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.userService.getUsers();
  }
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<CreateUserDto, 'password'>> {
    return await this.userService.createUser(createUserDto);
  }
  @Get(':id')
  async getUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Omit<CreateUserDto, 'password'>> {
    return await this.userService.getUser(id);
  }
}
