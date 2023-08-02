import { IsEnum, IsInt, IsNumber, IsOptional, Matches, Min } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Regex } from 'src/common/constants/common.constant';
import { Order } from '../entities/order.entity';
import { OrderStatus, OrderStatusArray } from 'src/common/enums/order-status.enum';
import { CreateUserOrderDto } from './create-user-order.dto';

export class CreateOrderDto extends CreateUserOrderDto {
  static resource = Order.name;

  @ApiProperty({
    description: 'User id',
    type: Number,
    nullable: false,
    required: true,
    example: 0,
  })
  @IsInt()
  userId: number;

  @IsEnum(OrderStatus)
  @ApiProperty({
    description: `Unconfirmed | Canceled | Confirmed | Preparing | Delivering | Completed`,
    enum: OrderStatusArray,
    nullable: false,
    required: true,
    example: OrderStatus.Unconfirmed,
  })
  status: OrderStatus = OrderStatus.Unconfirmed;

  @Matches(Regex.DATE)
  @IsOptional()
  @ApiProperty({
    description: 'Planned delivery date',
    type: 'string(Date)',
    nullable: true,
    required: false,
    example: '1997-02-20',
  })
  plannedDeliveryDate?: Date;

  @Min(0)
  @IsNumber()
  @ApiProperty({
    description: 'Delivery fee',
    type: Number,
    nullable: false,
    required: true,
    example: 0,
  })
  deliveryFee: number;
}
