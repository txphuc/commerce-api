import { PartialType } from '@nestjs/swagger';
import { Order } from '../entities/order.entity';
import { CreateUserOrderDto } from './create-user-order.dto';

export class UpdateUserOrderDto extends PartialType(CreateUserOrderDto) {
  static resource = Order.name;
}
