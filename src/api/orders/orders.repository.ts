import { Injectable } from '@nestjs/common';
import { PageMetaDto } from 'src/common/dto/pagination/page-meta.dto';
import { PageDto } from 'src/common/dto/pagination/page.dto';
import { getSkip } from 'src/common/utils/pagination.util';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderPageOptionsDto } from 'src/common/dto/pagination/order-page-options.dto';
import { isNumberString } from '@nestjs/class-validator';

@Injectable()
export class OrdersRepository extends Repository<Order> {
  constructor(private dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }

  async getAllOrdersPagination(pageOptionsDto: OrderPageOptionsDto): Promise<PageDto<Order>> {
    const { search, page, take, order, status, isPaid } = pageOptionsDto;
    const queryBuilder = this.createQueryBuilder('order');
    queryBuilder.withDeleted();
    queryBuilder.leftJoinAndSelect('order.user', 'user');
    queryBuilder.leftJoinAndSelect('order.orderItems', 'orderItem');
    queryBuilder.leftJoinAndSelect('order.paymentMethod', 'paymentMethod');
    queryBuilder.leftJoinAndSelect('orderItem.item', 'item');

    queryBuilder.orderBy('order.id', order);
    if (page) {
      queryBuilder.skip(getSkip(pageOptionsDto)).take(take);
    }

    if (status) {
      queryBuilder.where('order.status = :status', { status });
    }

    if (isPaid !== null && isPaid !== undefined) {
      queryBuilder.where('order.is_paid = :isPaid', { isPaid });
    }

    if (pageOptionsDto.search) {
      if (isNumberString(search)) {
        queryBuilder.andWhere('(order.id = :id OR user.full_name ilike :name)', {
          id: search,
          name: `%${search}%`,
        });
      } else {
        queryBuilder.andWhere('user.full_name ilike :name', { name: `%${search}%` });
      }
    }

    const [entities, itemCount] = await queryBuilder.getManyAndCount();

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
