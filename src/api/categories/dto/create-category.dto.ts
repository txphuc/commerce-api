import { IsInt, IsOptional, IsString, MaxLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../entities/category.entity';

export class CreateCategoryDto {
  static resource = Category.name;

  @ApiProperty({
    description: 'Name of category',
    type: String,
    nullable: false,
    required: true,
    example: 'example',
  })
  @MaxLength(64)
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of category',
    type: String,
    nullable: true,
    required: false,
    example: 'example',
  })
  @MaxLength(256)
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Id of parent category',
    type: Number,
    nullable: true,
    required: false,
    example: 1,
  })
  @IsInt()
  @IsOptional()
  parentId?: number;
}