import { IsInt, IsOptional, IsString, MaxLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';
import { IsValidImageList } from 'src/common/validators/is-valid-image-list.validator';

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
  @MaxLength(64)
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of product',
    type: String,
    nullable: true,
    required: false,
    example: 'example',
  })
  @MaxLength(1024)
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
