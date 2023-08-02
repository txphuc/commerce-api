import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  Put,
  Res,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CurrentUserType } from 'src/common/types/current-user.type';
import RoleGuard from '../auth/guards/role.guard';
import { Role } from 'src/common/enums/role.enum';
import { Response } from 'express';
import { OrderPageOptionsDto } from 'src/common/dto/pagination/order-page-options.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { OrderDto } from './dto/order.dto';

@Controller('orders')
@ApiTags('Orders')
@Serialize(OrderDto)
@UseGuards(RoleGuard(Role.Admin))
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getAllOrder(@Query() pageOptionsDto: OrderPageOptionsDto) {
    return this.ordersService.getAllOrders(pageOptionsDto);
  }

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.ordersService.create(createOrderDto, currentUser);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.ordersService.findOneById(id, currentUser);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto, currentUser);
  }

  @Delete(':id')
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Res() response: Response,
  ) {
    await this.ordersService.softDelete(id, currentUser);
    return response.sendStatus(204);
  }

  @Patch(':id/restore')
  async unDelete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Res() response: Response,
  ) {
    await this.ordersService.unDelete(id, currentUser);
    return response.sendStatus(204);
  }
}
