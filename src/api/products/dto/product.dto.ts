import { Expose, Type } from 'class-transformer';
import { ItemDto } from 'src/api/items/dto/item.dto';
import { ProductViewDto } from './product.view.dto';
export class ProductDto {
  @Expose()
  id: number;

  @Expose()
  categoryId: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  images: string[];

  @Type(() => ItemDto)
  @Expose()
  items: ItemDto[];

  @Type(() => ProductViewDto)
  @Expose()
  info: ProductViewDto;

  @Expose()
  createdBy: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedBy: number;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt: Date;
}
