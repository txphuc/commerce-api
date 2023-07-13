import { Item } from '../entities/item.entity';
import {
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Common } from 'src/common/constants/common.constant';
import { IsValidImageList } from 'src/common/validators/is-valid-image-list.validator';

export class CreateItemDto {
  static resource = Item.name;

  @ApiProperty({
    description: 'Product id',
    type: Number,
    nullable: false,
    required: true,
    example: 0,
  })
  @IsInt()
  productId: number;

  @ApiProperty({
    description: 'Name of item',
    type: String,
    nullable: false,
    required: true,
    example: 'example',
  })
  @MaxLength(Common.Name.MAX_LENGTH)
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of item',
    type: String,
    nullable: true,
    required: false,
    example: 'example',
  })
  @MaxLength(Common.Description.MAX_LENGTH)
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Price of item',
    type: 'Money',
    nullable: false,
    required: true,
    example: 0,
  })
  @Min(0)
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Quantity of item',
    type: 'Integer',
    nullable: false,
    required: true,
    example: 0,
  })
  @Min(0)
  @IsInt()
  quantity: number;

  @ApiProperty({
    description: 'Quantity of purchased item',
    type: 'Integer',
    nullable: false,
    required: true,
    example: 0,
  })
  @Min(0)
  @IsInt()
  purchased: number;

  @ApiProperty({
    description: 'Discount(0-100%) for item',
    type: Number,
    nullable: false,
    required: true,
    example: 0,
  })
  @Max(100)
  @Min(0)
  @IsInt()
  discount: number;

  @ApiProperty({
    description: 'Description of item',
    type: [String],
    nullable: false,
    required: true,
    example: ['https://example.com/image.jpg'],
  })
  @IsValidImageList()
  images: string[];

  @ApiProperty({
    description: 'Specification of item',
    type: Object,
    nullable: true,
    required: false,
    example: { weight: '1 kg', height: '1 m' },
  })
  @IsObject()
  @IsOptional()
  specification?: object;
}
