import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from './page-options.dto';
import { IsEnum, IsInt, IsOptional } from '@nestjs/class-validator';
import { ProductOrderBy } from 'src/common/enums/product-order-by.enum';
import { Type } from 'class-transformer';

export class ProductPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({ enum: ProductOrderBy, default: ProductOrderBy.none })
  @IsEnum(ProductOrderBy)
  @IsOptional()
  orderBy?: ProductOrderBy = ProductOrderBy.none;

  @ApiPropertyOptional({ default: null })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number = null;
}
