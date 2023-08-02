import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Serialize, SkipSerialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { CurrentUserType } from 'src/common/types/current-user.type';
import { PageOptionsDto } from 'src/common/dto/pagination/page-options.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import RoleGuard from '../auth/guards/role.guard';
import { Role } from 'src/common/enums/role.enum';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { Response } from 'express';
import { CreateUserOrderDto } from '../orders/dto/create-user-order.dto';
import { OrdersService } from '../orders/orders.service';
import { OrderDto } from '../orders/dto/order.dto';

@ApiTags('Users')
@Controller('api/v1/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  @Get('profile')
  @Serialize(UserDto)
  @SkipSerialize()
  async getProfile(@CurrentUser() user: CurrentUserType) {
    return user;
  }

  @Get()
  @Serialize(UserDto)
  @UseGuards(RoleGuard(Role.Admin))
  async getAllUsers(@Query() pageOptionsDto: PageOptionsDto) {
    return this.usersService.getAllUsers(pageOptionsDto);
  }

  @Get(':id')
  @Serialize(UserDto)
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneById(id);
  }

  @Put(':id')
  @Serialize(UserDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, currentUser, updateUserDto);
  }

  @Patch(':id/role')
  @UseGuards(RoleGuard(Role.Admin))
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Res() response: Response,
  ) {
    await this.usersService.updateUserRole(id, currentUser, updateUserRoleDto);
    return response.sendStatus(200);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Role.Admin))
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Res() response: Response,
  ) {
    await this.usersService.softDelete(id, currentUser);
    return response.sendStatus(204);
  }

  @Patch(':id/restore')
  @UseGuards(RoleGuard(Role.Admin))
  async unDelete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Res() response: Response,
  ) {
    await this.usersService.unDelete(id, currentUser);
    return response.sendStatus(204);
  }

  @Post(':id/order')
  @Serialize(OrderDto)
  async createOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserOrderDto: CreateUserOrderDto,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return await this.ordersService.create(createUserOrderDto, currentUser);
  }

  @Put(':id/order/:orderId')
  @Serialize(OrderDto)
  async updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() createUserOrderDto: CreateUserOrderDto,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return await this.ordersService.update(orderId, createUserOrderDto, currentUser);
  }

  @Delete(':id/order/:orderId')
  async softDeleteOrder(
    @Param('id', ParseIntPipe) id: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Res() response: Response,
  ) {
    await this.ordersService.softDelete(orderId, currentUser);
    return response.sendStatus(204);
  }
}
