import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';
import { IsValidImageList } from 'src/common/validators/is-valid-image-list.validator';
import { Common } from 'src/common/constants/common.constant';

export class CreateProductDto {
  static resource = Product.name;

  @ApiProperty({
    description: 'Category id',
    type: Number,
    nullable: false,
    required: true,
    example: 0,
  })
  @IsInt()
  categoryId: number;

  @ApiProperty({
    description: 'Name of product',
    type: String,
    nullable: false,
    required: true,
    example: 'example',
  })
  @MaxLength(Common.Name.MAX_LENGTH)
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of product',
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
    description: 'Description of product',
    type: [String],
    nullable: false,
    required: true,
    example: ['https://example.com/image.jpg'],
  })
  @IsValidImageList()
  images: string[];
}
