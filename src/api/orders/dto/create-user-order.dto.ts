import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  ValidateNested,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Common } from 'src/common/constants/common.constant';
import { Order } from '../entities/order.entity';
import { PostOrderItemsDto } from './post-order-item.dto';
import { Type } from 'class-transformer';
import { IsDistinctListOfObject } from 'src/common/validators/is-duplicated-object-in-list';

export class CreateUserOrderDto {
  static resource = Order.name;

  @MaxLength(Common.Name.MAX_LENGTH)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name of receiver',
    type: String,
    nullable: false,
    required: true,
    example: 'example',
  })
  receiver: string;

  @MaxLength(Common.Address.MAX_LENGTH)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Address of order',
    type: String,
    nullable: false,
    required: true,
    example: 'example',
  })
  address: string;

  @MaxLength(Common.Phone.MAX_LENGTH)
  @IsNumberString()
  @ApiProperty({
    description: 'Phone number of user',
    type: String,
    nullable: false,
    required: true,
    example: '0905123456',
  })
  phone: string;

  @IsInt()
  @ApiProperty({
    description: 'Payment method id',
    type: Number,
    nullable: false,
    required: true,
    example: 0,
  })
  paymentMethodId: number;

  @ApiProperty({
    description: 'List of order items',
    type: [PostOrderItemsDto],
    nullable: false,
    required: true,
  })
  @IsDistinctListOfObject({ context: ['itemId'] })
  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostOrderItemsDto)
  orderItems: PostOrderItemsDto[];
}
