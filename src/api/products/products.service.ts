import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { CurrentUserType } from 'src/common/types/current-user.type';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsRepository } from './products.repository';
import { createErrorType } from 'src/common/types/error.type';
import { commonError } from 'src/common/errors/constants/common.constant';
import { Product } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { ProductPageOptionsDto } from 'src/common/dto/pagination/product-page-options.dto';
import { PageDto } from 'src/common/dto/pagination/page.tdo';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../items/entities/item.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/common/enums/role.enum';
import { ProductView } from './entities/product.view.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesService: CategoriesService,
    @InjectRepository(Item) private readonly itemsRepository: Repository<Item>,
    @InjectRepository(ProductView) private readonly productViewRepository: Repository<ProductView>,
  ) {}

  async getAllProducts(
    productPageOptionsDto: ProductPageOptionsDto,
    currentUser: CurrentUserType,
  ): Promise<PageDto<Product>> {
    return await this.productsRepository.getAllProductsPagination(
      productPageOptionsDto,
      currentUser,
    );
  }

  async create(createProductDto: CreateProductDto, currentUser: CurrentUserType): Promise<Product> {
    await this.categoriesService.findOneById(createProductDto.categoryId);
    const product = this.productsRepository.create(createProductDto);
    product.setCreatedUser(currentUser.userId);
    return await this.productsRepository.save(product);
  }

  async findOneById(id: number, currentUser?: CurrentUserType): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id: id } });
    if (!product) {
      throw new BadRequestException(createErrorType(Product.name, 'id', commonError.isNotFound));
    }
    const items = await this.itemsRepository.find({
      where: { productId: id },
      withDeleted: currentUser?.role === Role.Admin,
    });
    product.items = items;
    return product;
  }

  async update(id: number, currentUser: CurrentUserType, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findOneBy({ id: id });
    if (!product) {
      throw new BadRequestException(createErrorType(Product.name, 'id', commonError.isNotFound));
    }
    await this.categoriesService.findOneById(updateProductDto.categoryId);
    Object.assign(product, updateProductDto);
    product.setUpdatedUser(currentUser.userId);

    return await this.productsRepository.save(product);
  }

  async softDelete(id: number, currentUser: CurrentUserType) {
    const product = await this.productsRepository.findOne({ where: { id: id } });
    if (!product) {
      throw new BadRequestException(createErrorType(Product.name, 'id', commonError.isNotFound));
    }
    product.setUpdatedUser(currentUser.userId);
    product.deletedAt = new Date();
    await this.productsRepository.save(product);
  }

  async unDelete(id: number, currentUser: CurrentUserType) {
    const product = await this.productsRepository.findOne({
      where: { id: id },
      withDeleted: true,
    });
    if (!product) {
      throw new BadRequestException(createErrorType(Product.name, 'id', commonError.isNotFound));
    }
    if (product.deletedAt === null) {
      throw new BadRequestException(createErrorType(Product.name, 'id', commonError.notDeletedYet));
    }
    product.deletedAt = null;
    product.setCreatedUser(currentUser.userId);
    await this.productsRepository.save(product);
  }
}
