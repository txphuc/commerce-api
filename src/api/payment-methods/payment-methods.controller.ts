import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Res,
  Put,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CurrentUserType } from 'src/common/types/current-user.type';
import RoleGuard from '../auth/guards/role.guard';
import { Response } from 'express';
import { Role } from 'src/common/enums/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { Public } from '../auth/strategies/public.strategy';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { PaymentMethodsService } from './payment-methods.service';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethodDto } from './dto/payment-method.dto';

@Controller('api/v1/payment-methods')
@ApiTags('PaymentMethod')
@Serialize(PaymentMethodDto)
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Get()
  @Public()
  async getAllPaymentMethod(@CurrentUser() currentUser: CurrentUserType) {
    return this.paymentMethodsService.getAllPaymentMethods(currentUser);
  }

  @Post()
  @UseGuards(RoleGuard(Role.Admin))
  async create(
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.paymentMethodsService.create(createPaymentMethodDto, currentUser);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodsService.findOneById(id);
  }

  @Put(':id')
  @UseGuards(RoleGuard(Role.Admin))
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    return this.paymentMethodsService.update(id, currentUser, updatePaymentMethodDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Role.Admin))
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Res() response: Response,
  ) {
    await this.paymentMethodsService.softDelete(id, currentUser);
    return response.sendStatus(204);
  }

  @Patch(':id/restore')
  @UseGuards(RoleGuard(Role.Admin))
  async unDelete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Res() response: Response,
  ) {
    await this.paymentMethodsService.unDelete(id, currentUser);
    return response.sendStatus(204);
  }
}
