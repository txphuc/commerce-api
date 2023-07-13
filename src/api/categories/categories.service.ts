import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CurrentUserType } from 'src/common/types/current-user.type';
import { CategoriesRepository } from './categories.repository';
import { createErrorType } from 'src/common/types/error.type';
import { commonError } from 'src/common/errors/constants/common.constant';
import { Category } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IsNull, Not } from 'typeorm';
import { categoryError } from 'src/common/errors/constants/category.constant';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    currentUser: CurrentUserType,
  ): Promise<Category> {
    const errors = [];

    let category = await this.categoriesRepository.findOneBy({ name: createCategoryDto.name });
    if (category) {
      errors.push(createErrorType(Category.name, 'name', commonError.alreadyExists));
    }

    if (createCategoryDto.parentId !== null && createCategoryDto.parentId !== undefined) {
      const parentCategory = await this.categoriesRepository.findOneBy({
        id: createCategoryDto.parentId,
      });
      if (!parentCategory) {
        errors.push(createErrorType(Category.name, 'parentId', commonError.isNotFound));
      }
    }
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    category = this.categoriesRepository.create(createCategoryDto);
    category.setUpdatedUser(currentUser.userId);

    return await this.categoriesRepository.save(category);
  }

  async findOneById(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ id: id });
    if (!category) {
      throw new BadRequestException(createErrorType(Category.name, 'id', commonError.isNotFound));
    }
    return category;
  }

  async update(id: number, currentUser: CurrentUserType, updateCategoryDto: UpdateCategoryDto) {
    if (id <= updateCategoryDto.parentId) {
      throw new BadRequestException(categoryError.invalidParent);
    }
    const errors = [];
    const category = await this.categoriesRepository.findOneBy({ id: id });
    if (!category) {
      throw new BadRequestException(createErrorType(Category.name, 'id', commonError.isNotFound));
    } else {
      const otherCategoryByName = await this.categoriesRepository.findOne({
        where: {
          name: updateCategoryDto.name,
          id: Not(id),
        },
      });
      if (otherCategoryByName) {
        errors.push(createErrorType(Category.name, 'name', commonError.alreadyExists));
      }
    }
    if (updateCategoryDto.parentId !== null && updateCategoryDto.parentId !== undefined) {
      const parentCategory = await this.categoriesRepository.findOneBy({
        id: updateCategoryDto.parentId,
      });
      if (!parentCategory) {
        errors.push(createErrorType(Category.name, 'parentId', commonError.isNotFound));
      }
    }
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    Object.assign(category, updateCategoryDto);
    category.setUpdatedUser(currentUser.userId);

    return await this.categoriesRepository.save(category);
  }

  async softDelete(id: number, currentUser: CurrentUserType) {
    const category = await this.categoriesRepository.findOne({ where: { id: id } });
    if (!category) {
      throw new BadRequestException(createErrorType(Category.name, 'id', commonError.isNotFound));
    }
    category.setUpdatedUser(currentUser.userId);
    category.deletedAt = new Date();
    await this.categoriesRepository.save(category);
  }

  async unDelete(id: number, currentUser: CurrentUserType) {
    const category = await this.categoriesRepository.findOne({
      where: { id: id },
      withDeleted: true,
    });
    if (!category) {
      throw new BadRequestException(createErrorType(Category.name, 'id', commonError.isNotFound));
    }
    if (category.deletedAt === null) {
      throw new BadRequestException(
        createErrorType(Category.name, 'id', commonError.notDeletedYet),
      );
    }
    category.deletedAt = null;
    category.setCreatedUser(currentUser.userId);
    await this.categoriesRepository.save(category);
  }

  async getAllCategoriesByParent(
    currentUser: CurrentUserType,
    parentId?: number,
  ): Promise<Category[]> {
    const categories = await this.categoriesRepository.find({
      where: { parentId: parentId === 0 ? IsNull() : parentId },
      order: { name: 'ASC' },
      withDeleted: currentUser?.role === Role.Admin,
    });
    return categories;
  }
}
