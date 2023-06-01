import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/common/enums/role.enum';
import { hash } from 'src/common/utils/bcrypt.util';
import { authError } from 'src/common/errors/constants/auth.constant';
import { commonError } from 'src/common/errors/constants/common.constant';
import { CreateGoogleUserDto } from './dto/create-google-user.dto';
import { UsersRepository } from './users.repository';
import { PageDto } from 'src/common/dto/pagination/page.tdo';
import { PageOptionsDto } from 'src/common/dto/pagination/page-options.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly usersRepository: UsersRepository) {}

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email });
  }

  async findOneById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      return user;
    }
    throw new NotFoundException({
      resource: User.name,
      field: 'id',
      code: commonError.isNotFound,
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    let user = await this.findOneByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException(authError.isExistEmail);
    } else {
      createUserDto.role = Role.User;
      user = this.usersRepository.create(createUserDto);
      user.password = await hash(createUserDto.password);
      return await this.usersRepository.save(user);
    }
  }

  async createGoogleUser(createGoogleUserDto: CreateGoogleUserDto): Promise<User> {
    const user = this.usersRepository.create(createGoogleUserDto);
    user.role = Role.User;
    user.isActivated = true;
    return await this.usersRepository.save(user);
  }

  async getAllUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    return await this.usersRepository.getAllUsersPagination(pageOptionsDto);
  }
}
