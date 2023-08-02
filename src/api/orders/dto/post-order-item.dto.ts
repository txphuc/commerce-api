import { IsInt, Min } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from '../entities/order-item.entity';

export class PostOrderItemsDto {
  static resource = OrderItem.name;

  @ApiProperty({
    description: 'Item id for order',
    type: Number,
    nullable: false,
    required: true,
    example: 0,
  })
  @IsInt()
  itemId: number;

  @Min(1)
  @IsInt()
  @ApiProperty({
    description: 'Quantity of items',
    type: 'Integer',
    nullable: false,
    required: true,
    example: 1,
  })
  quantity: number;
}
