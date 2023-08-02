import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersRepository } from './orders.repository';
import { OrderPageOptionsDto } from 'src/common/dto/pagination/order-page-options.dto';
import { CurrentUserType } from 'src/common/types/current-user.type';
import { CreateUserOrderDto } from './dto/create-user-order.dto';
import { EntityManager } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { PaymentMethod } from '../payment-methods/entities/payment-method.entity';
import { commonError } from 'src/common/errors/constants/common.constant';
import { ErrorType, createErrorType } from 'src/common/types/error.type';
import { User } from '../users/entities/user.entity';
import { Item } from '../items/entities/item.entity';
import * as _ from 'lodash';
import { orderError } from 'src/common/errors/constants/order.constant';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateUserOrderDto } from './dto/update-user-order.dto';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly ordersRepository: OrdersRepository) {}

  async getAllOrders(pageOptionsDto: OrderPageOptionsDto) {
    return await this.ordersRepository.getAllOrdersPagination(pageOptionsDto);
  }

  async create(createDto: CreateOrderDto | CreateUserOrderDto, currentUser: CurrentUserType) {
    const savedOrderId = await this.ordersRepository.manager.transaction(
      async (manager: EntityManager) => {
        const errors: ErrorType[] = [];
        const paymentMethod = await manager.findOneBy(PaymentMethod, {
          id: createDto.paymentMethodId,
        });

        if (!paymentMethod) {
          errors.push(
            createErrorType(
              PaymentMethod.name,
              'id',
              commonError.isNotFound,
              createDto.paymentMethodId,
            ),
          );
        }

        if (currentUser?.role === Role.Admin) {
          if (createDto[`userId`]) {
            const user = await manager.findOneBy(User, { id: createDto[`userId`] });
            if (!user) {
              errors.push(
                createErrorType(User.name, 'id', commonError.isNotFound, createDto[`userId`]),
              );
            }
          } else {
            createDto[`userId`] = currentUser?.userId;
          }
        }

        const itemsById = await this.validateOrderItems(createDto, errors, manager);

        if (errors.length > 0) {
          throw new BadRequestException(errors);
        }

        const order: Order = this.ordersRepository.create(createDto);
        order.setCreatedUser(currentUser?.userId);
        const savedOrder: Order = await manager.save(Order, order);

        const orderItemsForSave = this.generateOrderItems(
          createDto,
          manager,
          currentUser,
          savedOrder.id,
          itemsById,
          true,
        );

        await manager.save(OrderItem, orderItemsForSave);
        return savedOrder.id;
      },
    );
    return await this.findOneById(savedOrderId, currentUser);
  }

  async findOneById(id: number, currentUser: CurrentUserType): Promise<Order> {
    const order = await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .leftJoinAndSelect('order.paymentMethod', 'paymentMethod')
      .leftJoinAndSelect('orderItem.item', 'item')
      .where('order.id = :id', { id })
      .getOne();
    if (!order) {
      throw new NotFoundException(createErrorType(Order.name, 'id', commonError.isNotFound, id));
    }
    if (currentUser?.role === Role.User) {
      if (currentUser?.userId !== order.userId) {
        throw new ForbiddenException(
          createErrorType(User.name, 'role', commonError.forbiddenResource, currentUser?.role),
        );
      }
    }
    return order;
  }

  async update(
    id: number,
    updateDto: UpdateOrderDto | UpdateUserOrderDto,
    currentUser: CurrentUserType,
  ): Promise<Order> {
    await this.ordersRepository.manager.transaction(async (manager: EntityManager) => {
      const order = await this.ordersRepository.findOne({ where: { id: id } });
      if (!order) {
        throw new NotFoundException(createErrorType(Order.name, 'id', commonError.isNotFound, id));
      }
      if (currentUser?.role === Role.User) {
        if (order.userId !== currentUser?.userId) {
          throw new ForbiddenException(
            createErrorType(User.name, 'role', commonError.forbiddenResource, currentUser?.role),
          );
        }
        if (order.status === OrderStatus.Canceled) {
          throw new BadRequestException(
            createErrorType(
              Order.name,
              'status',
              orderError.canNotUpdateCanceledOrder,
              order.status,
            ),
          );
        }
        if (order.status !== OrderStatus.Unconfirmed) {
          throw new BadRequestException(
            createErrorType(
              Order.name,
              'status',
              orderError.canNotUpdateConfirmedOrder,
              order.status,
            ),
          );
        }
      }
      const errors: ErrorType[] = [];
      const paymentMethod = await manager.findOneBy(PaymentMethod, {
        id: updateDto.paymentMethodId,
      });

      if (!paymentMethod) {
        errors.push(
          createErrorType(
            PaymentMethod.name,
            'id',
            commonError.isNotFound,
            updateDto.paymentMethodId,
          ),
        );
      }

      if (currentUser?.role === Role.Admin) {
        if (updateDto[`userId`]) {
          const user = await manager.findOneBy(User, { id: updateDto[`userId`] });
          if (!user) {
            errors.push(
              createErrorType(User.name, 'id', commonError.isNotFound, updateDto[`userId`]),
            );
          }
        }
      }
      const itemsById = await this.validateOrderItems(updateDto, errors, manager);
      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }

      Object.assign(order, updateDto);
      delete order.orderItems;
      order.setUpdatedUser(currentUser?.userId);
      await manager.save(Order, order);
      await manager.delete(OrderItem, { orderId: id });
      const orderItemsForSave = this.generateOrderItems(
        updateDto,
        manager,
        currentUser,
        id,
        itemsById,
        false,
      );

      await manager.save(OrderItem, orderItemsForSave);
    });
    return this.findOneById(id, currentUser);
  }

  private async validateOrderItems(
    dto: CreateOrderDto | CreateUserOrderDto | UpdateOrderDto | UpdateUserOrderDto,
    errors: ErrorType[],
    manager: EntityManager,
  ) {
    const orderItemsById = _.keyBy(dto.orderItems, 'itemId');
    const orderItemIds = dto.orderItems.map((item) => item.itemId);

    const items = await manager
      .createQueryBuilder(Item, 'item')
      .where('item.id IN (:...orderItemIds)', { orderItemIds })
      .getMany();
    const itemsById = _.keyBy(items, 'id');

    Object.keys(orderItemsById).forEach((itemId) => {
      if (!itemsById[itemId]) {
        errors.push(createErrorType(OrderItem.name, 'itemId', commonError.isNotFound, itemId));
      }
      if (itemsById[itemId] && orderItemsById[itemId].quantity > itemsById[itemId].quantity) {
        errors.push(
          createErrorType(OrderItem.name, 'itemId', orderError.isExceedingItemQuantity, itemId),
        );
      }
    });
    return itemsById;
  }

  private generateOrderItems(
    dto: CreateOrderDto | CreateUserOrderDto | UpdateOrderDto | UpdateUserOrderDto,
    manager: EntityManager,
    currentUser: CurrentUserType,
    orderId: number,
    itemsById: any,
    isCreate: boolean,
  ) {
    return dto.orderItems.map((orderItem) => {
      const result = manager.create(OrderItem, {
        ...orderItem,
        orderId: orderId,
        originalAmount: itemsById[orderItem.itemId]['price'] * orderItem.quantity,
        actualAmount:
          (itemsById[orderItem.itemId]['price'] *
            orderItem.quantity *
            (100 - itemsById[orderItem.itemId]['discount'])) /
          100,
      });
      isCreate
        ? result.setCreatedUser(currentUser?.userId)
        : result.setUpdatedUser(currentUser?.userId);
      return result;
    });
  }

  async softDelete(id: number, currentUser: CurrentUserType) {
    const order = await this.ordersRepository.findOne({ where: { id: id } });
    if (!order) {
      throw new BadRequestException(createErrorType(Order.name, 'id', commonError.isNotFound, id));
    }
    if (currentUser?.role === Role.User) {
      if (currentUser?.userId !== order.userId) {
        throw new ForbiddenException(
          createErrorType(User.name, 'role', commonError.forbiddenResource, currentUser?.role),
        );
      }
    }
    order.setUpdatedUser(currentUser?.userId);
    order.deletedAt = new Date();
    await this.ordersRepository.save(order);
  }

  async unDelete(id: number, currentUser: CurrentUserType) {
    const order = await this.ordersRepository.findOne({
      where: { id: id },
      withDeleted: true,
    });
    if (!order) {
      throw new BadRequestException(createErrorType(Order.name, 'id', commonError.isNotFound, id));
    }
    if (order.deletedAt === null) {
      throw new BadRequestException(
        createErrorType(Order.name, 'id', commonError.notDeletedYet, id),
      );
    }
    order.deletedAt = null;
    order.setUpdatedUser(currentUser?.userId);
    await this.ordersRepository.save(order);
  }
}
