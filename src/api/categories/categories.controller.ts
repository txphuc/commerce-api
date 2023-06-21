import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CurrentUserType } from 'src/common/types/current-user.type';
import { Role } from 'src/common/enums/role.enum';
import RoleGuard from '../auth/guards/role.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CategoryDto } from './dto/category.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from '../auth/strategies/public.strategy';

@ApiTags('Categories')
@Serialize(CategoryDto)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(RoleGuard(Role.Admin))
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return await this.categoriesService.create(createCategoryDto, currentUser);
  }

  @Get(':id')
  @UseGuards(RoleGuard(Role.Admin))
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.findOneById(id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard(Role.Admin))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, currentUser, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Role.Admin))
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Res() response: Response,
  ) {
    await this.categoriesService.softDelete(id, currentUser);
    return response.sendStatus(204);
  }

  @Get('parent/:id')
  @Public()
  async getAllCategoriesByParent(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.getAllCategoriesByParent(id);
  }
}
