import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/CreateUserDto.dto';
import { User } from 'src/entitie/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.usersRepository.find({ relations: ['posts'] });
  }

  async createUser(
    user: CreateUserDto,
  ): Promise<Omit<CreateUserDto, 'password'>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = await this.usersRepository.save(user);
    if (result) {
      return result;
    }
    throw new BadRequestException('User not created');
  }
  async getUser(id: number): Promise<Omit<CreateUserDto, 'password'>> {
    return await this.usersRepository.findOne({
      where: { id: id },
      relations: ['posts'],
    });
  }
}
