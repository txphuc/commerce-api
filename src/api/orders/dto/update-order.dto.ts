import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { Order } from '../entities/order.entity';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  static resource = Order.name;
}
