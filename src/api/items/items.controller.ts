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
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CurrentUserType } from 'src/common/types/current-user.type';
import RoleGuard from '../auth/guards/role.guard';
import { Response } from 'express';
import { Role } from 'src/common/enums/role.enum';
import { Public } from '../auth/strategies/public.strategy';
import { ApiTags } from '@nestjs/swagger';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ItemDto } from './dto/item.dto';

@Controller('api/v1/items')
@ApiTags('Items')
@Serialize(ItemDto)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @UseGuards(RoleGuard(Role.Admin))
  async create(@Body() createItemDto: CreateItemDto, @CurrentUser() currentUser: CurrentUserType) {
    return this.itemsService.create(createItemDto, currentUser);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: number) {
    return this.itemsService.findOneById(id);
  }

  @Put(':id')
  @UseGuards(RoleGuard(Role.Admin))
  update(
    @Param('id') id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemsService.update(id, currentUser, updateItemDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Role.Admin))
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Res() response: Response,
  ) {
    await this.itemsService.softDelete(id, currentUser);
    return response.sendStatus(204);
  }

  @Patch(':id/restore')
  @UseGuards(RoleGuard(Role.Admin))
  async unDelete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Res() response: Response,
  ) {
    await this.itemsService.unDelete(id, currentUser);
    return response.sendStatus(204);
  }
}
