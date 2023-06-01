import { Controller, Get, Logger, Param, ParseIntPipe, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Serialize, SkipSerialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { CurrentUserType } from 'src/common/types/current-user.type';
import { PageOptionsDto } from 'src/common/dto/pagination/page-options.dto';

@ApiTags('Users')
@Serialize(UserDto)
@Controller('api/v1/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @SkipSerialize()
  async getProfile(@CurrentUser() user: CurrentUserType) {
    return user;
  }

  @Get()
  async getAllUsers(@Query() pageOptionsDto: PageOptionsDto) {
    return this.usersService.getAllUsers(pageOptionsDto);
  }

  @Get(':id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneById(id);
  }
}
