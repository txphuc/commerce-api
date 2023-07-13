import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { CurrentUserType } from 'src/common/types/current-user.type';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemsRepository } from './items.repository';
import { createErrorType } from 'src/common/types/error.type';
import { commonError } from 'src/common/errors/constants/common.constant';
import { Item } from './entities/item.entity';
import { UpdateItemDto } from './dto/update-item.dto';
import { ProductsService } from '../products/products.service';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class ItemsService {
  private readonly logger = new Logger(ItemsService.name);

  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly productsService: ProductsService,
  ) {}

  async create(createItemDto: CreateItemDto, currentUser: CurrentUserType): Promise<Item> {
    await this.productsService.findOneById(createItemDto.productId);
    const item = this.itemsRepository.create(createItemDto);
    item.setCreatedUser(currentUser.userId);
    return await this.itemsRepository.save(item);
  }

  async findOneById(id: number): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({ id: id });
    if (!item) {
      throw new BadRequestException(createErrorType(Item.name, 'id', commonError.isNotFound));
    }
    return item;
  }

  async update(id: number, currentUser: CurrentUserType, updateItemDto: UpdateItemDto) {
    const item = await this.itemsRepository.findOneBy({ id: id });
    if (!item) {
      throw new BadRequestException(createErrorType(Item.name, 'id', commonError.isNotFound));
    }
    await this.productsService.findOneById(updateItemDto.productId);
    Object.assign(item, updateItemDto);
    item.setUpdatedUser(currentUser.userId);

    return await this.itemsRepository.save(item);
  }

  async softDelete(id: number, currentUser: CurrentUserType) {
    const item = await this.itemsRepository.findOne({ where: { id: id } });
    if (!item) {
      throw new BadRequestException(createErrorType(Item.name, 'id', commonError.isNotFound));
    }
    item.setUpdatedUser(currentUser.userId);
    item.deletedAt = new Date();
    await this.itemsRepository.save(item);
  }

  async unDelete(id: number, currentUser: CurrentUserType) {
    const item = await this.itemsRepository.findOne({
      where: { id: id },
      withDeleted: true,
    });
    if (!item) {
      throw new BadRequestException(createErrorType(Item.name, 'id', commonError.isNotFound));
    }
    if (item.deletedAt === null) {
      throw new BadRequestException(createErrorType(Item.name, 'id', commonError.notDeletedYet));
    }
    item.deletedAt = null;
    item.setCreatedUser(currentUser.userId);
    await this.itemsRepository.save(item);
  }

  async getItemsOfProduct(productId: number, currentUser: CurrentUserType): Promise<Item[]> {
    return await this.itemsRepository.find({
      where: { productId: productId },
      withDeleted: currentUser?.role === Role.Admin,
    });
  }
}
