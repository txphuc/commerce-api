import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from './page-options.dto';
import { IsEnum, IsInt, IsOptional } from '@nestjs/class-validator';
import { ProductOrderBy } from 'src/common/enums/product-order-by.enum';
import { Type } from 'class-transformer';

export class ProductPageOptionsDto extends PageOptionsDto {
  static resource = ProductPageOptionsDto.name;

  @ApiPropertyOptional({ enum: ProductOrderBy, default: ProductOrderBy.none })
  @IsEnum(ProductOrderBy)
  @IsOptional()
  orderBy?: ProductOrderBy = ProductOrderBy.none;

  @ApiPropertyOptional({ default: null })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  categoryId?: number = null;
}
