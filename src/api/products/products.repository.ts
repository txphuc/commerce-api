import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { PageDto } from 'src/common/dto/pagination/page.dto';
import { ProductPageOptionsDto } from 'src/common/dto/pagination/product-page-options.dto';
import { ProductOrderBy } from 'src/common/enums/product-order-by.enum';
import { getSkip } from 'src/common/utils/pagination.util';
import { PageMetaDto } from 'src/common/dto/pagination/page-meta.dto';
import { CurrentUserType } from 'src/common/types/current-user.type';
import { Role } from 'src/common/enums/role.enum';
import { ProductView } from './entities/product.view.entity';

@Injectable()
export class ProductsRepository extends Repository<Product> {
  constructor(private dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async getAllProductsPagination(
    pageOptionsDto: ProductPageOptionsDto,
    currentUser: CurrentUserType,
  ): Promise<PageDto<Product>> {
    const { search, page, take, order, orderBy, categoryId } = pageOptionsDto;
    const queryBuilder = this.createQueryBuilder('product');
    queryBuilder.leftJoinAndSelect('product_view', 'info', 'product.id = info.product_id');
    if (currentUser?.role === Role.Admin) {
      queryBuilder.withDeleted();
    }

    queryBuilder.orderBy(
      !orderBy || orderBy === ProductOrderBy.none ? 'product.id' : `product.${orderBy}`,
      order,
    );
    if (page) {
      queryBuilder.skip(getSkip(pageOptionsDto)).take(take);
    }

    if (pageOptionsDto.search) {
      queryBuilder.where('product.name ilike :name', { name: `%${search}%` });
    }
    if (categoryId) {
      queryBuilder.where('product.category_id = :categoryId', { categoryId });
    }
    const rawEntities = await queryBuilder.getRawMany();
    const itemCount = rawEntities.length;
    const entities = rawEntities.map((entity) => {
      const product = new Product();
      product.id = entity.product_id;
      product.categoryId = entity.product_category_id;
      product.name = entity.product_name;
      product.description = entity.product_description;
      product.images = entity.product_images;
      product.createdAt = entity.product_created_at;
      product.updatedAt = entity.product_updated_at;
      product.deletedAt = entity.product_deleted_at;
      product.createdBy = entity.product_created_by;
      product.updatedBy = entity.product_updated_by;
      const info = new ProductView();
      info.productId = entity.info_product_id;
      info.minPrice = entity.info_min_price;
      info.maxPrice = entity.info_max_price;
      info.minDiscount = entity.info_min_discount;
      info.maxDiscount = entity.info_max_discount;
      info.totalQuantity = entity.info_total_quantity;
      info.totalPurchased = entity.info_total_purchased;
      product.info = info;
      return product;
    });
    const pageMetaDto = new PageMetaDto(pageOptionsDto, itemCount);

    if (!page) {
      pageMetaDto.take = itemCount;
      pageMetaDto.pageCount = 1;
      pageMetaDto.hasNext = false;
      pageMetaDto.hasPrevious = false;
    }

    return new PageDto(entities, pageMetaDto);
  }
}
