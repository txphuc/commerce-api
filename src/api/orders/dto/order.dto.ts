import { Expose, Type } from 'class-transformer';
import { PaymentMethodDto } from 'src/api/payment-methods/dto/payment-method.dto';
import { UserDto } from 'src/api/users/dto/user.dto';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { OrderItemDto } from './order-item.dto';

export class OrderDto {
  @Expose()
  id: number;

  @Expose()
  originTotalAmount: number;

  @Expose()
  totalAmount: number;

  @Expose()
  isPaid: boolean;

  @Expose()
  status: OrderStatus;

  @Expose()
  canceledDateTime: Date;

  @Expose()
  confirmedDateTime: Date;

  @Expose()
  startDeliveringDateTime: Date;

  @Expose()
  completedDateTime: Date;

  @Expose()
  plannedDeliveryDate: Date;

  @Expose()
  receiver: string;

  @Expose()
  address: string;

  @Expose()
  phone: string;

  @Expose()
  deliveryFee: number;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @Type(() => PaymentMethodDto)
  paymentMethod: PaymentMethodDto;

  @Expose()
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];

  @Expose()
  createdBy: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedBy: number;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt: Date;
}
