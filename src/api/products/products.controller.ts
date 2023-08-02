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
  Query,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CurrentUserType } from 'src/common/types/current-user.type';
import RoleGuard from '../auth/guards/role.guard';
import { Response } from 'express';
import { Role } from 'src/common/enums/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { ProductPageOptionsDto } from 'src/common/dto/pagination/product-page-options.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ProductDto } from './dto/product.dto';
import { Public } from '../auth/strategies/public.strategy';

@Controller('api/v1/products')
@ApiTags('Products')
@Serialize(ProductDto)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Public()
  async getAllProducts(
    @Query() productPageOptionsDto: ProductPageOptionsDto,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.productsService.getAllProducts(productPageOptionsDto, currentUser);
  }

  @Post()
  @UseGuards(RoleGuard(Role.Admin))
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.productsService.create(createProductDto, currentUser);
  }

  @Get(':id')
  @Public()
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.productsService.findOneById(id, currentUser);
  }

  @Put(':id')
  @UseGuards(RoleGuard(Role.Admin))
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, currentUser, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Role.Admin))
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Res() response: Response,
  ) {
    await this.productsService.softDelete(id, currentUser);
    return response.sendStatus(204);
  }

  @Patch(':id/restore')
  @UseGuards(RoleGuard(Role.Admin))
  async unDelete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Res() response: Response,
  ) {
    await this.productsService.unDelete(id, currentUser);
    return response.sendStatus(204);
  }
}
